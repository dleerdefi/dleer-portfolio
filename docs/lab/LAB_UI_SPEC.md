# Lab UI specification

- **Status:** ready to build
- **Created:** 2026-10-08
- **Views:** [TELEMETRY_VIEW.md](TELEMETRY_VIEW.md) (`~/lab/telemetry`), [THREATS_VIEW.md](THREATS_VIEW.md) (`~/lab/threats`)
- **Producer side:** [HOMELAB_REFERENCE.md](HOMELAB_REFERENCE.md) (the private `dleerdefi/dleer-homelab` repo)
- **Approved look:** [concepts/](concepts/README.md)

This is the work order for Claude Code. It adds a `~/lab/` directory to the portfolio with two
views of David's homelab, both fed by JSON documents the homelab pushes to a private Cloudflare R2
bucket:

| View | What it shows | Data |
|---|---|---|
| `~/lab/telemetry` | the three PowerEdge servers: wall power, CPU, memory, inlet temperature, GPUs, 24 h history | `v1/now.json`, `v1/history.json` from labsnap |
| `~/lab/threats` | the honeynet: a live globe of attacks colored by type, a feed, 24 h statistics | `v1/threats.json`, `v1/threats-live.json` from threatsnap |

The site only reads and renders these documents. Nothing in this repo connects to the homelab,
and nothing at home accepts a connection from this site.

## Contents

