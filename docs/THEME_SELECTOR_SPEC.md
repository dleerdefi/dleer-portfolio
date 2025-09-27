# Theme Selector Tile Specification

## Executive Summary

This specification outlines the implementation of a dynamic theme selector tile for the Tile Portfolio Template, inspired by jasoncameron.dev. The feature introduces a fourth tile to the desktop layout, providing users with real-time theme customization through color palette selection and preset theme switching. The implementation includes advanced animations: smooth transitions on desktop and a distinctive circle expansion effect on mobile devices.

### Key Features:
1. **New Theme Tile** - 15% width tile in desktop layout, stacked in mobile
2. **Color Palette Selector** - 14 customizable accent colors
3. **Theme Presets** - Tokyo Night, Catppuccin Mocha, Catppuccin Latte
4. **Advanced Animations** - Circle expansion on mobile, smooth transitions on desktop
5. **Persistent Preferences** - LocalStorage-based theme persistence

## 1. Current State Analysis

### 1.1 Existing Layout Structure

#### Desktop Layout (≥1024px)
```
Current Structure:
┌─────────────────┬─────────────────┐
│                 │                 │
│  Left Column    │   Content Tile  │
│     (50%)       │      (50%)      │
│                 │                 │
│ ┌─────────────┐ │                 │
│ │  Neofetch   │ │                 │
│ │   (40%)     │ │                 │
│ ├─────────────┤ │                 │
│ │ Navigation  │ │                 │
│ │   (60%)     │ │                 │
│ └─────────────┘ │                 │
└─────────────────┴─────────────────┘
```

#### Mobile/Stacked Layout (<1024px)
```
Current Stack Order:
1. Polybar (sticky top)
2. NeofetchTile
3. NavigationTile
4. ContentViewer
```

### 1.2 Current Theme System

The application currently uses Tokyo Night theme with CSS variables:
- Hard-coded in `app/globals.css`
- No runtime theme switching
- No user customization options
- Colors defined as CSS custom properties

### 1.3 Focus Management
- Three tiles: 'neofetch', 'navigation', 'content'
- Tab navigation cycles through tiles
- Visual focus indicators (border highlight)
- FocusContext manages state

## 2. Design Requirements

### 2.1 Layout Modifications

#### New Desktop Layout
```
Proposed Structure:
┌─────────────────┬──────────────┬──────────┐
│                 │              │          │
│  Left Column    │ Content Tile │  Theme   │
│     (50%)       │    (35%)     │  (15%)   │
│                 │              │          │
│ ┌─────────────┐ │              │          │
│ │  Neofetch   │ │              │          │
│ │   (40%)     │ │              │          │
│ ├─────────────┤ │              │          │
│ │ Navigation  │ │              │          │
│ │   (60%)     │ │              │          │
│ └─────────────┘ │              │          │
└─────────────────┴──────────────┴──────────┘
```

#### Mobile/Stacked Layout Update
```
New Stack Order:
1. Polybar (sticky top)
2. NeofetchTile
3. NavigationTile
4. ContentViewer
5. ThemeTile (new)
```

### 2.2 Theme Tile Components

Based on jasoncameron.dev analysis:

#### Color Palette Grid
- 2 rows × 7 columns = 14 colors
- Each color ~40px × 40px (desktop)
- Hover effects and active state
- Border radius for modern look

#### Theme Preset Buttons
- Three preset options displayed as buttons
- Active theme highlighted
- Text labels: "Latte", "Mocha", "Tokyo Night"

#### Background Effect Toggle
- Checkbox/toggle for background effects
- Label: "Background effect: on/off"

### 2.3 Supported Themes

#### Tokyo Night (Current/Darkest)
```css
Background: #1a1b26
Surface: #24283b
Primary: #7aa2f7
Text: #a9b1d6
```

#### Catppuccin Mocha (Medium Dark)
```css
Background: #1e1e2e
Surface: #313244
Primary: #89b4fa
Text: #cdd6f4
```

#### Catppuccin Latte (Light)
```css
Background: #eff1f5
Surface: #e6e9ef
Primary: #1e66f5
Text: #4c4f69
```

## 3. Technical Architecture

### 3.1 Component Hierarchy

```
App
├── ThemeProvider (new)
│   └── FocusProvider
│       └── LayoutManagerWithFocus
│           ├── Polybar
│           ├── NeofetchTile
│           ├── NavigationTile
│           ├── ContentViewer
│           └── ThemeTile (new)
```

### 3.2 State Management

