# Window Manager Enhancement Specification

## Overview
This specification outlines the implementation of a true tiling window manager experience for the portfolio, embodying the core principles of ricing: **usability**, **minimalism**, **control**, and **personal aesthetic**.

## Core Principles

### 1. Usability
- **Quick Navigation**: Keyboard-driven with intuitive shortcuts
- **Context-Aware Visibility**: Show only what's needed, when needed
- **Smooth Transitions**: Fluid animations that don't impede workflow
- **Responsive Feedback**: Immediate visual response to user actions

### 2. Minimalism
- **Reduce Cognitive Load**: Hide non-essential tiles when focusing
- **Clean Visual Hierarchy**: Clear distinction between active/inactive elements
- **Purposeful Display**: Every visible element serves a current purpose

### 3. Control
- **User-Driven Layout**: Multiple layout modes (tiled, monocle, focus, zen)
- **Flexible Visibility**: Show/hide/minimize tiles as needed
- **Keyboard Shortcuts**: Power-user controls for efficient navigation
- **Preset Layouts**: Quick switching between common configurations

### 4. Personal Aesthetic
- **Theme Integration**: Respects user's theme choices
- **Background Control**: Toggle wallpaper visibility for eye comfort
- **Opacity Management**: Adjustable transparency for focus/context

## Layout Modes

### Tiled (Default)
- All four tiles visible in standard grid
- Equal importance to all tiles
- Traditional portfolio view

### Monocle
- Single tile maximized to full viewport
- Other tiles completely hidden
- Maximum focus on one task

### Focus
- Active tile at full opacity
- Surrounding tiles dimmed (30% opacity)
- Maintains spatial context while emphasizing focus

### Zen
- Single tile centered with padding
- Background wallpaper visible
- Reduced opacity (95%) for eye comfort
- Ideal for long reading/coding sessions

## Tile States

### Visibility States
- **visible**: Tile is shown and interactive
- **hidden**: Tile is completely removed from view
- **minimized**: Tile is reduced to minimal indicator
- **dimmed**: Tile is visible but de-emphasized

### Properties per State
- **opacity**: 0-1 (visual prominence)
- **zIndex**: Stacking order for overlaps
- **expanded**: Whether tile fills available space
- **interactive**: Can receive user input

## Keyboard Shortcuts

### Layout Controls
- `Ctrl/Cmd + 1`: Tiled layout
- `Ctrl/Cmd + 2`: Monocle layout
- `Ctrl/Cmd + 3`: Focus layout
- `Ctrl/Cmd + 4`: Zen layout

### Window Controls
- `Ctrl/Cmd + M`: Toggle maximize current tile
- `Ctrl/Cmd + Z`: Toggle zen mode
- `Ctrl/Cmd + H`: Hide current tile
- `Ctrl/Cmd + Shift + H`: Show all tiles

### Navigation
- `Alt + Tab`: Cycle through visible tiles
- `Alt + [1-4]`: Focus specific tile (neofetch, nav, content, theme)
- `Escape`: Return to default layout

### Presets
- `Ctrl/Cmd + Shift + 1`: Default preset
- `Ctrl/Cmd + Shift + 2`: Coding preset (hide neofetch, minimize theme)
- `Ctrl/Cmd + Shift + 3`: Reading preset (content only, zen mode)
- `Ctrl/Cmd + Shift + 4`: Minimal preset (nav + content only)

## Visual Indicators

### Focus Indicators
- **Border**: 2px accent color on focused tile
- **Shadow**: Subtle glow effect with accent color
- **Opacity**: Full opacity for focused, reduced for others
- **Z-index**: Elevated stacking for focused tile

### Hover States
- **Border highlight**: Accent color at 50% opacity
- **Cursor change**: Pointer for interactive areas
- **Transition**: 200ms ease-in-out for smooth feedback

### Mode Indicators
- **Polybar badge**: Current layout mode displayed
- **Background dim**: 50% black overlay in focus mode
- **Tile badges**: Minimize/maximize icons on hover

## Implementation Architecture

### Context Structure
```typescript
WindowManagerContext
├── State Management
│   ├── layoutMode: LayoutMode
│   ├── focusedTile: TileType | null
│   ├── maximizedTile: TileType | null
│   ├── tiles: Record<TileType, TileWindowState>
│   └── background: BackgroundState
│
├── Layout Controls
│   ├── setLayoutMode(mode)
│   ├── toggleMaximize(tile?)
│   └── toggleZenMode()
│
├── Tile Controls
│   ├── hideTile(tile)
│   ├── showTile(tile)
│   ├── minimizeTile(tile)
│   └── focusTile(tile)
│
└── Preset Management
    └── applyPresetLayout(preset)
```

### Integration with Existing Systems
- **FocusContext**: Maintains content/navigation state
- **ThemeContext**: Provides colors and visual preferences
- **WindowManagerContext**: New layer for layout/visibility control

### Component Updates Required
1. **LayoutManager**: Integrate WindowManagerContext for tile visibility
2. **BorderedContainer**: Apply tile-specific window states
3. **Polybar**: Add layout mode indicator and controls
4. **Individual Tiles**: Respect visibility/opacity states

## Mobile Considerations
- Simplified layout modes (stacked/parallax only)
- Touch gestures for tile switching
- Reduced keyboard shortcut set
- Auto-collapse to single tile on small screens

## Performance Optimizations
- CSS transforms for animations (GPU acceleration)
- Memoized tile components to prevent unnecessary re-renders
- Debounced resize handlers
- Lazy loading for hidden tiles

## Accessibility
- Screen reader announcements for mode changes
- Focus trap within maximized tiles
- Keyboard navigation fully functional
- High contrast mode compatibility

## Testing Strategy
1. Unit tests for context state management
2. Integration tests for keyboard shortcuts
3. Visual regression tests for layout modes
4. Performance benchmarks for animations
5. Accessibility audit with screen readers

## Migration Path
1. Create WindowManagerContext with basic state
2. Integrate with LayoutManager (non-breaking)
3. Add keyboard shortcuts progressively
4. Implement visual indicators
5. Add preset layouts
6. Full integration and cleanup

## Success Metrics
- Keyboard shortcut usage (analytics)
- Time spent in different layout modes
- User feedback on focus improvements
- Performance metrics (frame rate, CPU usage)
- Accessibility compliance score

## Future Enhancements
- Custom layout definitions
- Tile resizing with keyboard/mouse
- Multi-monitor support simulation
- Session state persistence
- Custom keyboard shortcut configuration
- Vim-style navigation bindings