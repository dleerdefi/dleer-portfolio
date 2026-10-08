# `~/lab/threats`: the honeynet's live threat map

Part of the [lab UI spec](LAB_UI_SPEC.md). Concepts: `tile-threats`, `page-threats`,
`mobile-threats`, `mobile-threats-globe`, `mobile-section`, `states` in [concepts/](concepts/README.md).

A honeypot David runs on a small cloud VM, plus honeytoken decoys on dleer.ai. At home,
**threatsnap** pulls what they saw, turns it into two anonymised JSON documents and pushes them to
the same private R2 bucket as the telemetry. This view draws a globe of where attacks come from,
colored by attack type, a `journalctl`-style feed and 24 h statistics. **No IP address is ever in
the data or on the page.**

## Contents

1. [Sources](#1-sources)
2. [Consumer contract](#2-consumer-contract)
3. [Freshness](#3-freshness)
4. [Views](#4-views)
5. [Globe](#5-globe)
6. [Replay clock](#6-replay-clock)
7. [Feed](#7-feed)
8. [Statistics blocks](#8-statistics-blocks)
9. [Legend and filters](#9-legend-and-filters)
10. [States](#10-states)
11. [Tests](#11-tests)

---

## 1. Sources

In `dleerdefi/dleer-homelab`:

| What | Path | Where it is today |
|---|---|---|
| Contract (the source of truth) | `docs/threats-contract.md` | `main` (PR #10, with PR #11's note that `cc` may be `null`) |
| Honeynet build spec | `docs/honeynet-spec.md` | `main`; PRs #11–#14 each refine it |
| Decision record | `docs/decisions/0002-honeynet-sensor-off-site.md` | `main` |
| JSON Schemas | `stacks/honeynet/threatsnap/threatsnap/schemas/threats.v1.schema.json`, `threats-live.v1.schema.json` | `main` (PR #11) |
| Golden examples | `stacks/honeynet/threatsnap/examples/threats.v1.json`, `threats-live.v1.json` | `main` (PR #11) |
| Invalid examples | `stacks/honeynet/threatsnap/examples/invalid/*.json` (15 files) | `main` (PR #11) |
| Producer, constants | `stacks/honeynet/threatsnap/threatsnap/contract.py`, `validate.py`, README | `main` (PR #11) |
| Honeytoken Worker | `workers/honeytokens/` | PR #13 (`claude/honeytokens-worker`) |

PR #11 merged on 2026-10-08. For the still-open PRs (#12–#14), read files from their branches (`git show origin/<branch>:<path>`).

| Object | Rewritten | Max size (compact JSON) | Route |
|---|---|---|---|
| `v1/threats.json` (the digest) | every 5 min | 64 KiB | `/api/lab/threats` |
| `v1/threats-live.json` (the last 15 min) | every 60 s | 48 KiB | `/api/lab/threats/live` |

---

## 2. Consumer contract

`lib/lab/schemas/threats.ts` mirrors the producer schemas. Unknown keys are stripped (the
contracts allow additions in v1); every key the producer requires is required here.

### Enums

| Name | Values (this order everywhere) |
|---|---|
| `category` | `recon`, `brute_force`, `web_exploit`, `intrusion`, `malware`, `ai_agent` |
| `target` | `sensor` (the cloud honeypot), `web` (the decoys on dleer.ai) |
| `svc` | `ssh`, `telnet`, `http`, `https`, `other` |
| `behavior` | `system_recon`, `cred_change`, `ssh_key_persistence`, `cron_persistence`, `download_attempt`, `miner`, `botnet_dropper`, `cleanup`, `other` |
| malware `via` | `scp`, `sftp`, `upload` |

What the categories mean (show it as the legend buttons' `title`):

| Category | Meaning |
|---|---|
| `recon` | a probe of a port where nothing listens, or a connection that never tried to log in |
| `brute_force` | failed SSH or Telnet logins |
| `web_exploit` | an HTTP request matching an exploit or scanner rule, or a hit on a decoy path |
| `intrusion` | a successful (fake) login followed by commands |
| `malware` | a file pushed to the honeypot, or a command that fetches one |
| `ai_agent` | a session or request that followed an instruction planted for AI agents |

### Shared pieces

| Name | Rule |
|---|---|
| `timestamp` | `/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/` |
| `count` | int 0–1,000,000,000 (never `null`) |
| `lat`, `lon` | number −90–90, −180–180 (one decimal in practice) |
| `cc` | `/^[A-Z]{2}$/`; `cc_or_null` where noted |
| `ipShape` | `/[0-9]{1,3}(\.[0-9]{1,3}){3}/`: a string matching it anywhere is rejected (`.refine`) |
| `credential` | `/^[\x21-\x7E]{1,24}$/`, and not matching `ipShape`, `://`, `/@[^@]*\./` or `::` |
| `cred_sources` | int 5–1,000,000,000 (the five-source floor) |
| `by_category` | an object with all six categories as `count` |

### `threats.json`

| Field | Zod |
|---|---|
| `schema_version` | `z.literal(1)` |
| `generated_at` | `timestamp` |
| `interval_s` | int 60–3600 (300) |
| `stale_after_s` | int 60–86400 (1200) |
| `window_s` | `z.literal(86400)` |
| `targets` | exactly 2 of `{ id: target, label: /^[a-z0-9 .\-]{1,40}$/ and not ipShape, lat, lon, up: boolean }`. Labels and positions come from producer config (`us-west honeypot`, `dleer.ai`), never from an address lookup |
| `totals` | `{ events: count, sources: count, countries: int 0–300, by_category, by_target: { sensor: count, web: count } }` |
| `hourly` | `{ start: timestamp, step_s: literal 3600, points: literal 24, by_category: { <category>: count[24] } }`; entry `i` covers `start + i × 3600` |
| `geo` | 0–400 of `{ lat, lon, cc: cc_or_null, events, sources, top_category: category, by_category }`, sorted by `events` descending (fewer than 400 when the size cap needs it) |
| `countries` | 0–20 of `{ cc, events, sources }` |
| `asns` | 0–20 of `{ asn: int 1–4294967295, name: /^[A-Za-z0-9 .,&'()\-/]{1,64}$/ and not ipShape, or null, events, sources }` |
| `credentials` | `{ usernames, passwords: 0–10 of { value: credential, attempts: count, sources: cred_sources }, pairs: 0–10 of { username: credential, password: credential, attempts, sources: cred_sources } }` |
| `behaviors` | exactly 9 of `{ behavior, sessions: count }` (the producer writes every behavior once, in enum order) |
| `signatures` | 0–10 of `{ name: /^[A-Za-z0-9 ._:/()\-]{1,120}$/ and not ipShape, hits }`; empty in v1 (no IDS on the sensor) |
| `cves` | 0–10 of `{ id: /^CVE-\d{4}-\d{4,7}$/, hits, sources }` |
| `malware` | 0–10 of `{ sha256: /^[a-f0-9]{64}$/, first_seen: timestamp, sources, via }` |
| `download_attempts` | `count` (the URLs are never published) |
| `ai_agent` | `{ suspected: count, likely: count }`; `likely` is a subset of `suspected` |

**Mirror the producer schema, no more.** The contract also promises things its schema does not
check: behaviors in enum order with each once, `geo` sorted by events, `likely ≤ suspected`, GPU
order in the telemetry. Do not add refinements for them (a producer slip would take the view
offline for no safety gain). Render by lookup instead: behaviors by name in the fixed enum order
(a missing one shows `—`), `geo` sorted client-side where order matters.

### `threats-live.json`

| Field | Zod |
|---|---|
| `schema_version`, `generated_at` | as above |
| `interval_s` | int 10–600 (60) |
| `stale_after_s` | int 10–3600 (300) |
| `window_start` | `timestamp` |
| `window_s` | `z.literal(900)` |
| `bucket_s` | `z.literal(10)` |
| `events` | 0–400 of `{ t: int 0–890, lat, lon, cc: cc_or_null, cat: category, target, svc, n: int 1–1,000,000,000 }`. `t` is seconds from `window_start` to the start of a 10 s bucket; `n` counts events sharing bucket, place, category, target and service. Events with no known place are left out by the producer |
| `dropped` | `count`: entries left out once the 400 cap was reached (lowest `n` first) |

---

## 3. Freshness

| Document | live | delayed | offline |
|---|---|---|---|
| `threats.json` | age ≤ `stale_after_s` (1200 s) | ≤ 1 h | older, missing or invalid |
| `threats-live.json` | age ≤ `stale_after_s` (300 s) | ≤ 15 min | older, missing or invalid |

The badge shows the worse of the two. Numbers grey out when the digest is not live; the replay
(arcs and feed) stops when the live document is not live. Digest offline → the whole view is
`honeynet offline`.

---

## 4. Views

All copy below is the approved wording; keep it. Category names render as the enum values
(`brute_force`), in monospace like the rest of the site.

### 4.1 Content tile (`lab-threats`)

Concept `tile-threats`:

1. **Header row:** `❯ ~/lab/threats`; badges right (`● live 42 s ago`, `◇ demo data`).
2. **Framing:** "A honeypot I run on a small cloud VM. Every arc is a real attack from the last
   few minutes. No IP addresses are shown."
3. **Globe row:** the globe (about 45 % of the tile width, at most 360 px) with target labels
   `us-west honeypot` and `dleer.ai`; to its right the legend as a column of full-width toggle
   buttons under the caption `last 24 h · tap to filter`: swatch, category, 24 h count.
4. **Bottom row:** the feed (~60 %) in a bordered box headed `$ journalctl -u honeynet -f`, and a
   summary box: `events`, `sources`, `countries`, `ai agents` (`4 / 2`, suspected / likely),
   `events / hour, 24 h` (one row of 24 bars in the accent, the sum of all categories), and
   `full page → /lab/threats` at the bottom.
5. **Attribution** footer (`LabAttribution`).

### 4.2 Framed page `/lab/threats`

Concept `page-threats`. Framed header with `← Back`, tabs, `esc closes`; title row with badges;
framing: "A honeypot I run on a small cloud VM, plus decoy paths on this site. Every arc is a
real attack from the last few minutes. No IP addresses are shown."

First screen at ≥ 1024 px:

- **Left:** the globe (440 px) with target labels `us-west honeypot · up` and `dleer.ai · up`
  (`· down` when `up` is false); the legend as chips centered under it (swatch, name, count),
  wrapping to two rows.
- **Right sidebar (~450 px)**, stacked boxes:
  1. `last 24 h`: two columns of key/value pairs: `events`, `countries`, `fake logins`
     (`by_category.intrusion`) | `sources`, `downloads` (`download_attempts`), `ai agents`
     (`suspected / likely`).
  2. `events / hour by category · -24 h → now · each row its own scale`: one row per category:
     swatch, name, 24 bars in the category color, 24 h total.
  3. `top countries`: the top five, country name (from `Intl.DisplayNames`), a bar in the accent
     scaled to the first, events.
  4. `credentials tried · seen from 5+ sources`: usernames and passwords side by side, top four
     each, with attempts.
- **Full-width feed** under both, two columns, newest at the bottom of the right column.
- **Attribution** under the feed.

Below the first screen, in this order (two columns at ≥ 1024 px, one below): all 20 countries;
`top networks` (`AS4134 Chinanet`, events, sources; a `null` name shows only `AS4134`);
`top pairs` (`root / 123456`, attempts); `what intruders did` (the nine behaviors, §8);
`cves`; `malware pushed`; `ai agents` with its sentence; `signatures` only when not empty.

Below 1024 px the page follows the mobile layout (§4.3).

### 4.3 Mobile `/lab/threats`

Concepts `mobile-threats` (before the tap) and `mobile-threats-globe` (after):

1. Header: `← Back` and the badge; `❯ ~/lab/threats`; the framing paragraph.
2. Three stat cells: `events 24 h`, `sources`, `countries`.
3. **Globe placeholder:** a dashed box with `▶ ./render-globe` (44 px tall, accent border) and
   `loads the 3D map (about N KB) on tap`, N from the measured chunk size. After the tap the
   globe (300 px, no target labels, beacons only) replaces it, with a `■ stop globe` button that
   unloads it and brings the placeholder back.
4. Legend as a two-column grid of toggle chips (≥ 44 px tall).
5. The feed (last 10 lines; service and target columns omitted).
6. The statistics blocks of §4.2 stacked: hourly by category, countries, credentials, networks,
   pairs, behaviors, CVEs, malware, AI agents.
7. Attribution.

### 4.4 Mobile Lab section card

Concept `mobile-section`, the second card in `ParallaxLabSection`, the whole card a link to
`/lab/threats`: `~/lab/threats` and the badge; `15,447 events in 24 h from 31 countries`; the
three largest categories (swatch, name, a bar in the category color scaled to the largest,
compact count); `open the threat map →`. From `/api/lab/summary`; no globe here.

### 4.5 Neofetch row

`Honeypot: 15.4k events/24h · 31 countries`, styled like the telemetry row
([TELEMETRY_VIEW.md §5.5](TELEMETRY_VIEW.md#55-neofetch-row)). Hidden when offline or unknown.

---

## 5. Globe

`components/lab/threats/ThreatGlobe.tsx` (client) mounts it; `globe-layers.ts` holds pure
functions from documents and filters to layer data (unit-tested).

### Loading

- Desktop (≥ 1024 px) without `navigator.connection.saveData`: load when the container enters
  the viewport (`IntersectionObserver`). Phones or Save-Data: the placeholder (§4.3), load on tap.
- No WebGL (`canvas.getContext('webgl2') || getContext('webgl')` is null): the placeholder with
  the button disabled and `WebGL not available`. A failed chunk load: `globe failed to load`.
  The stats, legend and feed never depend on the globe.
- One dynamic import for the whole globe chunk:
  `Promise.all([import('globe.gl'), import('topojson-client'), import('world-atlas/land-110m.json')])`,
  so the land shape is bundled and edge-cached with the code (no CDN request, no CORS).

### Renderer

- `new Globe(el, { animateIn: false, rendererConfig: { antialias: !phone, alpha: true, powerPreference: 'low-power' } })`
  (check the constructor signature of the installed version); pixel ratio
  `Math.min(devicePixelRatio, phone ? 1.5 : 2)`; transparent background; size from a
  `ResizeObserver` (square).
- No earth texture. Sphere material color `--theme-bg`; thin atmosphere in the accent
  (`atmosphereAltitude` ≈ 0.12); graticules only if they read well in all three presets.
- Land: `hexPolygonsData` from `land-110m`, `hexPolygonUseDots(true)`, resolution 3, margin
  ≈ 0.35, color `--theme-text-dimmed`.

### Layers

| Layer | globe.gl API | Data and look |
|---|---|---|
| 24 h bins | `pointsData` | `digest.geo`, minus filtered categories (a bin's size uses the sum of its visible `by_category`; a bin with nothing visible is hidden). Color `--lab-bin` (neutral). Radius and altitude grow with `log10(events)`. `pointsMerge(false)` (≤ 400 points; keeps hover). Hover label: country name, events, sources, top category |
| Live arcs | `arcsData` | replayed events (§6) from the event's place to its target; color `--lab-<cat>`; stroke `0.25 + 0.2 × log10(n + 1)`; dash length ≈ 0.4, gap 2, initial gap 1, animate time ≈ 1500 ms; removed ≈ 2.4 s after start. At most 150 on screen: over that, drop the lowest `n` first |
| Target beacons | `ringsData` | both targets; accent rings fading out (`rgba(accent, 1 − t)`), the sensor faster than the web target; a short burst when an arc lands. No rings for a target with `up: false` |
| Target markers and labels | `htmlElementsData` | DOM elements built with `textContent` and styled with CSS variables (they recolor without JavaScript): an accent dot (hollow and grey when down) and, on the tile and the page, the label (`us-west honeypot`, plus `· up`/`· down` on the page) |

Hover labels are HTML strings in globe.gl: build them only from numbers, enum values and
`Intl.DisplayNames` output, escaped. Never from other strings.

### Camera and motion

- Start over the Pacific and the Americas: `pointOfView({ lat: 28, lng: -100, altitude: 2.1 })`.
- Slow auto-rotate (`autoRotateSpeed` ≈ 0.35) that stops on interaction and resumes after 10 s
  idle. Zoom and pan off (the page scrolls past the globe).
- Pause (`pauseAnimation`) when the tab is hidden or the globe leaves the viewport; resume when
  back.
- `prefers-reduced-motion: reduce`: no arcs, no rings, no auto-rotate; static bins only.

### Theme

`useLabColors` (LAB_UI_SPEC.md §4) gives concrete colors. On a preset or accent change, set the
accessors again (`hexPolygonColor`, `pointColor`, `arcColor`, `ringColor`, `atmosphereColor`) and
the sphere material's color; do not remount.

### Disposal

On unmount and on `■ stop globe`: `pauseAnimation()`, the instance destructor (`_destructor()` in
current globe.gl; confirm in the installed version), `renderer().dispose()`,
`renderer().forceContextLoss()`, remove listeners and observers, empty the container. Switching
tiles must return the GPU to idle.

---

## 6. Replay clock

`components/lab/threats/ReplayClock.ts`, pure and unit-tested with an injectable clock. The live
document covers 15 minutes in 10 s buckets and is refreshed every 60 s; playing it back on a
delay keeps the globe moving between polls.

- **Ingest lag.** Events reach threatsnap late. The sensor writes one gzipped file per minute,
  and its uploader moves a file to R2 once it has been idle for 90 s, checking every 60 s
  (homelab PR #12: "data reaches R2 about 3 minutes after the event"). threatsnap then ingests
  every 60 s. So a sensor event can first appear in a live document up to about 4.5 minutes after
  it happened. Honeytoken hits are written per hit and arrive within seconds. A bucket scheduled
  before its events arrive is lost to the high-water mark, so the settle lag must exceed the
  ingest lag.
- **Settled buckets.** A bucket is settled when `bucket_start + 10 s ≤ generated_at − SETTLE_S`.
  Only settled buckets are scheduled. `SETTLE_S = 300` until the homelab has measured the real
  lag in its phase 1 live checks; then use that p95, rounded up to 30 s.
- **Delay.** Events play at `window_start + t + DELAY`, with `DELAY = SETTLE_S + 240` (540 s
  for now). A bucket is first settled in a document generated `SETTLE_S + 10` to
  `SETTLE_S + 70` s after it starts. That document can then wait up to 20 s in the server's memory
  cache, up to 60 s at the edge (`s-maxage=30` plus `stale-while-revalidate=30`, LAB_UI_SPEC.md
  §5) and up to one poll interval (60 s) in the browser. That is `SETTLE_S + 210` s in the worst
  case, plus a 30 s margin. Keep `SETTLE_S` and `DELAY` as two named constants in one place, and
  change them only with the cache headers in view.
- **Copy follows the delay.** While `DELAY` is at most 300 s the framing says "Every arc is a
  real attack from the last few minutes"; above that it says "from the last ten minutes".
- **Clock.** Use the server's time, not the visitor's: estimate it from each live response's
  `Date` header plus its `Age` header (set by the edge cache), and keep the offset to the local
  clock. Fall back to the local clock if the headers are missing.
- **High-water mark.** Keep the latest scheduled bucket start; from each new document schedule
  only settled buckets after it. Nothing is ever scheduled twice, and late additions to played
  buckets are not replayed. This also works in demo mode, where the fixture is rebased on every
  request.
- **Spread.** Events sharing a bucket fire evenly across its 10 s, with a small seeded jitter.
- **Never in the past.** An event more than 5 s overdue when scheduled is dropped.
- **Warm start.** On the first document, play the 30 s just before the playback time over about
  3 s so the globe is never empty, and prefill the feed with the 8 settled events before that
  (no arcs).
- **Stop.** When the live state is delayed or offline, stop scheduling; arcs already in flight
  finish. Resume from the high-water mark when it is live again.
- Filtered categories are skipped at fire time, not at scheduling time, so toggling a category
  back on takes effect at once.

---

## 7. Feed

`ThreatFeed.tsx`: a fixed-height monospace log of replayed events, newest at the bottom, 50
lines kept (10 on phones).

```
19:04:30  ■ brute_force  ssh    CN ×12  → honeypot
19:04:40  ■ web_exploit  https  VN      → dleer.ai
19:04:50  ■ recon        other  RU      → honeypot
```

- Time: the bucket's time in the visitor's time zone, 24 h `HH:MM:SS`.
- The swatch in the category color, the category name in text color.
- Service and target columns on the page only. `sensor` prints as `honeypot`, `web` as the web
  target's label.
- Country as the ISO code with the full name in a `title`; `null` → `—`. `×n` when `n > 1`.
- Text only, no links. `aria-live="off"`.

---

## 8. Statistics blocks

`components/lab/threats/stats/`, all from the digest, all real `<table>`s:

| Block | Content |
|---|---|
| `last 24 h` | events, sources, countries, fake logins, downloads, ai agents (§4.2) |
| `events / hour by category` | `HourlyBlocks`, one row per category, each row its own scale, totals at the end |
| `top countries` | name, accent bar scaled to the first, events, sources (page: five on the first screen, twenty below) |
| `top networks` | `AS<asn> <name>`, events, sources (ten) |
| `credentials tried` | usernames and passwords (attempts), and below the fold `top pairs` (`username / password`, attempts). Values in monospace, exactly as received; the caption says `seen from 5+ sources` |
| `what intruders did` | the nine behaviors with sessions, labelled: `system_recon` "looked around the system", `cred_change` "changed a password", `ssh_key_persistence` "planted an SSH key", `cron_persistence` "added a cron job", `download_attempt` "tried to download something", `miner` "started a miner", `botnet_dropper` "dropped a bot", `cleanup` "cleaned up after itself", `other` "other" |
| `cves` | id linked to NVD, hits, sources |
| `malware pushed` | sha256 shortened to 12 characters with the full value in a `title`, `via`, first seen as a relative time, links `VirusTotal` and `MalwareBazaar` (LAB_UI_SPEC.md §9) |
| `ai agents` | `suspected` and `likely` with: "Sessions that followed an instruction planted where only an AI agent would act on it. Likely: it also answered at machine speed." |
| `signatures` | hidden while empty (v1) |

---

## 9. Legend and filters

`CategoryLegend.tsx`: one `<button aria-pressed>` per category in the fixed order: swatch,
name, 24 h count, the category meaning as `title`. Pressing toggles the category in the arcs,
the bins (by subtracting it) and the feed. Counts never change with filters, and colors never
move. At least one category stays on. The filter state is per view and resets on navigation.

---

## 10. States

| Situation | Rendering |
|---|---|
| live | everything; arcs replaying |
| live document delayed or offline, digest live | numbers normal; no new arcs; a note under the globe `live feed paused`; badge shows the worse state |
| digest delayed | numbers at 55 % opacity, badge `◐ delayed as of N min ago`, no new arcs |
| digest offline | header and badge, then one line `○ honeynet offline`; no numbers, no globe |
| a target `up: false` | its marker hollow and grey, label `· down`, no rings |
| `cc: null` | feed `—`; bin hover "unknown country" |
| empty lists | the block shows `none in the last 24 h` (except `signatures`, which hides) |
| no WebGL, Save-Data, phone | the placeholder (§4.3) |
| reduced motion | static bins only (§5) |
| demo | `◇ demo data` badge |

---

## 11. Tests

`tests/lab/threats-schema.test.ts` against the vendored files:

| Example | Expected |
|---|---|
| `threats.v1.json`, `threats-live.v1.json` | parse |
| `threats-bad-cve-id.json` | reject |
| `threats-credential-email.json` | reject |
| `threats-credential-one-source.json` | reject (`sources` < 5) |
| `threats-ip-in-label.json` | reject (IP shape in a target label) |
| `threats-ipv6-in-asn-name.json` | reject |
| `threats-missing-behavior.json` | reject |
| `threats-nan.json` | reject (`JSON.parse` fails on `NaN`; the loader reports offline) |
| `threats-null-count.json` | reject |
| `threats-unknown-category.json` | reject |
| `threats-live-offset-outside-window.json` | reject (`t` = 900) |
| `threats-live-too-many-events.json` | reject (401 events) |
| `threats-live-unknown-service.json` | reject |
| `threats-oversized.json` | schema-valid; rejected by the loader's 64 KiB cap |
| `threats-unknown-key.json`, `threats-live-source-address.json` | **parse, with the extra key stripped** (`source_ips`, `src`): assert the key is gone and that the serialized output contains no IPv4/IPv6-shaped string |

Also: `tests/lab/replay-clock.test.ts` (overlapping documents never double-schedule; nothing
fires before its time or more than 5 s late; warm start; stop and resume on state changes;
filters applied at fire time), `tests/lab/globe-layers.test.ts` (150-arc cap dropping the lowest
`n`; bins shrink and hide with filters; label text escaped), freshness at 1200/1201 s and
3600/3601 s (digest) and 300/301 s and 900/901 s (live), and the compact-encoded golden files
under their size caps.
