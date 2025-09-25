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
- **Fonts**: Geist and Geist Mono from next/font/google
- **Theme**: Tokyo Night color palette with glass morphism effects

### Current Implementation

#### Tiled Layout System
The portfolio features a fixed 3-tile layout system that mimics Hyprland window manager:

1. **LayoutManager** (`components/RicedLayout/LayoutManager.tsx`)
   - Orchestrates the entire tiled interface
   - Desktop: Fixed 3-tile layout (50% left column split into two tiles, 50% right column)
   - Mobile: Tabbed interface with navigation buttons
   - Manages focus state between tiles
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

### Design System

#### Color Palette (Tokyo Night)
```css
#1a1b26 - Background dark
#24283b - Tile backgrounds (with 75% opacity)
#414868 - Default borders (50% opacity)
#7aa2f7 - Active/accent color (blue)
#a9b1d6 - Primary text
#565f89 - Dimmed text
#9ece6a - Success/green indicators
#7dcfff - Cyan accents
#bb9af7 - Purple accents
```

#### Spacing System
- Uniform 12px gaps between all elements
- Implemented using inline styles for consistency
- Tile borders: 2px for visibility
- Internal tile padding: p-6 (24px)

#### Responsive Breakpoints
- Desktop: ≥768px (full 3-tile layout)
- Mobile: <768px (tabbed interface)

### Key Implementation Details

1. **Focus Management**: Tiles have visual focus states with blue borders and shadows
2. **Glass Morphism**: `backdrop-blur-md` with semi-transparent backgrounds
3. **Animations**: Smooth transitions on focus changes and hover states
4. **Mobile UX**: Tab-based navigation with clear active states

### Common Tasks

#### Adding New Content Types
1. Update `ContentType` in `LayoutManager.tsx`
2. Add handling in `ContentViewer.tsx`
3. Update navigation items in `NavigationTile.tsx`
4. Add polybar navigation if needed

#### Adjusting Spacing
- All spacing uses inline styles with explicit pixel values
- Maintain 12px standard for consistency
- Test on both desktop and mobile layouts

#### Color Modifications
- Use Tokyo Night palette consistently
- Maintain opacity values for glass effect
- Ensure sufficient contrast for readability

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
- [ ] Dark/light theme toggle (Catppuccin variants)
- [ ] GitHub activity integration
- [ ] Live code editing in portfolio