#### ThemeContext Structure
```typescript
interface ThemeState {
  preset: 'tokyo-night' | 'catppuccin-mocha' | 'catppuccin-latte';
  accentColor: AccentColor;
  backgroundEffect: boolean;
  isTransitioning: boolean;
}

interface ThemeContextValue {
  theme: ThemeState;
  setThemePreset: (preset: ThemePreset) => void;
  setAccentColor: (color: AccentColor) => void;
  toggleBackgroundEffect: () => void;
}
```

#### Focus Context Updates
```typescript
// Update TileType
export type TileType = 'neofetch' | 'navigation' | 'content' | 'theme';

// Update tab navigation order
const tiles: TileType[] = ['neofetch', 'navigation', 'content', 'theme'];
```

### 3.3 Theme Application Strategy

#### CSS Variable System
```css
:root {
  /* Base theme variables */
  --theme-bg: var(--tokyo-bg);
  --theme-surface: var(--tokyo-surface);
  --theme-text: var(--tokyo-text);
  /* ... */
}

.theme-catppuccin-mocha {
  --theme-bg: var(--mocha-bg);
  --theme-surface: var(--mocha-surface);
  --theme-text: var(--mocha-text);
  /* ... */
}

.accent-blue { --term-accent: #7aa2f7; }
.accent-green { --term-accent: #9ece6a; }
/* ... 14 accent colors */
```

## 4. Animation Specifications

### 4.1 Desktop Theme Transition

#### Implementation
```css
/* Smooth variable transition */
* {
  transition: background-color 300ms ease,
              color 300ms ease,
              border-color 300ms ease;
}
```

#### Behavior
- All theme colors transition simultaneously
- 300ms duration for smooth effect
- No layout shift or flicker

### 4.2 Mobile Circle Expansion Animation

#### Concept
- Animation originates from theme tile location
- Expands as circular clip-path
- Creates "ripple" effect across entire viewport

