# Working from the homelab repo

Part of the [lab UI spec](LAB_UI_SPEC.md). The lab views render documents produced in David's
private homelab repo, **`dleerdefi/dleer-homelab`**. Read it before building, and come back to it
whenever a contract question comes up: the contracts, schemas and golden examples there are the
source of truth, and this repo only mirrors them.

## Contents

1. [What the homelab repo is](#1-what-the-homelab-repo-is)
2. [Getting read access](#2-getting-read-access)
3. [Reading list](#3-reading-list)
4. [Dashboards](#4-dashboards)
5. [The honeynet in one page](#5-the-honeynet-in-one-page)
6. [Vendored fixtures](#6-vendored-fixtures)
7. [What this repo must never do](#7-what-this-repo-must-never-do)
8. [Go-live: who does what](#8-go-live-who-does-what)
9. [When the homelab changes](#9-when-the-homelab-changes)

---

## 1. What the homelab repo is

Infrastructure as code for three Dell PowerEdge servers (a T430 for storage and media, an R730
for GPU inference, an R720xd for apps and CI) running Proxmox, plus the monitoring stack
(Prometheus, Grafana, exporters, Alertmanager) and the honeynet. Default branch `main`. It is
**private**; this repo is **public**. Everything below is about reading it, never about copying
it here, except the synthetic fixtures in §6.

Two producers in it write the documents this site reads:

| Producer | Runs | Writes | Contract |
|---|---|---|---|
| **labsnap** | at home, on the apps docker VM | `v1/now.json` (30 s), `v1/history.json` (5 min) | `docs/status-contract.md` |
| **threatsnap** | at home, same VM | `v1/threats.json` (5 min), `v1/threats-live.json` (60 s) | `docs/threats-contract.md` |

Both push to one private R2 bucket; this site holds an Object Read only token for it. Nothing in
the homelab accepts a connection from this site.

---

## 2. Getting read access

- **Claude Code on the web:** attach `dleerdefi/dleer-homelab` to the session **read-only**
  (the "add repository" tool, access `read`), clone it next to this repo, e.g.
  `../dleer-homelab`, and `git fetch origin` so the open PR branches are visible.
- **Locally:** `gh repo clone dleerdefi/dleer-homelab ../dleer-homelab` with an account that
  can read it.
- If neither works, stop and ask David for access. Do not work from memory of the contracts.

Treat it as read-only: no pushes, branches, comments or PRs there from a portfolio session. If
something in the homelab looks wrong, say so in your PR description and to David.

---

## 3. Reading list

In this order. Paths are from the homelab repo root; "PR #n" means the file is on that PR's
branch until it merges (`git show origin/<branch>:<path>`).

| # | Path | Why | Where |
|---|---|---|---|
| 1 | `README.md`, `docs/architecture.md` | the zones, the push-not-serve rule, what is public | `main` |
| 2 | `docs/status-contract.md` | telemetry contract: fields, units, freshness, compatibility, the route sketch this spec follows | `main` |
| 3 | `stacks/monitoring/labsnap/labsnap/schemas/*.json`, `examples/*.json`, `examples/invalid/*.json` | the telemetry schemas and examples the consumer mirrors | `main` |
| 4 | `stacks/monitoring/labsnap/labsnap/contract.py`, `README.md` | every published key; how labsnap fails closed | `main` |
| 5 | `stacks/monitoring/prometheus/rules/public.rules.yml` | the `public:*` recording rules: the only series labsnap may publish | `main` |
| 6 | `stacks/monitoring/grafana/dashboards/lab/public-preview.json` | what is public, as a dashboard (§4) | `main` |
| 7 | `docs/threats-contract.md` | threats contract: enums, filters, freshness, "never published" | `main`; PR #11 adds `cc` may be `null` |
| 8 | `docs/honeynet-spec.md`, `docs/decisions/0002-honeynet-sensor-off-site.md` | how the honeynet works and why; phase 5 points at this spec | `main`; PRs #11–#14 refine it |
| 9 | `stacks/honeynet/threatsnap/README.md`, `threatsnap/contract.py`, `threatsnap/validate.py`, `threatsnap/schemas/*.json`, `examples/` | the threat schemas, golden and invalid examples, size caps, the IP-shape scan | PR #11 (`claude/threatsnap`) |
| 10 | `workers/honeytokens/wrangler.toml`, `README.md` | the routes the honeytoken Worker owns on dleer.ai (§7) | PR #13 (`claude/honeytokens-worker`) |
| 11 | `docs/roadmap.md` | phase 1b (labsnap goes public, the flag stays off for a week) and the redirects | `main`; PR #14 updates it |

Hardware names are not in any document: the status contract says they live in the portfolio,
keyed by `role` and `index` ([TELEMETRY_VIEW.md §4](TELEMETRY_VIEW.md#4-hardware-names)).

---

## 4. Dashboards

The homelab's Grafana dashboards are in `stacks/monitoring/grafana/dashboards/`:

| Dashboard | Use for this site |
|---|---|
| `lab/public-preview.json` ("Public preview: what dleer.ai shows") | **What is public, drawn.** Every panel queries only `public:*` series, the same ones labsnap publishes; the authoritative key list is labsnap's `contract.py`. The dashboard lacks only the reserved `storage` and `media` fields. The telemetry view is this dashboard redrawn in the site's style |
| `lab/server-hardware.json`, `lab/ci-runners.json`, the pinned community dashboards | private operations views (fans, voltages, disks, runners, exporters). Read them for context if useful; **never** reproduce their data or panels on the site |

How the public-preview panels map to the telemetry view:

| Panel (series) | In the UI |
|---|---|
| Lab power (`public:lab_power:watts`) | the hero number, the 24 h line chart |
| Energy, last 24 h (`public:lab_energy_24h:kwh`) | `24.1 kWh` |
| Hosts reporting (`public:host_up:bool`) | `3/3 hosts up`, per-host `down` |
| Power by host (`public:host_power:watts`) | host watts, the same-scale small multiples |
| CPU by host (`public:host_cpu:ratio`) | cpu meters, cpu sparklines |
| Memory by host (`public:host_mem:ratio`) | mem meters |
| Inlet temperature (`public:host_inlet_temp:celsius`) | `inlet 22 °C` |
| GPU temperature, utilisation, power and memory (`public:gpu_*`) | the GPU table and its util sparklines |

**The honeynet has no Grafana dashboard for the public.** Its public "dashboard output" is the
two threat documents themselves; this site is their only renderer. threatsnap's Prometheus
metrics (`threatsnap_*`) and alerts (`stacks/monitoring/prometheus/rules/honeynet.rules.yml`, PR
#11) are private operations data: they explain freshness problems but never appear on the site.

---

## 5. The honeynet in one page

```
small cloud VM (US West)                               Cloudflare (dleer.ai)
  Cowrie: fake SSH/Telnet                                honeytoken Worker: decoys on paths
  nginx decoy site                                       scanners probe; one anonymised
  nftables: honeypots cannot reach anything              record per hit (no IP stored)
  Vector ──PUT gzipped events──► R2 raw bucket            ──PUT──► R2 raw bucket
                                       ▲                              ▲
                                       └──── GET (pull only) ─────────┘
                                                     │
home: threatsnap ─ DuckDB (30 d) ─ DB-IP City Lite / IPinfo Lite ─ classify ─ filters ─ schema,
      size cap, IP-shape scan ──PUT──► v1/threats.json, v1/threats-live.json ──► this site
```

What matters for the UI:

- **Targets** are `sensor` (the cloud honeypot) and `web` (the Worker's decoys); their labels
  and positions are producer config, drawn as the globe's beacons.
- **Places are coarse:** city-level, rounded to 0.1°; countries ISO alpha-2; `cc` can be `null`.
- **Outside strings are filtered** (credentials with a five-source floor and a blocklist, AS
  names, signature names), and the whole document is scanned for IP shapes before publishing.
- **threatsnap starts in dry run** (`THREATSNAP_DRY_RUN=true`) and has a kill switch
  (`THREATSNAP_PUBLISH=false`). Until it publishes for real, the threats view is offline in
  production; build and test against the fixtures.
- **AI-agent detection** follows Palisade Research's LLM Agent Honeypot approach: a planted
  instruction only an LLM agent would follow, and a timing check. Describe it in one sentence at
  most; never name the canary or the route.

Status on 2026-10-08:

| PR | Branch | What | State |
|---|---|---|---|
| #10 | `claude/honeynet-spec` | build spec, threats contract, ADR 0002 | merged |
| #11 | `claude/threatsnap` | threatsnap, schemas, golden and invalid examples, alerts, CI | open |
| #12 | `claude/honeynet-sensor` | the sensor (Cowrie, decoy, nftables, Vector) | open |
| #13 | `claude/honeytokens-worker` | the honeytoken Worker | open |
| #14 | `claude/honeynet-docs` | architecture, roadmap, projects, README updates | open |

Check the current state before relying on a path. If #11 changes a schema or example after you
vendor it, re-sync (§6).

---

## 6. Vendored fixtures

This repo is public and its CI cannot read the private homelab, so the golden and invalid
examples are copied here. They are synthetic by design (threatsnap's README and the threats
contract say the portfolio copies them as its demo data) and contain no real addresses, names or
secrets: the invalid examples use only documentation addresses (`203.0.113.0/24`,
`2001:db8::/32`) and `corp.example`.

| Source (homelab) | Destination (here) | Use |
|---|---|---|
| `stacks/monitoring/labsnap/examples/now.v1.json`, `history.v1.json` | `lib/lab/fixtures/` | demo mode, tests |
| `stacks/honeynet/threatsnap/examples/threats.v1.json`, `threats-live.v1.json` | `lib/lab/fixtures/` | demo mode, tests |
| `stacks/monitoring/labsnap/examples/invalid/*.json` | `tests/fixtures/homelab/invalid/labsnap/` | tests |
| `stacks/honeynet/threatsnap/examples/invalid/*.json` | `tests/fixtures/homelab/invalid/threatsnap/` | tests |

`lib/lab/fixtures/MANIFEST.json` records, for every copied file: the homelab path, the branch,
the commit SHA it was copied from, and its sha256. A test recomputes the hashes, so a hand edit
fails CI. When this spec was written the sources were `main` at `79227c3` (labsnap) and
`claude/threatsnap` at `acecedd` (threatsnap).

**Sync procedure** (when a homelab PR changes an example or a schema):

1. `git -C ../dleer-homelab fetch origin` and check out the commit to copy from.
2. Copy the files verbatim (`cp`), never re-serialize or edit them.
3. Update `MANIFEST.json` (SHA, sha256), then update the Zod schemas if the producer schema
   changed, then run the tests.
4. Say in the PR description which homelab commit the fixtures now match.

Do not copy anything else from the homelab: no config, `.env` files, compose files, rules,
dashboards, scripts, honeyfs contents or Worker code.

---

## 7. What this repo must never do

- **Shadow or collide with the honeytoken Worker's routes.** The Worker answers a fixed list
  of scanner-bait paths on `dleer.ai` at the edge, before requests reach Railway. The list is in
  `workers/honeytokens/wrangler.toml` in the homelab; read it there and do not copy it into this
  repo. Before adding any route or any file under `public/`, check it against that list. The
  homelab, in turn, promises never to route `/_next/*`, `/api/*`, `/blog*`, `/projects*`,
  `/lab*`, the feeds or the sitemap. All lab routes stay under `/lab` and `/api/lab/`.
- **Publish homelab internals.** No IP addresses, hostnames, Tailscale names, bucket names,
  account IDs, tokens, canary values, decoy contents, dashboard JSON, alert rules or `.env`
  values in code, docs, tests, commit messages or PR descriptions. Environment variables carry
  the real values on Railway only.
- **Talk to the homelab or R2 from the browser.** Only the route handlers read R2, with the
  read-only token, server-side.
- **Display anything not in the contracts.** If a view needs a new field, it is a contract
  change in the homelab first (an additive v1 key, documented there), then a schema update here.
- **Run CI on self-hosted runners.** David's self-hosted runners serve the private homelab;
  this public repo uses GitHub-hosted runners only.

---

## 8. Go-live: who does what

| Step | Who | Where |
|---|---|---|
| labsnap public (dry run compared with the public-preview dashboard, then `SNAPSHOT_DRY_RUN=false`) | David | homelab roadmap phase 1b |
| R2 bucket, write tokens for labsnap and threatsnap, the read-only token for this site | David | Cloudflare |
| Lab UI behind the flag, against fixtures | Claude Code | this repo, LAB_UI_SPEC.md §13 phases 1–5 |
| `R2_ACCOUNT_ID`, `R2_LAB_BUCKET`, `R2_LAB_READ_KEY_ID`, `R2_LAB_READ_SECRET` on Railway | David | Railway |
| Cache rule for `/api/lab/*` | David | Cloudflare |
| `NEXT_PUBLIC_FEATURE_LAB=true` and redeploy, after labsnap has run cleanly for a week | David | Railway |
| `status.dleer.ai` → `dleer.ai/lab`, `threats.dleer.ai` → `dleer.ai/lab/threats` redirects | David | Cloudflare (homelab architecture doc) |
| threatsnap out of dry run, sensor and Worker live | David | homelab honeynet spec |

Note: the homelab's `docs/honeynet-spec.md` refers to this work as `docs/LAB_THREATS_SPEC.md`
in this repo; that file now points here.

---

## 9. When the homelab changes

| Change there | Do here |
|---|---|
| a new optional key in a v1 document | nothing is required (it is stripped); add it to the Zod schema and the UI only if a view should show it |
| a breaking change (`v2/` written beside `v1/`) | add v2 schemas and loaders side by side, switch the routes, keep v1 until David says the producer has stopped writing it |
| a new or replaced GPU | add its name to `lib/lab/names.ts`; until then it renders as `GPU <role>:<index>` |
| a new or renamed server | a contract change (the `role` enum and `hosts_expected` are fixed in v1); wait for it |
| `storage` filled (TrueNAS collector) or `media` filled (Plex) | already handled: the lines appear when the values are not `null` |
| a new golden or invalid example | re-sync (§6) and add its expectation to the view doc's test table |
| a weekly report (`v1/threats-weekly/…`, honeynet spec phase 6) | out of scope; it will come with its own contract addition |
