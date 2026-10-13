# Portfolio v2: audit, performance and UI work order

- **Status:** ready to run
- **Created:** 2026-10-13, from an audit of `main` at `9b0efa6` (build, typecheck, lint and 201 tests green)
- **Audience:** a Claude Code session (Opus 5.5 or Fable 5.1) working in this repo, and David
- **Companion docs:** [docs/lab/README.md](lab/README.md) (the lab's spec set, still binding), [CLAUDE.md](../CLAUDE.md)

This is the work order for the next version of dleer.ai. The site works today and the lab is its
best feature, but the home page does not put it, or the projects that matter, in front of a
visitor. This document is both the audit (what is wrong or weak, with file paths) and the spec
(what to build, in phases, with acceptance criteria). It is written to be pasted into a session
as the opening prompt, or referenced as `docs/PORTFOLIO_V2_SPEC.md`.

## How to use this document

1. Read sections 1 to 3 in full before touching code. Then read the lab's [LAB_UI_SPEC.md](lab/LAB_UI_SPEC.md)
   §1 (ground rules), which still hold for everything under `/lab` and `/api/lab/`.
2. Work one phase (section 5) per branch and pull request, in order. Each phase lists its scope,
   the files it touches, and the checks that make it done. Do not start the next phase in the same PR.
3. Before the first code change of each phase, run the audit script (section 8) and keep its
   output: every PR description shows before and after numbers and screenshots.
4. Where this document says **decide with David**, stop and ask before building; everything
   else is decided here. Where it says **recommended**, build that unless a reason not to shows
   up in the code; say so in the PR.

## Contents

1. [Goals and priorities](#1-goals-and-priorities)
2. [Ground rules](#2-ground-rules)
3. [Audit findings (2026-10-13)](#3-audit-findings-2026-10-13)
4. [Target experience](#4-target-experience)
5. [Phases](#5-phases)
6. [Performance budgets](#6-performance-budgets)
7. [Definition of done](#7-definition-of-done)
8. [Measuring: the audit script](#8-measuring-the-audit-script)
9. [Decisions needed from David](#9-decisions-needed-from-david)
10. [Appendix: audit evidence](#10-appendix-audit-evidence)

---

## 1. Goals and priorities

The site is David's resume. A visitor is most likely a hiring manager, a founder or an engineer
who has 60 seconds on a phone, or five minutes on a laptop. In that time they should see, in
this order:

1. **Who David is**, in one screen: name, what he builds, where to reach him.
2. **The two projects that matter now**: **AgentCM** (the flagship, public release planned the
   week of 2026-10-13; until then a "coming soon" with a date) and **Construction Skills for
   Claude Code** ([dleerdefi/claude-code-construction](https://github.com/dleerdefi/claude-code-construction),
   16 skills, MIT, 43 stars and 13 forks on 2026-10-13, used by construction management
   professionals). The LLM security toolkit stays as the third featured project.
3. **The lab, live**: three rack servers' power right now and a honeypot under attack on a globe.
   Nobody else's portfolio has this. Today it is one row in the neofetch tile and a `Lab/`
   entry in a file tree.
4. Everything else: the other projects, the about page, the four blog posts, the theme toys.

Priorities, when they conflict, in this order:

| # | Priority | Meaning |
|---|---|---|
| 1 | **Phones are flawless** | no overflow, no overlap, no blank first paint, no jank, readable without zoom, every control reachable with a thumb. Tested on a 390 px wide viewport at every phase |
| 2 | **Performance** | the budgets in section 6. Lighthouse mobile ≥ 95 performance, 100 accessibility, 100 SEO, measured on the production build |
| 3 | **The lab and the featured projects are visible without a click** | on the home page, desktop and phone |
| 4 | **The rice stays** | tiles, the polybar, JetBrains Mono, the three presets and the accent picker are the identity. Refine, do not replace. Visitors who liked the site should recognise it |
| 5 | **The blog recedes** | it is not maintained and will not be. Posts stay reachable at their URLs, nothing links to them from the first screen |

Non-goals: a CMS, user accounts, analytics beyond what exists, a redesign away from the window
manager aesthetic, any new route outside `/lab` and `/api/lab/` for lab data, anything that
connects the site to the homelab directly.

---

## 2. Ground rules

1. **The lab rules hold.** [LAB_UI_SPEC.md §1](lab/LAB_UI_SPEC.md#1-ground-rules) and
   [HOMELAB_REFERENCE.md §7](lab/HOMELAB_REFERENCE.md#7-what-this-repo-must-never-do) apply to
   every phase that touches `lib/lab`, `components/lab`, `app/lab`, `app/api/lab` or the lab's
   entry points. Read the homelab repo before changing a contract mirror; never copy addresses,
   bucket names or secrets into this public repo.
2. **Flags stay honest.** `NEXT_PUBLIC_FEATURE_LAB` off must still produce a site with no lab
   code in the home bundle and 404s on lab routes. New flags follow the same pattern:
   `NEXT_PUBLIC_FEATURE_*`, read through `useFeatureFlags()`, folded at build time where a
   bundle must not grow.
3. **One DOM, CSS decides the layout.** The desktop tiles and the phone stack are two
   arrangements of the same server-rendered content (section 4.3). No JavaScript decides which
   layout to render, so there is no blank pre-hydration state and no hydration mismatch.
4. **Colors come from CSS variables.** No new hard-coded hex values in components (the lab
   already follows this; `components/tiles/*` and `components/layout/Background.tsx` do not).
5. **Small modules.** New files under about 300 lines. The files that are already over
   (`contexts/FocusContext.tsx` 458, `components/tiles/NavigationTile.tsx` 433,
   `components/layout/LayoutManager.tsx` 366) get smaller in the phases that touch them, not larger.
6. **Measure, then change.** Every PR that claims a performance improvement shows the audit
   script's numbers before and after, from the production build (`npm run build && next start`).
7. **CI stays green at every commit**: `npm run build` (flag off, lab on, lab and threats on),
   `npm run typecheck`, `npm run lint`, `npm test`. Add tests for new pure logic (schemas,
   formatting, ordering); do not add a browser test suite to CI in this work order.
8. **No deploys, no settings changes.** Railway, Cloudflare, R2 and DNS are David's. The flags
   are not flipped in production by a session.
9. **Keep the URLs.** `/`, `/projects`, `/projects/<slug>`, `/blog`, `/blog/<slug>`, `/lab`,
   `/lab/threats`, `/rss.xml`, `/feed.json`, `/sitemap.xml` keep working. New URLs are additive.
10. **Accessibility is not a phase.** Every interactive element is a real `button` or `a`,
    reachable by keyboard, with a visible focus ring, in every phase that touches it.

---

## 3. Audit findings (2026-10-13)

Found by reading the code, building it (lab and threat map on, demo data), and running the
production build through headless Chromium at 1440×900, 1920×1080, 1280×720 and 390×844 (the
audit script, section 8). Numbers are in the appendix. Grouped by kind; each phase in section 5
references these by id.

### 3.1 Correctness and content

| Id | Finding | Where |
|---|---|---|
| C1 | **Blank first paint on `/`.** The server HTML for the home page contains no content: `LayoutManager` returns an empty `div` until a client effect has measured `window.innerWidth`. First paint and LCP wait for the whole JS bundle to hydrate; crawlers that do not run JS see nothing on the home page | `components/layout/LayoutManager.tsx` (`hasChecked`), `app/page.tsx` |
| C2 | **`React.lazy` created inside render.** The phone layout is wrapped in `React.lazy(() => import(...))` inside `LayoutManager`'s render, so every re-render of `LayoutManager` creates a new lazy component and remounts `MobileParallaxLayout` (scroll position, state and the globe's intersection observers reset) | `components/layout/LayoutManager.tsx` |
| C3 | **Placeholder author in metadata.** Project and blog pages ship `authors: [{ name: 'Your Name' }]` to search engines and social cards | `app/projects/[slug]/page.tsx:42`, `app/blog/[slug]/page.tsx:45` |
| C4 | **The Open Graph fallback image does not exist.** Every project and blog page points at `/og-image.png`, which is not in `public/` (the site default is fine on dleer.ai because `NEXT_PUBLIC_OG_IMAGE` is set there; the per-page `generateMetadata` ignores it). Shared links to any project or post have a broken card; forks have none at all | `app/projects/[slug]/page.tsx:36`, `app/blog/[slug]/page.tsx:39`, `config/portfolio.config.ts:145` |
| C5 | **The lab mirrors are two days behind the homelab.** Homelab `main` at `6e4473a` (2026-10-12, "Public telemetry: NAS, CI runners, video engines, airflow, lab counts, cost") added `lab.vms_running`, `targets_up/total`, `alerts_firing`, `disks/disks_healthy`, `drive_temp_max_c`, `energy_cost_usd_24h`, per-host `fan_rpm`, `exhaust_c`, `psu_in_v`, a `nas` block, a `ci` block and GPU `enc_ratio/dec_ratio`. The portfolio's `now.v1.json` fixture (manifest commit `ba74e7e`) and `history.v1.json` (`79227c3`) have none of them, and neither do the Zod schemas or the UI. The sha256 values differ for both labsnap examples. Unknown keys are stripped today (by design), so nothing breaks, but the best new numbers are invisible | `lib/lab/fixtures/MANIFEST.json`, `lib/lab/schemas/`, `components/lab/telemetry/` |
| C6 | **Full-size wallpapers fetched that nothing displays.** Two preloaders (`BackgroundTile` and `Background`) call `new Image()` on the *original* adjacent carousel files, which `next/image` never requests (it serves `/_next/image?...` variants). On the desktop home that is `cat_anime-girl.webp`, 218 KB, on every first load, for nothing | `components/tiles/BackgroundTile.tsx` (preload effect), `components/layout/Background.tsx` ("FIX 1") |
| C7 | **Two theme systems fight on phones.** `useEnforceMobileTheme` forces Tokyo Night and sets `--accent-color` as an inline style on `<html>`; `ThemeContext` has a resize handler whose only job is to undo that. Resizing a desktop window across 1024 px flips the accent between purple and cyan; a phone visitor cannot use the preset or accent pickers at all, and `localStorage` preferences are ignored below 1024 px | `hooks/useEnforceMobileTheme.ts`, `contexts/ThemeContext.tsx`, `components/layout/parallax/hooks/useParallaxTheme.ts` |
| C8 | **List footer overlaps the frame on phones.** On `/projects` and `/blog` at 390 px the `ZenList` footer ("9 items", "1 / 9") sits on top of the 2 px frame border, half outside it | `components/zen/ZenList.tsx`, `components/layout/FramedPageLayout.tsx` |
| C9 | **Project list rows collide on phones.** A three-line title with an inline `Featured` badge and a status badge to its right leaves the title 40 % of the width; the `GitHub →` link of one row sits on the divider of the next on desktop too | `app/projects/page.tsx` (`renderItem`) |
| C10 | **Dead code shipped or kept:** `components/tiles/ThemeTile.tsx` (199 lines, 17 hard-coded colors, imported nowhere), `components/ui/ProjectCard.tsx`, `components/ui/BorderedContainer.tsx`, `components/assets/DleerVectorLogo.tsx`, `components/blog/ScrollReveal.tsx`, `components/layout/parallax/components/SkillGrid.tsx` and `BackButton.tsx`, `hooks/useResponsive.ts`. Zen mode (`contexts/ViewContext.tsx`, `components/layout/FocusedView.tsx`, 390 lines) is "dormant" per the lab spec: `enterZen` is only reachable from inside `FocusedView` | listed |
| C11 | **Navigation entries are not buttons.** Every row in the nav tile is a `div` with `onClick`, invisible to keyboards and screen readers; hover styling mutates `element.style` in `onMouseEnter`. The polybar buttons set `outline: none` with no replacement focus style | `components/tiles/NavigationTile.tsx`, `components/layout/Polybar.tsx` |
| C12 | **Docs drift.** `CLAUDE.md` describes a hamburger menu on mobile (there is no polybar on phones), a "Stacked" mobile mode (removed: phones always get parallax), 11 CSS modules (there are 14) and Geist fonts from `next/font` (not used; JetBrains Mono is self-hosted). `README.md` says 12 modules | `CLAUDE.md`, `README.md` |
| C13 | **`next lint` is deprecated** (removed in Next 16) and warns on `components/mdx/PostAudio.tsx:182` (missing effect deps). `tsconfig` targets ES2017 | `package.json`, `tsconfig.json` |
| C14 | **No security headers** are set by the app (`headers()` is absent from `next.config.ts`): no `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`. Cloudflare may add some; the app should not depend on it | `next.config.ts` |

### 3.2 Performance

Production build, lab and threat map on, demo data, no CDN, cold cache, headless Chromium.

| Id | Finding | Evidence |
|---|---|---|
| P1 | **`/` is the heaviest page by far:** 213 KB first-load JS (72.6 KB route chunk + 102 KB shared), against 120 to 144 KB for every other page. The route chunk carries `framer-motion` (layout animation on six tiles plus the phone layout), both layouts' components and the content-collections data for all projects and posts | build output; appendix |
| P2 | **373 KB of images on a desktop first load**: the 1920 px wallpaper variant (161 KB), the unused original from C6 (218 KB), two thumbnails. On a phone, 235 KB: the wallpaper is requested with `sizes="100vw"` at 1920 w even at 390 px wide, because `deviceSizes` picks from the DPR-scaled width | appendix (`img` column) |
| P3 | **187 KB of fonts on every page**: JetBrains Mono Regular (92 KB) and Bold (95 KB) are both `preload`ed. The `.woff2` files are not subset (Light is also shipped in `public/fonts`) | `app/layout.tsx`, `public/fonts` |
| P4 | **Blank until hydration** (C1): on the desktop home, `domContentLoaded` is 35 to 100 ms but no pixel of content exists until the 213 KB has executed. LCP cannot be measured as a paint of content in the server HTML because there is none | appendix |
| P5 | **Compositing cost on phones.** The phone layout stacks `backdrop-filter: blur(10px)` on a fixed 65 vh hero, a 4 px blurred dot-gradient band, the frame's glass edges, and a wallpaper with `filter: blur() brightness() contrast()` and `transform: scale(1.1)`, all with `will-change`. Every tile on desktop animates `backdropFilter`, `padding`, `borderWidth` and `containerType` through `framer-motion` `animate` props (values that never change), which keeps the motion runtime active for them | `components/layout/parallax/components/ParallaxScrollContainer.tsx`, `components/layout/Background.tsx`, `components/layout/LayoutManager.tsx` |
| P6 | **Scroll handler does layout reads per frame.** `useParallaxScroll` runs `getBoundingClientRect()` for every section on every scroll event and sets React state twice per event (`scrollPercent` rounds to an integer, so it re-renders the whole layout up to 100 times per page scroll) | `components/layout/parallax/hooks/useParallaxScroll.ts` |
| P7 | **A `MutationObserver` on `<html>` re-derives the theme** that `ThemeContext` already knows, and `Background` imports `ThemeContext` dynamically at runtime to find the carousel list | `components/layout/Background.tsx` |
| P8 | **The polybar clock re-renders every second** with `setInterval` + `setState`; harmless alone, but `Polybar` sits inside `LayoutManager`'s tree | `components/layout/Polybar.tsx` |
| P9 | **The lab is within budget.** `/lab` 127 KB and `/lab/threats` 131 KB first load; the globe chunk (573 KB measured, 590 KB stated in `GLOBE_KB`) loads only when a threats view is visible on desktop and only after a tap on phones, as specified. Keep it that way | appendix |

### 3.3 UX and layout

| Id | Finding |
|---|---|
| U1 | **The theme controls take 30 % of the lower-left quadrant** (three tiles: preset, accent, wallpaper) on desktop. They are the least important thing on the page and the most visually busy: 15 saturated swatches sit next to the content tile at all times. Concept art and a single row of controls can do the same job in 36 px |
| U2 | **The nav tile is a file tree with the interesting things folded.** `Projects/`, `Blog/` and `Lab/` are collapsed by default; a visitor has to click an arrow to learn the lab exists. "Tab to navigate between tiles" is the tile's most prominent line |
| U3 | **The content tile opens on About with the profile photo**, which is fine, but nothing on the first screen says "AgentCM", "Construction Skills" or shows a live number bigger than 14 px |
| U4 | **The neofetch tile has room to spare** at 1440 px and wastes most of it; at 1280×720 the About text wraps to six words a line and the tech grid is cut off below the fold inside the tile |
| U5 | **The phone hero is 65 vh of mostly empty space:** the `DL` logo and six social rows float in the top third, the lower two thirds are a blurred gradient. Then Bio, Technologies (nine large icons), Projects (nine bare titles), Blog (four titles), Lab (two good cards), Contact. The lab's cards, the best part of the phone page, are the fifth section down |
| U6 | **The phone layout has no polybar and no way to jump to a section**: a visitor scrolls, or does not |
| U7 | **Projects are a bare list on phones** and a loosely spaced list on desktop (U9/C9). No cover, no metric, no "why this matters"; `Featured` is a badge, not a placement. The order is date-sorted with featured first, which puts a 2025-10 side project above the work that matters |
| U8 | **Project pages are the right shape and the wrong content density.** A title, a summary, a date line, a tech stack, then prose. There is no hero image, no metrics row (stars, users, scale), no link row (GitHub, docs, release) above the fold, and no "next project" at the end. `1 min read` on a project page is odd |
| U9 | **The projects list has the `j/k move · Enter open · Esc back` hints on phones** in a layout that has no keyboard |
| U10 | **The blog is the weakest section and is given equal billing**: a polybar workspace, a nav directory, a phone section, sitemap priority 0.9 (above projects at 0.9 for the list and 0.7 for project pages) |
| U11 | **`Lab/` in the nav opens telemetry in a 50 % wide tile**, which works, but the richer framed `/lab` page is one more click away and nothing on the tile says it exists except a small `~/lab →` |
| U12 | **No "coming soon" state exists** in the project schema (`status` is `concept | development | beta | production`); AgentCM cannot be announced with a date today |

### 3.4 What is good and must survive

- The tiled desktop layout, the polybar, the accent border on the focused tile, hjkl and Tab
  navigation, the three presets and the accent system.
- The lab: its data layer (validated, cached, server-only), its theming (CSS variables only),
  its freshness states, the globe's loading discipline, the demo mode, the fixture manifest and
  the 201 tests. Phase 5 extends it; nothing in it is rewritten.
- The framed page layout for detail pages, the MDX components (`Terminal`, `Window`,
  `Admonition`, `Figure`), the content-collections setup, the contact form, the audio player.
- `railway.toml`'s memory tuning and the image cache TTL.

---

## 4. Target experience

### 4.1 Desktop (≥ 1024 px), the home page

```
┌ polybar ─────────────────────────────────────────────────────────────────────────────┐
│ [DLEER] portfolio     ● home  ● projects  ● lab  ● about  ● contact        ◐ ◉ ▣  00:20 │
├────────────────────────────────┬─────────────────────────────────────────────────────┤
│ neofetch                       │ content (the stage)                                 │
│  DLEER   david@portfolio       │                                                     │
│          GitHub, X, LinkedIn   │  Hi, I'm David Leer                                 │
│          Lab: 1,029 W · 3/3 ●  │  one-paragraph pitch                                │
│          Honeypot: 15.4k/24h   │                                                     │
├──────────────────┬─────────────┤  ┌ AgentCM ──────────────┐ ┌ Construction Skills ─┐ │
│ contents         │ ~/lab  live │  │ coming 2026-10-17     │ │ 16 skills · 43 ★     │ │
│  ├── home        │  1,029 W    │  │ one line, one image   │ │ one line, one image  │ │
│  ├── projects/   │  ▁▂▃▅▃▂▁▂   │  └───────────────────────┘ └──────────────────────┘ │
│  │   ├ AgentCM   │  3/3 hosts  │  ┌ LLM Security Toolkit ─┐ ┌ ~/lab/threats ───────┐ │
│  │   ├ Construct.│  honeypot   │  │ 219 attacks · 20 ★    │ │ 15.4k events · 31 cc │ │
│  │   └ 7 more    │  15.4k ▂▃▂▅ │  └───────────────────────┘ └──────────────────────┘ │
│  ├── lab/        │  31 cc      │                                                     │
│  ├── about       │  open →     │  all projects →      writing →                      │
│  └── contact     │             │                                                     │
└──────────────────┴─────────────┴─────────────────────────────────────────────────────┘
```

- **Polybar** gains a right-hand tray (`◐ ◉ ▣` above): preset switcher (the three existing
  icons), accent picker (a dot that opens a 15-swatch popover; closes on select, Esc or outside
  click) and wallpaper (a popover with the preset's thumbnails and `none`, plus the background
  effect toggle). Keyboard: the tray is in the Tab order; the popovers trap focus and restore
  it. This replaces the three settings tiles (U1).
- **Workspaces** become `home · projects · lab · about · contact`. `blog` leaves the polybar
  (U10); `writing →` on the home stage and a footer link on About keep the posts one click away.
- **Neofetch tile** keeps its look, drops the rows whose env values are unset (today it renders
  `(N/A)`), and keeps the two lab rows.
- **Contents tile** (the nav) opens `projects/` by default with the three featured entries and
  a `7 more` line; `lab/` shows `telemetry ●` and `threats ●` with their status glyphs as today.
  The "Tab to navigate" hint moves to the polybar's right end as `? keys`, which opens a small
  help popover (Tab, hjkl, Esc, j/k on lists).
- **Lab tile** (new, where the settings tiles were): the live summary from `/api/lab/summary`
  that `ParallaxLabSection` already draws on phones, as one tile: power with a 24 h sparkline,
  hosts, and the honeypot line with the top three categories as bars. Clicking opens
  `lab-telemetry` in the stage; `open →` goes to `/lab`. Hidden entirely when the lab flag is
  off; the contents tile then takes the full width as today. Follows [LAB_UI_SPEC.md §3](lab/LAB_UI_SPEC.md#3-where-the-lab-appears)
  and §6 (one summary fetch after first paint, then every 5 min while visible).
- **The stage** (content tile) opens on a new `home` content type: greeting, the pitch (two
  sentences, from `NEXT_PUBLIC_BIO_INTRO`), four cards (three featured projects, one threats
  card when the threat map is on, else a telemetry card), and two links. Cards are the
  `ProjectCard` described in 4.4. `about`, `contact`, `projects-overview`, `lab-telemetry` and
  `lab-threats` render in the stage as today.
- **Tile chrome** is CSS: the focused tile's accent border and shadow come from a
  `data-focused` attribute and a transition, not from `framer-motion` animating `backdropFilter`
  and `padding`. `LayoutGroup`/`layoutId` stay only if a tile actually moves (none does today;
  remove them if not).

### 4.2 Phone (< 1024 px), the home page

Order, top to bottom:

1. **Hero**, content height, not 65 vh: `DLEER` block letters, `david@portfolio`, the social
   rows that have values, the two lab rows (today desktop only; `NeofetchLabRows` renders here
   too), the color strip. One screen tall at most.
2. **Featured** (new): the three project cards, full width, with cover, one line, one metric,
   and the status chip (`coming 2026-10-17` for AgentCM).
3. **Lab**: the two cards that exist today (`ParallaxLabSection`), moved up from fifth to third (U5).
4. **About**: greeting, bio paragraphs, tagline.
5. **Stack**: the tech grid, at half the icon size, in rows of four.
6. **All projects**: the remaining projects as compact rows (title, one line, status chip).
7. **Contact**: as today.

Blog has no section (U10); `writing →` under the Featured block links to `/blog`.

A **section rail** replaces the missing polybar (U6): a thin fixed strip at the bottom of the
frame with one dot per section, the active one filled, tap to jump, hidden while scrolling and
shown when the scroll settles. It is the phone's polybar; it also shows the live `1,029 W` next
to the lab dot while the lab is live (the existing `status-store` already carries it).

Parallax stays as a progressive enhancement: the hero fades and the sections slide in with CSS
`animation-timeline: scroll()` where supported (Chrome and Safari 26 do; Firefox does not) and
with nothing otherwise. `framer-motion` is not on the phone's critical path.

### 4.3 One DOM, CSS decides

The home page server-renders one document with the sections above as semantic landmarks
(`header`, `nav`, `main`, `section`s with headings). A CSS grid in `app/styles/` arranges them:

- `@media (min-width: 1024px)`: the tiled grid of 4.1, `height: 100dvh`, each area scrolling
  inside itself, the polybar on top.
- below: the single column of 4.2 inside the framed border, the rail at the bottom.

Nothing in React reads `window.innerWidth` to choose a layout. Behaviour that differs by
layout (keyboard navigation, focus, the rail) attaches after hydration from a `matchMedia`
hook (`useSyncExternalStore`, server snapshot "desktop") and only adds listeners; the markup is
the same either way. Consequences, all intended:

- `/` stays a static page with real content in its HTML: FCP and LCP are the server HTML, not
  the bundle (fixes C1, P4).
- `LayoutManager`'s `isStacked` state, `hasChecked`, the in-render `React.lazy` (C2) and
  `MobileParallaxLayout` as a separate tree go away. The parallax section components become the
  shared section components.
- The theme is one system on every device (fixes C7): `ThemeContext` applies classes, the
  inline-style enforcement hook and the resize recovery are deleted. **Decide with David**
  (section 9, Q3) whether phones keep a fixed preset; the recommended answer is no, one default
  everywhere with the tray available on phones in the rail's `⋯` sheet.
- Content that only one layout shows (the file tree versus the rail) is rendered once and
  hidden with CSS, never duplicated. The three big content areas (hero, featured, lab) are the
  same elements in both layouts.

### 4.4 Projects as the story

The project frontmatter gains fields (all optional, so existing files keep building):

```yaml
featured_rank: 1              # 1..3 shows on the home stage and the phone's Featured block, in this order
status: "coming-soon"         # new value; with release_date below
release_date: "2026-10-17"    # shown as "coming 2026-10-17" until then, then the status flips to production
hero: "/images/projects/agentcm/hero.webp"   # 16:9, ≥ 1600 px wide; the card's cover and the page's hero
metrics:                      # at most three; the card shows the first, the page shows all
  - { label: "skills", value: "16" }
  - { label: "stars", value: "github" }      # "github" means: fill from the GitHub API at build (4.5)
  - { label: "forks", value: "github" }
links:                        # the page's link row, in order
  - { label: "GitHub", url: "https://github.com/dleerdefi/claude-code-construction" }
  - { label: "Install", url: "https://github.com/dleerdefi/claude-code-construction#setup" }
audience: "construction project engineers and managers"   # one phrase, used on the card
```

The **project page** (`/projects/<slug>`) becomes a case study: hero image (or the `Terminal`
diagram the MDX already has, when no hero), title, the audience line, the metrics row, the link
row, then the prose, then a `next project →` footer. Reading time is dropped from project pages.
AgentCM's page exists before release with `status: coming-soon`, the date, the pitch, and the
link row pointing at what exists (a GitHub org page, a waitlist, nothing: **decide with David**,
Q1). The day it ships, David edits two frontmatter lines.

The **projects list** (`/projects`) becomes a grid of `ProjectCard`s (featured three first,
then the rest by date) on desktop and a single column on phones, with the keyboard hints shown
only when a keyboard exists (`@media (hover: hover) and (pointer: fine)`), fixing U9, C9. The
`ZenList` keyboard handling is kept for the list; its footer moves inside the frame (C8).

`ProjectCard` is one component used by the stage, the phone's Featured block and the list:
cover (16:9, `next/image` with `sizes` for its column), title, one line, the first metric, the
status chip, the audience phrase. It is a link, whole-card, with the title as the accessible name.

### 4.5 GitHub numbers

"GitHub activity integration" is on `CLAUDE.md`'s list. The cheap, useful version: a server-side
`lib/github.ts` that fetches `https://api.github.com/repos/<owner>/<repo>` for each project with a
`github` URL at build time and on ISR revalidation (daily; the pages already revalidate daily),
with `GITHUB_TOKEN` optional (60 unauthenticated requests per hour is enough for ten repos once a
day). Stars, forks and `pushed_at` fill the `metrics` entries whose value is `"github"` and a
`updated <relative time>` line on the card. A failed fetch leaves the metric out; never a `0`.
No client-side GitHub requests.

### 4.6 The lab, promoted

Beyond the lab tile (4.1) and the phone order (4.2):

- **Re-sync the fixtures** to homelab `main` at `6e4473a` or later per
  [HOMELAB_REFERENCE.md §6](lab/HOMELAB_REFERENCE.md#6-vendored-fixtures), extend the Zod mirrors
  for the new v1 keys (C5) with the same `null` discipline, and show them:
  - a **lab counts strip** under the hero number on `/lab`: `27 VMs · 41/42 targets · 0 alerts ·
    38/38 disks healthy · hottest drive 34 °C · $4.95 / 24 h` (each hidden when `null`);
  - per host, an **airflow line**: `inlet 22 °C → exhaust 31 °C · fans 4,800 rpm · 230 V`;
  - a **NAS card** on the storage host: pool health, read/write throughput with the 24 h
    sparklines, ARC hit ratio;
  - a **CI card** on the apps host: `runners 3/4 online · 1 busy · 2.4 h work / 24 h`, with the
    busy sparkline; `queue_oldest_s` as `queue 4 min` when non-zero;
  - GPU rows gain `enc`/`dec` columns (the Quadro's encoder shows Plex transcoding).
  - the neofetch `Lab:` row gains the VM count: `Lab: 1,029 W · 27 VMs · 3/3 hosts ●`.
- **`/lab` gets a one-paragraph "how this works" footer** with the push-not-serve diagram from
  the lab README, because visitors who understand the architecture are the ones David wants.
- **The threats page links back** to the construction of the honeynet in one sentence (the
  off-site sensor, the Worker's decoys, no IP ever published), with the text already approved in
  [THREATS_VIEW.md](lab/THREATS_VIEW.md).
- **A `lab` project page** (`content/projects/homelab/index.mdx`) tells the story as a case
  study (three PowerEdge servers, the push-only public data path, the honeynet, the inference
  plumbing), links to `/lab` and `/lab/threats`, and uses the existing `dleer-homelab.webp` as
  its hero. It is the fourth featured candidate when AgentCM is not yet public.

Prepared, not built, until the homelab produces the documents:

- `v1/threats-weekly/<YYYY-Www>.json` (homelab roadmap phase 5): a `/lab/threats/weekly` view
  rendering the house model's weekly write-up. Add the route only when the contract exists.

### 4.7 Showing off the GPU server

David asked how to let visitors touch the GPU server. The constraint that keeps the lab safe is
the one every option must keep: **nothing at home accepts a connection from the internet; public
data is pushed out as a validated document, and anything interactive terminates in the DMZ with
Turnstile, rate limits and caps** ([homelab architecture](lab/HOMELAB_REFERENCE.md#5-the-honeynet-in-one-page)).
The portfolio only ever renders documents or embeds a gateway; it never proxies to the lab.

Options, ranked by payoff over risk and effort. Effort is on the homelab side; the portfolio side
is a consumer in every case.

| # | Offer | What the visitor sees | Risk | Homelab effort | Portfolio effort | Recommended |
|---|---|---|---|---|---|---|
| G1 | **Nightly hero image** (homelab phase 3, step 2) | the home page's wallpaper was rendered last night on an RTX A4000 from that day's numbers: "412 W, 3,118 failed logins from 61 countries" as a caption with the render time. A `◇ rendered by the lab` chip on the wallpaper | none: zero input, pushed document plus an image on the CDN bucket | small, after Ollama + ComfyUI are up | small: `v1/hero.json` mirror, a wallpaper entry, the chip | **yes, first.** It is the lab visibly making the site |
| G2 | **Weekly attack report** written by the house model (homelab phase 5) | `/lab/threats/weekly`: "what 40,000 bots tried this week", with the aggregates it was written from | low: static, human-reviewed, no raw payloads reach the model | medium | small: a document mirror and a view | **yes, second.** Shows the LLM and the honeynet together |
| G3 | **Ask the lab**: a chat box that answers questions about the homelab and the portfolio from the public docs and the live summary, streamed from a local model | a terminal-styled prompt on `/lab`: "what's drawing the power right now?" | medium: interactive. Turnstile, per-IP and global caps, a 20-message daily budget, a fixed system prompt, retrieval over public docs only, no tools, output length cap, logs kept 7 days | large: the DMZ gateway (homelab phase 2) plus LiteLLM (phase 3) | medium: an embed of the gateway's streamed endpoint behind a flag; the portfolio never holds a key to it | later, after G1 and G2, behind `NEXT_PUBLIC_FEATURE_LAB_ASK` |
| G4 | **Image lab** `imagine.dleer.ai` (homelab project 2) | type a prompt, get a picture in seconds with the GPU name, render time and queue position | medium, documented controls in the homelab catalogue | large | small: a card on `/lab` linking to the gateway, the GPU and queue readout from a pushed `v1/imagine.json` | when the homelab ships it |
| G5 | **Live inference readout** | a line on the GPU table: "serving qwen3-14b · 42 tok/s · 1,204 requests today" from LiteLLM's metrics via a `public:*` rule | none: pushed numbers | small (a recording rule and a contract field) | small (schema and a row) | yes, with phase 5 of this spec, once the rule exists |

The recommended sequence is G1 → G5 → G2 → G3. The portfolio work for G1 and G5 is specified in
phase 7; G2, G3 and G4 get their own specs when the homelab's documents exist. Do not build a
gateway, a queue or any inference call in this repo.

---

## 5. Phases

Each phase is one branch and one PR, with the checks in section 7 green. Phase 0 and 1 first;
phases 2 to 4 can go in parallel after that if David runs more than one session; 5 to 7 after 2.

### Phase 0: hygiene and the baseline

Findings: C2, C3, C4, C6, C10, C12, C13, C14.

- Hoist the `React.lazy` out of render (C2) as a one-line fix now; the whole component is
  replaced in phase 2, but phones get the fix immediately.
- Replace `'Your Name'` with `config.seo.author` in both detail pages (C3).
- Add a real Open Graph image: `app/opengraph-image.tsx` (the site default, 1200×630, the
  `DLEER` block letters on the Tokyo Night surface with the title, generated with `next/og` at
  build time; it is a static route, no runtime cost) and `app/projects/[slug]/opengraph-image.tsx`
  (title, summary, the hero when present). Remove the `/og-image.png` fallbacks (C4).
- Delete the two full-size preloaders; if adjacent thumbnails should be warm, use
  `<link rel="prefetch">` on the `/_next/image` URLs the tile actually requests (C6).
- Delete the unused files in C10 and zen mode (`ViewContext`, `FocusedView`, `enterZen` paths
  in `FocusContext`), after a grep confirms no import. Note in the PR what was removed.
- Migrate `next lint` to the ESLint CLI (`npx @next/codemod@canary next-lint-to-eslint-cli .`),
  fix the `PostAudio` warning, set `tsconfig` `target` to `ES2022` (C13).
- Add `headers()` to `next.config.ts` with `Strict-Transport-Security`, `X-Content-Type-Options:
  nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (camera,
  microphone, geolocation off), and a `Content-Security-Policy` in report-only mode first
  (`script-src 'self' 'unsafe-inline'` is needed by Next's inline runtime unless nonces are
  wired; the globe and MDX use no external scripts). Promote to enforcing in a later PR after a
  week of no reports (C14).
- Rewrite the stale parts of `CLAUDE.md` and `README.md` (C12) to describe the site as it is
  after this phase, and add a `docs/PORTFOLIO_V2_SPEC.md` line to `CLAUDE.md`'s reading list.
- Commit the audit script (section 8) and its first report as the baseline in the PR description.

Done when: all of the above, CI green, the appendix numbers reproduced within noise, and the
desktop home no longer requests any `/images/*.webp` original.

### Phase 1: performance foundations

Findings: P2, P3, P5, P6, P7, P8. (P1 and P4 are fixed structurally by phase 2.)

- **Images.** Give the wallpaper real `sizes` (`100vw` is right, but add `deviceSizes` in
  `next.config.ts` of `[390, 640, 828, 1080, 1280, 1920]` so phones get ≤ 828 w) and `priority`
  only on desktop; add `placeholder="blur"` with a tiny inline `blurDataURL` per wallpaper (a
  16 px version, generated once into `lib/themes.ts`). Thumbnails for the tray at 2× of their
  rendered size and no more. Add `AVIF` to `images.formats`.
- **Fonts.** Preload Regular only; Bold loads on use with `font-display: swap`. Subset both to
  Latin + box drawing + the glyphs the site uses (`pyftsubset`, with the unicode ranges listed in
  `03-fonts.css`); keep the originals for the MDX code blocks under `unicode-range`. Drop the
  unused Light face from `public/fonts`. Target: ≤ 60 KB of font on first paint.
- **Compositing.** On phones (`@media (max-width: 1023px)`): no `backdrop-filter` on the hero
  or the dot band; the wallpaper is pre-blurred at build time (a second, blurred asset per
  wallpaper, since `filter: blur()` on a full-screen layer is the single most expensive thing
  the page does on a mid-range phone) and `transform: scale()` goes. Honour
  `prefers-reduced-motion` and `prefers-reduced-transparency` everywhere the lab already does.
  Remove `will-change` except on the one element that animates in the next 100 ms.
- **Scrolling.** Replace `useParallaxScroll`'s per-event layout reads with one
  `IntersectionObserver` per section (threshold 0.5) for the active section and a
  `requestAnimationFrame`-throttled progress value held in a ref, not state; the rail and the
  scroll indicator read it from a `MotionValue` or a CSS custom property set once per frame.
- **Background.** `Background` reads `ThemeContext` directly; the `MutationObserver` and the
  dynamic import go. The polybar clock updates a text node through a ref, or `Polybar` is
  memoised so the tick re-renders only itself.
- **Bundle.** Move `framer-motion` out of the first-load path: tile focus is CSS; the only
  remaining motion use (if any) is dynamically imported. Confirm with `ANALYZE=true npm run
  build` that `/` carries no `framer-motion` chunk on first load. Keep `content-collections`'
  project data in the home bundle to the fields the home needs (a `lib/projects.ts` selector
  that maps `allProjects` to `{slug,title,summary,status,featured_rank,metrics,hero}` for the
  client; the MDX `html` and `content` never reach the client on `/`).

Done when: the phone home's first load is ≤ 150 KB JS and ≤ 160 KB images and fonts combined
(section 6), the scroll handler fires no synchronous layout read (Performance panel shows no
forced reflow in a scroll), and Lighthouse mobile performance is ≥ 90 on `/` before phase 2.

### Phase 2: the home page, one DOM

Findings: C1, C7, C11, P1, P4, U1, U2, U3, U4, U5, U6, U11. Design: 4.1, 4.2, 4.3.

Scope, in order of commits:

1. **Layout skeleton.** `app/page.tsx` renders `<HomePage>` (server component) with the
   sections as landmarks; `app/styles/15-home-layout.css` carries the two arrangements. The
   desktop grid areas: `polybar`, `neofetch`, `nav`, `lab`, `stage`. Tiles are `section`s with
   `data-tile` and `data-focused`. Nothing client-side decides the layout. `CLAUDE.md`'s CSS
   module list gains the file.
2. **Polybar tray** replaces the three settings tiles: `components/layout/polybar/ThemeTray.tsx`
   (preset, accent popover, wallpaper popover, `? keys`). The old tiles are deleted, their
   `FocusContext` tile ids removed, and `handleTabNavigation`/`handleDirectionalNavigation`
   updated for four tiles. Popovers are `role="dialog"` with focus trapping and Esc.
3. **The stage's `home` content type** with the four cards (4.1), `ProjectCard` from 4.4 (phase 3
   fills the frontmatter; until then the card draws what exists). `FocusContext`'s `ContentType`
   gains `{ type: 'home' }`; the polybar's first workspace is `home`; `blog` leaves the polybar.
4. **The lab tile** (`components/lab/home/LabTile.tsx`), reusing `ParallaxLabSection`'s pieces
   (`LabStatusBadge`, `Sparkline`, `Value`, the top-categories bars). Behind `features.lab`;
   when off, the grid template has no `lab` area.
5. **The nav tile** rewritten as `components/tiles/nav/NavTree.tsx` + `NavEntry.tsx`: real
   `button`s, CSS hover and focus, `aria-expanded` on directories, `aria-current` on the active
   entry; `projects/` expanded by default with the featured three and `N more`. Under 150 lines
   each. `NavigationTile.tsx` becomes a thin wrapper or goes.
6. **The phone column and the rail** (`components/layout/mobile/SectionRail.tsx`): sections in
   the 4.2 order; the hero at content height with `NeofetchLabRows`; the parallax hooks reduced
   to the phase 1 observer; `MobileParallaxLayout.tsx`, `ParallaxScrollContainer.tsx` and
   `LayoutManager.tsx` deleted once nothing imports them.
7. **One theme system.** Delete `useEnforceMobileTheme`, `useParallaxTheme` and the resize
   recovery in `ThemeContext`; `FramedPageLayout` stops calling the enforcement hook. Apply Q3's
   answer.

Done when: the server HTML of `/` contains the greeting, the three featured titles and the
neofetch rows (grep the `curl` output); there is no blank frame at any width (the audit script
screenshots at 100 ms after navigation show content); Tab, hjkl, Esc and the polybar work as
before on desktop; the phone column has no horizontal overflow at 320, 360, 390 and 430 px; the
rail jumps to every section; the lab tile shows live numbers in demo mode and disappears with
the flag off; `/` first-load JS ≤ 150 KB.

### Phase 3: projects as the story

Findings: C8, C9, U7, U8, U9, U12. Design: 4.4, 4.5.

- Extend `content-collections.ts`'s project schema with the 4.4 fields (all optional;
  `status` gains `coming-soon`; `release_date` required when `status` is `coming-soon`, enforced
  in the schema with `superRefine`). Add a test for the schema in `tests/content/`.
- `lib/projects.ts`: `featuredProjects()` (by `featured_rank`, then the `featured` boolean for
  backwards compatibility, max three), `otherProjects()`, `nextProject(slug)`, and the client
  selector from phase 1.
- `lib/github.ts` (4.5) with a 24 h in-memory cache and an `unstable_cache` tag, filling
  `metrics` values of `"github"`. Tests with a mocked `fetch`: success, 403 (rate limit) and
  network failure all leave the metric out.
- `components/projects/ProjectCard.tsx`, `ProjectHero.tsx`, `MetricsRow.tsx`, `LinkRow.tsx`,
  `StatusChip.tsx` (the chip knows `coming-soon` + date, and flips to `production` by comparing
  `release_date` to the build date so nothing needs a deploy on release day beyond the content
  edit David makes anyway).
- `/projects` as the card grid; `/projects/<slug>` as the case study (hero, audience, metrics,
  links, prose, next project); the `ZenList` footer inside the frame; keyboard hints only with
  `(hover: hover) and (pointer: fine)`.
- Content: write `content/projects/agentcm/index.mdx` (`featured_rank: 1`, `coming-soon`,
  release date and pitch from David, Q1) and `content/projects/claude-code-construction/index.mdx`
  (`featured_rank: 2`; the 16 skills by group, who uses it, install in two lines, the eval set
  on public Sanibel Fire Station 172 plans, MIT), set `featured_rank: 3` on
  `llm-security-auditor`, and the `homelab` case study from 4.6. Hero images come from David (Q2);
  until they exist the card uses the MDX `Terminal` diagram's first lines as a text cover, never
  a broken image.
- Sitemap priorities: projects 0.9 and project pages 0.8; blog 0.6 and posts 0.5.

Done when: the three featured cards render on the desktop stage and the phone Featured block
with status chips and at least one metric each; AgentCM shows `coming <date>`; the GitHub
metrics appear for repos with a `github` URL and vanish gracefully offline (test with
`GITHUB_TOKEN` unset and the network blocked); the phone list has no overlap at 390 px.

### Phase 4: the blog recedes

Findings: U10.

- `features.blog` becomes `process.env.NEXT_PUBLIC_FEATURE_BLOG !== 'false'` with the
  documented default `false` in `.env.example` for David's deployment, `true` for forks (the
  README sells the blog). With it `false`: no polybar workspace, no nav directory, no phone
  section; `/blog`, `/blog/<slug>`, `/rss.xml` and `/feed.json` keep working; the `writing →`
  link on the home stage and the About footer remain; the sitemap keeps the posts at the lower
  priority. With it `true`: the site behaves as on `main` today plus the new layout.
- The blog list page gets the same card treatment as projects for consistency, in one small
  component, and the `/blog` page says, in one line, that it is an archive.

Done when: both flag values build and pass; a crawl of the sitemap finds every post URL alive.

### Phase 5: the lab, promoted

Findings: C5, U11. Design: 4.6. The lab's own spec set governs the details; this phase extends
it, so update [TELEMETRY_VIEW.md](lab/TELEMETRY_VIEW.md) with the new fields and views in the
same PR.

- Re-sync the four fixtures from homelab `main` (record the commit; `6e4473a` or later) per
  [HOMELAB_REFERENCE.md §6](lab/HOMELAB_REFERENCE.md#6-vendored-fixtures); update `MANIFEST.json`;
  confirm `tests/lab/fixtures-manifest.test.ts` passes.
- Extend `lib/lab/schemas` for every new v1 key in `docs/status-contract.md` (homelab) with
  `.nullable()` where the contract allows `null` and `.optional()` for the whole block when the
  contract says the block is `null` while not reporting. Extend `LabSummary` with `vms_running`
  only (the neofetch row); the rest is for the views.
- Build the counts strip, airflow line, NAS card, CI card and GPU enc/dec columns (4.6) in new
  files under `components/lab/telemetry/`, each under 150 lines, using the existing shared
  components; phone layouts in `TelemetryPhone.tsx` get the strip and the NAS line.
- `/lab` footer: the "how this works" paragraph and diagram; the threats page's one-sentence
  honeynet note.
- Tests: schema tests for each new block (golden, `null` block, invalid types), freshness
  unchanged, summary test for `vms_running`.

Done when: every new number renders in demo mode with the right unit and a dash for `null`, the
manifest test passes against the new SHAs, and the telemetry chunk stays within its budget
(≤ 25 KB gzipped, [LAB_UI_SPEC.md §8](lab/LAB_UI_SPEC.md#8-performance-budgets)).

### Phase 6: phone polish pass

Done after phases 2 to 5, as one PR of small fixes found by the audit script's phone screenshots
at 320, 360, 390, 430 and 768 px, plus landscape 844×390. The checklist to walk:

- No horizontal scroll at any width; no text under 14 px; tap targets ≥ 44 px with ≥ 8 px gaps.
- The frame border never overlaps content (C8 class of bugs) at any scroll position.
- The rail hides while the keyboard is open (contact form) and above the iOS home indicator
  (`env(safe-area-inset-bottom)`).
- The globe button, `■ stop globe`, and the feed remain usable one-handed.
- `prefers-reduced-motion`: no parallax, no fades longer than 150 ms, static globe.
- Dark and light presets both readable on an OLED phone at 30 % brightness (contrast ≥ 4.5:1
  for body text, checked with the lab's `--lab-text-2` rule).
- Back navigation from a project page returns to the scroll position on the home page
  (`scroll-restoration` with the one-DOM layout should make this free; verify).

### Phase 7: the GPU, visible (G1 and G5 consumer side)

Only after the homelab produces the documents; the portfolio side is small and fixture-first:

- `v1/hero.json` mirror (schema from the homelab contract when written: image URL on the CDN
  bucket, `rendered_at`, GPU role and index, `render_ms`, the caption numbers, never the prompt
  text verbatim unless the contract says it is safe), a loader with the same freshness rules, a
  wallpaper entry `lab` in the tray that is selected by default when the document is live, and the
  `◇ rendered by the lab` chip with the caption on hover or tap.
- `gpus[].inference` block (G5) in the telemetry schema and a row in the GPU table.

Done when: demo fixtures render both, and with the document missing the site looks exactly as
after phase 6.

---

## 6. Performance budgets

Measured on the production build with the audit script (section 8) and Lighthouse (mobile,
simulated 4G, mid-tier CPU throttling), no CDN, cold cache. The lab's own budgets in
[LAB_UI_SPEC.md §8](lab/LAB_UI_SPEC.md#8-performance-budgets) stay in force.

| Metric | `/` today | Budget after phase 2 | Every other page |
|---|---|---|---|
| First-load JS (gzipped, Next's build table) | 213 KB | ≤ 150 KB | ≤ 130 KB (lab pages ≤ 135 KB) |
| Images on first load, phone 390 px | 235 KB | ≤ 100 KB | ≤ 150 KB (blog post covers) |
| Images on first load, desktop 1440 px | 373 KB | ≤ 220 KB | ≤ 250 KB |
| Fonts on first paint | 187 KB | ≤ 60 KB | ≤ 60 KB |
| Server HTML carries the LCP element | no | yes | yes |
| Lighthouse mobile: performance / a11y / best practices / SEO | not measured (blank paint) | ≥ 95 / 100 / 100 / 100 | same |
| LCP, mobile simulated 4G | n/a | ≤ 1.8 s | ≤ 2.0 s |
| TBT, mobile | n/a | ≤ 150 ms | ≤ 150 ms |
| CLS | n/a | 0 | 0 |
| Long tasks after load on a mid-range phone | n/a | none > 100 ms | none > 100 ms (globe excepted, per lab spec) |
| Requests on first load | 21 | ≤ 18 | ≤ 20 |
| Railway RSS after 24 h | baseline | within +10 MB of the phase 0 baseline | |

---

## 7. Definition of done

For every phase PR:

- [ ] `npm run build` with the flag off, with the lab on (demo data), and with the lab and threat
      map on; `npm run typecheck`; `npm run lint`; `npm test`. All green in CI.
- [ ] The audit script's report before and after, pasted in the PR description, with the
      screenshots at 1440×900 and 390×844 attached (desktop home, phone home at four scroll
      positions, `/projects`, one project page, `/lab`, `/lab/threats`).
- [ ] No console errors or warnings on any audited page in the production build (the
      `Deprecated API for given entry type` warning from the audit script's own measurement is
      the one exception).
- [ ] No request on the home page for a lab, globe, three or land chunk with the lab flag off; no
      globe chunk on `/` or `/lab` with it on (unchanged lab rule).
- [ ] Keyboard walk on desktop: Tab reaches every control in a sensible order with a visible
      ring; Esc closes every popover; hjkl still moves between tiles.
- [ ] Screen reader pass on the home page (VoiceOver or NVDA, one run): landmarks announced,
      cards read as links with their titles, status chips read as text.
- [ ] `CLAUDE.md` updated for anything the phase changed in the file map or commands.
- [ ] Nothing from the homelab repo copied except fixtures, and nothing in the diff that
      [HOMELAB_REFERENCE.md §7](lab/HOMELAB_REFERENCE.md#7-what-this-repo-must-never-do) forbids.

For the work order as a whole, additionally:

- [ ] Section 6 budgets met on `/`, `/projects`, a project page, `/lab`, `/lab/threats`.
- [ ] Lighthouse mobile ≥ 95 performance on `/`; 100 on accessibility and SEO on every page.
- [ ] A visitor on a 390 px phone sees, without scrolling: the name, what David does, and the
      first featured card; with one scroll: the lab, live.
- [ ] A visitor on a 1440 px laptop sees, without a click: the three featured projects, the lab
      tile with live numbers, the neofetch identity, and the polybar.
- [ ] David has reviewed the desktop home and the phone home in all three presets and said yes.

---

## 8. Measuring: the audit script

`docs/audit/audit-shots.mjs` drives headless Chromium over the production build and writes
screenshots and a JSON report (load time, DOMContentLoaded, JS and image transfer, request
count, document height, horizontal overflow, console errors, the largest requests). It is what
produced the appendix. Playwright's Chromium is already installed in Claude Code cloud sessions
(`/opt/pw-browsers`); locally, `npx playwright install chromium` once.

```bash
# build with the lab on, demo data, and serve it
NEXT_PUBLIC_FEATURE_LAB=true NEXT_PUBLIC_FEATURE_LAB_THREATS=true LAB_DEMO_DATA=true npm run build
LAB_DEMO_DATA=true PORT=3111 node_modules/.bin/next start -p 3111 &

# run the audit (installs playwright-core locally without touching package.json)
npm install --no-save playwright-core
AUDIT_BASE=http://localhost:3111 AUDIT_OUT=./audit-out node docs/audit/audit-shots.mjs

# Lighthouse, mobile, on the same server
npx lighthouse http://localhost:3111/ --preset=perf --form-factor=mobile --screenEmulation.mobile \
  --throttling-method=simulate --output=json --output-path=./audit-out/lh-home.json
```

Keep `playwright-core` and `lighthouse` out of `package.json`; they are audit tools, not
dependencies, and the CI job does not run them.

---

## 9. Decisions needed from David

| # | Question | Needed by | Recommended |
|---|---|---|---|
| Q1 | **AgentCM**: the release date to show, the one-paragraph pitch, the audience phrase, what the link row points at before release (GitHub org, a landing page, a waitlist form, or nothing), and the hero image | phase 3 | show the date; link row `GitHub →` only once the repo is public, until then no links and the chip says `coming <date>` |
| Q2 | **Hero images** for AgentCM, Construction Skills, the LLM toolkit and the homelab (16:9, ≥ 1600 px, on the CDN under `/images/projects/<slug>/hero.webp`) | phase 3 | a screenshot of the real thing beats an illustration; the homelab's existing photo works for its page |
| Q3 | **Theme on phones**: keep forcing Tokyo Night + cyan (today), or one default everywhere with the preset and accent pickers reachable from the rail | phase 2 | one default everywhere, pickers reachable; the forced-theme code is the source of C7 |
| Q4 | **Blog default**: `NEXT_PUBLIC_FEATURE_BLOG=false` on dleer.ai (posts reachable, unlinked from the first screen) | phase 4 | yes |
| Q5 | **Workspace order** in the polybar: `home · projects · lab · about · contact` | phase 2 | as written |
| Q6 | **Which project cards fill the stage** when the threat map flag is off: three projects + the telemetry card, or four projects | phase 2 | three projects + telemetry |
| Q7 | **The GPU offer sequence** G1 → G5 → G2 → G3 (4.7), and whether G3 ("ask the lab") is wanted at all | phase 7 and the homelab roadmap | G1, G5, G2; decide G3 after G2 has run a month |
| Q8 | **CSP enforcement** after the report-only week | after phase 0 | enforce |

---

## 10. Appendix: audit evidence

Production build of `9b0efa6`, lab and threat map on, demo data, no CDN, no env (so the
placeholders `[Your Name]`, `username`, `(N/A)` were visible, which is itself finding C3's cousin:
the neofetch tile should hide rows whose env is unset rather than print `(N/A)`). Headless
Chromium 131, cold cache, `networkidle`. JS and images are transfer sizes of resources loaded by
the page; "first-load JS" in section 6 is Next's build table instead.

| Viewport | Page | Load (ms) | DCL (ms) | JS (KB) | Images (KB) | Requests | Console |
|---|---|---|---|---|---|---|---|
| 1440×900 | `/` | 1405 | 52 | 216 | 373 | 21 | one 400 (profile placeholder, env unset) |
| 1920×1080 | `/` | 909 | 35 | 216 | 373 | 21 | same |
| 1280×720 | `/` | 1355 | 104 | 216 | 373 | 21 | same |
| 390×844 | `/` | 1086 | 34 | 231 | 235 | 20 | clean |
| 1440×900 | `/projects` | 782 | 43 | 4 | 0 | 16 | clean |
| 1440×900 | `/projects/llm-security-auditor` | 839 | 27 | 10 | 0 | 20 | clean |
| 1440×900 | `/blog` | 724 | 30 | 1 | 0 | 16 | clean |
| 1440×900 | `/blog/local-ai-prepping-2025` | 1023 | 40 | 2 | 119 | 23 | clean |
| 1440×900 | `/lab` | 877 | 33 | 27 | 0 | 28 | clean |
| 1440×900 | `/lab/threats` | 987 | 27 | 573 (globe) | 0 | 35 | WebGL software-fallback notices only |
| 390×844 | `/lab` | 690 | 34 | 0 | 0 | 25 | clean |
| 390×844 | `/lab/threats` | 735 | 23 | 14 (no globe until tap) | 0 | 24 | clean |

Next's build table (first-load JS, gzipped): `/` 213 KB (route 72.6 KB), `/projects` 144 KB,
`/projects/[slug]` 120 KB, `/blog` 143 KB, `/blog/[slug]` 121 KB, `/lab` 127 KB, `/lab/threats`
131 KB, shared 102 KB.

Server HTML of `/`: 10.6 KB, containing no neofetch text, no "Contents", no greeting (C1).

Largest requests on the desktop home: `cat_anime-girl.webp` 218 KB (original, unused: C6),
`/_next/image?url=purple-girl.webp&w=1920` 161 KB, `JetBrainsMono-Bold.woff2` 95 KB,
`JetBrainsMono-Regular.woff2` 92 KB.

Homelab contract drift (C5): portfolio `now.v1.json` sha256 `d3a33aba…` (manifest commit
`ba74e7e`) versus homelab `main` `6e4473a` `cc0715ff…`; `history.v1.json` `817d7993…` versus
`a61d5c1c…`. The threats fixtures match.

Production variables on Railway (service `dleer-portfolio`, project `brave-wonder`, deployed
from `main`, last deploy 2026-10-13 00:17 UTC; names only, values were not read): every
`NEXT_PUBLIC_*` personal, social, photo, SEO and CDN variable in `.env.example` is set, as are
`NEXT_PUBLIC_FEATURE_LAB`, `NEXT_PUBLIC_FEATURE_LAB_THREATS`, `LAB_DEMO_DATA`, the four `R2_*`
variables and the two `RESEND_*` ones. So the audit's placeholder rows (`(N/A)`, `[Your Name]`)
are an artefact of the audit environment, not of production; the findings above do not depend on
them. To reproduce the audit with real content, copy the `NEXT_PUBLIC_*` values (no secrets
needed: the lab runs in demo mode without `R2_*`) into `.env.local` before `npm run build`.

Screenshots reviewed for section 3.3: desktop home at three widths, phone home at four scroll
positions, `/projects` and a project page at both widths, `/blog`, `/lab` and `/lab/threats` at
both widths.