#### Implementation
```typescript
// Animation trigger
const triggerThemeAnimation = (newTheme: string) => {
  // Create overlay div
  const overlay = document.createElement('div');
  overlay.className = `theme-overlay ${newTheme}`;

  // Position at bottom-right (theme tile location)
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 9999;
    animation: circle-expand 600ms ease-out forwards;
  `;

  document.body.appendChild(overlay);

  // Cleanup after animation
  setTimeout(() => {
    applyTheme(newTheme);
    overlay.remove();
  }, 600);
};
```

#### CSS Animation
```css
@keyframes circle-expand {
  from {
    clip-path: circle(0% at 95% 95%);
  }
  to {
    clip-path: circle(150% at 95% 95%);
  }
}
```

## 5. Implementation Plan

### Phase 1: Layout Restructure (4 hours)

#### Tasks:
1. Update FocusContext to support 'theme' tile type
2. Modify LayoutManagerWithFocus desktop layout
3. Add theme tile to mobile stack
4. Update tab navigation logic

#### Deliverables:
- Updated `contexts/FocusContext.tsx`
- Modified `components/RicedLayout/LayoutManagerWithFocus.tsx`
- Working 4-tile layout

### Phase 2: Theme System (6 hours)

#### Tasks:
1. Create ThemeContext and Provider
2. Define theme configurations
3. Implement CSS variable system
4. Add localStorage persistence

#### Deliverables:
- `contexts/ThemeContext.tsx`
- `lib/themes.ts` with theme definitions
- Updated `app/globals.css`

### Phase 3: ThemeTile Component (6 hours)

#### Tasks:
1. Create ThemeTile component structure
2. Implement color palette grid
3. Add theme preset buttons
4. Style for compact 15% width

#### Deliverables:
- `components/RicedLayout/ThemeTile.tsx`
- Responsive styling
- Interactive elements

### Phase 4: Animations (4 hours)

#### Tasks:
1. Implement desktop transitions
2. Create mobile circle expansion
3. Add animation triggers
4. Test performance

#### Deliverables:
- Animation utilities
- Smooth theme transitions
- Mobile-specific animations

### Phase 5: Integration & Testing (4 hours)

#### Tasks:
1. Wire up all theme changes
2. Test responsive behavior
3. Ensure accessibility
4. Performance optimization

#### Deliverables:
- Fully integrated theme system
- Test documentation
- Performance metrics

## 6. User Interface Specifications

### 6.1 ThemeTile Layout (Desktop)

```
┌─────────────────────┐
│  🎨 Theme           │
│                     │
│  ┌─┬─┬─┬─┬─┬─┬─┐  │
│  │ │ │ │ │ │ │ │  │  ← Row 1 (7 colors)
│  ├─┼─┼─┼─┼─┼─┼─┤  │
│  │ │ │ │ │ │ │ │  │  ← Row 2 (7 colors)
│  └─┴─┴─┴─┴─┴─┴─┘  │
│                     │
│  [Latte] [Mocha]   │  ← Theme presets
│  [Tokyo Night]      │
│                     │
│  ☑ Background effect│  ← Toggle
│                     │
└─────────────────────┘
```

### 6.2 Interaction States

#### Color Swatches
- Default: Solid color with subtle border
- Hover: Scale(1.1) with shadow
- Active: Checkmark overlay
- Selected: Border highlight

#### Theme Buttons
- Default: Ghost button style
- Hover: Background opacity
- Active: Solid background
- Selected: Primary color background

### 6.3 Mobile Adaptations
- Full width in stacked layout
- Larger touch targets (min 44px)
- Horizontal scroll for color palette if needed
- Simplified layout with essential controls

## 7. Testing Strategy

### 7.1 Functional Testing

#### Test Cases:
1. Theme preset switching updates all colors
2. Accent color selection persists
3. Background effect toggle works
4. LocalStorage saves preferences
5. Tab navigation includes theme tile
6. Mobile circle animation triggers correctly

### 7.2 Performance Criteria

- Theme switch: < 300ms total time
- Animation FPS: Maintain 60fps
- Memory: No leaks after 100 theme changes
- Paint/Layout: Minimal reflow during transitions

### 7.3 Accessibility Requirements

- Keyboard navigation to all controls
- ARIA labels for color swatches
- Focus indicators visible
- Color contrast meets WCAG AA
- Reduced motion respects user preference

### 7.4 Browser Compatibility

| Browser | Desktop | Mobile | Circle Animation |
|---------|---------|--------|------------------|
| Chrome 120+ | ✅ | ✅ | ✅ |
| Firefox 120+ | ✅ | ✅ | ✅ |
| Safari 17+ | ✅ | ✅ | ✅ |
| Edge 120+ | ✅ | ✅ | ✅ |

## 8. Risk Assessment

### 8.1 Technical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| CSS variable performance | High | Low | Use transform/opacity where possible |
| Animation jank on mobile | Medium | Medium | Use GPU-accelerated properties |
| Theme flash on load | Low | Medium | SSR theme class application |
| Focus management complexity | Medium | Low | Extend existing FocusContext |

### 8.2 UX Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Tile too narrow on desktop | Medium | Medium | Responsive font/element sizing |
| Color selection unclear | Low | Low | Add hover tooltips with color names |
| Theme persistence fails | High | Low | Fallback to default theme |

## 9. Future Enhancements

### 9.1 Near-term (v1.1)
- Custom theme creation
- Export/import theme configurations
- More preset themes (Dracula, Gruvbox, etc.)
- Animated background patterns per theme

### 9.2 Long-term (v2.0)
- Theme marketplace/sharing
- Time-based theme switching
- System preference sync
- Advanced color customization (HSL sliders)

## 10. Success Criteria

### 10.1 Acceptance Criteria
- ✅ Theme tile renders in correct position
- ✅ All three preset themes work
- ✅ 14 accent colors selectable
- ✅ Themes persist across sessions
- ✅ Mobile animation smooth
- ✅ No accessibility regressions
- ✅ Performance targets met

### 10.2 Definition of Done
1. Feature implemented per specification
2. All tests passing
3. Code reviewed and approved
4. Documentation updated
5. No critical bugs
6. Performance benchmarks met
7. Accessibility audit passed

## Appendix A: Color Palette Reference

### Accent Colors (14 total)
```typescript
const accentColors = [
  { name: 'Rose', value: '#f43f5e' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Fuchsia', value: '#d946ef' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Violet', value: '#8b5cf6' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Sky', value: '#0ea5e9' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Lime', value: '#84cc16' },
  { name: 'Amber', value: '#f59e0b' }
];
```

## Appendix B: Implementation Checklist

- [ ] Layout restructure complete
- [ ] ThemeContext implemented
- [ ] ThemeTile component created
- [ ] Desktop animations working
- [ ] Mobile circle animation working
- [ ] Theme persistence functional
- [ ] All preset themes styled
- [ ] Accent colors integrated
- [ ] Focus management updated
- [ ] Responsive design verified
- [ ] Accessibility audit passed
- [ ] Performance targets met
- [ ] Documentation updated
- [ ] Tests written and passing

---

**Document Version**: 1.0.0
**Last Updated**: December 2024
**Author**: Claude Code Assistant
**Status**: Ready for Implementation
**Inspired By**: jasoncameron.dev