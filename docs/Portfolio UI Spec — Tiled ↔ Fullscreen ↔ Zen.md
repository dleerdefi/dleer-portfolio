# **Portfolio UI Spec — Tiled ↔ Fullscreen ↔ Zen (Hyprland-style)**

## **0\) Tech assumptions**

* React \+ Tailwind \+ Framer Motion (or Motion One).

* State via Zustand or React Context.

* Routing optional; content can be in-memory for now.

---

## **1\) Product intent (north star)**

Recreate a Hyprland/i3 “riced” desktop metaphor for desktop; keep mobile as standard scroll.

* **Tiled** \= multi-window canvas (default desktop view).

* **Fullscreen (FS)** \= maximize a single content section; **desktop still visible** at edges.

* **Zen** \= distraction-free reading **inside FS** (subset state; no Zen from Tiled).

---

## **2\) Sections & allowed modes**

| Section | Tiled | FS (default?) | Zen available? |
| ----- | ----- | ----- | ----- |
| About (main) | ✅ | Optional | ❌ |
| Projects | ✅ | ✅ (default) | ✅ (optional) |
| Blog posts | ✅ | ✅ (default) | ✅ |
| Content/File tree | ✅ | 🚫 (overlay) | ❌ |
| Theme selector | ✅ | 🚫 (modal) | ❌ |
| Neofetch summary | ✅ | Micro-focus | ❌ |

**Rule:** If a section is “immersive” (Blog/Projects), **click from file tree opens directly in FS** (no extra click).

---

## **3\) Global UI: polybar & tiles**

* **Polybar** always mounted.

  * Tiled: opacity `1.0`

  * FS: opacity `0.6`

  * Zen: **auto-hidden** (reveals on top-edge mouse or any key)

* Tiles in Tiled use square corners. See §7 for radii.

---

## **4\) Mode state & guards**

type Mode \= 'tiled' | 'fullscreen' | 'zen';  
type Section \= 'about' | 'projects' | 'blog' | 'content' | 'theme' | 'neofetch';

interface ViewState {  
  mode: Mode;  
  section: Section | null;        // active section (FS/Zen)  
  previousMode: Mode | null;      // for Zen → FS return  
  canZen: boolean;                // derived from section  
  scrollPositions: Record\<string, number\>; // per section  
}

**Transitions**

* Tiled → FS: allowed if target ≠ utility.

* FS → Zen: allowed only if `section ∈ { 'blog','projects' }`.

* Zen → FS: `Esc` or toggle.

* FS → Tiled: `Esc`, close icon, or polybar nav.

**Guards**

* Entering Zen from non-immersive sections is blocked.

---

## **5\) Navigation triggers**

* **File tree click**

  * If Blog/Projects: `set({mode:'fullscreen', section})`

  * If About: show in right tile (tiled), with “Maximize” button for optional FS

  * `content`/`theme` never trigger FS

* **FS controls**

  * Top-left ☐ (visible on hover/move) → back to Tiled

  * **Zen toggle** (`Z` or icon) → FS ↔ Zen

* **Polybar**

  * Section buttons jump focus; if in FS/Zen, exiting behaves as below

* **Keyboard**

  * `Esc` pops one layer: Zen→FS→Tiled

  * `⌘/Ctrl+K` quick switcher (optional) in Zen

---

## **6\) Animations (GPU-friendly)**

**General**: animate `transform`, `opacity`, and light `filter: blur()` only. Short timings.

### **Tiled → FS (expand)**

* Active tile: `scale 0.98→1`, translate from tile origin → centered, `opacity .96→1`

* Background grid: `opacity 1→.25`, `blur 0→6px`

* Polybar: `opacity 1→.6`

* Duration: **220–260ms**, tile transform **spring** (`stiffness:420, damping:32, mass:.7`); others ease-out `cubic-bezier(.22,1,.36,1)`

### **FS → Tiled (collapse)**

* Active tile: `scale 1→.98`, translate → origin, `opacity 1→.96`

* Grid: `blur 6→0`, `opacity .25→1`

