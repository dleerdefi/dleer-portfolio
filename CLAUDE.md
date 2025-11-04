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

# Linting
npm run lint
```

## Project Architecture

This is a **Next.js 15.5.4** portfolio application with App Router, designed as a Hyprland/Arch Linux rice-inspired website with a tiled window manager aesthetic.

### Core Structure
- **Framework**: Next.js 15+ with App Router and Turbopack
- **Styling**: Tailwind CSS v4 (using @tailwindcss/postcss)
  - **CSS Architecture**: Modular CSS with 12 focused stylesheets
  - **Organization**: Each module under 650 LOC for maintainability
- **TypeScript**: Strict mode enabled with path aliases (@/* mapped to root)
- **Fonts**: Geist and Geist Mono from next/font/google, JetBrains Mono
- **Theme**: Dynamic theme system with Tokyo Night, Nord, and Solarized Light presets
- **State Management**: React Context API for theme and focus management

### CSS Architecture

The application uses a modular CSS architecture with styles split into 12 focused modules:

#### Module Structure (`app/styles/`)
1. **01-theme-variables.css** (182 lines) - Theme presets & CSS custom properties
2. **02-theme-effects.css** (49 lines) - Theme-specific visual effects & transitions
3. **03-fonts.css** (29 lines) - JetBrains Mono @font-face declarations
4. **04-terminal-theme.css** (103 lines) - Terminal color system & mappings
5. **05-base.css** (70 lines) - CSS reset, base styles & container utilities
6. **06-typography.css** (72 lines) - Links, headings, code blocks
7. **07-terminal-ui.css** (75 lines) - Terminal UI components & ASCII box drawing
8. **08-animations.css** (72 lines) - Keyframes & animation utilities
9. **09-utilities.css** (102 lines) - Responsive, spacing & touch utilities
10. **10-mobile.css** (133 lines) - Mobile-specific optimizations & safe areas
11. **11-glass-effects.css** (71 lines) - Glass morphism & visual effects
12. **12-blog-content.css** (624 lines) - Blog prose styling, MDX components, figures, admonitions, code blocks

The main `app/globals.css` file imports all modules in the correct cascade order.

### Current Implementation

#### Tiled Layout System
The portfolio features a fixed tiled layout system that mimics Hyprland window manager with dual-mode mobile support:

1. **LayoutManager** (`components/layout/LayoutManager.tsx`)
   - Enhanced version with focus context integration
   - Desktop: Fixed 6-tile layout (Neofetch, Navigation, Content, Theme Preset, Accent Color, Background)
   - Mobile: Dual-mode support (Stacked or Parallax)
   - Manages focus state through FocusContext
   - Dynamic tile opacity based on focus and theme
   - Uniform 12px spacing throughout (uses inline styles for reliability)
   - Automatically switches to MobileParallaxLayout when parallax mode is enabled

2. **Polybar** (`components/layout/Polybar.tsx`)
   - Workspace-style navigation bar at the top
   - Shows active workspace with dot indicators
   - Displays tile count and current time
   - Mobile: Hamburger menu with slide-out navigation
   - Height: 36px (h-9)

3. **NeofetchTile** (`components/tiles/NeofetchTile.tsx`)
   - Top-left tile displaying system-like information
   - ASCII art logo
   - Professional info styled as system specs
   - Padding: p-6 for proper text spacing

4. **NavigationTile** (`components/tiles/NavigationTile.tsx`)
   - Bottom-left tile with file tree navigation
   - Expandable directories for projects and blog
   - Visual indicators for active selection
   - Tree-style connectors for file hierarchy

5. **ContentViewer** (`components/tiles/ContentViewer.tsx`)
   - Right tile for content display
   - Handles multiple content types (home, about, projects, blog, contact)
   - Terminal-style rendering with syntax highlighting
   - Responsive content layout

6. **ThemePresetTile** (`components/tiles/ThemePresetTile.tsx`)
   - Theme preset switcher (Tokyo Night, Nord, Solarized Light)
   - Visual preview of each theme's color palette
   - Instant theme switching with smooth transitions

7. **AccentColorTile** (`components/tiles/AccentColorTile.tsx`)
   - 15 accent color swatches in responsive grid
   - Real-time accent color preview
   - Responsive touch targets (24-32px based on screen size)

8. **BackgroundTile** (`components/tiles/BackgroundTile.tsx`)
   - Background image selector with previews
   - 3 curated images per theme + None option
   - Background effect toggle (animated gradient orbs)
   - Mobile mode toggle (Stacked vs Parallax) - visible only on mobile

9. **Background** (`components/layout/Background.tsx`)
   - Animated gradient orbs
   - Creates glass morphism effect for tiles
   - Smooth, performant animations
   - Toggleable via BackgroundTile settings

10. **MobileParallaxLayout** (`components/layout/parallax/MobileParallaxLayout.tsx`)
   - Alternative mobile layout with parallax scrolling effects
   - Each tile has different scroll speeds for depth effect
   - Smooth transitions between tiles
   - Touch-optimized scrolling behavior
   - Activated via theme settings on mobile devices

11. **ScrollProgress** (`components/layout/parallax/ScrollProgress.tsx`)
   - Visual scroll position indicator for parallax mode
   - Shows current position in the scrollable content
   - Helps users understand their location in the parallax view

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
--accent-color     /* Dynamic accent from 15 options */
--accent-color-rgb /* RGB values for opacity */
```

