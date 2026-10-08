# Lab UI concepts

The approved look for the lab views, as static mockups. They were drawn from the homelab's golden
examples (synthetic data), so every number on them is one the real documents can hold. They are
references for layout, hierarchy and wording, **not code to copy**: build the views with the
site's components, `FONT_SIZES` and CSS variables as the spec says.

Approved direction: **A** (the content tile) for the tiled desktop, **B** (the framed
command-center page) for the shareable pages, with the per-category hourly rows folded into B. A
btop-style panel variant was explored and not chosen.

## Files

| Concept | Shows | Spec |
|---|---|---|
| [`tile-threats.html`](tile-threats.html) | desktop tiles with `~/lab/threats` in the content tile: globe, legend column, feed, summary; the `Lab/` directory in the nav tile, the `lab` polybar workspace, the two neofetch rows | [THREATS_VIEW.md §4.1](../THREATS_VIEW.md#41-content-tile-lab-threats) |
| [`tile-telemetry.html`](tile-telemetry.html) | desktop tiles with `~/lab/telemetry` in the content tile: hero, sparkline, host and GPU tables, same-scale small multiples | [TELEMETRY_VIEW.md §5.1](../TELEMETRY_VIEW.md#51-content-tile-lab-telemetry) |
| [`page-lab.html`](page-lab.html) | the framed page `/lab`: tabs, hero, 24 h line chart with hover, host cards, GPU table, honeypot teaser | [TELEMETRY_VIEW.md §5.2](../TELEMETRY_VIEW.md#52-framed-page-lab) |
| [`page-threats.html`](page-threats.html) | the framed page `/lab/threats`: globe with target labels and legend chips, stats sidebar, two-column feed | [THREATS_VIEW.md §4.2](../THREATS_VIEW.md#42-framed-page-labthreats) |
| [`mobile-section.html`](mobile-section.html) | the mobile home page's new Lab section between Blog and Contact | TELEMETRY_VIEW.md §5.4, THREATS_VIEW.md §4.4 |
| [`mobile-lab.html`](mobile-lab.html) | `/lab` on a phone | [TELEMETRY_VIEW.md §5.3](../TELEMETRY_VIEW.md#53-mobile-lab) |
| [`mobile-threats.html`](mobile-threats.html) | `/lab/threats` on a phone before the globe loads (`▶ ./render-globe`) | [THREATS_VIEW.md §4.3](../THREATS_VIEW.md#43-mobile-labthreats) |
| [`mobile-threats-globe.html`](mobile-threats-globe.html) | the same after the tap, with `■ stop globe` | THREATS_VIEW.md §4.3 |
| [`states.html`](states.html) | freshness badges, delayed, offline, `null` and `down`, the globe placeholder, reduced motion | LAB_UI_SPEC.md §7, the views' States sections |

`png/<concept>--<preset>.png` are screenshots: desktop concepts at 1440 × 900 (states at
1440 × 480) in Tokyo Night, Nord and Solarized Light with each preset's default accent; mobile
concepts at 390 × 844 in Tokyo Night with the cyan accent the site forces below 1024 px.

`assets/globe-<preset>.svg` are still pictures of what the globe should look like: dotted land,
neutral 24 h bins sized by events, live arcs colored by category. The beacons and labels on the
targets are drawn by the page over the picture, in the accent. The real globe is globe.gl
([THREATS_VIEW.md §5](../THREATS_VIEW.md#5-globe)).

## Theme switching

The lab follows the site's theme preset and accent; the mockups do the same. Open a concept from
a clone (it loads the site's own fonts from `public/fonts/`) and add a hash:

```
tile-threats.html#preset=nord
tile-threats.html#preset=solarized-light&accent=teal
mobile-lab.html#preset=tokyo-night&accentHex=%237dcfff
```

`preset`: `tokyo-night`, `nord`, `solarized-light`. `accent`: one of the site's fifteen
(`rose`, `pink`, `fuchsia`, `purple`, `violet`, `indigo`, `blue`, `sky`, `cyan`, `teal`,
`emerald`, `green`, `lime`, `amber`, `orange`); `accentHex` for any other color. The page reloads
its variables from the hash, the same way the site swaps `theme-*` and `accent-*` classes.

## Known differences from the spec

The spec wins where they differ:

- Pixel font sizes are illustrative; the tile uses `FONT_SIZES` with a 14 px floor.
- Feed times are fixed strings; the real feed prints each replayed bucket in local time.
- The `about 600 KB` on the mobile button is a placeholder for the measured chunk size.
