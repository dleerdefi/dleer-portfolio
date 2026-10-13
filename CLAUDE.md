# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
# Start development server with Turbopack
npm run dev

# Build for production with Turbopack
npm run build

# Start production server
npm run start

# Clean up dev server processes (useful after crashes)
npm run cleanup

# Auto-cleanup before dev (configured in package.json)
npm run dev  # automatically runs cleanup first

# Type checking
npm run typecheck

# Linting (the ESLint CLI with eslint.config.mjs; `next lint` is deprecated)
npm run lint

# Unit tests (Vitest, tests/lab)
npm test

# The lab with bundled demo data (no credentials needed); add
# NEXT_PUBLIC_FEATURE_LAB_THREATS=true for the threat map
NEXT_PUBLIC_FEATURE_LAB=true LAB_DEMO_DATA=true npm run dev

# After adding or changing a wallpaper in public/images (and lib/wallpapers.ts):
# pre-blurred copies in assets/wallpapers + lib/wallpapers.generated.ts
node scripts/build-wallpapers.mjs

# After changing the profile photo in public/images/profile: the desktop neofetch tile's 3:4
# copies in assets/hero + lib/hero-photo.generated.ts (`upper` for an upper-body crop)
node scripts/build-hero-photo.mjs

# After changing the glyphs the site draws with: font subsets + app/styles/03-fonts.css
# (pip install fonttools brotli)
python3 scripts/subset-fonts.py
```

On a fresh checkout `npm run typecheck` needs the content-collections types and `next-env.d.ts`
(which declares image imports such as the pre-blurred wallpapers) that a build, or `npm run dev`,
generates first.

## Portfolio v2 work order

[docs/PORTFOLIO_V2_SPEC.md](docs/PORTFOLIO_V2_SPEC.md) is the audit (2026-10-13) and the phased
spec for the next version of the site: performance budgets, the one-DOM home layout, projects as
case studies, the blog receding, the lab promoted. Read it before any layout, performance or
projects work; its phases are one PR each. `docs/audit/audit-shots.mjs` produces the before and
after numbers every phase PR shows.

## Lab (`~/lab`)

Live homelab telemetry and a honeypot threat map, behind `NEXT_PUBLIC_FEATURE_LAB` (off by
default; with it off the site is unchanged and the lab routes 404). The threat map has a second
flag, `NEXT_PUBLIC_FEATURE_LAB_THREATS` (off by default, only counts while the lab is on): gate
any threats entry point on `labThreatsEnabled()` from `lib/lab/flag.ts`. Before touching anything
lab-related, read [docs/lab/README.md](docs/lab/README.md): the spec set, the approved concepts,
and how to read the private `dleerdefi/dleer-homelab` repo whose data contracts it consumes.
Never copy homelab addresses, secrets or bucket names into this public repo, and never add
routes outside `/lab` and `/api/lab/` for it.

| Where | What |
|---|---|
| `lib/lab/` | Zod mirrors of the five producer schemas, freshness, the read-only R2 client, cached loaders with the IP-shape scan, demo mode (`LAB_DEMO_DATA=true`), the summary, names and formatting |
| `lib/lab/fixtures/`, `tests/fixtures/homelab/` | verbatim homelab golden and invalid examples; `MANIFEST.json` pins source commit and sha256 (re-sync per `docs/lab/HOMELAB_REFERENCE.md` §6, never hand-edit) |
| `app/api/lab/*` | `status`, `status/history`, `status/live` (the last 10 minutes at 10 s steps, `/lab`'s gliding `LivePanel` only), `threats`, `threats/live`, `summary`: GET only, validated payloads, §5 cache headers |
| `hooks/useLabData.ts`, `lib/lab/status-store.ts`, `hooks/useLabColors.ts` | polling, the shared live/delayed/offline store, concrete theme colors for the globe |
| `components/lab/shared/` | `LabStatusBadge`, `Meter`, `Sparkline`, `LineChart`, `LiveChart` (the gliding 10-minute chart), `HourlyBlocks`, `Swatch`, `LabAttribution`, `Value`, `LabHeader` |
| `components/lab/telemetry/`, `components/lab/threats/` | the tiles (`lab-telemetry`, `lab-threats`), the framed pages `/lab` and `/lab/threats`, their phone layouts, `LabExtras` (cost, the health line, the NAS and CI blocks, the transcoding tag), `LabHowItWorks` (`/lab`'s footer), `ReplayClock`, the feed, stats, legend, and the lazy globe (`ThreatGlobe`, `globe-setup`, `globe-layers`) |
| entry points | `components/tiles/nav/LabDirectory.tsx` in the contents tree, the polybar `lab` workspace, the lab card `components/lab/home/LabTile.tsx` (a carousel: `LabCarousel.tsx`, `LabSlides.tsx`; loaded through `components/home/LabIslands.tsx`), the section rail's watts |

Lab colors come only from CSS variables (`13-lab.css`); `null` renders as a dash; the globe chunk
loads only when a threats view shows it (on phones, after a tap).

## Project Architecture

This is a **Next.js 15.5** portfolio application with App Router, designed as a Hyprland/Arch Linux rice-inspired website with a tiled window manager aesthetic.

### Core Structure
- **Framework**: Next.js 15+ with App Router and Turbopack
- **Styling**: Tailwind CSS v4 (using @tailwindcss/postcss)
  - **CSS Architecture**: Modular CSS with 16 focused stylesheets
  - **Organization**: Each module under 650 LOC for maintainability
- **TypeScript**: Strict mode enabled with path aliases (@/* mapped to root)
- **Fonts**: JetBrains Mono, self-hosted in `public/fonts`: pages load the `.subset.woff2` files (Regular 33 KB with ligatures, preloaded; Bold 19 KB), and the full files only for a glyph beyond them (`03-fonts.css`, generated by `scripts/subset-fonts.py`). A TTF subset in `lib/og/fonts` serves the Open Graph cards
- **Content on the client**: client components never import `content-collections` (it carries every document's MDX and HTML). Server components build summaries with `lib/content-index.ts` and pass down only what a client component draws (the contents tree gets the featured titles); `/`, `/projects` and the project pages are server-rendered
- **Animation**: CSS only (transitions, keyframes, and DOM writes in rAF for scroll effects); there is no animation library
- **Theme**: Dynamic theme system with Tokyo Night, Nord, and Solarized Light presets
- **State Management**: React Context API for theme and focus management

### CSS Architecture

The application uses a modular CSS architecture with styles split into 16 focused modules:

#### Module Structure (`app/styles/`)
1. **01-theme-variables.css** (239 lines) - Theme presets & CSS custom properties, `--accent-text` (the accent clamped to read at 4.5:1 on each preset)
2. **02-theme-effects.css** (49 lines) - Theme-specific visual effects & transitions
3. **03-fonts.css** (39 lines) - JetBrains Mono @font-face declarations, generated by `scripts/subset-fonts.py`
4. **04-terminal-theme.css** (103 lines) - Terminal color system & mappings
5. **05-base.css** (70 lines) - CSS reset, base styles & container utilities
6. **06-typography.css** (72 lines) - Links, headings, code blocks
7. **07-terminal-ui.css** (75 lines) - Terminal UI components & ASCII box drawing
8. **08-animations.css** (98 lines) - Keyframes & animation utilities, reduced-motion rules (no transition takes time)
9. **09-utilities.css** (102 lines) - Responsive, spacing & touch utilities
10. **10-mobile.css** (133 lines) - Mobile-specific optimizations & safe areas
11. **11-glass-effects.css** (93 lines) - Glass morphism & visual effects (the home tiles' chrome is in 15)
12. **12-blog-content.css** (637 lines) - Blog prose styling (links underlined), MDX components, figures, admonitions, code blocks
13. **13-lab.css** (179 lines) - Lab (`~/lab`): attack-category colors per preset, `--lab-*` tokens, shared lab classes, the home lab card (carousel and slides)
14. **14-lab-views.css** (285 lines) - Lab layouts: the framed `/lab` pages, the last-10-minutes panel, the health line, NAS / CI blocks and tags, the globe's markers and tooltip, phone tweaks, `/lab`'s how-this-works footer
15. **15-home-layout.css** (246 lines) - The home page's two arrangements of one DOM: neofetch and the desktop photo, the home view, the lab tile, the contents tree, the polybar tray and popovers, the section rail, the phone column, the desktop grid and tile chrome, the phone's scroll-driven animations
16. **16-projects.css** (111 lines) - Projects: the cards and their covers, the `/projects` grid, the case-study pages

The main `app/globals.css` file imports all modules in the correct cascade order.

### Current Implementation

#### The home page: one DOM, two arrangements

`/` is server-rendered once (`app/page.tsx`) and CSS (`15-home-layout.css`) lays it out: tiles at
1024 px and up, one scrolling column below. Nothing reads the window width to choose a layout; the
only width check in script is `useIsDesktop()` (`hooks/useMediaQuery.ts`, server snapshot =
desktop), which decides what the stage shows and which keys apply. Spec: §4.1 to §4.3 of
`docs/PORTFOLIO_V2_SPEC.md`.

1. **HomeShell** (`components/home/HomeShell.tsx`): the `Background`, the phone frame, the
   `Polybar`, and the tiles; desktop keys (hjkl between tiles via `lib/tile-navigation.ts`, Esc
   back to `home`; Tab is native and the focused tile follows DOM focus); on phones the
   `ScrollProgress` indicator and the `SectionRail`, fed by `hooks/usePhoneScroll.ts`.
2. **FocusTile** (`components/home/FocusTile.tsx`): a `section` with `data-tile` and
   `data-focused`; its chrome (border, glass, `--tile-alpha` per preset, the focus ring) is CSS.
   The tiles: `neofetch` (`section-top`), `navigation` (`section-contents`, desktop only),
   `content` (`section-home`, the stage) and, with the lab flag, `lab`.
3. **Neofetch** (`components/home/Neofetch.tsx`, server): the social rows whose URL is set
   (`system` in `config/portfolio.config.ts`: GitHub, X, LinkedIn, YouTube, Instagram, TikTok; an
   optional follower or views count after the handle) and the color swatches. On desktop the
   profile photo (`HeroPhoto.tsx`) stands beside the rows, centred on it, where real neofetch
   draws an image; pressing it switches to the RF-DETR detection version, which loads on first
   hover or focus. Phones keep
   the block-letter logo above the rows and download no photo (a desktop-only `<picture>`
   source). The photo shows while `NEXT_PUBLIC_PROFILE_PHOTO` is set; its crops come from
   `scripts/build-hero-photo.mjs`.
4. **Stage** (`components/home/Stage.tsx`): the content tile's body. `home` is the server-rendered
   `HomeView` (greeting, the one-line pitch `NEXT_PUBLIC_BIO_INTRO`, the short bio
   `NEXT_PUBLIC_BIO_SUMMARY`, the three featured `ProjectCard`s and a "N more projects" card); it
   is also the site's about, there is no about view. `contact` and the lab views load with
   `next/dynamic` on desktop. Phones always show `home`.
5. **NavTree** (`components/home/NavTree.tsx`): the contents tree on desktop: `home`,
   `projects/` (links to the featured three and `/projects`), `lab/` (`LabDirectory`),
   `contact`. Real buttons and links, `aria-expanded` and `aria-current`.
6. **LabTile** (`components/lab/home/LabTile.tsx`): the lab card, one card of slides
   (`LabCarousel`, `LabSlides`): power, hosts, GPUs, storage and CI, and the honeypot with the
   threat map on, each a link to its part of the lab, from `/api/lab/summary` fetched after
   idle. On desktop a slide opens its view in the stage (at that section) and the card advances
   every 6 s unless hovered, focused, off screen, paused or with reduced motion; phones swipe it
   and open the pages. Spec: `docs/lab/TELEMETRY_VIEW.md` §5.4.
7. **Polybar** (`components/layout/Polybar.tsx`, desktop only): workspaces (home, projects, lab,
   contact), the `ThemeTray` (`components/layout/polybar/`: presets, accent and wallpaper
   popovers, `?` keys; popovers are focus-trapping `role="dialog"`s) and the clock.
8. **Phone sections** (`components/home/sections/PhoneSections.tsx`, server): the other
   projects and contact (`ContactForm.tsx`), hidden on desktop where the stage shows contact.
9. **SectionRail** (`components/home/SectionRail.tsx`, phones): one dot per section, tap to jump,
   the lab's live watts beside its dot, hidden while scrolling and while the keyboard is up.
10. **Background** (`components/layout/Background.tsx`): the chosen wallpaper, pre-blurred to a
   few KB (`assets/wallpapers`, `lib/wallpapers.generated.ts`) and shown without next/image's blur
   placeholder (that placeholder cost 0.5 to 1 s of main thread; spec P13), the preset's color
   filter and overlay, and the orbs (toggle in the wallpaper popover).

Detail pages (`/projects/*`, `/blog/*`, `/lab*`) use `FramedPageLayout` on every device.

#### Projects (`content/projects/<slug>/index.mdx`)

Each project is a case study (spec §4.4). The frontmatter schema is `lib/content-schema.ts`
(tested in `tests/content/`); the fields beyond title, summary, dates, tags and tech:

- `featured_rank`: 1, 2, 3 are the home page's featured cards in that order; 4 and up stand in
  when one is missing. Then the older `featured: true`, then the newest (`lib/projects.ts`).
- `status: coming-soon` with `release_date` (required then): the chip reads `coming Oct 16`, and
  from that date the status is `production`, computed when a page is built (daily). On release
  day, add the `github` URL and links.
- `hero`: a 16:9 image (1600 px or more), the `/projects` card's cover and the page's hero. Without
  it the card draws the MDX's first `<Terminal>` diagram or code block as an SVG text cover
  (`lib/cover-text.ts`, `ProjectCover.tsx`).
- A `<Terminal>` diagram is a template literal whose every line starts with a `|` margin
  (`lib/terminal-text.ts` has an example; `content/projects/homelab/index.mdx` uses it): MDX
  strips leading spaces inside a component, and even inside an expression, which shifts a
  diagram's columns. It keeps its lines on a phone and scrolls sideways.
- `metrics` (at most three; the card shows the first): a value of `"github"` with the label
  `stars` or `forks` is read from the GitHub API when the page is built and daily after
  (`lib/github.ts`, `GITHUB_TOKEN` optional); a failed read leaves it out, never a 0.
- `links` (URLs, or site paths like `/lab`), `audience` (one phrase, "for ...").

`/projects` is a server-rendered grid of `ProjectCard`s (featured first) with j/k/Esc keys
(`components/ui/ListKeys.tsx`) and hints only for a fine pointer; `/projects/<slug>` is the case study:
hero, audience, summary, `MetricsRow`, `LinkRow`, stack, the MDX, next project. The home page's
cards leave the covers out so the featured three fit the first screen.

#### Blog (`content/blog/<slug>/index.mdx`)

`/blog` is the same server-rendered grid as `/projects`, of `PostCard`s (`components/blog/`).
`NEXT_PUBLIC_FEATURE_BLOG` (on unless `false`; dleer.ai sets `false`) decides the blog's entry
points: a `blog` polybar workspace, `blog/` in the contents tree and a phone "Writing" section with
its rail dot. With it off the posts stay at their URLs, in the sitemap (at lower priority), RSS and
the JSON feed, and behind the home page's `writing →` link, and `/blog` says it is an archive.

#### MDX Components

12. **PostAudio** (`components/mdx/PostAudio.tsx`)
   - Blog post audio player with playback controls
   - Speed adjustment (1x, 1.25x, 1.5x)
   - Progress bar with seek functionality
   - Download button for offline listening
   - Analytics tracking (7 event types: play, pause, seek, speed change, download, complete, error)

13. **AutoPostAudio** (`components/blog/AutoPostAudio.tsx`)
   - Automatic audio detection for blog posts
   - Checks for `/audio/blog/{slug}.mp3` files
   - Auto-renders PostAudio component if audio exists
   - No manual configuration needed per post

### Design System

#### Color System (Dynamic CSS Variables)

The theme system uses CSS variables that update based on the selected preset:

```css
/* Core Theme Variables */
--theme-bg         /* Base background */
--theme-surface    /* Tile backgrounds */
--theme-primary    /* Primary accent */
--theme-text       /* Body text */
--theme-text-dimmed /* Muted text */
--theme-success    /* Success states */
--theme-info       /* Info highlights */
--theme-warning    /* Warning states */
--theme-error      /* Error states */