* Polybar: `.6→1`

* Duration: **180–220ms**, ease-in `cubic-bezier(.2,0,0,1)`

### **FS ↔ Zen (chrome off/on)**

* Into Zen: hide chrome (title/sidebar/polybar): `opacity 1→0`, `y:0→-6px` (140–180ms ease-in-out)

* Content typography: increase via CSS vars (font-size \+4–6%, line-height \+0.05–0.1), max-width to \~68–72ch

* Background: tiles stay hidden; wallpaper \+ subtle vignette fade in

* Out of Zen: reverse; stagger chrome re-entry by 60–90ms

**Edge affordance in FS**

* Keep **2–4% viewport margin** around FS tile; faint glow/outline increases on hover near edge (120ms).

**Reduced motion**

* Respect `prefers-reduced-motion: reduce` → switch to instant state toggles.

---

## **7\) Corner radii & elevation (hierarchy)**

* **Tiled**: `border-radius: 0px` (square)

* **Fullscreen**: `6–8px` \+ 1px subtle border (e.g., `rgba(255,255,255,.08)` dark theme)

* **Zen**: `10–14px`, drop border, add soft ambient shadow (animate **opacity only**)

* **Modals/overlays**: `12–16px`

Tokenize:

:root {  
  \--r-tiled: 0px; \--r-fs: 8px; \--r-zen: 12px; \--r-modal: 14px;  
}  
.tiled .tile       { border-radius: var(--r-tiled); }  
.fullscreen .view  { border-radius: var(--r-fs); }  
.zen .view         { border-radius: var(--r-zen); box-shadow: 0 20px 40px rgba(0,0,0,.25); }

Animate radius during transitions (200–240ms FS entry; 140–180ms Zen entry).

---

## **8\) Components (contract & behavior)**

### **`<AppShell/>`**

* Renders `Polybar`, `DesktopGrid` (tiled) and `FocusedView` (FS/Zen).

* Provides `ViewContext` (mode, section, transitions).

### **`<Polybar/>`**

* Shows section tabs (About, Projects, Blog), modes (FS indicator, Zen toggle disabled unless allowed).

* Dim in FS; auto-hide in Zen (reveal on top-edge hover or keypress).

* Exit FS button (☐).

### **`<DesktopGrid/>` (Tiled)**

* Left column:

  * `AboutSummaryTile` (neofetch aesthetic; never FS; micro-focus allowed)

  * `ContentTreeTile` (file tree; **never FS**; can expand as an overlay on focus)

  * `ThemeTile` (opens **modal** palette; no FS)

* Right column:

  * `MainPreviewTile` (shows About/Project/Blog preview while in Tiled)

* All tiles square; selection reduces transparency on inactive tiles.

### **`<ContentTree/>`**

* Click behavior:

  * Blog/Projects → **direct FS** (one action \= one intent)

  * About → open in `MainPreviewTile` (Tiled); optional FS via “Maximize”

* Optional: dockable mini-sidebar in FS (toggle with `Alt+T`)

### **`<FocusedView/>` (FS/Zen)**

* Hosts active section content.

* **FS Chrome**: title/breadcrumbs, ☐ exit, optional prev/next (blogs), optional sidebar toggle.

* **Zen**: hides chrome; shows a tiny HUD for \~1.5s on input: “Zen — Esc to exit · ⌘K to jump · A/A- to resize text”.

* Edge glow hover affordance to hint exit.

### **`<ThemeModal/>`**

* Summoned via Theme tile or 🎨 icon/shortcut.

* Changes CSS vars for color scheme \+ accent; **not** visible as a tile in FS/Zen.

---

## **9\) Typography (Zen presets)**

* Max measure: **68–72ch**

* Base increase: **\+4–6%** font size in Zen

* Line-height: **1.6–1.75**

* Reader themes: **Light, Sepia, Dim** via class on `body.zen [data-reader-theme]`

---

## **10\) Shortcuts (must work)**

* `Esc`: Zen→FS→Tiled (one layer per press)

* `Z`: toggle Zen (only in FS, only if allowed)