1. [Ground rules](#1-ground-rules)
2. [Architecture and cost](#2-architecture-and-cost)
3. [Where the lab appears](#3-where-the-lab-appears)
4. [Theme: the lab follows the site](#4-theme-the-lab-follows-the-site)
5. [Server data layer](#5-server-data-layer)
6. [Client data](#6-client-data)
7. [Shared components and chart rules](#7-shared-components-and-chart-rules)
8. [Performance budgets](#8-performance-budgets)
9. [Security and privacy](#9-security-and-privacy)
10. [Accessibility](#10-accessibility)
11. [Dependencies, tests and CI](#11-dependencies-tests-and-ci)
12. [Environment](#12-environment)
13. [Phases](#13-phases)
14. [Acceptance criteria](#14-acceptance-criteria)
15. [Decisions and trade-offs](#15-decisions-and-trade-offs)

---

## 1. Ground rules

These hold for every phase. If a task seems to need breaking one, stop and ask David.

1. **Read the homelab first.** Before writing code, read the documents listed in
   [HOMELAB_REFERENCE.md](HOMELAB_REFERENCE.md) in the `dleerdefi/dleer-homelab` repo: the two
   data contracts, the four JSON Schemas, the golden examples, the public Grafana dashboard and
   the honeynet build spec. The contracts there are the source of truth; the consumer schemas
   here mirror them.
2. **No theme settings of its own.** Every lab view follows the site's theme preset and accent
   picker, live, like every other tile ([section 4](#4-theme-the-lab-follows-the-site)). No
   hard-coded colors in components; colors come from CSS variables.
3. **This repo is public.** Never copy into it an IP address, hostname, Tailscale name, bucket
   name, token, account ID, canary value, decoy path list or anything from the homelab's `.env`
   files. Golden examples are synthetic and may be copied ([HOMELAB_REFERENCE.md §6](HOMELAB_REFERENCE.md#6-vendored-fixtures)).
4. **Off by default.** Everything sits behind `NEXT_PUBLIC_FEATURE_LAB`. With the flag off the
   site must look and behave exactly like `main`, and the lab routes return 404.
5. **Fixtures first.** Build every view against the vendored golden examples (demo mode) before
   any real document exists. Demo data always shows a `◇ demo data` badge.
6. **`null` means unknown.** Render a dash (`—`) with no unit, never `0`.
7. **Never render what you did not validate.** Responses carry the Zod-parsed object, never the
   fetched text. Unknown keys are stripped, so they never reach a browser.
8. **Cheap on Railway.** No proxying to the homelab, no websockets, no server rendering of the
   globe, no image generation. Two small cached reads per document per cache window.
9. **Don't route under the honeytoken Worker's paths.** A Cloudflare Worker owns a set of
   scanner-bait paths on `dleer.ai` ([HOMELAB_REFERENCE.md §7](HOMELAB_REFERENCE.md#7-what-this-repo-must-never-do)).
   New routes live under `/lab` and `/api/lab/` only.
10. **No deletes, no deploys.** Don't delete branches or files outside this work, don't change
    Railway or Cloudflare settings, don't turn the flag on in production. Those are David's
    steps, listed in [section 13](#13-phases).
11. **Small modules.** Keep new files under about 300 lines. Split instead of growing
    `NavigationTile.tsx` (427 lines) or `FocusContext.tsx` (453 lines) further: lab code goes in
    new files, and existing files get only the hooks into it.

---

## 2. Architecture and cost

```
home (trusted LAN)                       Cloudflare R2, private bucket       Railway: this app                    Cloudflare edge      browser
labsnap ─────PUT v1/now.json      30 s ─►                                    /api/lab/status          ──────────► cache rule ────────► tiles, pages
        ─────PUT v1/history.json  5 min ─►   read-only token, server-side ◄─ /api/lab/status/history              (s-maxage)          charts in SVG
threatsnap ──PUT v1/threats.json  5 min ─►                                   /api/lab/threats                                          globe.gl in WebGL,
           ──PUT v1/threats-live.json 60 s ►                                 /api/lab/threats/live                                     on the visitor's GPU
                                                                             /api/lab/summary
```

| Cost driver | Why it stays near zero |
|---|---|
| CPU | Route handlers parse at most a few small documents per cache window (now 1 KB, history ~25 KB, digest ≤ 64 KB, live ≤ 48 KB). All rendering happens in the browser |
| RAM | Five cached parsed objects, well under 1 MB. No sharp, no server-side globe. Budget: +20 MB over the pre-deploy baseline |
| Egress, data | Every response carries `s-maxage`; a Cloudflare cache rule (David) lets the edge answer most polls |
| Egress, code | The globe chunk is a hashed `/_next/static` file that Cloudflare caches at the edge, so Railway serves it about once per edge location per deploy. It loads only when a visitor opens a threats view (on phones, only after a tap) |
| R2 | Reads per document are bounded by the in-memory cache (one per 10–60 s per instance), far inside the free tier |

---

## 3. Where the lab appears

All entry points are hidden when `features.lab` is false.

| Place | Change | Concept |
|---|---|---|
| `config/portfolio.config.ts`, `config/types.ts`, `lib/config.ts` | `features.lab: process.env.NEXT_PUBLIC_FEATURE_LAB === 'true'`; add `lab?: boolean` to the type and `lab: false` to the `useFeatureFlags()` fallback | — |
| `contexts/FocusContext.tsx` | add `{ type: 'lab-telemetry' }` and `{ type: 'lab-threats' }` to `ContentType` and to `transitionRules.content.validContent`; `handlePolybarNavigation('lab')` opens `lab-telemetry` | — |
| `components/tiles/ContentViewer.tsx` | `case 'lab-telemetry'` and `case 'lab-threats'`, each a `next/dynamic` import so no lab code is in the home bundle | `tile-telemetry`, `tile-threats` |
| `components/tiles/NavigationTile.tsx` | a `Lab/` directory between `Blog/` and `Contact`, rendered by a new `components/tiles/nav/LabDirectory.tsx`. Clicking `Lab/` opens `lab-telemetry`; the arrow toggles the children `telemetry` and `threats`, which open their views in the content tile (not a route push). Each child shows the view's status glyph when it is known ([§6](#6-client-data)) | `tile-*` |
| `components/layout/Polybar.tsx` | a `lab` workspace between `blog` and `contact`; active when `activeContent.type` starts with `lab-` | `tile-*` |
| `components/layout/LayoutManager.tsx` | nothing new: `handlePolybarNavigate` already passes sections other than projects and blog to `handlePolybarNavigation` | — |
| `components/tiles/NeofetchTile.tsx` | two rows after the social rows: `Lab: 1,029 W · 3/3 hosts ●` and `Honeypot: 15.4k events/24h · 31 countries`, from `/api/lab/summary` (first fetch after first paint, then every 5 min while visible; §6). A row is hidden while its state is offline or unknown. Clicking a row opens its view in the content tile | `tile-*` |
| `app/lab/page.tsx` | framed telemetry page (`/lab`) | `page-lab` |
| `app/lab/threats/page.tsx` | framed threats page (`/lab/threats`) | `page-threats` |
| `next.config.ts` | `redirects()`: `/lab/telemetry` → `/lab` (permanent), returned only when `NEXT_PUBLIC_FEATURE_LAB === 'true'` at build time (an empty list otherwise) | — |
| `components/layout/MobileParallaxLayout.tsx` | a `lab` section between `blog` and `contact` (`ParallaxLabSection.tsx` in `parallax/sections/`) with two cards linking to `/lab` and `/lab/threats` | `mobile-section` |
| `app/sitemap.ts` | `/lab` and `/lab/threats` when the flag is on | — |
| Zen mode | nothing: `enterZen` is only reachable from inside `FocusedView` today, so zen is dormant | — |

Framed pages follow `app/projects/[slug]/page.tsx`: a server component with `generateMetadata`,
`notFound()` when the flag is off, `<EscKeyHandler returnPath="/" />`, `<FramedPageLayout>`, and a
header row with `← Back` (to `/`), a two-tab switcher (`telemetry` → `/lab`, `threats` →
`/lab/threats`, the current one marked with `aria-current="page"` and the accent border) and an
`esc closes` hint. The page body is a client component. Metadata: title `Lab: telemetry` /
`Lab: threat map`, a one-sentence description, the site's existing OG image.

Below 1024 px the site always renders `MobileParallaxLayout` (`LayoutManager.tsx`: "Mobile
Layout - Always use Parallax"), so there is no stacked layout to support. Framed pages are used
as they are on phones; their contents stack ([concepts](concepts/README.md) `mobile-lab`,
`mobile-threats`).

---

## 4. Theme: the lab follows the site

The lab has **no theme controls**. It reads the same CSS variables as every tile, so changing
the preset or the accent recolors every lab view, the charts and the globe, without a reload.

| Element | Variable |
|---|---|
| Surfaces, borders, body text | `--theme-surface`, `--theme-bg`, `--theme-border`, `--theme-text` |
| Secondary text (labels, units, axis ticks, timestamps) | `--lab-text-2` = `rgba(var(--theme-text-rgb), 0.72)`. Not `--theme-text-dimmed`: Tokyo Night's `#565f89` fails text contrast on its own surface |
| Prompt glyph `❯`, view titles, links, meter fills, single-series lines and areas, focused tile border, target beacons and rings on the globe, top-country bars | `--accent-color` (and `--accent-color-rgb` for alpha) |
| Meter and bar tracks | `--lab-track` = `rgba(var(--accent-color-rgb), 0.18)` |
| Attack categories (swatches, arcs, hourly rows) | `--lab-<category>` from the table below |
| 24 h globe bins | `--lab-bin` = `rgba(var(--theme-text-rgb), 0.55)`: neutral, because a bin mixes categories |
| Globe land dots, graticule | `--theme-text-dimmed`, `--theme-border` |
| Freshness badge | `--theme-success` / `--theme-warning` / `--theme-error`, always with an icon and a word |

### `app/styles/13-lab.css`

Import it after `12-blog-content.css` in `app/globals.css`, and add it to the CSS module list in
`CLAUDE.md`. Values are validated per preset for adjacent-pair separation, colorblind and
normal vision; change one only after re-checking its neighbours in the legend order.

```css
/* Lab: attack-category colors per preset and a few shared tokens.
   The lab has no theme settings of its own; it follows the site's preset and accent. */

/* Tokyo Night also on :root: the mobile parallax layout sets className="tokyo-night"
   (no theme- prefix), so only the :root defaults apply there. */
:root,
.theme-tokyo-night {
  --lab-recon: #737aa2;
  --lab-brute-force: #7aa2f7;
  --lab-web-exploit: #e0af68;
  --lab-intrusion: #2ac3de;
  --lab-malware: #f7768e;
  --lab-ai-agent: #73daca;
}

.theme-nord {
  --lab-recon: #7B88A1;
  --lab-brute-force: #81A1C1;
  --lab-web-exploit: #EBCB8B;
  --lab-intrusion: #5E81AC;
  --lab-malware: #BF616A;
  --lab-ai-agent: #8FBCBB;
}

.theme-solarized-light {
  --lab-recon: #93a1a1;
  --lab-brute-force: #268bd2;
  --lab-web-exploit: #b58900;
  --lab-intrusion: #2aa198;
  --lab-malware: #dc322f;
  --lab-ai-agent: #6c71c4;
}

:root {
  --lab-text-2: rgba(var(--theme-text-rgb), 0.72);
  --lab-track: rgba(var(--accent-color-rgb), 0.18);
  --lab-bin: rgba(var(--theme-text-rgb), 0.55);
}
```

Legend order is fixed everywhere: `recon`, `brute_force`, `web_exploit`, `intrusion`, `malware`,
`ai_agent`. A category keeps its color when others are filtered out.

### Mobile

Below 1024 px the site forces Tokyo Night with the accent `#7dcfff` (`useParallaxTheme`,
`useEnforceMobileTheme`). The lab does nothing special: it reads the same variables and gets the
Tokyo values and the cyan accent. `--lab-intrusion` is `#2ac3de`, not `#7dcfff`, so it never
equals the mobile accent.

### Reading colors in JavaScript

The globe and any canvas need concrete colors. `hooks/useLabColors.ts` reads the variables
with `getComputedStyle(document.documentElement)` and returns
`{ accent, accentRgb, text, textRgb, textDimmed, border, surface, bg, bin, cat: Record<Category, string> }`.

It re-reads from a `MutationObserver` on `document.documentElement` watching the `class` and
`style` attributes, not from `useTheme()` state: `ThemeProvider` applies the `theme-*` and
`accent-*` classes in its own effect, which runs after its children's effects, and the mobile
overrides (`useParallaxTheme`, `useEnforceMobileTheme`) write the `class` and inline style on
mount, `resize` and `focus`. Components pass new accessors to globe.gl instead of remounting it.

---

## 5. Server data layer

### Files

```
lib/lab/
  r2.ts              server-only. aws4fetch client; getObject(key, maxBytes) → { ok: true, body } | { ok: false, reason }
  freshness.ts       pure. freshness({ generatedAt, staleAfterS, delayedCeilingS, now }) → { state, ageS }
  schemas/
    telemetry.ts     Zod: NowDoc, HistoryDoc (mirror of the labsnap schemas)
    threats.ts       Zod: DigestDoc, LiveDoc (mirror of the threatsnap schemas)
    shared.ts        timestamp, count, lat, lon, cc, ratio, category, target, svc, the IP-shape refinement, ipShapes()
  load.ts            server-only. createLoader({...}) → () => Promise<LabPayload<T>>; in-memory cache, one in-flight fetch per key
  loaders.ts         server-only. loadNow, loadHistory, loadDigest, loadLive, loadSummary
  demo/
    rebase.ts        shifts a fixture's timestamps to "now" (demo mode)
    history.ts       builds a 289-point demo history pinned to the now fixture (the golden history has 13 points)
  fixtures/          vendored golden examples (verbatim copies; see HOMELAB_REFERENCE.md §6)
    now.v1.json  history.v1.json  threats.v1.json  threats-live.v1.json  MANIFEST.json
  names.ts           role/index → hardware names; category and behavior labels
  format.ts          numbers, units, compact counts, the dash for null, relative ages
  types.ts           LabState, LabPayload<T>, Category, …
app/api/lab/status/route.ts           → loadNow
app/api/lab/status/history/route.ts   → loadHistory
app/api/lab/threats/route.ts          → loadDigest
app/api/lab/threats/live/route.ts     → loadLive
app/api/lab/summary/route.ts          → loadSummary
```

`import 'server-only'` at the top of `r2.ts`, `load.ts` and `loaders.ts` (add the `server-only`
package) so a client import fails the build.

### Reading R2

```ts
import 'server-only';
import { AwsClient } from 'aws4fetch';

const client = new AwsClient({
  accessKeyId: process.env.R2_LAB_READ_KEY_ID!,
  secretAccessKey: process.env.R2_LAB_READ_SECRET!,
  service: 's3',
  region: 'auto',
});
const base = `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${process.env.R2_LAB_BUCKET}`;
```

- `getObject(key, maxBytes)`: `client.fetch(`${base}/${key}`, { signal: AbortSignal.timeout(3000) })`.
  Reject when any `R2_*` variable is missing (`reason: 'unconfigured'`), on non-200, when
  `Content-Length` exceeds `maxBytes`, and when the body read exceeds `maxBytes`.
- The key is always one of four constants. Nothing from the request reaches the URL.
- Log a failure server-side at most once a minute per key, with the reason and status only
  (never the body or headers).

### Documents

| Loader | Key | Max bytes | Memory cache | Delayed ceiling |
|---|---|---|---|---|
| `loadNow` | `v1/now.json` | 16 KiB | 10 s | 900 s |
| `loadHistory` | `v1/history.json` | 512 KiB | 60 s | 3600 s |
| `loadDigest` | `v1/threats.json` | 64 KiB (the contract cap) | 60 s | 3600 s |
| `loadLive` | `v1/threats-live.json` | 48 KiB (the contract cap) | 20 s | 900 s |

Producers write compact JSON (`separators=(",", ":")`); the golden files on disk are
pretty-printed, so size tests encode them compactly first.

### Loader behavior

1. Return the cached result while it is younger than the memory-cache window. One in-flight
   fetch per key (store the promise; concurrent callers await it).
2. Fetch → `JSON.parse` → `schema.safeParse`. Any failure (missing config, timeout, 404,
   oversize, `NaN` or other invalid JSON, Zod failure) gives `{ state: 'offline' }`. Never throw
   to the client.
3. Freshness from the parsed document ([below](#freshness)). `offline` → `{ state: 'offline' }`.
4. Otherwise `{ state, age_s, ...parsed }`. `parsed` is Zod's output, so unknown keys are gone.
5. **IP-shape scan.** Serialize the payload and run `ipShapes()` (`lib/lab/schemas/shared.ts`)
   over it; any match makes the result `{ state: 'offline' }` and is logged with the reason
   only. It mirrors the producer's last-word filter (`filters.ip_shapes` in threatsnap): IPv4
   `/(?<!\d)\d{1,3}(?:\.\d{1,3}){3}(?!\d)/g`, and IPv6 candidates as runs matching
   `/[0-9A-Fa-f.]*:[0-9A-Fa-f:.]*/g` that contain a hex digit and either `::` or at least three
   colons. Timestamps (`19:05:00`, two colons) do not match. The field patterns alone would let
   an IPv6 literal without `::` through a credential or signature name; this scan does not.
6. Cache offline results for the same window (so an outage doesn't multiply R2 reads).

### Freshness

Decided on the server with the server's clock, from each document's own `generated_at` and
`stale_after_s`, as both homelab contracts specify:

| State | Condition | Shows |
|---|---|---|
| `live` | `age ≤ stale_after_s` (now 120, history 900, digest 1200, live 300 today) | the values |
| `delayed` | `age ≤` the loader's delayed ceiling | values greyed, `as of N min ago`; the globe's replay stops |
| `offline` | older, a 404, any failure above, or `generated_at` more than 300 s in the future | one line (`lab offline`, `honeynet offline`), no numbers |

`age_s` is rounded and never negative (clamp small clock skew to 0). The delayed ceilings for
now (15 min) and for the threat documents come from the homelab contracts; the 1 h ceiling for
history is this site's choice (the status contract only defines 15 min for now.json), so a
missed history write or two does not blank the charts.

### Response shape

```ts
type LabState = 'live' | 'delayed' | 'offline';
type LabPayload<T> =
  | ({ state: 'live' | 'delayed'; age_s: number; demo?: true } & T)
  | { state: 'offline' };
```

This follows the sketch in the homelab's `docs/status-contract.md`.

### `/api/lab/summary`

One small response for the home page (neofetch rows, nav glyphs, the mobile Lab section), so the
home page never downloads a full digest:

```ts
{
  demo?: true,
  telemetry: { state: LabState; age_s?: number; power_w?: number | null; energy_kwh_24h?: number | null;
               hosts_up?: number; hosts_expected?: number;
               power_24h?: (number | null)[] },   // history lab.power_w: the last 288 points, averaged in 3s → 96 points; a window with a null stays null
  threats:   { state: LabState; age_s?: number; events?: number; sources?: number; countries?: number;
               by_category?: Record<Category, number> }
}
```

Built from `loadNow`, `loadHistory` and `loadDigest`; each block carries only its state when
offline. `power_24h` is omitted when history is not live or delayed.

### Route handlers

- `GET` only, `export const dynamic = 'force-dynamic'` (the memory cache does the work). No query
  parameters are read.
- Flag off (`process.env.NEXT_PUBLIC_FEATURE_LAB !== 'true'`): `404`, empty body.
- `Content-Type: application/json`. `Cache-Control`:

| Route | live / delayed | offline |
|---|---|---|
| `/api/lab/status` | `public, max-age=15, s-maxage=15, stale-while-revalidate=30` | `public, max-age=15, s-maxage=15` |
| `/api/lab/status/history` | `public, max-age=60, s-maxage=120, stale-while-revalidate=300` | `public, max-age=30, s-maxage=30` |
| `/api/lab/threats` | `public, max-age=60, s-maxage=120, stale-while-revalidate=300` | `public, max-age=30, s-maxage=30` |
| `/api/lab/threats/live` | `public, max-age=0, s-maxage=30, stale-while-revalidate=30` (the client polls anyway; short caches keep the replay budget in [THREATS_VIEW.md §6](THREATS_VIEW.md#6-replay-clock)) | `public, max-age=30, s-maxage=30` |
| `/api/lab/summary` | `public, max-age=30, s-maxage=30, stale-while-revalidate=60` | same |

Check with `next start` and `curl -sI` that these headers reach the client unchanged.

**Cloudflare cache rule (David, after deploy).** JSON under `/api/` is not cached by default.
One rule on the `dleer.ai` zone: when hostname equals `dleer.ai` and URI path starts with
`/api/lab/`, eligible for cache; edge TTL "use cache-control header if present"; browser TTL
"respect origin".

### Demo mode

`LAB_DEMO_DATA=true` (server-only) serves the vendored fixtures instead of R2, with `demo: true`
in every payload. It wins over the `R2_*` settings so a fork runs with no credentials. Import the
fixtures inside the demo branch (`await import(...)`) so production never loads them.

| Document | Rebase |
|---|---|
| now | `generated_at` = now − 12 s |
| history | the generated 289-point series from `demo/history.ts`; `start` = now rounded down to 5 min − 288 × 300 s; `generated_at` = now − 60 s |
| digest | `generated_at` = now − 42 s; `hourly.start` = the current hour − 23 h; `malware[].first_seen` shifted by the same delta as `generated_at` |
| live | `generated_at` = now rounded down to 10 s − 20 s; `window_start` = `generated_at` − 900 s |

`demo/history.ts` is deterministic (a seeded generator, no `Math.random`): a quiet night, a GPU
job in the afternoon on the `gpu` host, a nightly backup on `storage`, one `null` gap, and every
series ending exactly at the now fixture's values so the hero number matches the chart's end
label. `docs/lab/concepts` was drawn from this shape.

---

## 6. Client data

### `hooks/useLabData.ts`

`useLabData(url, periodMs, { enabled })` → `{ payload, error }`:

- Fetches on mount and every `periodMs`, only while mounted, `enabled`, and
  `document.visibilityState === 'visible'`. On becoming visible, refetches at once if the last
  fetch is older than `periodMs`.
- One `AbortController` per request; aborts on unmount and before a new request.
- A network failure keeps the last payload and marks it with `error`; the view decides (§7 states).

| Consumer | Routes and periods |
|---|---|
| Telemetry tile and page | `/api/lab/status` every 30 s; `/api/lab/status/history` every 5 min; `/api/lab/summary` every 5 min (the honeypot teaser) |
| Threats tile and page | `/api/lab/threats` every 5 min; `/api/lab/threats/live` every 60 s |
| Neofetch rows, nav glyphs | `/api/lab/summary` once after first paint (`requestIdleCallback`, fallback `setTimeout` 1 s), then every 5 min while visible |
| Mobile Lab section | `/api/lab/summary` when the section is within one screen of the viewport (`IntersectionObserver`), then every 5 min while visible |

### Shared status store

`lib/lab/status-store.ts`: a module-level store (`useSyncExternalStore`) holding the latest
known `{ telemetry?: LabState, threats?: LabState }`. Every lab fetch writes to it. The nav
tile's glyphs and the polybar read it; they never fetch on their own. Unknown → no glyph.

---

## 7. Shared components and chart rules

`components/lab/shared/`:

| Component | Spec |
|---|---|
| `LabStatusBadge` | `● live 42 s ago`, `◐ delayed as of 7 min ago`, `○ offline`; plus a separate `◇ demo data` badge with a dashed neutral border (demo is not a status). Icon + word + color, never color alone. Status colors appear only in status indicators: this badge, the `hosts 3/3 up` glyph, the nav and neofetch glyphs, and the `down` marker |
| `Meter` | a horizontal bar: track `--lab-track`, fill `--accent-color`, a minimum visible fill of 2 % for any value above 0, the percentage printed beside it in text tokens. `null` → empty track and `—` |
| `Sparkline` | SVG, 2 px line in `--accent-color` (or the category color), 10 % area wash, `null` breaks the line (never drawn as 0), optional end value label. Small multiples share one y-domain and say so in their caption (`same scale`) |
| `LineChart` | one y-axis only, recessive grid (`stroke: var(--theme-border)`, `stroke-opacity: 0.6`), three x labels (`-24 h`, `-12 h`, `now`), end label with the last value, hover crosshair and tooltip (`5 h 0 min ago` / `1,000 W`), keyboard: focusable, arrow keys move the crosshair. `null` breaks the line |
| `HourlyBlocks` | one row per series of 24 hourly values as bars; on the threats page each category row is scaled to its own maximum and the caption says `each row its own scale` (shape over magnitude; the row total is printed at the end) |
| `Swatch` | a 10 px square in the category color, `aria-hidden`, always next to the category name |
| `LabAttribution` | `IP geolocation by DB-IP, CC BY 4.0 · Network data by IPinfo, CC BY-SA 4.0`, with DB-IP linked to `https://db-ip.com` and IPinfo to `https://ipinfo.io`. Required by the data licenses on every threats view |
| `Dash` / `format.ts` | `—` for `null` (no unit), thousands separators, `15.4k` style compact counts at ≥ 10,000, `°C`, `W`, `kWh`, percentages without decimals |

Chart rules (all views):

- **Text wears text tokens.** Values, labels and legends use `--theme-text` or `--lab-text-2`;
  a colored swatch or mark beside them carries the identity. Never color text with a category
  color.
- **One axis.** No dual-axis charts. Two measures → two charts.
- **Fixed category order and colors** (§4). A filter never repaints the remaining categories.
- **Hero numbers** at least 48 px (tile 56 px, page 72 px in the concepts).
- **Selective labels.** End labels and tooltips; never a number on every point.
- In the content tile, text uses `FONT_SIZES` from `lib/constants/typography.ts` like the
  other content components, with `xs` (14 px minimum) as the floor. Pixel sizes in the concepts
  are illustrative.

---

## 8. Performance budgets

| Budget | Limit | How to check |
|---|---|---|
| First-load JS of `/` | ≤ +5 KB gzipped vs. `main` | `ANALYZE=true npm run build`, compare with a `main` build |
| Telemetry view chunk | ≤ 25 KB gzipped | analyzer |
| Threats view chunk without the globe | ≤ 30 KB gzipped | analyzer |
| Globe chunk (globe.gl, three, land data) | loaded only when a threats view mounts and the globe is visible (phones: after the tap); size recorded in the PR; the mobile button's "about N KB" uses the measured number | network panel on `/`, `/lab`, `/lab/threats` |
| Long tasks after the globe chunk parses | none over 200 ms on a mid-range laptop | Performance panel |
| Frame rate while animating | 50+ fps desktop, 30+ fps mid-range phone | Performance panel |
| Idle cost | switching away from a threats view stops the render loop and frees the WebGL context | Performance panel, `chrome://gpu` |
| Railway RAM | within +20 MB of the pre-deploy baseline after 24 h | Railway metrics (David) |
| Requests to `/api/lab/*` reaching Railway | a few per minute once the cache rule is on | Railway HTTP logs (David) |

---

## 9. Security and privacy

- **Untrusted input.** Documents are validated with Zod on the server and rendered as text. No
  `dangerouslySetInnerHTML`, no HTML from data, no URLs from data. The only links built from data
  use values that passed `^CVE-\d{4}-\d{4,7}$` (to `https://nvd.nist.gov/vuln/detail/<id>`) or
  `^[a-f0-9]{64}$` (to `https://www.virustotal.com/gui/file/<sha256>` and
  `https://bazaar.abuse.ch/sample/<sha256>/`), opened with `target="_blank" rel="noopener noreferrer"`.
- **Defence in depth on strings.** The consumer schemas repeat the producer's patterns,
  including the IP-shape exclusions on target labels, AS names, signature names and credentials
  ([THREATS_VIEW.md §2](THREATS_VIEW.md#2-consumer-contract)). A document that fails is offline.
- **Credentials stay on the server.** `R2_*` never get a `NEXT_PUBLIC_` prefix; `server-only`
  guards the modules that read them. The token is Object Read only on one bucket (homelab side).
- **No personal data.** The documents contain no IP addresses by contract, and the site adds no
  analytics or logging of lab traffic.
- **No fetches from the browser to anything but this site's `/api/lab/*`** (and the static chunk).
  Country names come from `Intl.DisplayNames`, the land shape is bundled.

---

## 10. Accessibility

- Every interactive element is a real `<button>` or `<a href>`; legend toggles are
  `<button aria-pressed>`; touch targets ≥ 44 px on phones (stricter than the 32 px minimum in
  CLAUDE.md, because the lab's chips and the globe button are primary controls there).
- The globe canvas is `aria-hidden`; a visually hidden sentence beside it summarises it
  ("Live map: 15,447 attacks in the last 24 hours from 31 countries"), updated with the digest.
- Tables use `<table>` with `<th scope>`; meters and sparklines are `aria-hidden` next to the
  printed value. The line chart has an `aria-label` with the range and the latest value.
- The feed is `aria-live="off"` (it would be noise); the status badge is `role="status"`.
- `prefers-reduced-motion: reduce`: no arc animation, rings or auto-rotate; numbers update
  without counting animations.
- Contrast: body text uses `--theme-text`, secondary text `--lab-text-2`, never
  `--theme-text-dimmed` for text on Tokyo Night.

---

## 11. Dependencies, tests and CI

`package-lock.json` is in `.gitignore`, so Railway resolves versions fresh on every build. Add
new dependencies with **exact** versions (no `^`), and pin `three` directly so globe.gl's range
(`>=0.179 <1`) cannot float. Versions current on 2026-10-08; re-check with `npm view` and use
the latest patch of the same line if newer:

| Package | Version | Kind | Use |
|---|---|---|---|
| `aws4fetch` | `1.0.20` | dependency | signed R2 reads |
| `server-only` | `0.0.1` | dependency | build-time guard |
| `globe.gl` | `2.46.2` | dependency | the globe (dynamic import only) |
| `three` | `0.186.1` | dependency | pinned for globe.gl |
| `topojson-client` | `3.1.0` | dependency | land shape → GeoJSON in the globe chunk |
| `world-atlas` | `2.0.2` | dependency | `land-110m.json`, imported in the globe chunk |
| `vitest` | `5.0.3` | devDependency | unit tests (needs Node ≥ 22.12) |
| `@types/topojson-client` | `3.1.5` | devDependency | types |

Do not add a chart library: the charts are small SVG components (§7). Do not add new files under
`scripts/` (that folder is in `.gitignore`).

**Tests.** Add `"test": "vitest run"` to `package.json` and `vitest.config.ts` (node environment,
`@/` alias). Tests live in `tests/lab/`. What each must cover is listed per phase (§13) and per
view (TELEMETRY_VIEW.md, THREATS_VIEW.md).

**CI (optional, phase 1).** If you add a workflow, put it at `.github/workflows/lab.yml`:
`pull_request` and `push` to `main`, `runs-on: ubuntu-latest`, `permissions: contents: read`, no
secrets, Node 22, `npm install` (there is no lockfile), then `typecheck`, `lint`, `test` and
`build` with `NEXT_PUBLIC_FEATURE_LAB=true LAB_DEMO_DATA=true`. **Never `runs-on: self-hosted`:**
this repo is public, and David's self-hosted runners must never run code from strangers' pull
requests.

---

## 12. Environment

Add to `.env.example`:

```bash
# Lab (optional). Off by default; forks can ignore everything below.
# NEXT_PUBLIC_* values are inlined at build time: redeploy after changing the flag.
NEXT_PUBLIC_FEATURE_LAB=false

# Serve the bundled synthetic documents instead of reading R2 (local dev, previews, forks)
LAB_DEMO_DATA=false

# Cloudflare R2, server-side only: an Object Read only token for the lab bucket
R2_ACCOUNT_ID="YOUR_R2_ACCOUNT_ID"
R2_LAB_BUCKET="YOUR_LAB_BUCKET"
R2_LAB_READ_KEY_ID="YOUR_R2_READ_KEY_ID"
R2_LAB_READ_SECRET="YOUR_R2_READ_SECRET"
```

The real values exist only in Railway's variables (David). README gets a short "Lab (optional)"
section: what it is, the flag, demo mode, the variables, and a link to `docs/lab/`.

---

## 13. Phases

One branch and one PR per phase, each PR description listing what was verified (commands run,
screenshots in all three presets, budget numbers). Build every phase against demo data.

| Phase | Work | Checks before the next phase |
|---|---|---|
| **1. Foundations** | Feature flag; `13-lab.css`; vendored fixtures with `MANIFEST.json`; `lib/lab/*` (schemas, freshness, R2 client, loaders, demo mode, summary); the five routes; `useLabData`, status store, `useLabColors`; shared components (§7); Vitest; `.env.example`; optional CI | `typecheck`, `lint`, `test`, `build` green. Schemas accept every golden example and reject every invalid one as listed in the view docs; freshness boundaries exact; loader offline on 404, timeout, oversize, invalid JSON, Zod failure and missing config; responses never contain a stripped key. Flag off: site identical to `main`, routes 404 |
| **2. Telemetry** | `ContentType`, `ContentViewer`, `LabDirectory` in the nav tile, polybar `lab`, neofetch rows, the telemetry tile, `/lab`, `/lab/telemetry` redirect, sitemap | All three presets and several accents switch live; null and down states (TELEMETRY_VIEW.md §6) render as specified; tile and page match the concepts |
| **3. Threats without the globe** | the threats tile and `/lab/threats` with stats, legend, feed (replayed on the clock), badges, attribution, and the globe placeholder | Every stats block from the golden digest; filters work on the feed; delayed and offline states |
| **4. Globe** | `ThreatGlobe`, `globe-layers.ts`, `ReplayClock` wired to arcs, rings, targets, theme colors, pause/dispose, reduced motion, mobile tap-to-load | Budgets in §8 measured and recorded; switching views frees the context; no globe requests on `/` |
| **5. Mobile and polish** | `ParallaxLabSection`, mobile layouts of both pages, README section, CLAUDE.md updates (content types, CSS module list, lab components) | Phone widths 360–430 px: no horizontal scroll, globe only after tap, smooth parallax scrolling |
| **6. Go live (David)** | Railway: the four `R2_*` values and `NEXT_PUBLIC_FEATURE_LAB=true`, redeploy. Cloudflare: the cache rule (§5). Homelab: `status.dleer.ai` → `dleer.ai/lab` and `threats.dleer.ai` → `dleer.ai/lab/threats` redirects (homelab roadmap). Watch Railway metrics for 24 h | The homelab roadmap keeps the flag off until labsnap has run cleanly for a week; threatsnap starts in dry run, so the threats view stays offline until its first real publish |

**Stop and ask David** before: setting or changing any Railway or Cloudflare setting, turning
the flag on anywhere but local and preview builds, adding a dependency not listed in §11,
changing a value in the homelab contracts, or deleting anything.

---

## 14. Acceptance criteria

Automated (`npm run typecheck && npm run lint && npm test && npm run build`):

- [ ] Every golden example parses; every invalid example gets the result listed in the view docs.
- [ ] Freshness returns live, delayed and offline at the exact boundaries, per document.
- [ ] Loaders return offline on 404, timeout, oversize, `NaN`, invalid JSON, Zod failure and
      missing configuration, and cache results for the stated windows.
- [ ] No response body contains a key the schema strips (test with the `unknown-key` and
      `source-address` examples) or any IPv4/IPv6-shaped string.
- [ ] `ReplayClock` never schedules an event twice across overlapping documents, never before
      its time, and stops on delayed or offline.
- [ ] `globe-layers` caps arcs at 150 and drops the lowest `n` first.

Manual:

- [ ] Flag off: visually and functionally identical to `main`; `/lab`, `/lab/threats` and
      `/api/lab/*` return 404; no lab requests anywhere.
- [ ] Demo mode with no `R2_*` variables: every view renders with the `◇ demo data` badge.
- [ ] Each preset and at least three accents: every lab color changes live, including the globe;
      Solarized Light stays readable.
- [ ] Reduced motion: static globe, feed and numbers still update.
- [ ] Phones: no globe request until the tap; `■ stop globe` frees it; scrolling stays smooth.
- [ ] Wrong token or empty bucket: one `lab offline` / `honeynet offline` line, no console errors.
- [ ] Network panel on `/`: only `/api/lab/summary`, no globe, three or land data.

---

## 15. Decisions and trade-offs

| Decision | Why |
|---|---|
| Push, not serve | The homelab pushes documents to R2; this site reads them server-side. Nothing at home is reachable, and Railway does almost no work |
| globe.gl, lazy | The 3D globe is the point of the page. It renders on the visitor's GPU, its chunk is edge-cached, and it loads only when a threats view is open (on phones, on tap) |
| Bins neutral, arcs by category | A 24 h bin mixes categories, so coloring it by its top category would mostly show `recon`. Arcs are single events and carry the category |
| Category colors share hues with status colors in each preset (amber `web_exploit`, red `malware`) | Each preset has a small palette, and these readings are natural. Status colors appear only in status indicators, always with an icon and a word (or next to one), and category marks always sit next to their name. Revisit only if testing shows confusion |
| Some category marks are below 3:1 against their surface (Solarized `recon` 2.2, Nord `malware` 2.5); Solarized `recon` equals its `--theme-border` | Category marks never carry information alone: every swatch, arc color and hourly row sits next to the category name or a count. `recon` is deliberately the most recessive, since it is the background noise of the internet. If a mark must stand alone somewhere, re-check it first |
| Tokyo Night and Nord category palettes sit outside a strict lightness band | Both presets are pastel by design; the palettes were chosen for adjacent-pair separation under colorblind and normal vision instead, and every mark is labelled |
| Hardware names in the portfolio | The contract carries only `role` and `index`; names live in `lib/lab/names.ts` (status contract rule: no free text in documents) |
| Consumer strips unknown keys | The contracts allow additions within v1; stripping keeps new keys out of responses until the UI knows them |
| No zen mode | Zen is dormant in the current site; the framed pages cover the full-screen case |