/* Accent Color (User Selectable) */
--accent-color     /* Dynamic accent from 15 options: borders, fills, tints */
--accent-color-rgb /* RGB values for opacity */
--accent-text      /* The accent as text (and as the fill under text): its CIELAB lightness
                      clamped per preset so any of the 15 reads at 4.5:1 on the glass */
```

Every text color reads at 4.5:1 (3:1 at 24 px and up) on each preset's tiles over each of its
wallpapers: measured from rendered pixels (`docs/audit/contrast.mjs`), since axe and Lighthouse
cannot see through the glass. Run it after any color, glass or wallpaper change.

##### Tokyo Night (Default Dark)
- Background: #1a1b26; surface (tiles): #16161e, glass 0.25 / 0.9 focused
- Text: #c0caf5; primary (headers): #bb9af7
- Default accent: purple #a855f7 (as text, lifted to CIELAB L* 74)
- Success: #9ece6a / Warning: #e0af68 / Error: #f7768e / Info: #7dcfff

##### Nord (Arctic Dark)
- Background: #2E3440 (nord0); surface: #3B4252 (nord1), glass 0.7 / 0.85 focused
- Text: #E5E9F0 (nord5); primary: #98B9FF (the spec's #6A8FF2 lightened)
- Default accent: blue #3b82f6 (as text, lifted to L* 79)
- Success: #A3BE8C / Warning: #EBCB8B / Error: #FD99A0 / Info: #9CBFED (nord11 and nord10 lightened)

##### Solarized Light
- Background: #fdf6e3 (base3); surface: #eee8d5 (base2), glass 0.9 / 0.95 focused
- Text: #073642 (base02); primary: #065CA6
- Default accent: pink #ec4899 (as text, darkened to L* 35)
- Success: #4b6100 / Warning: #765200 / Error: #bc0019 / Info: #006861 (Solarized's green,
  yellow, red and cyan darkened to read on cream; no yellow can)

#### Spacing System
- Uniform 12px gaps between all elements
- Implemented using inline styles for consistency
- Tile borders: 2px for visibility
- Internal tile padding: p-6 (24px)

#### Responsive Breakpoints
- Desktop: ≥1024px (the tiles)
- Phones and tablets: <1024px (one scrolling column)

### Key Implementation Details

1. **Focus Management**:
   - `FocusContext` holds the focused tile and the stage's content; `handleContentNavigation`
     and `handlePolybarNavigation` change them
   - Visual focus states (accent border and shadow, more opaque glass) are CSS on
     `data-focused`; an unfocused tile's text is not dimmed (it would fall under 4.5:1)
   - Keyboard (desktop): hjkl moves between tiles by geometry, Tab is native, Esc returns the
     stage to `home`; the `?` popover in the tray lists them

2. **Theme System**:
   - CSS variables update dynamically on theme change
   - All colors use theme variables for consistency
   - Accent colors customizable independently
   - Solarized Light is the light preset; preset and wallpaper persist in localStorage on desktop
   - Phones get Tokyo Night with the cyan accent (`ThemeContext` at mount plus one rule in
     `01-theme-variables.css`; spec Q3)

3. **Glass Morphism**:
   - `backdrop-filter` with semi-transparent backgrounds on the desktop tiles
   - `--tile-alpha` per preset, higher when focused; opaque with `prefers-reduced-transparency`.
     Nord's and Solarized's are high enough that their wallpapers make no mid-tones behind text

4. **Mobile UX**:
   - One column of sections in a single document scroll; the hero recedes and sections rise with
     CSS scroll-driven animations where supported (transform and opacity on the hero only)
   - The section rail and a scroll indicator
   - Below 1024 px no text is under 14 px (decorative art aside: the block-letter logo, the
     `/lab` diagram, a cover's title bar) and every standalone control is a 44 px target; links
     inside lines of text (prose, the neofetch rows, the attribution) keep their line, at a
     24 px pitch at least. Each module's phone block holds its sizes (spec phase 6)
   - Form fields are 16 px at least, or iOS Safari zooms the page when one takes focus
   - With `prefers-reduced-motion` no transition takes any time (`08-animations.css`)
   - Nothing on the page grows after load: the lab cards hold their space until the summary
     arrives

5. **Open Graph cards**: generated at build time with `next/og` (`lib/og/card.tsx`): the site card
   (`app/opengraph-image.tsx`), one per project and post, and the two lab cards, which 404 with
   their flags off like every lab route. A project or post with a `cover` uses that instead.

6. **Security headers**: `next.config.ts` sets HSTS, `nosniff`, `X-Frame-Options`, a referrer and
   a permissions policy, and in production a report-only Content-Security-Policy (spec C14, Q8).

### Common Tasks

#### Adding New Content Types
1. Update `ContentType` in `FocusContext.tsx`
2. Add handling in `components/home/Stage.tsx` (a `next/dynamic` import unless it is small)
3. Add an entry in `components/home/NavTree.tsx`
4. Add a polybar workspace if needed, and the phone equivalent (a section or a page)

Content types today: `home`, `contact`, and behind the lab flag `lab-telemetry` and
`lab-threats`. `project`, `projects-overview` and `blog-overview` are navigation intents only:
they become routes (`/projects/<slug>`, `/projects`, `/blog`), and no view renders them. A
client component the home page imports from a server component ships in the page's chunk even
unrendered, so optional islands (the lab's) are `dynamic()` inside a client module
(`components/home/LabIslands.tsx`).

#### Working with Themes
1. **Add new theme preset**:
   - Update `ThemeContext.tsx` with new preset colors
   - Add its button in `components/layout/polybar/ThemeTray.tsx`
   - Ensure all CSS variables are defined (`01-theme-variables.css`, `13-lab.css` for the lab's
     category colors, and the preset's `--tile-alpha` in `15-home-layout.css`)

2. **Modify accent colors**:
   - Edit the swatches in `ThemeTray.tsx`
   - Update `AccentColor` type and `accentColorMap` in `ThemeContext.tsx`
   - Colors automatically apply via CSS variables

3. **Theme-aware components**:
   - Use `var(--theme-*)` CSS variables
   - Never hardcode colors directly
   - Use `rgba(var(--theme-*-rgb), opacity)` for transparency; secondary text is
     `rgba(var(--theme-text-rgb), 0.72)` (`--theme-text-dimmed` is under 3:1 on the dark presets)
   - Text in the accent is `var(--accent-text)`, never `var(--accent-color)` (that one is for
     borders, fills and tints); so is a fill with text on it (`color: var(--theme-bg)` over it)

#### Adjusting Spacing
- All spacing uses inline styles with explicit pixel values
- Maintain 12px standard for consistency
- Test on both desktop and mobile layouts

#### Color Modifications
- Always use CSS variables (`var(--theme-*)`) instead of hardcoded colors
- Maintain opacity values for glass effect
- Ensure sufficient contrast for readability
- Test all themes (especially light theme) for visibility

### Development Tips

1. **Hot Reload Issues**: If changes don't appear, the dev server may need restart
2. **Spacing Debugging**: Use browser inspector to verify padding/margin application
3. **Mobile Testing**: Use responsive mode below 1024 px to test the phone column; `docs/audit/audit-shots.mjs` screenshots five phone widths
4. **Performance**: Keep animations smooth with transform/opacity only
5. **CSS Changes**: When modifying styles, identify the correct module in `app/styles/`
6. **Module Size**: Keep new files, CSS or TypeScript, under about 300 lines

### Recent Improvements

#### Component Architecture Refactoring (Completed)
As part of preparing the codebase for open source release, major technical debt was addressed:

1. **Eliminated Code Duplication** (40% reduction):
   - Removed unused non-Focus component variants
   - Deleted: Old LayoutManager, NavigationTile, ContentViewer, Polybar
   - Renamed WithFocus components to standard names

2. **TypeScript & Quality Assurance**:
   - Fixed all TypeScript compilation errors
   - Added `npm run typecheck` command
   - Added ESLint configuration with `npm run lint`
   - Proper type safety throughout the codebase

3. **Simplified Architecture**:
   - Single component implementation instead of dual variants
   - Cleaner import structure
   - Better maintainability for contributors

#### CSS Modularization (Completed)
Successfully refactored the monolithic 923 LOC globals.css:

1. **Improved Organization**:
   - Split into 11 focused modules by concern
   - Average module size: ~87 lines
   - Largest module: 182 lines (well under 300 LOC target)

2. **Benefits Achieved**:
   - Easier to locate and modify specific styles
   - Better git diffs and merge conflict resolution
   - Improved collaboration with clear module boundaries
   - No functional changes - identical styling output

### Image Storage: CDN Configuration

This project supports both local and CDN-based image storage for maximum flexibility:

#### Option 1: Local Images (Default)
- **How it works**: Images stored in `/public/images/`
- **Pros**: Works out of the box, no setup required
- **Cons**: Slower load times, uses server bandwidth
- **Best for**: Development, small deployments, quick prototyping

#### Option 2: CDN (Recommended for Production)
- **How it works**: Images served from external CDN (Cloudflare R2, AWS S3, etc.)
- **Pros**: Faster load times, reduced server bandwidth, better caching
- **Cons**: Requires CDN setup and configuration
- **Best for**: Production deployments, high traffic sites

**Setup CDN (Cloudflare R2 example):**

1. **Create R2 bucket** in Cloudflare dashboard:
   - Name: `your-portfolio-assets`
   - Location: Automatic (recommended)

2. **Upload images** maintaining folder structure:
   ```
   /images/
     /profile/
     /thumbs/
     /originals/
     *.webp
     *.png
   ```

3. **Connect custom domain** (e.g., `cdn.yourdomain.com`):
   - In R2 bucket settings → Connect Domain
   - Cloudflare creates DNS records automatically

4. **Configure CORS policy** (required for cross-origin image loading):
   ```json
   [
     {
       "AllowedOrigins": [
         "https://yourdomain.com",
         "https://www.yourdomain.com",
         "http://localhost:3000"
       ],
       "AllowedMethods": ["GET", "HEAD"],
       "AllowedHeaders": ["*"],
       "MaxAgeSeconds": 3600
     }
   ]
   ```

5. **Set environment variable**:
   ```bash
   # .env.local or Railway/Vercel settings
   NEXT_PUBLIC_CDN_URL=https://cdn.yourdomain.com
   ```

6. **Redeploy** - Images automatically load from CDN!

**Switching between Local and CDN:**
- **Local → CDN**: Set `NEXT_PUBLIC_CDN_URL`, redeploy
- **CDN → Local**: Remove `NEXT_PUBLIC_CDN_URL`, redeploy
- **No code changes required** - the `lib/image-paths.ts` utility handles everything

**For contributors/forks:**
The project works immediately with local images. Setting up a CDN is completely optional.

### Audio Integration

Blog posts support optional audio narration with automatic detection and analytics tracking:

#### How It Works

1. **Auto-Detection**: Place MP3 file at `/public/audio/blog/{slug}.mp3` (e.g., `local-ai-prepping-2025.mp3`)
2. **Auto-Render**: `AutoPostAudio` component checks for audio file existence and renders player if found
3. **No Configuration**: No manual setup needed in MDX files - completely automatic

#### Audio Player Features

- **Playback Controls**: Play/pause, seek, progress bar
- **Speed Adjustment**: 1x, 1.25x, 1.5x playback speeds
- **Download**: Offline listening support
- **Time Display**: Current position and total duration
- **Responsive**: Mobile-optimized touch targets

#### Analytics Events (7 Types)

The audio system dispatches CustomEvents for analytics integration:

```typescript
trackAudioPlay({ postSlug, src, positionSeconds })
trackAudioPause({ postSlug, src, positionSeconds })
trackAudioSeek({ postSlug, fromSeconds, toSeconds })
trackAudioSpeedChange({ postSlug, speed })
trackAudioDownload({ postSlug, src })
trackAudioComplete({ postSlug, src })
trackAudioError({ postSlug, src, error })
```

**Optional Google Analytics Integration:**
Call `initAudioAnalytics()` in app initialization to forward events to GA4.

#### Current Audio Assets

- 4 blog posts with audio (~3MB each, 12MB total)
- Format: MP3, 64 kbps, 24 kHz mono
- Stored: `/public/audio/blog/` (CDN-ready)

### Future Enhancements (Planned)
- [x] MDX blog system integration
- [x] Project detail pages with live demos
- [x] Blog post audio narration with analytics - COMPLETED
- [ ] More terminal effects (typing animation, matrix rain)
- [x] Dark/light theme toggle (Tokyo Night/Nord dark, Solarized light) - COMPLETED
- [x] Mobile parallax scrolling mode - COMPLETED
- [x] CDN image storage support - COMPLETED
- [ ] GitHub activity integration
- [x] Vim-style keyboard navigation
- [ ] Settings persistence (localStorage)