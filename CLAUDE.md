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
```

**Note**: No lint or typecheck scripts are currently configured in package.json. Consider adding:
- `npm run lint` for code linting
- `npm run typecheck` or `npx tsc --noEmit` for TypeScript type checking

## Project Architecture

This is a **Next.js 15.5.4** portfolio application with App Router, designed as a Hyprland/Arch Linux rice-inspired website with a tiled window manager aesthetic.

### Core Structure
- **Framework**: Next.js 15+ with App Router and Turbopack
- **Styling**: Tailwind CSS v4 (using @tailwindcss/postcss)
- **TypeScript**: Strict mode enabled with path aliases (@/* mapped to root)
- **Fonts**: Geist and Geist Mono from next/font/google, JetBrains Mono
- **Theme**: Dynamic theme system with Tokyo Night, Nord, and Solarized Light presets
- **State Management**: React Context API for theme and focus management

### Current Implementation

#### Tiled Layout System
The portfolio features a fixed tiled layout system that mimics Hyprland window manager with dual-mode mobile support:

1. **LayoutManager** (`components/RicedLayout/LayoutManager.tsx`)
   - Enhanced version with focus context integration
   - Desktop: Fixed 4-tile layout (Neofetch, Navigation, Theme, Content)
   - Mobile: Dual-mode support (Stacked or Parallax)
   - Manages focus state through FocusContext
   - Dynamic tile opacity based on focus and theme
   - Uniform 12px spacing throughout (uses inline styles for reliability)
   - Automatically switches to MobileParallaxLayout when parallax mode is enabled

2. **Polybar** (`components/RicedLayout/Polybar.tsx`)
   - Workspace-style navigation bar at the top
   - Shows active workspace with dot indicators
   - Displays tile count and current time
   - Mobile: Hamburger menu with slide-out navigation
   - Height: 36px (h-9)

3. **NeofetchTile** (`components/RicedLayout/NeofetchTile.tsx`)
   - Top-left tile displaying system-like information
   - ASCII art logo
   - Professional info styled as system specs
   - Padding: p-6 for proper text spacing

4. **NavigationTile** (`components/RicedLayout/NavigationTile.tsx`)
   - Bottom-left tile with file tree navigation
   - Expandable directories for projects and blog
   - Visual indicators for active selection
   - Tree-style connectors for file hierarchy

5. **ContentViewer** (`components/RicedLayout/ContentViewer.tsx`)
   - Right tile for content display
   - Handles multiple content types (home, about, projects, blog, contact)
   - Terminal-style rendering with syntax highlighting
   - Responsive content layout

6. **Background** (`components/RicedLayout/Background.tsx`)
   - Animated gradient orbs
   - Creates glass morphism effect for tiles
   - Smooth, performant animations
   - Toggleable via theme settings

7. **ThemeTile** (`components/RicedLayout/ThemeTile.tsx`)
   - Theme preset switcher (Tokyo Night, Nord, Solarized Light)
   - 15 accent color options in responsive grid
   - Background effect toggle
   - Mobile mode toggle (Stacked vs Parallax) - visible only on mobile
   - Responsive touch targets (24-32px based on screen size)

8. **MobileParallaxLayout** (`components/RicedLayout/MobileParallaxLayout.tsx`)
   - Alternative mobile layout with parallax scrolling effects
   - Each tile has different scroll speeds for depth effect
   - Smooth transitions between tiles
   - Touch-optimized scrolling behavior
   - Activated via theme settings on mobile devices

9. **ScrollProgress** (`components/RicedLayout/ScrollProgress.tsx`)
   - Visual scroll position indicator for parallax mode
   - Shows current position in the scrollable content
   - Helps users understand their location in the parallax view

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

### Future Enhancements (Planned)
- [ ] MDX blog system integration
- [ ] Project detail pages with live demos
- [ ] Command palette for keyboard navigation
- [ ] More terminal effects (typing animation, matrix rain)
- [x] Dark/light theme toggle (Tokyo Night/Nord dark, Solarized light) - COMPLETED
- [x] Mobile parallax scrolling mode - COMPLETED
- [ ] GitHub activity integration
- [ ] Live code editing in portfolio
- [ ] Vim-style keyboard navigation
- [ ] Custom theme creator
- [ ] Settings persistence (localStorage)