* `⌘/Ctrl+K`: command palette / quick switcher (Zen \+ FS)

* `Alt+T`: toggle file tree sidebar in FS (optional)

* `[` `]`: previous/next blog post (FS/Zen)

---

## **11\) Persistence**

* Save per-section scroll position on mode exit.

* Save “preferred reading mode” (if user always toggles Zen for Blog, auto-enter Zen next time).

* Save last active section for desktop return.

---

## **12\) Performance constraints**

* Blur ≤ 6px; never animate `box-shadow` spread (fake with overlay opacity).

* Add `will-change` only during transition windows.

* Keep DOM of Tiled mounted under FS with `pointer-events: none` to avoid layout thrash.

---

## **13\) Accessibility**

* Reduced motion handling as above.

* Maintain focus order; when chrome hides (Zen), ensure content landmarks remain navigable.

* Sufficient contrast in all reader themes.

* Keyboard equivalents for all mouse actions.

---

## **14\) Acceptance criteria (QA)**

1. **Single-click FS**: Clicking a Blog/Project in file tree opens FS immediately (no second click).

2. **Two-layer exit**: `Esc` from Zen returns to FS with original scroll; second `Esc` returns to Tiled with grid intact.

3. **Edge context**: In FS, a 2–4% margin shows background; hovering near edge increases glow.

4. **Mode-specific radii**: 0px (Tiled) → 8px (FS) → 12px (Zen) animated.

5. **No Zen from Tiled**: Zen toggle disabled/invisible unless in FS \+ supported section.

6. **Theme modal**: opens everywhere via shortcut/icon; not a tile; never replaces content.

7. **Polybar behavior**: dim in FS; auto-hide in Zen; top-edge reveal works.

8. **Reduced motion**: all transitions collapse into instant state changes when enabled.

9. **Persistence**: reopen a blog after leaving returns to last read position; if “prefers Zen,” open directly to Zen.

10. **FPS sanity**: transitions stay smooth on mid-range hardware (no multi-reflow).

---

## **15\) Implementation checklist (tasks for Claude Code)**

* Create `ViewContext` (or Zustand store) with `mode`, `section`, `previousMode`, `canZen`, getters/setters, and guards.

* Implement `enterFullscreen(section)`, `exitToTiled()`, `toggleZen()` with guard clauses.

* Build `Polybar` with mode indicator, exit FS button, Zen toggle (conditionally enabled).

* Build `DesktopGrid` with tiles (AboutSummary, ContentTree, ThemeTile, MainPreview).

* Wire `ContentTree` click handlers per §5.

* Implement `FocusedView` with FS chrome \+ Zen HUD; animations per §6; edge affordance.

* Add `ThemeModal` invoked from Theme tile and global shortcut.

* Add CSS tokens for radii; Tailwind plugin classes if desired.

* Add reduced-motion media query branches.

* Add persistence layer (localStorage) for scroll \+ preferred mode.

* Write unit tests for guard logic; cypress tests for mode transitions and Esc stack.

---

## **16\) Motion presets (code you can reuse)**

// expand tile → fullscreen  
export const fxExpand \= {  
  initial: { scale: 0.98, opacity: 0.96 },  
  animate: { scale: 1, opacity: 1 },  
  transition: { type: 'spring', stiffness: 420, damping: 32, mass: 0.7 }  
};

export const fxGridDim \= {  
  initial: { opacity: 1, filter: 'blur(0px)' },  
  animate: { opacity: 0.25, filter: 'blur(6px)' },  
  transition: { duration: 0.22, ease: \[0.22, 1, 0.36, 1\] }  
};

export const fxCollapse \= {  
  animate: { scale: 0.98, opacity: 0.96 },  
  transition: { duration: 0.2, ease: \[0.2, 0, 0, 1\] }  
};

// chrome off (FS → Zen)  
export const fxChromeOff \= {  
  animate: { opacity: 0, y: \-6 },  
  transition: { duration: 0.16, ease: \[0.25, 0.46, 0.45, 0.94\] }  
};  
