# Profile Photo Feature Specification

## Overview

This document specifies the profile photo feature implementation for the portfolio, including placement strategy, responsive behavior, and Hyprland/rice aesthetic integration.

**Feature**: Display a vertical portrait photo (Shibuya, Japan) with window manager styling
**Primary Challenge**: Responsive placement across desktop (27" monitor, ThinkPad, MacBook) and mobile layouts
**Secondary Challenge**: Align with Hyprland/i3wm rice theme aesthetic

---

## Desktop Layout Architecture

### Full 4-Tile Desktop Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ POLYBAR (36px height)                                    [Workspace] [Time] │
├────────────────────────────────┬────────────────────────────────────────────┤
│                                │                                            │
│  ┌──────────────────────────┐  │  ┌──────────────────────────────────────┐ │
│  │                          │  │  │                                      │ │
│  │   NEOFETCH TILE          │  │  │   ┌─────────────────────────────┐  │ │
│  │   (40% height)           │  │  │   │ 🔴 🟡 🟢 shibuya.jpg       │  │ │
│  │                          │  │  │   ├─────────────────────────────┤  │ │
│  │   ASCII Logo             │  │  │   │                             │  │ │
│  │   System Info            │  │  │   │    PROFILE PHOTO            │  │ │
│  │                          │  │  │   │    (float-right)            │  │ │
│  └──────────────────────────┘  │  │   │    280-400px wide           │  │ │
│                                │  │   │                             │  │ │
│  ┌──────────────┬────────────┐ │  │   │    2:3 aspect ratio         │  │ │
│  │              │  ┌───────┐ │ │  │   │                             │  │ │
│  │              │  │Theme  │ │ │  │   └─────────────────────────────┘  │ │
│  │              │  │Preset │ │ │  │                                      │ │
│  │              │  │(15%)  │ │ │  │   CONTENT VIEWER                     │ │
│  │              │  └───────┘ │ │  │   (scrollable)                       │ │
│  │ NAVIGATION   │  ┌───────┐ │ │  │                                      │ │
│  │ TILE         │  │Accent │ │ │  │   Text wraps around photo on         │ │
│  │ (70% width)  │  │Color  │ │ │  │   desktop (lg: breakpoint)           │ │
│  │              │  │(35%)  │ │ │  │                                      │ │
│  │ (60% height) │  └───────┘ │ │  │   Bio paragraphs flow around         │ │
│  │              │  ┌───────┐ │ │  │   the floating image...              │ │
│  │              │  │Back-  │ │ │  │                                      │ │
│  │              │  │ground │ │ │  │   Tech grid clears float at          │ │
│  │              │  │(50%)  │ │ │  │   bottom with clear: both            │ │
│  │              │  └───────┘ │ │  │                                      │ │
│  └──────────────┴────────────┘ │  └──────────────────────────────────────┘ │
│          50% width              │              50% width                    │
└────────────────────────────────┴────────────────────────────────────────────┘
```

### Content Tile - Photo Integration Detail

```
┌────────────────────────────────────────────────────────────────┐
│ CONTENT VIEWER TILE (Right 50%)                                │
│ Padding: 24px | Scrollable overflow                            │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Hi, I'm David Leer           ┌───────────────────────────┐   │
│  ════════════════════          │ 🔴 🟡 🟢 shibuya.jpg     │   │
│                                ├───────────────────────────┤   │
│  I'm a full-stack engineer     │                           │   │
│  with 8+ years building        │                           │   │
│  scalable web applications.    │      PROFILE PHOTO        │   │
│  My expertise spans TypeScript │      (float-right)        │   │
│  React, and cloud architecture │                           │   │
│  ...                           │      280-400px width      │   │
│                                │      clamp responsive     │   │
│  Currently, I lead engineering │                           │   │
│  teams at [Company], where we  │      2:3 aspect           │   │
│  built systems serving millions│                           │   │
│  of users daily...             │      Window frame         │   │
│                                │      with border          │   │
│  Text flows naturally around   │                           │   │
│  the floating photo creating   │      Hover shows EXIF     │   │
│  an elegant magazine-style     │      metadata bar         │   │
│  layout that maintains         └───────────────────────────┘   │
│  readability...                                                │
│                                                                │
│  ═══════════════════════════════════════════════════════════   │
│  "Building products that users love, with code that            │
│   developers maintain."                                        │
│                                                                │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                   TECH GRID                              │  │
│  │  (clear: both - appears below photo)                     │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Desktop Dimensions by Device

#### 27" Monitor (2560×1440 @ 100% scaling)
```
Total viewport:    2560 × 1440px
Polybar height:    36px
Content area:      2560 × 1404px (minus polybar)
Padding (12px):    24px total horizontal, 24px vertical
Gap (12px):        12px between tiles

Left Column:       1258px × 1368px
  Neofetch:        1258px × 547px (40%)
  Bottom section:  1258px × 809px (60%)
    Navigation:    868px × 809px (70%)
    Theme column:  366px × 809px (30%)

Right Column:      1258px × 1368px
  Content tile:    1258px × 1368px
  Photo width:     400px (max, 35% of 1210px inner width)
  Photo height:    600px (2:3 ratio)
```

#### ThinkPad (1920×1200 @ 125% scaling → 1536×960 effective)
```
Total viewport:    1536 × 960px
Polybar height:    36px
Content area:      1536 × 924px (minus polybar)
Padding:           24px total horizontal, 24px vertical
Gap:               12px between tiles

Left Column:       750px × 888px
  Neofetch:        750px × 355px (40%)
  Bottom section:  750px × 521px (60%)
    Navigation:    513px × 521px (70%)
    Theme column:  225px × 521px (30%)

Right Column:      750px × 888px
  Content tile:    750px × 888px
  Photo width:     350px (35% of 702px inner width)
  Photo height:    525px (2:3 ratio)
```

#### MacBook Pro 14" (3024×1964 @ 200% scaling → 1512×982 effective)
```
Total viewport:    1512 × 982px
Polybar height:    36px
Content area:      1512 × 946px (minus polybar)
Padding:           24px total horizontal, 24px vertical
Gap:               12px between tiles

Left Column:       738px × 910px
  Neofetch:        738px × 364px (40%)
  Bottom section:  738px × 534px (60%)
    Navigation:    504px × 534px (70%)
    Theme column:  222px × 534px (30%)

Right Column:      738px × 910px
  Content tile:    738px × 910px
  Photo width:     280px (clamp minimum, 35% of 690px)
  Photo height:    420px (2:3 ratio)
```

---

## Mobile Layout Architecture

### Mobile Parallax/Stacked Layout (<1024px)

```
┌─────────────────────────────────────┐
│  POLYBAR (hamburger menu)           │
├─────────────────────────────────────┤
│                                     │
│  ┌───────────────────────────────┐ │
│  │                               │ │
│  │    NEOFETCH SECTION           │ │
│  │    (full-width)               │ │
│  │                               │ │
│  │    ASCII Logo                 │ │
│  │    System Info                │ │
│  │                               │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │                               │ │
│  │    NAVIGATION SECTION         │ │
│  │    (full-width)               │ │
│  │                               │ │
│  │    File tree navigation       │ │
│  │                               │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │  ABOUT CONTENT                │ │
│  │  ═══════════════════════       │ │
│  │                               │ │
│  │  Hi, I'm David Leer           │ │
│  │                               │ │
│  │  ┌─────────────────────────┐ │ │
│  │  │ 🔴 🟡 🟢 shibuya.jpg   │ │ │
│  │  ├─────────────────────────┤ │ │
│  │  │                         │ │ │
│  │  │                         │ │ │
│  │  │   PROFILE PHOTO         │ │ │
│  │  │   (full-width)          │ │ │
│  │  │   ~350px display        │ │ │
│  │  │                         │ │ │
│  │  │   2:3 aspect ratio      │ │ │
│  │  │                         │ │ │
│  │  │                         │ │ │
│  │  └─────────────────────────┘ │ │
│  │                               │ │
│  │  I'm a full-stack engineer    │ │
│  │  with 8+ years building       │ │
│  │  scalable web applications... │ │
│  │                               │ │
│  │  Currently, I lead...         │ │
│  │                               │ │
│  │  Tech Grid                    │ │
│  │                               │ │
│  └───────────────────────────────┘ │
│                                     │
│  [THEME SECTION]                    │
│  [OTHER SECTIONS...]                │
│                                     │
└─────────────────────────────────────┘
         Vertical Scroll
              ↓
```

### Mobile Dimensions

```
Mobile viewport:   375-768px width (typical smartphones/tablets)
Photo container:   100% width (minus tile padding)
Photo display:     ~350px typical render width
Aspect ratio:      2:3 (maintains portrait orientation)
Placement:         Between heading and bio paragraphs
Layout:            No float, block-level full-width
```

---

## Component Specifications

### ProfilePhoto Component

**Location**: `components/ui/ProfilePhoto.tsx`

#### Window Frame Structure

```
┌─────────────────────────────────────────┐
│ 🔴 🟡 🟢 shibuya_portrait.jpg         │ ← Title Bar (28px)
├─────────────────────────────────────────┤   Traffic Lights (12px)
│                                         │   Theme-aware bg
│                                         │
│                                         │
│           PHOTO CONTENT                 │
│           (Next.js Image)               │
│                                         │
│           aspect-ratio: 2/3             │
│                                         │
│                                         │
├─────────────────────────────────────────┤
│ Tokyo | f/1.8 | 1/125s | ISO 800       │ ← EXIF Bar (24px)
└─────────────────────────────────────────┘   Slides up on hover
```

#### Styling Details

**Border**:
- Width: 2px
- Color: `rgba(var(--accent-color-rgb), 0.3)` (default)
- Color (hover): `rgba(var(--accent-color-rgb), 0.5)`
- Transition: 300ms

**Title Bar**:
- Height: 28px
- Background: `rgba(var(--theme-surface-rgb), 0.9)`
- Border-bottom: `1px solid rgba(var(--accent-color-rgb), 0.2)`
- Font: Monospace, clamp(11px, 0.75rem, 14px)

**Traffic Lights** (macOS style):
- Size: 12px × 12px circles
- Spacing: 2px gap
- Colors (idle): `rgba(var(--theme-text-rgb), 0.3)`
- Colors (hover):
  - Red: `linear-gradient(135deg, #ff5f56 0%, #e0443e 100%)`
  - Yellow: `linear-gradient(135deg, #ffbd2e 0%, #e2a512 100%)`
  - Green: `linear-gradient(135deg, #27c93f 0%, #1fa831 100%)`

**Photo Container**:
- Background: `rgba(var(--theme-bg-rgb), 0.1)`
- Aspect ratio: Enforced via CSS `aspect-ratio: width / height`
- Image: Next.js Image component with `fill` and `object-cover`

**EXIF Status Bar**:
- Height: 0px (collapsed) → 24px (hover)
- Transition: 200ms ease-out
- Background: `rgba(var(--theme-bg-rgb), 0.95)`
- Border-top: `1px solid rgba(var(--accent-color-rgb), 0.2)` (when visible)
- Font: Monospace, clamp(10px, 0.65rem, 12px)
- Color: `var(--theme-text-dimmed)`
- Format: `Location | Aperture | Shutter | ISO`

**Shadow**:
- Default: `0 4px 12px rgba(0, 0, 0, 0.15)`
- Hover: `0 8px 24px rgba(0, 0, 0, 0.2)`

---

### Integration in AboutContent

**Location**: `components/tiles/content/AboutContent.tsx`

#### Implementation

```tsx
{/* Profile Photo - Float right on desktop, full-width on mobile */}
{personal.profilePhoto && (
  <div className="mb-4 lg:float-right lg:ml-6 lg:mb-6 lg:w-[clamp(280px,35%,400px)]">
    <ProfilePhoto
      src={personal.profilePhoto.src}
      alt={personal.profilePhoto.alt}
      width={personal.profilePhoto.width}
      height={personal.profilePhoto.height}
      exif={personal.profilePhoto.exif}
    />
  </div>
)}

{/* Bio paragraphs naturally wrap around floated photo */}
{personal.bio.intro && (
  <p className="leading-relaxed">
    {personal.bio.intro}
  </p>
)}

{/* Tagline clears float */}
<p className="italic pt-1 border-t" style={{ clear: 'both' }}>
  {personal.bio.tagline}
</p>

{/* Tech grid clears float */}
<div style={{ clear: 'both' }}>
  <AboutTechGrid />
</div>
```

#### Responsive Behavior

**Desktop (lg: ≥1024px)**:
- `float-right`: Photo floats to right side
- `ml-6`: 1.5rem (24px) left margin for text spacing
- `mb-6`: 1.5rem (24px) bottom margin
- `w-[clamp(280px,35%,400px)]`: Dynamic width
  - Minimum: 280px (MacBook Pro 14")
  - Preferred: 35% of container width
  - Maximum: 400px (27" monitor)

**Mobile (<1024px)**:
- `mb-4`: 1rem (16px) bottom margin
- Full-width: No float, natural block layout
- Appears between heading and first bio paragraph

#### Float Clearing Strategy

- **Tagline**: `clear: 'both'` ensures it appears below photo
- **Tech Grid**: Wrapped in div with `clear: 'both'`
- Prevents layout overflow and maintains proper vertical rhythm

---

## Configuration

### Type Definition

**Location**: `config/types.ts`

```typescript
export interface PersonalInfo {
  name: string;
  username: string;
  greeting?: string;
  title: string;
  subtitle: string;
  email: string;
  contactEmail: string;
  location: string;
  profilePhoto?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    exif?: {
      location?: string;
      aperture?: string;
      shutter?: string;
      iso?: string;
    };
  };
  bio: {
    intro?: string;
    experience?: string;
    leadership?: string;
    tagline?: string;
  };
}
```

### Portfolio Config

**Location**: `config/portfolio.config.ts`

```typescript
profilePhoto: {
  src: process.env.NEXT_PUBLIC_PROFILE_PHOTO || "/images/profile/shibuya-portrait.webp",
  alt: "David Leer in Shibuya, Tokyo",
  width: 400,
  height: 600,
  exif: {
    location: "Tokyo, Japan",
    aperture: "f/1.8",
    shutter: "1/125s",
    iso: "800"
  }
},
```

**Environment Variable Override**:
- Set `NEXT_PUBLIC_PROFILE_PHOTO` to use custom path
- Useful for different environments or CDN hosting

---

## Image Specifications

### Required Files

Add to `/public/images/profile/`:
- `shibuya-portrait.webp` - Primary optimized version
- `shibuya-portrait.jpg` - Optional fallback

### Dimensions

**Source Image**:
- Width: 800-1000px
- Height: 1200-1500px
- Aspect Ratio: 2:3 or 3:4 (vertical portrait)

**Display Sizes**:
- Desktop 27": ~400px width
- Desktop ThinkPad: ~350px width
- Desktop MacBook: ~280px width
- Mobile: ~350px width (full container)

### Optimization

**Format**: WebP (primary)
- Quality: 80-85%
- Target size: < 150KB
- Compression: Lossy with sharp edges preserved

**Format**: JPG (fallback)
- Quality: 85%
- Progressive encoding
- Target size: < 200KB

### Optimization Commands

#### Using sharp-cli (Recommended)
```bash
npm install -g sharp-cli
sharp -i shibuya-portrait.jpg -o shibuya-portrait.webp --webp '{"quality": 85}'
```

#### Using ImageMagick
```bash
convert shibuya-portrait.jpg \
  -resize 1000x1500 \
  -quality 85 \
  shibuya-portrait.webp
```

#### Using cwebp (Google's WebP encoder)
```bash
cwebp -q 85 shibuya-portrait.jpg -o shibuya-portrait.webp
```

### Online Tools
- [Squoosh](https://squoosh.app/) - Google's image optimizer
- [TinyPNG](https://tinypng.com/) - JPG/PNG compression
- [CloudConvert](https://cloudconvert.com/) - Format conversion

---

## EXIF Metadata

### Current Placeholder Data

```typescript
exif: {
  location: "Tokyo, Japan",
  aperture: "f/1.8",
  shutter: "1/125s",
  iso: "800"
}
```

### Updating with Real Data

1. **Extract EXIF from original photo**:
   ```bash
   exiftool shibuya-portrait.jpg | grep -E "(Aperture|Shutter|ISO)"
   ```

2. **Update in `config/portfolio.config.ts`**:
   ```typescript
   exif: {
     location: "Shibuya, Tokyo",  // Actual location
     aperture: "f/2.8",            // From camera metadata
     shutter: "1/60s",             // From camera metadata
     iso: "1600"                   // From camera metadata
   }
   ```

3. **Format Guidelines**:
   - Location: City, Country or Landmark name
   - Aperture: `f/X.X` format
   - Shutter: `1/Xs` or `Xs` format
   - ISO: Numeric value as string

---

## Testing Checklist

### Desktop Layout

- [ ] **27" Monitor**:
  - [ ] Photo displays at 400px width
  - [ ] Text wraps smoothly around photo
  - [ ] No layout overflow or awkward gaps
  - [ ] Tagline appears below photo (cleared float)
  - [ ] Tech grid appears below cleared content

- [ ] **ThinkPad (1536×960)**:
  - [ ] Photo displays at ~350px width
  - [ ] Adequate spacing around photo (24px margins)
  - [ ] Readable text flow around image
  - [ ] No content crowding

- [ ] **MacBook Pro 14" (1512×982)**:
  - [ ] Photo clamps to 280px minimum width
  - [ ] Photo maintains 2:3 aspect ratio
  - [ ] Text wrap still functional at minimum size
  - [ ] Float clearing works properly

### Mobile Layout

- [ ] **Smartphone (375-414px)**:
  - [ ] Photo appears full-width (minus padding)
  - [ ] Photo positioned between heading and bio
  - [ ] No horizontal scroll
  - [ ] Touch targets functional (EXIF hover becomes tap)

- [ ] **Tablet (768-1024px)**:
  - [ ] Photo displays appropriately sized
  - [ ] Layout switches to mobile before 1024px breakpoint
  - [ ] Smooth transition between layouts

### Window Frame Styling

- [ ] **Title Bar**:
  - [ ] Traffic lights appear correctly sized (12px)
  - [ ] Traffic lights show gradients on hover
  - [ ] Filename displays with underscores (shibuya_portrait.jpg)
  - [ ] Theme colors apply correctly

- [ ] **EXIF Status Bar**:
  - [ ] Hidden by default (height: 0)
  - [ ] Slides up smoothly on hover (200ms)
  - [ ] Displays all metadata fields
  - [ ] Monospace font renders correctly
  - [ ] Border appears when visible

- [ ] **Border & Shadow**:
  - [ ] Border uses accent color with opacity
  - [ ] Border intensifies on hover (0.3 → 0.5)
  - [ ] Shadow deepens on hover
  - [ ] Transitions smooth (300ms)

### Theme Integration

- [ ] **Tokyo Night**:
  - [ ] Title bar background matches theme surface
  - [ ] Border uses purple accent (default)
  - [ ] EXIF text uses dimmed color
  - [ ] Overall contrast appropriate

- [ ] **Nord**:
  - [ ] Arctic color palette applied
  - [ ] Blue accent colors work
  - [ ] Sufficient contrast in dark theme

- [ ] **Solarized Light**:
  - [ ] Light theme colors inverted properly
  - [ ] Photo border visible against light background
  - [ ] Text remains readable
  - [ ] EXIF bar contrast maintained

### Image Optimization

- [ ] **File Size**:
  - [ ] WebP version < 150KB
  - [ ] JPG fallback < 200KB (if provided)

- [ ] **Visual Quality**:
  - [ ] No visible compression artifacts
  - [ ] Sharp edges preserved (face, buildings)
  - [ ] Color accuracy maintained
  - [ ] Progressive loading works

### Accessibility

- [ ] **Alt Text**:
  - [ ] Descriptive alt text provided
  - [ ] Alt text includes context (location)

- [ ] **Keyboard Navigation**:
  - [ ] Photo doesn't trap focus
  - [ ] EXIF visible via keyboard interaction (if applicable)

- [ ] **Screen Readers**:
  - [ ] Alt text announced properly
  - [ ] EXIF metadata accessible

---

## Implementation Summary

### Files Created
- `components/ui/ProfilePhoto.tsx` - Window frame photo component
- `docs/PROFILE_PHOTO_FEATURE_SPEC.md` - This specification

### Files Modified
- `config/types.ts` - Added `profilePhoto` to `PersonalInfo` interface
- `config/portfolio.config.ts` - Added photo configuration
- `components/tiles/content/AboutContent.tsx` - Integrated photo with float layout

### Files Required (User Action)
- `/public/images/profile/shibuya-portrait.webp` - Actual photo file
- `/public/images/profile/shibuya-portrait.jpg` - Optional JPG fallback

---

## Design Rationale

### Placement Decision: Inline in AboutContent

**Why not Neofetch tile replacement?**
- Loses core rice aesthetic identity
- Height constraints problematic on smaller screens (MacBook: 364px available)
- Vertical photo needs ~400-600px for quality display

**Why not 5th tile?**
- Navigation becomes too cramped (~270-400px width)
- Photo tile too small (~230-345px width)
- Breaks established 50-50 grid balance

**Why inline with float-right?**
- ✅ Scrollable content = no height constraints
- ✅ Works across all screen sizes without restructuring
- ✅ Contextually appropriate (appears in About section)
- ✅ Magazine-style layout feels natural and professional
- ✅ Mobile transition clean (float → full-width block)

### Window Manager Aesthetic

**Hyprland/i3wm Inspiration**:
- Tiled windows with borders
- Minimalist title bars
- Status bars with system information
- Keyboard-driven interaction

**Applied to Photo**:
- Window frame with accent-colored border
- macOS-style traffic lights (familiar tiling WM element)
- EXIF metadata as status bar (mimics terminal info displays)
- Hover interactions (modern polish on rice aesthetic)

### Responsive Strategy

**Desktop (≥1024px)**:
- Float-right with text wrap (magazine layout)
- Dynamic width via clamp() (adapts to screen size)
- Generous spacing (24px margins)

**Mobile (<1024px)**:
- Full-width block layout (no float)
- Positioned between heading and bio
- Touch-friendly sizing (~350px typical)

**Why this approach?**
- Leverages CSS float for natural text flow
- Single codebase for both layouts (Tailwind breakpoints)
- No JavaScript required for layout switching
- Graceful degradation across devices

---

## Future Enhancements

### Potential Improvements
- [ ] Multiple photo variants for art direction (different crops at breakpoints)
- [ ] Lazy loading with blur-up placeholder
- [ ] Photo gallery integration (multiple photos from Japan)
- [ ] Parallax depth effect on mobile bio section
- [ ] Click to expand fullscreen view
- [ ] Swap photos based on active theme

### Performance Optimizations
- [ ] Preload critical images above the fold
- [ ] Serve different resolutions via `srcset`
- [ ] CDN hosting for faster delivery
- [ ] AVIF format support (smaller than WebP)

---

## References

### Component Files
- [ProfilePhoto.tsx](../components/ui/ProfilePhoto.tsx) - Photo component
- [AboutContent.tsx](../components/tiles/content/AboutContent.tsx) - Integration point
- [types.ts](../config/types.ts) - Type definitions
- [portfolio.config.ts](../config/portfolio.config.ts) - Configuration

### Related Documentation
- [CLAUDE.md](../CLAUDE.md) - Project architecture
- [DESKTOP_SCALING_REFACTOR_SPEC.md](./DESKTOP_SCALING_REFACTOR_SPEC.md) - Scaling system

### Design References
- Hyprland window manager styling
- i3wm tiling aesthetics
- macOS window chrome (traffic lights)
- Terminal status bars (EXIF display)
