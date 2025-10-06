# Tiled Layout Enhancement Specification

## Executive Summary

This document analyzes proposed UI improvements for the Hyprland/Unix-inspired tiled layout system and provides implementation recommendations based on technical feasibility, user experience, and architectural alignment.

## Current Architecture Analysis

### Technology Stack
- **Framework**: Next.js 15.5.4 with React 19.1.0
- **Animation**: Framer Motion 12.23.22
- **Styling**: Tailwind CSS v4 with CSS modules
- **State Management**: React Context API (FocusContext, ThemeContext)

### Current Implementation
- Fixed 4-tile desktop layout (50/50 split with nested tiles)
- Responsive breakpoint at 1024px
- Framer Motion LayoutGroup for smooth transitions
- Glass morphism effects with dynamic opacity
- 12px uniform spacing via inline styles
- Rounded corners (8-10px radius) on all tiles

## Proposed Features Analysis

### 1. Remove Rounded Corners (90-degree edges)
**Feasibility**: ✅ **EASY**
- Currently using `rounded-lg` Tailwind classes and inline `borderRadius` styles
- Simple change in LayoutManager.tsx animation properties
- Aligns perfectly with authentic tiling WM aesthetic

**Implementation**:
```tsx
// Change from:
borderRadius: '10px'
// To:
borderRadius: '0px'
```

**Recommendation**: **IMPLEMENT IMMEDIATELY** - Low effort, high aesthetic impact

---

### 2. Resizable Tiles with Smart Constraints
**Feasibility**: ⚠️ **MODERATE-COMPLEX**

**Pros**:
- Framer Motion supports drag gestures and constraints
- Can implement resize handles at tile edges
- Possible to maintain grid alignment with snap points

**Cons**:
- Current architecture uses fixed percentages (50%, 70%, 30%)
- Would require refactoring to flexible grid system
- Need to handle minimum/maximum sizes per tile type
- Complex state management for persisting layouts

**Implementation Approach**:
```tsx
// Use CSS Grid with dynamic track sizes
display: 'grid'
gridTemplateColumns: `${leftWidth}fr ${rightWidth}fr`
gridTemplateRows: `${topHeight}fr ${bottomHeight}fr`

// Add resize handles with framer-motion drag
<motion.div
  drag="x"
  dragConstraints={constraints}
  onDrag={handleResize}
  className="resize-handle"
/>
```

**Recommendation**: **PHASE 2** - Implement after core improvements

---

### 3. Draggable/Floating Tiles
**Feasibility**: ⚠️ **COMPLEX**

**Pros**:
- Framer Motion has excellent drag support
- Could create "floating mode" toggle
- Interesting for showcasing specific content

**Cons**:
- Breaks tiling WM paradigm (tiling WMs don't have floating windows by default)
- Z-index management complexity
- Would need window management system (focus, stacking order)
- Mobile UX concerns

**Alternative Approach**:
Instead of free-floating, implement **"maximized mode"** where clicking a maximize button makes a tile fullscreen with others minimized to polybar.

**Recommendation**: **RECONSIDER** - Implement maximize/minimize instead

---

### 4. Enhanced Polybar with Minimize/Restore
**Feasibility**: ✅ **EASY-MODERATE**

**Excellent Fit** for tiling WM aesthetic:
- Minimized tiles appear as icons/badges in polybar
- Click to restore to original position
- Animation with Framer Motion's AnimatePresence

**Implementation**:
```tsx
// In Polybar.tsx
const minimizedTiles = [
  { id: 'neofetch', icon: '◼', label: 'about' },
  // ... minimized tiles
];

// In LayoutManager.tsx
<AnimatePresence>
  {!minimizedTiles.includes('neofetch') && (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
    >
      <NeofetchTile />
    </motion.div>
  )}
</AnimatePresence>
```

**Recommendation**: **IMPLEMENT** - High value, authentic to WM paradigm

---

## Recommended Implementation Plan

### Phase 1: Quick Wins (1-2 hours)
1. **Remove rounded corners** ✅
   - Update all borderRadius to 0
   - Test visual hierarchy without rounds
   - Adjust border styles if needed

2. **Add minimize/maximize buttons** ✅
   - Add control buttons to tile headers
   - Implement minimize to polybar
   - Add maximize to fullscreen

### Phase 2: Core Enhancements (4-6 hours)
1. **Polybar tile management**
   - Show minimized tiles as workspace indicators
   - Restore animation with proper positioning
   - Persist state in localStorage

2. **Keyboard shortcuts**
   - Mod+M: Minimize focused tile
   - Mod+F: Maximize/fullscreen toggle
   - Mod+R: Reset to default layout

### Phase 3: Advanced Features (8-12 hours)
1. **Constrained resize system**
   - Implement resize handles between tiles
   - Maintain total viewport coverage
   - Smart minimum sizes based on content
   - Save layout preferences

2. **Layout presets**
   - Default (current 50/50)
   - Focus mode (80/20)
   - Dashboard (equal quarters)
   - Saved custom layouts

## Alternative Architecture: Parallax as Default

### Consideration for Future
Instead of complex tile management, consider:
1. **Parallax as primary layout** for both desktop and mobile
2. **Tiled layout as "Classic Mode"** accessible via theme settings
3. Benefits:
   - Unified codebase
   - Better mobile-first approach
   - Simpler state management
   - More modern feel

## Technical Recommendations

### Do Implement
1. **Sharp corners** - Immediate, authentic WM feel
2. **Minimize/maximize** - Natural WM behavior
3. **Polybar enhancements** - Central control panel
4. **Keyboard shortcuts** - Power user features

### Don't Implement (Yet)
1. **Free floating tiles** - Breaks tiling paradigm
2. **Complex resize** without proper grid system
3. **Drag and drop** - Not authentic to tiling WMs

### Consider Instead
1. **Workspace switching** - Multiple tile layouts
2. **Split/merge tiles** - i3/Hyprland style
3. **Focus follows mouse** - True WM behavior
4. **Tiling animations** - Smooth reflow on layout change

## CSS Architecture Changes

### Required Updates
```css
/* In 04-terminal-theme.css */
--border-radius: 0; /* was 8px */
--border-radius-lg: 0; /* was 12px */

/* Add new utility classes */
.tile-sharp {
  border-radius: 0 !important;
}

.resize-handle {
  cursor: ew-resize;
  width: 4px;
  background: var(--accent-color);
  opacity: 0;
  transition: opacity 0.2s;
}

.resize-handle:hover {
  opacity: 0.5;
}
```

## State Management Considerations

### New Context Requirements
```typescript
interface LayoutContext {
  minimizedTiles: Set<string>;
  maximizedTile: string | null;
  layoutPreset: 'default' | 'focus' | 'dashboard' | 'custom';
  customLayout?: GridDimensions;
  toggleMinimize: (tileId: string) => void;
  toggleMaximize: (tileId: string) => void;
  setLayoutPreset: (preset: string) => void;
}
```

## Conclusion

The most impactful improvements that maintain the authentic tiling WM aesthetic are:

1. **Immediate**: Remove rounded corners
2. **High Priority**: Polybar minimize/restore system
3. **Medium Priority**: Maximize/fullscreen mode
4. **Future**: Consider parallax as primary with tiled as optional

These changes enhance the Hyprland/Unix aesthetic while maintaining clean, professional code architecture. The minimize/maximize paradigm is more authentic to tiling WMs than floating windows and provides better UX.

## Next Steps

1. Implement sharp corners (5 minutes)
2. Design minimize/maximize UI controls
3. Prototype polybar tile indicators
4. User test the enhanced interactions
5. Decide on parallax vs. tiled as default