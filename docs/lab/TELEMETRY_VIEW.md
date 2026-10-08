# `~/lab/telemetry`: the homelab's live numbers

Part of the [lab UI spec](LAB_UI_SPEC.md). Concepts: `tile-telemetry`, `page-lab`, `mobile-lab`,
`mobile-section`, `states` in [concepts/](concepts/README.md).

Three Dell PowerEdge servers, read by Prometheus at home and pushed by **labsnap** as two JSON
documents. The allowlist is labsnap's `contract.py` (every key it may publish); the homelab's
"Public preview" Grafana dashboard draws the same series, minus the reserved `storage` and
`media` fields ([HOMELAB_REFERENCE.md §4](HOMELAB_REFERENCE.md#4-dashboards)). This view shows
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
| `lab` | `{ power_w: number 0–10000 \| null, energy_kwh_24h: number 0–250 \| null, hosts_up: int 0–3, hosts_expected: literal 3 }` |
| `hosts` | exactly three, in order: `z.tuple([host('storage'), host('gpu'), host('apps')])`, where `host(role) = { role: z.literal(role), up: boolean, power_w: number 0–3000 \| null, cpu_ratio: ratio, mem_ratio: ratio, inlet_c: number −10–70 \| null }` |
| `gpus` | 0–8 of `{ role, index: int 0–7, util_ratio: ratio, mem_ratio: ratio, power_w: number 0–500 \| null, temp_c: number 0–120 \| null }`. The producer sorts them by role then index; do not enforce the order, look GPUs up by `role:index` |
| `storage` | `{ used_bytes: int 0–1e15, total_bytes: int 0–1e15 } \| null`; `null` until the homelab's TrueNAS collector feeds labsnap |
| `media` | `{ streams: int 0–100 \| null, transcodes: int 0–100 \| null } \| null`; reserved for Plex, `null` while Plex is not monitored (the golden example has `{2, 1}`) |

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
| `gpus` | 0–8 of `{ role, index, util_ratio: (ratio)[], power_w: (number 0–500 \| null)[] }` |
| `media` | `{ streams: (int 0–100 \| null)[] } \| null` |

Refinement: every series has exactly `points` entries (the contract says so; the JSON Schema
only caps them at 2017). A mismatch fails the document. `null` entries are gaps: draw a break,
never a zero.

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
   caption `at the wall, now`. To its right, two key/value lines: `24 h  24.1 kWh` and
   `hosts  3/3 up ●` (the dot follows the badge state).
4. **24 h sparkline:** caption `power, last 24 h`; `history.lab.power_w`, full tile width,
   ~56 px high, accent line and 10 % area, gaps as breaks.
5. **Host table** (`<table>`): columns `host` (short name bold, role in `--lab-text-2`), `power`
   (`231 W`), `cpu` (meter + `12%`), `mem` (meter + `71%`), `inlet` (`22 °C`). Down hosts are
   dimmed with `○ down` in place of the values.
6. **GPU table:** columns `gpu` (model bold, host short name in `--lab-text-2`), `util` (meter +
   %), `vram` (meter + %), `power`, `temp`.
7. **Small multiples:** caption `power by host, 24 h · same scale`; three sparklines side by
   side, one shared y-domain, each labelled with the short name and its current watts.
8. **Footer links:** `full page → /lab` (left) and `honeypot: 15,447 events / 24 h →` (right,
   opens `lab-threats` in the tile). The count comes from `/api/lab/summary`; the link is shown
   only when its threats state is live or delayed.

### 5.2 Framed page `/lab`

Concept `page-lab`. Max content width as other framed pages; at ≥ 1024 px:

1. Framed header (LAB_UI_SPEC.md §3): `← Back`, tabs `telemetry | threats`, `esc closes`.
2. Title row: `❯ ~/lab` and the badges.
3. Framing: "Three PowerEdge servers in my homelab, live: power from each server's iDRAC, load
   from Prometheus. Pushed every 30 s; nothing at home accepts a connection to serve this page."
4. **Left column (~300 px):** hero `lab.power_w` at 72 px with `at the wall, now`; under it two
   stat boxes: `24.1` / `kWh, 24 h` and `3/3` / `hosts up`.
5. **Right:** `LineChart` of `history.lab.power_w`, caption `lab power, last 24 h`, ~200 px high,
   y-axis in watts with round ticks, x labels `-24 h`, `-12 h`, `now`, end label `1,029 W`,
   hover crosshair and tooltip.
6. **Three host cards** in a row, in role order: name (`PowerEdge T430`) and job (`NAS · media`)
   on the first line; current watts large with `power` caption and the host's 24 h power
   sparkline beside it (all three cards share one y-domain); `cpu` meter + % + 24 h cpu
   sparkline (domain 0–1); `mem` meter + %; `inlet 22 °C`. When `storage` is not null, the T430
   card adds `pool` with a meter and `41.2 / 72.0 TB` (decimal TB, one decimal). When `media` is
   not null, it adds `plex  2 streams · 1 transcoding`.
7. **GPU table** (full width): `gpu`, `in` (host short name), `util` (meter + %), `vram` (meter
   + %), `power`, `temp`, `util, 24 h` (sparkline, domain 0–1, same for every row).
8. **Honeypot teaser** (one bordered line): `❯ honeypot: 15,447 events in 24 h from 31
   countries` and `~/lab/threats →` on the right, from `/api/lab/summary`. Hidden when the
   threats state is offline or unknown.

Below 1024 px everything stacks: hero and stat boxes, the chart full width, host cards one per
row, then GPUs.

### 5.3 Mobile `/lab`

Concept `mobile-lab`. The framed page at phone width: `← Back` and the badge in the header (no
tabs; the teaser at the bottom links to threats), `❯ ~/lab`, hero at 52 px with `kWh` and hosts
to its right, `power, last 24 h` sparkline, one compact card per host (name, watts, cpu and mem
meters), one card listing the GPUs (name, util meter, %, temperature), and the honeypot teaser.

### 5.4 Mobile Lab section card

Concept `mobile-section`. In `ParallaxLabSection`, the first of two cards, the whole card a link
to `/lab`: `~/lab` and the badge; hero watts at 34 px with `24.1 kWh / 24 h` and `3/3 hosts up`
to the right; a sparkline of `summary.telemetry.power_24h`; `open telemetry →`. Data from
`/api/lab/summary`. Offline: the card shows `lab offline` and stays a link.

### 5.5 Neofetch row

`Lab: 1,029 W · 3/3 hosts ●` — label in the neofetch label style (`--theme-primary`, bold), value
in `--theme-text`, the glyph in the status color (`●` live, `◐` delayed). Hidden when offline or
unknown. From `/api/lab/summary`.

---

## 6. States

| Situation | Rendering |
|---|---|
| `null` value | `—` with no unit; meters show an empty track |
| `hosts[i].up === false` | the row or card dimmed to 50 %, `○ down` in `--theme-error` beside the name, values as dashes |
| `lab.hosts_up < hosts_expected` | `hosts 2/3 up` with `◐` in the warning color |
| `gpus` empty | the GPU table is omitted |
| `storage` / `media` `null` | their lines are omitted (not dashed: they are reserved fields) |
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
unit.
