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

## Project Architecture

This is a **Next.js 15.5.4** portfolio application with App Router, designed as a Hyprland/Arch Linux rice-inspired website with a tiled window manager aesthetic.

### Core Structure
- **Framework**: Next.js 15+ with App Router and Turbopack
- **Styling**: Tailwind CSS v4 (using @tailwindcss/postcss)
- **TypeScript**: Strict mode enabled with path aliases (@/* mapped to root)
- **Fonts**: Geist and Geist Mono from next/font/google, JetBrains Mono
- **Theme**: Dynamic theme system with Tokyo Night, Catppuccin Mocha, and Catppuccin Latte presets
- **State Management**: React Context API for theme and focus management

### Current Implementation

#### Tiled Layout System
The portfolio features a fixed tiled layout system that mimics Hyprland window manager:

1. **LayoutManagerWithFocus** (`components/RicedLayout/LayoutManagerWithFocus.tsx`)
   - Enhanced version with focus context integration
   - Desktop: Fixed 4-tile layout (Neofetch, Navigation, Theme, Content)
   - Mobile: Stacked layout with smooth scrolling
   - Manages focus state through FocusContext
   - Dynamic tile opacity based on focus and theme
   - Uniform 12px spacing throughout (uses inline styles for reliability)

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
   - Theme preset switcher (Tokyo Night, Catppuccin Mocha, Catppuccin Latte)
   - 15 accent color options in responsive grid
   - Background effect toggle
   - Responsive touch targets (24-32px based on screen size)

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

##### Tokyo Night (Default)
- Background: #1a1b26
- Surface: #24283b
- Primary: #7aa2f7
- Text: #a9b1d6

##### Catppuccin Mocha
- Background: #1e1e2e
- Surface: #313244
- Primary: #89b4fa
- Text: #cdd6f4

##### Catppuccin Latte (Light)
- Background: #eff1f5
- Surface: #e6e9ef
- Primary: #1e66f5
- Text: #4c4f69

#### Spacing System
- Uniform 12px gaps between all elements
- Implemented using inline styles for consistency
- Tile borders: 2px for visibility
- Internal tile padding: p-6 (24px)

#### Responsive Breakpoints
- Desktop: ≥1024px (full 4-tile layout)
- Mobile/Tablet: <1024px (stacked layout with scrolling)

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
   - Stacked layout with smooth scrolling
   - Touch-optimized targets (minimum 24x24px, 32x32px on touch screens)
   - Auto-scroll to active content
   - Responsive sizing for all interactive elements

### Common Tasks

#### Adding New Content Types
1. Update `ContentType` in `FocusContext.tsx`
2. Add handling in `ContentViewerWithFocus.tsx`
3. Update navigation items in `NavigationTileWithFocus.tsx`
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

### Future Enhancements (Planned)
- [ ] MDX blog system integration
- [ ] Project detail pages with live demos
- [ ] Command palette for keyboard navigation
- [ ] More terminal effects (typing animation, matrix rain)
- [x] Dark/light theme toggle (Catppuccin variants) - COMPLETED
- [ ] GitHub activity integration
- [ ] Live code editing in portfolio
- [ ] Vim-style keyboard navigation
- [ ] Custom theme creator
- [ ] Settings persistence (localStorage)