##### Tokyo Night (Default Dark)
- Background: #1a1b26
- Surface: #16161e (tiles) / #1f2335 (alternative)
- Primary: #7aa2f7 (blue)
- Text: #c0caf5 (body) / #7aa2f7 (headers)
- Accent: #bb9af7 (purple - default)
- Success: #9ece6a / Warning: #e0af68 / Error: #f7768e

##### Nord (Arctic Dark)
- Background: #2E3440 (Polar Night)
- Surface: #3B4252 (raised elements)
- Primary: #88C0D0 (frost blue)
- Text: #D8DEE9 (Snow Storm) / #ECEFF4 (bright)
- Accent: #81A1C1 (blue - default)
- Success: #A3BE8C / Warning: #EBCB8B / Error: #BF616A

##### Solarized Light
- Background: #fdf6e3 (base3)
- Surface: #eee8d5 (base2)
- Primary: #268bd2 (blue)
- Text: #657b83 (base00) / #586e75 (base01)
- Accent: #d33682 (magenta - default)
- Success: #859900 / Warning: #b58900 / Error: #dc322f

#### Spacing System
- Uniform 12px gaps between all elements
- Implemented using inline styles for consistency
- Tile borders: 2px for visibility
- Internal tile padding: p-6 (24px)

#### Responsive Breakpoints
- Desktop: ≥1024px (full 4-tile layout)
- Mobile/Tablet: <1024px (dual-mode):
  - **Stacked Mode** (default): Traditional vertical scroll with all tiles
  - **Parallax Mode** (optional): Depth-based scrolling with different speeds per layer

### Key Implementation Details

1. **Focus Management**:
   - FocusContext manages tile and content navigation
   - Visual focus states with accent color borders and shadows
   - Keyboard navigation with Tab and Arrow keys
   - Auto-scroll to focused tiles in mobile view

2. **Theme System**:
   - CSS variables update dynamically on theme change
   - All colors use theme variables for consistency
   - Accent colors customizable independently
   - Light/dark mode support via Catppuccin Latte

3. **Glass Morphism**:
   - `backdrop-blur` with semi-transparent backgrounds
   - Dynamic opacity based on focus state and content type
   - Theme-aware transparency levels

4. **Mobile UX**:
   - **Dual-mode architecture**:
     - Stacked Mode: Traditional layout with smooth scrolling
     - Parallax Mode: Multi-layer scrolling with depth effects
   - Mode toggle in theme settings (mobile only)
   - Touch-optimized targets (minimum 24x24px, 32x32px on touch screens)
   - Auto-scroll to active content (stacked mode)
   - Parallax scroll indicators (parallax mode)
   - Responsive sizing for all interactive elements

### Common Tasks

#### Adding New Content Types
1. Update `ContentType` in `FocusContext.tsx`
2. Add handling in `ContentViewer.tsx`
3. Update navigation items in `NavigationTile.tsx`
4. Add polybar navigation if needed

#### Working with Themes
1. **Add new theme preset**:
   - Update `ThemeContext.tsx` with new preset colors
   - Add theme button in `ThemeTile.tsx`
   - Ensure all CSS variables are defined

2. **Modify accent colors**:
   - Edit color array in `ThemeTile.tsx`
   - Update `AccentColor` type in `ThemeContext.tsx`
   - Colors automatically apply via CSS variables

3. **Theme-aware components**:
   - Use `var(--theme-*)` CSS variables
   - Never hardcode colors directly
   - Use `rgba(var(--theme-*-rgb), opacity)` for transparency

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
3. **Mobile Testing**: Use responsive mode to test tabbed interface
4. **Performance**: Keep animations smooth with transform/opacity only
5. **CSS Changes**: When modifying styles, identify the correct module in `app/styles/`
6. **Module Size**: Keep individual CSS modules under 200 LOC for maintainability

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