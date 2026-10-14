# `~/lab/telemetry`: the homelab's live numbers

Part of the [lab UI spec](LAB_UI_SPEC.md). Concepts: `tile-telemetry`, `page-lab`, `mobile-lab`,
`mobile-section`, `states` in [concepts/](concepts/README.md).

Three Dell PowerEdge servers, read by Prometheus at home and pushed by **labsnap** as two JSON
documents. The allowlist is labsnap's `contract.py` (every key it may publish); the homelab's
"Public preview" Grafana dashboard draws the same series, minus the reserved `media` field ([HOMELAB_REFERENCE.md §4](HOMELAB_REFERENCE.md#4-dashboards)). This view shows
those keys and nothing else.

## Contents

1. [Sources](#1-sources)
2. [Consumer contract](#2-consumer-contract)
3. [Freshness](#3-freshness)
4. [Hardware names](#4-hardware-names)
5. [Views](#5-views)
6. [States](#6-states)
7. [Tests](#7-tests)

---

## 1. Sources

In `dleerdefi/dleer-homelab` (read them before building; paths from the repo root):

| What | Path |
|---|---|
| Contract (the source of truth) | `docs/status-contract.md` |
| JSON Schemas | `stacks/monitoring/labsnap/labsnap/schemas/now.v1.schema.json`, `history.v1.schema.json` |
| Golden examples | `stacks/monitoring/labsnap/examples/now.v1.json`, `history.v1.json` |
| Invalid examples | `stacks/monitoring/labsnap/examples/invalid/*.json` (12 files) |
| What is public | `stacks/monitoring/grafana/dashboards/lab/public-preview.json` and `stacks/monitoring/prometheus/rules/public.rules.yml` |
| Producer | `stacks/monitoring/labsnap/` (`contract.py` lists every published key) |

| Object | Rewritten | Size | Route |
|---|---|---|---|
| `v1/now.json` | every 30 s | ~1 KB | `/api/lab/status` |
| `v1/history.json` | every 5 min | ~25 KB (24 h at 5 min = 289 points) | `/api/lab/status/history` |

---

## 2. Consumer contract

`lib/lab/schemas/telemetry.ts` mirrors the producer schemas. Zod's default object parsing
strips unknown keys (the compatibility rule: additions can appear in v1 at any time); every key
the producer requires is required here too.

Shared pieces: `timestamp` = `/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/`; `ratio` = number 0–1 or
`null`; `role` = `storage | gpu | apps`.

### `now.json`

| Field | Zod |
|---|---|
| `schema_version` | `z.literal(1)` |
| `generated_at` | `timestamp` |
| `interval_s` | int 10–600 (30 today) |
| `stale_after_s` | int 10–86400 (120 today) |
| `lab` | `{ power_w: number 0–10000 \| null, energy_kwh_24h: number 0–250 \| null, energy_cost_usd_24h: number 0–100 \| null, vms_running: int 0–500 \| null, targets_up, targets_total, alerts_firing: int 0–1000 \| null, disks, disks_healthy: int 0–500 \| null, drive_temp_max_c: number 0–100 \| null, hosts_up: int 0–3, hosts_expected: literal 3 }` |
| `hosts` | exactly three, in order: `z.tuple([host('storage'), host('gpu'), host('apps')])`, where `host(role) = { role: z.literal(role), up: boolean, power_w: number 0–3000 \| null, cpu_ratio: ratio, mem_ratio: ratio, inlet_c: number −10–70 \| null, fan_rpm: number 0–30000 \| null, exhaust_c: number −10–100 \| null, psu_in_v: number 0–300 \| null }`. `exhaust_c` is always `null` on the T430 (its BMC has no exhaust sensor) |
| `gpus` | 0–8 of `{ role, index: int 0–7, util_ratio: ratio, mem_ratio: ratio, power_w: number 0–500 \| null, temp_c: number 0–120 \| null, enc_ratio: ratio, dec_ratio: ratio }`. `enc_ratio` / `dec_ratio` are the NVENC / NVDEC load: a load, never a count of streams. The producer sorts them by role then index; do not enforce the order, look GPUs up by `role:index` |
| `storage` | `{ used_bytes: int 0–1e15, total_bytes: int 0–1e15 } \| null`: the NAS's TrueNAS data pools summed into one figure (below); `null` while TrueNAS isn't reporting |
| `nas` | `{ pool_healthy: boolean \| null, read_bytes_s: int 0–1e11 \| null, write_bytes_s: int 0–1e11 \| null, arc_hit_ratio: ratio } \| null`: the TrueNAS data pools (boot pool left out): every data pool ONLINE, throughput, and reads served from RAM over the last hour. `null` while TrueNAS isn't reporting |
| `ci` | `{ runners_online, runners_total, runners_busy: int 0–500 \| null, queue_oldest_s: int 0–2592000 \| null, busy_hours_24h: number 0–12000 \| null } \| null`: the self-hosted GitHub Actions runners, totals across every repo (never per repo; the data has no repo names). `null` while the runner exporter isn't reporting |
| `media` | `{ streams: int 0–100 \| null, transcodes: int 0–100 \| null } \| null`; reserved for Plex, `null` while Plex is not monitored (the golden example has `{2, 1}`) |

The `lab` counts come from homelab PR #28: `vms_running` (VMs and containers running, a count,
never names), `targets_up` / `targets_total` (monitored endpoints answering), `alerts_firing` (0
when quiet), `disks` / `disks_healthy` (SMART), `drive_temp_max_c` (the hottest disk), and
`energy_cost_usd_24h` (the 24 h energy at Puget Sound Energy's residential rate, $0.2056/kWh, no
basic charge or taxes). Every key is required, as in the producer schema; each value can be `null`.
Homelab PR #32 adds `energy_rate_usd_per_kwh` (that rate, 0–5; a `now.json` written before it
has no key, read as `null`). The views price the current draw with it, `power_w / 1000 × rate`
per hour (`costAtDraw` in `lib/lab/format.ts`): `≈ $3.70/day at this draw` under the watts on
`/lab`, in the stage tile and on the home card's power slide, and `$0.154/h · $3.70/day` beside
the live panel's latest power, which moves every 10 s. The 24 h cost is labelled `last 24 h`.
Each is hidden while the rate is `null`; the home slide then shows the 24 h cost instead.

**`storage`** follows the homelab's `docs/status-contract.md` (homelab PR #16):

- The TrueNAS data pools on the `storage` host, summed: `total_bytes` is the pools' size and
  `used_bytes` their allocated space, as `zpool list` reports them (SIZE and ALLOC), not dataset
  quotas. ZFS sits on PERC virtual disks without RAID-Z, so the total is within about 1 % of
  usable space.
- The boot pool is left out; it holds the NAS's operating system, not files.
- Both or nothing: `null` while TrueNAS isn't reporting (never `0`). Exact integer bytes;
  divide by 10¹² for TB. Not in `history.json`.

### `history.json`

| Field | Zod |
|---|---|
| `schema_version`, `generated_at` | as above |
| `interval_s` | int 60–3600 (300 today) |
| `stale_after_s` | int 60–86400 (900 today) |
| `start` | `timestamp`; entry `i` is the value at `start + i × step_s` |
| `step_s` | int 60–3600 (300 today) |
| `points` | int 2–2017 (289 today) |
| `lab.power_w` | `(number 0–10000 \| null)[]` |
| `hosts` | `z.tuple` of three in role order: `{ role, power_w: (number 0–3000 \| null)[], cpu_ratio: (ratio)[] }` |
| `gpus` | 0–8 of `{ role, index, util_ratio: (ratio)[], power_w: (number 0–500 \| null)[], enc_ratio: (ratio)[] }` |
| `nas` | `{ read_bytes_s: (int 0–1e11 \| null)[], write_bytes_s: (int 0–1e11 \| null)[] } \| null` |
| `ci` | `{ runners_busy: (int 0–500 \| null)[] } \| null` |
| `media` | `{ streams: (int 0–100 \| null)[] } \| null` |

Refinement: every series, the `nas`, `ci` and GPU `enc_ratio` ones included, has exactly
`points` entries (the contract says so; the JSON Schema only caps them at 2017). A mismatch
fails the document. `null` entries are gaps: draw a break, never a zero.

---

## 3. Freshness

| Document | live | delayed | offline |
|---|---|---|---|
| `now.json` | age ≤ `stale_after_s` (120 s) | ≤ 15 min | older, missing or invalid |
| `history.json` | age ≤ `stale_after_s` (900 s) | ≤ 1 h (this site's choice; LAB_UI_SPEC.md §5) | older, missing or invalid |

The view's badge follows `now.json`. History only affects the charts: when it is offline the
charts are replaced by one line (`history unavailable`) and the hero numbers stay.

---

## 4. Hardware names

The documents carry `role` and `index` only; names live in `lib/lab/names.ts`:

| Key | Name | Short | Job |
|---|---|---|---|
| host `storage` | PowerEdge T430 | T430 | NAS · media |
| host `gpu` | PowerEdge R730 | R730 | GPU · inference |
| host `apps` | PowerEdge R720xd | R720xd | apps · CI |
| gpu `storage:0` | Quadro RTX 4000 | on T430 | the Plex VM's card |
| gpu `gpu:0` | RTX A4000 #0 | on R730 | |
| gpu `gpu:1` | RTX A4000 #1 | on R730 | |

A GPU key not in the table renders as `GPU <role>:<index>` on its host's short name, so a new
card shows up without a code change.

---

## 5. Views

All copy below is the approved wording; keep it.

### 5.1 Content tile (`lab-telemetry`)

Concept `tile-telemetry`. Top to bottom, inside the content tile's usual padding:

1. **Header row:** `❯ ~/lab/telemetry` in the accent at the view-title size; right-aligned
   `LabStatusBadge` (`● live 12 s ago`) and, in demo mode, `◇ demo data`.
2. **Framing:** "Three PowerEdge servers in my homelab, live. Power is read from each server's
   iDRAC." (`--lab-text-2`).
3. **Hero:** `lab.power_w` rounded, thousands separator, ≥ 48 px, unit `W` smaller beside it,
   caption `at the wall, now`. To its right, two key/value lines: `24 h  24.1 kWh · ≈ $4.96` and
   `hosts  3/3 up ●` (the dot follows the badge state). The cost is `lab.energy_cost_usd_24h`
   with two decimals; its tooltip is the rate: "Puget Sound Energy residential rate,
   $0.2056/kWh; excludes the basic charge and taxes".
4. **Lab health line** (`--theme-text`, separators in `--lab-text-2`): `6 VMs · 27/27 targets up
   · 0 alerts · 20/20 disks healthy · hottest disk 31 °C`. When `alerts_firing > 0` the alert
   count (`2 alerts`) turns `--theme-warning`, and nothing more is said about them.
5. **24 h sparkline:** caption `power, last 24 h`; `history.lab.power_w`, full tile width,
   ~56 px high, accent line and 10 % area, gaps as breaks.
6. **Host table** (`<table>`): columns `host` (short name bold, role in `--lab-text-2`, and a
   quiet sub-line `fan 6,500 rpm · psu 116 V`), `power` (`231 W`), `cpu` (meter + `12%`), `mem`
   (meter + `71%`), `air` (`23 → 51 °C` with `Δt +28 °C` under it; the inlet alone, `22 °C`,
   where `exhaust_c` is `null`). Down hosts are dimmed with `○ down` in place of the values.
7. **GPU table:** columns `gpu` (model bold, host short name in `--lab-text-2`), `util` (meter +
   %), `vram` (meter + %), `enc/dec` (`31%/12%`, the video engines' load), `power`, `temp`. While
   the Quadro's `enc_ratio > 0` its name gets a small `transcoding` tag (accent outline). The
   encoder is a load: never show it as a number of streams.
8. **Small multiples:** caption `power by host, 24 h · same scale`; three sparklines side by
   side, one shared y-domain, each labelled with the short name and its current watts.
9. **Footer links:** `full page → /lab` (left) and `honeypot: 15,447 events / 24 h →` (right,
   opens `lab-threats` in the tile). The count comes from `/api/lab/summary`; the link is shown
   only when its threats state is live or delayed.

Both tables sit in a sideways-scrolling wrapper, so a narrow tile scrolls them instead of
clipping the last column.

Opened from a slide of the home lab card (§5.4), the view arrives at that slide's part:
`{ type: 'lab-telemetry', section: 'hosts' | 'gpus' }` scrolls the tile to the host or the GPU
table once the numbers render, and the power slide (no `section`) scrolls it back to the top.

### 5.2 Framed page `/lab`

Concept `page-lab`. Max content width as other framed pages; at ≥ 1024 px:

1. Framed header (LAB_UI_SPEC.md §3): `← Back`, tabs `telemetry | threats`, `esc closes`.
2. Title row: `❯ ~/lab` and the badges.
3. Framing: "Three PowerEdge servers in my homelab, live: power from each server's iDRAC, load
   from Prometheus. Pushed every 30 s; nothing at home accepts a connection to serve this page."
4. **Left column (~300 px):** hero `lab.power_w` at 72 px with `at the wall, now`; under it two
   stat boxes: `24.1` / `kWh, 24 h` with `≈ $4.96*` under it, and `3/3` / `hosts up`. The `*`
   points at the footnote (item 10).
5. **Right:** `LineChart` of `history.lab.power_w`, caption `lab power, last 24 h`, ~200 px high,
   y-axis in watts with round ticks, x labels `-24 h`, `-12 h`, `now`, end label `1,029 W`,
   hover crosshair and tooltip.
6. **Lab health line**, full width, as in §5.1 item 4.
7. **Three host cards** in a row, in role order: name (`PowerEdge T430`) and job (`NAS · media`)
   on the first line; current watts large with `power` caption and the host's 24 h power
   sparkline beside it (all three cards share one y-domain); `cpu` meter + % + 24 h cpu
   sparkline (domain 0–1); `mem` meter + %; `inlet 22 °C`; `exhaust 51 °C` with `Δt +28 °C`
   in `--lab-text-2` (both rows hidden where `exhaust_c` is `null`: the T430's BMC has no
   exhaust sensor); `fan 6,500 rpm`; `psu in 116 V` (quiet, `--lab-text-2`). When `media` is not
   null, the T430 card adds `plex  2 streams · 1 transcoding`. Then, under a dashed rule, a
   captioned block per host where its section is not null:
   - **T430, `nas`:** `pool` with `● healthy` (`--theme-success`) or `● degraded`
     (`--theme-error`) from `pool_healthy`, then the pool meter and `38.6 / 50.3 TB` (decimal TB,
     one decimal) when `storage` is not null; `read` and `write` in decimal units (`240 kB/s`,
     `12.5 MB/s`, one decimal below 100 of a unit) each with a 24 h sparkline
     (`history.nas`); `ARC hit 99.9%`. While `nas` is `null` but `storage` is not, the bare
     `pool` row (meter and TB) stays in the card instead.
   - **R720xd, `ci`:** `runners  14/22 online`; `busy  2 now` with a 24 h sparkline
     (`history.ci.runners_busy`); `24 h  6.4 runner-hours` (`busy_hours_24h` is a rolling 24 h,
     hence not "today"); `queue  oldest job waiting 3 min` only while `queue_oldest_s > 0`.
     Never a repository name (the data has none).
8. **GPU table** (full width): `gpu`, `in` (host short name), `util` (meter + %), `vram` (meter
   + %), `enc` and `dec` (%), `power`, `temp`, `util, 24 h` and `enc, 24 h` (sparklines, domain
   0–1, same for every row). The `transcoding` tag as in §5.1 item 7.
9. **Honeypot teaser** (one bordered line): `❯ honeypot: 15,447 events in 24 h from 31
   countries` and `~/lab/threats →` on the right, from `/api/lab/summary`. Hidden when the
   threats state is offline or unknown.
10. **Footnote** (`--lab-text-2`, small): `* ≈ $ per 24 h: Puget Sound Energy residential rate,
   $0.2056/kWh; excludes the basic charge and taxes.`
11. **How this works** (`LabHowItWorks.tsx`, a bordered card, last): the push-only path as a
   vertical diagram about 35 columns wide (`labsnap, threatsnap` → push JSON on a timer →
   `private bucket` → read-only token → `/api/lab/*`, validated and cached → `edge cache ──►
   this page`; `aria-hidden`, the paragraph says the same), beside one paragraph from 768 px and
   above it below: "Nothing at home serves this page. … When the pushes stop, the badge says so."
   and `The full story →` to `/projects/homelab`. It renders after the first answer (data or
   offline), so the numbers arriving never push it down.

The first host card carries `id="hosts"` and the GPU card `id="gpus"` (on the phone layout too):
the home lab card's slides link to `/lab#hosts` and `/lab#gpus`, and since those elements exist
only once the data renders, the page scrolls to the hash then, once.

Below 1024 px everything stacks: hero and stat boxes, the chart full width, the health line,
host cards one per row, then GPUs.

### 5.3 Mobile `/lab`

Concept `mobile-lab`. The framed page at phone width: `← Back` and the badge in the header (no
tabs; the teaser at the bottom links to threats), `❯ ~/lab`, hero at 52 px with `kWh`, `≈ $4.96*`
and hosts to its right, the lab health line, `power, last 24 h` sparkline, one compact card per
host (name, watts, cpu and mem meters, then one quiet wrapping line `inlet · exhaust · Δt · fan ·
psu`, exhaust and Δt omitted where `exhaust_c` is `null`; the T430 card adds the NAS block and
the R720xd card the CI block, as in §5.2), one card listing the GPUs (name with `enc 31% · dec
12%` and the `transcoding` tag under it, util meter, %, temperature), the cost footnote, the
honeypot teaser, and the how-this-works card (§5.2 item 11, the diagram above the paragraph).

### 5.4 Home lab card

`components/lab/home/LabTile.tsx`, `LabCarousel.tsx`, `LabSlides.tsx` (docs/PORTFOLIO_V2_SPEC.md
§4.6): the lab tile on desktop, the Lab section on phones. Under the heading `Lab`, a `/lab ↗`
link and one line (`My homelab, live.`, or `My homelab and the honeypot I run, live.` with the
threat map on), one card of fixed size that shows one slide at a time. Every slide is a whole
link with the same frame: its path and the status badge, a few headline numbers, a call to
action.

| Slide | Path | Numbers (`/api/lab/summary`) | Desktop | Phone |
|---|---|---|---|---|
| power | `~/lab` | watts at 34 px; `24.1 kWh / 24 h`, `≈ $4.96/day` (when a number), `3/3 hosts up`; the `power_24h` sparkline | `lab-telemetry` in the stage | `/lab` |
| hosts | `~/lab/hosts` | per host: short name and job, `cpu 12% · inlet 22 °C` or `down` | `lab-telemetry`, section `hosts` | `/lab#hosts` |
| GPUs | `~/lab/gpus` | per GPU: name and host, `util 37% · 52 °C`, `· enc 31%` while encoding | `lab-telemetry`, section `gpus` | `/lab#gpus` |
| storage and CI | `~/lab/nas+ci` | `NAS T430`: `pool healthy` (or `degraded`), `read · write`; `CI runners R720xd`: `14/22 online · 2 busy` | `lab-telemetry`, section `hosts` | `/lab#hosts` |
| honeypot (threat map on) | `~/lab/threats` | events and countries in 24 h; the three largest categories with swatch, bar and count | `lab-threats` in the stage | `/lab/threats` |

A slide whose numbers are missing (offline, or the block `null`) is left out; until the summary
arrives, and while telemetry is offline, the power slide holds the card's space (`lab offline`).

**Motion.** A row with scroll snapping: a phone swipes it, a dot or the timer scrolls it. On
desktop it advances every 6 s, never while the pointer or focus is on the card, while it is off
screen (`IntersectionObserver`) or the tab hidden, after the viewer presses `pause`, or with
`prefers-reduced-motion` (WCAG 2.2.2); then there is no `pause` button. Phones never advance on
their own.

**Accessibility.** `section` with `aria-roledescription="carousel"`; each slide
`aria-roledescription="slide"`, the ones out of view `aria-hidden` and out of the tab order; the
row is a polite live region except while it plays; the dots are buttons (`Show hosts`,
`aria-current` on the slide in view; 24 px targets on desktop, 44 px on phones, where the
card's text is 14 px at least). Only the power slide's badge is a status
region; the copies on the other slides are not, so a change is read once.

**Narrow cards.** The card is a size container. Figures joined by ` · ` wrap between figures,
never inside one (a dot that would start a line is clipped). At 270 px and less the power's
stats go under the watts; at 180 px and less (the desktop tile at 1024 px) `inlet` drops to the
bare temperature, the honeypot bars go (the counts stay) and the badge is its icon, the word
kept for screen readers. On desktop screens 900 px tall and less the tile drops its intro line;
at 820 px and less also its heading (still there for screen readers) and some padding, so the
card and its dots fit without the tile scrolling down to 1024×768 and 1280×720.

### 5.5 Neofetch row

`Lab: 1,029 W · 3/3 hosts ● · ≈ $4.96/day` — label in the neofetch label style
(`--theme-primary`, bold), value in `--theme-text`, the glyph in the status color (`●` live, `◐`
delayed). The cost part, with the rate as its tooltip, only when
`summary.telemetry.energy_cost_usd_24h` is a number. Hidden when offline or unknown. From
`/api/lab/summary`.

---

## 6. States

| Situation | Rendering |
|---|---|
| `null` value | `—` with no unit; meters show an empty track |
| `hosts[i].up === false` | the row or card dimmed to 50 %, `○ down` in `--theme-error` beside the name, values as dashes |
| `lab.hosts_up < hosts_expected` | `hosts 2/3 up` with `◐` in the warning color |
| `gpus` empty | the GPU table is omitted |
| `storage` / `media` `null` | their lines are omitted, not dashed (`storage` is `null` while TrueNAS isn't reporting; `media` is reserved) |
| `nas` / `ci` `null` | the whole NAS or CI block is hidden (the section is unknown, not zero); a `null` field inside a known section is a dash |
| `hosts[i].exhaust_c === null` | the exhaust and `Δt` rows are hidden (no sensor), the tile's `air` column shows the inlet alone |
| `alerts_firing > 0` | the alert count in `--theme-warning`, nothing else (no names) |
| the Quadro's `enc_ratio > 0` | the `transcoding` tag; `0` or `null`, no tag |
| `history.nas` / `history.ci` `null` | the NAS / CI values without their sparklines |
| history offline | charts and sparklines replaced by `history unavailable` (`--lab-text-2`) |
| history gap (`null` entries) | a break in every line, never a drop to zero |
| delayed | values at 55 % opacity, badge `◐ delayed as of N min ago` |
| offline | the header and badge, then one line `○ lab offline`, no numbers |
| demo | `◇ demo data` badge beside the status badge |

---

## 7. Tests

`tests/lab/telemetry-schema.test.ts`, against the vendored files ([HOMELAB_REFERENCE.md §6](HOMELAB_REFERENCE.md#6-vendored-fixtures)):

| Example | Expected |
|---|---|
| `now.v1.json`, `history.v1.json` | parse |
| `now-bad-timestamp.json` | reject |
| `now-hosts-out-of-order.json` | reject |
| `now-missing-media-key.json` | reject |
| `now-nan-as-string.json` | reject |
| `now-ratio-out-of-range.json` | reject |
| `now-unknown-role.json` | reject |
| `now-wrong-version.json` | reject |
| `history-series-with-text.json` | reject |
| `history-two-hosts.json` | reject |
| `now-extra-host-field.json`, `now-free-text-gpu-model.json`, `history-gpu-extra-field.json` | **parse, with the extra key stripped**: the producer rejects these, the consumer tolerates additions by design. Assert the key (`hostname`, `model`, `uuid`) is absent from the output |

Also: freshness at 120/121 s and 900/901 s (now), 900/901 s and 3600/3601 s (history); a series
whose length differs from `points` fails; the demo history is deterministic, has 289 points,
one `null`, and ends at the now fixture's values; `format.ts` renders `null` as `—` without a
unit. The schema tests also check the homelab PR #28 fields in the golden examples, that `nas`
and `ci` may be `null` but must be present (as the producer requires), and that the new series
(`gpus[].enc_ratio`, `nas`, `ci`) are held to `points` too.

`tests/lab/telemetry-view.test.ts` renders the views to static markup: `nas` / `ci` `null` hides
its block; a `null` field inside one is a dash; the queue line only when a job waits;
`exhaust_c` `null` hides exhaust and `Δt` (card and tile table); `transcoding` shows once while
the Quadro's encoder runs and never on an A4000; enc/dec read as percentages, never streams; the
health line text, the warning colour for firing alerts, dashes for `null` counts; the cost
tooltip; and the new formatters.
