# Responsive Layout Specification

## Overview
This document specifies the responsive design implementation for the portfolio's tiled window manager UI, transitioning from a complex multi-breakpoint system to a simplified two-mode approach.

## Design Principles
- **Simplicity**: Only two layout modes (desktop tiled vs mobile stacked)
- **Consistency**: Maintain 12px gaps between all tiles in both modes
- **Usability**: All content visible and accessible without tabs
- **Aesthetics**: Preserve the Hyprland-inspired tiling aesthetic

## Layout Modes

### 1. Desktop Tiled Mode
**Breakpoint**: ≥ 1024px

**Structure**:
```
┌─────────────────────────────────────────┐
│              Polybar (36px)             │
├────────────────┬────────────────────────┤
│                │                        │
│   Neofetch     │                        │
│   (50% height) │                        │
│                │      Content           │
├────────────────┤      Viewer            │
│                │      (100% height)     │
│  Navigation    │                        │
│   (50% height) │                        │
│                │                        │
└────────────────┴────────────────────────┘
     50% width          50% width
```

**Characteristics**:
- Fixed viewport height (h-screen)
- No scrolling (overflow-hidden)
- Left column split 50/50 vertically
- 12px padding around container
- 12px gaps between all tiles

### 2. Mobile Stacked Mode
**Breakpoint**: < 1024px

**Structure**:
```
┌──────────────────┐
│     Polybar      │
├──────────────────┤
│                  │
│    Neofetch      │
│                  │
├──────────────────┤
│                  │
│   Navigation     │
│                  │
├──────────────────┤
│                  │
│    Content       │
│     Viewer       │
│                  │
└──────────────────┘
    100% width
```

**Characteristics**:
- Natural height (no h-screen)
- Vertical scrolling enabled
- All tiles full width
- Content-based tile heights
- 12px padding around container
- 12px gaps between tiles
- Tiles stack in order: Neofetch → Navigation → Content

## Implementation Phases

### Phase 1: Setup and State Management
1. Replace `isMobile` state with `isStacked` boolean
2. Update breakpoint check to use 1024px threshold
3. Remove existing mobile tabbed interface code
4. Update Polybar to handle both modes

### Phase 2: Desktop Mode Refinement
1. Ensure current desktop layout is preserved
2. Verify 12px spacing consistency
3. Test with different content loads
4. Validate ASCII art display

### Phase 3: Stacked Mode Implementation
1. Create new stacked layout structure
2. Remove fixed heights in stacked mode
3. Implement proper scrolling container
4. Apply full-width styling to tiles

### Phase 4: Responsive Adjustments
1. Optimize font sizes for each mode
2. Adjust ASCII art based on available width
3. Test transition between modes
4. Handle window resize events smoothly

### Phase 5: Testing and Polish
1. Cross-browser testing
2. Touch device testing
3. Performance optimization
4. Accessibility verification

## Technical Requirements

### CSS Classes to Add/Modify
- `.stacked-container`: Wrapper for stacked mode
- `.stacked-tile`: Individual tile in stacked mode
- Remove `.h-screen` in stacked mode
- Remove `.overflow-hidden` in stacked mode
- Remove `.h-1/2` from tiles in stacked mode

### State Management
```typescript
const [isStacked, setIsStacked] = useState(false);

useEffect(() => {
  const checkLayout = () => {
    setIsStacked(window.innerWidth < 1024);
  };
  checkLayout();
  window.addEventListener('resize', checkLayout);
  return () => window.removeEventListener('resize', checkLayout);
}, []);
```

### Container Structure (Stacked Mode)
```tsx
<div className="min-h-screen overflow-y-auto flex flex-col">
  <Polybar />
  <div style={{ padding: '12px' }}>
    <div className="flex flex-col" style={{ gap: '12px' }}>
      <NeofetchTile />
      <NavigationTile />
      <ContentViewer />
    </div>
  </div>
</div>
```

## Breakpoint Rationale

### Why 1024px?
- **Industry Standard**: Common laptop/small desktop width
- **Content Integrity**: Below 1024px, three tiles side-by-side become cramped
- **Readability**: Ensures minimum 500px per tile in desktop mode
- **Device Coverage**:
  - Tablets in landscape: Usually 1024px-1366px
  - Tablets in portrait: Usually 768px-834px (gets stacked)
  - Phones: All get stacked mode
  - Laptops/Desktops: Most get tiled mode

## Edge Cases to Handle
1. **Dynamic content loading**: Ensure stacked tiles adjust height
2. **Keyboard navigation**: Update Tab cycling for stacked mode
3. **Focus states**: Maintain visual feedback in both modes
4. **Animation transitions**: Smooth layout change on resize
5. **Very tall content**: Ensure individual tiles don't become too tall

## Auto-Scroll Behavior (Stacked Mode Only)

### Overview
Auto-scroll features enhance navigation in stacked mode where tiles may extend beyond the viewport. These features are **disabled in desktop mode** where all tiles are visible simultaneously.

### Feature 1: Tab Navigation Auto-Scroll
**When**: User presses Tab key to cycle through tiles in stacked mode
**Behavior**: The newly focused tile automatically scrolls into view
**Implementation**:
- Detect Tab keypress and focus change
- Use `scrollIntoView()` with smooth behavior
- Center the focused tile in viewport when possible
- Account for Polybar height (36px) as fixed offset

### Feature 2: Navigation Selection Auto-Scroll
**When**: User clicks on a project/blog item in the Navigation tile in stacked mode
**Behavior**: Content viewer tile automatically scrolls into view
**Implementation**:
- Trigger on `onContentSelect` callback
- Scroll to Content tile with slight delay (100ms) to ensure content updates first
- Use 'start' alignment to show top of content
- Only active when `isStacked === true`

### Technical Implementation Details

```typescript
// Conditional auto-scroll in stacked mode only
if (isStacked) {
  // Create refs for each tile
  const neofetchRef = useRef<HTMLDivElement>(null);
  const navigationRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Tab navigation handler
  useEffect(() => {
    if (!isStacked) return; // Guard clause

    const tileRefs = {
      'neofetch': neofetchRef,
      'navigation': navigationRef,
      'content': contentRef
    };

    tileRefs[focusedTile]?.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  }, [focusedTile, isStacked]);

  // Navigation selection handler
  const handleContentSelect = (content: ContentType) => {
    setActiveContent(content);
    if (isStacked) {
      setTimeout(() => {
        contentRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  };
}
```

### Important Considerations
- **Mode Detection**: Always check `isStacked` before triggering auto-scroll
- **Performance**: Use `requestAnimationFrame` if scroll performance issues arise
- **User Control**: Respect manual scrolling - don't fight user's scroll position
- **Smooth Transitions**: Use CSS `scroll-behavior: smooth` as fallback

## Success Criteria
- [ ] Seamless transition at 1024px breakpoint
- [ ] No horizontal scrolling in either mode
- [ ] All content accessible without tabs
- [ ] Consistent 12px spacing maintained
- [ ] ASCII art displays correctly in both modes
- [ ] Performance remains smooth during resize
- [ ] Touch navigation works in stacked mode
- [ ] Tab navigation auto-scrolls to focused tile (stacked mode only)
- [ ] Navigation clicks auto-scroll to content (stacked mode only)
- [ ] Auto-scroll is completely disabled in desktop mode

## Future Considerations
- Potential for user-selectable layout preference
- Remember last used layout in localStorage
- Add collapse/expand for individual tiles in stacked mode
- Consider landscape phone optimization (if needed)