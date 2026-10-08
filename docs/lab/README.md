# `~/lab`: specification

Live views of David's homelab on the portfolio: the servers' telemetry and a honeypot threat map
with a globe. The homelab pushes small JSON documents to a private R2 bucket; this site reads
them server-side and draws them in the site's own style, following the active theme preset and
accent. Off by default behind `NEXT_PUBLIC_FEATURE_LAB`.

## Reading order

| # | Document | What it covers |
|---|---|---|
| 1 | [LAB_UI_SPEC.md](LAB_UI_SPEC.md) | the work order: ground rules, architecture, where the lab appears, theming, data layer, routes, budgets, security, accessibility, dependencies, phases, acceptance criteria |
| 2 | [HOMELAB_REFERENCE.md](HOMELAB_REFERENCE.md) | how to read the private `dleerdefi/dleer-homelab` repo: what to read, the dashboards, the honeynet, vendored fixtures, what never to do |
| 3 | [TELEMETRY_VIEW.md](TELEMETRY_VIEW.md) | `~/lab/telemetry`: the consumer contract for `now.json` and `history.json`, hardware names, the tile, `/lab`, mobile, states, tests |
| 4 | [THREATS_VIEW.md](THREATS_VIEW.md) | `~/lab/threats`: the consumer contract for `threats.json` and `threats-live.json`, the tile, `/lab/threats`, mobile, the globe, the replay clock, feed, stats, states, tests |
| 5 | [concepts/](concepts/README.md) | the approved mockups (HTML and PNG, all three presets) |

## At a glance

```
home: labsnap, threatsnap ──push──► private R2 bucket ◄──read-only, server-side── /api/lab/* (cached) ──► edge cache ──► tile, /lab, /lab/threats
```

| Route | What |
|---|---|
| `/lab` | framed telemetry page (`status.dleer.ai` redirects here) |
| `/lab/threats` | framed threat-map page (`threats.dleer.ai` redirects here) |
| `/api/lab/status`, `/api/lab/status/history` | telemetry documents, validated |
| `/api/lab/threats`, `/api/lab/threats/live` | threat documents, validated |
| `/api/lab/summary` | a few numbers for the home page |

Start with `LAB_UI_SPEC.md` §1 (ground rules) and §13 (phases).
