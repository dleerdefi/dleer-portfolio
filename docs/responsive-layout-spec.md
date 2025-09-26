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

## Layout Transition Animation

### Overview
Smooth animated transitions enhance the user experience when resizing the viewport across the 1024px breakpoint. Tiles gracefully animate between their tiled and stacked positions, creating a cohesive visual flow.

### Design Goals
- **Visual Continuity**: Tiles smoothly transition rather than instantly snapping
- **Performance**: Use CSS transforms for GPU acceleration
- **Accessibility**: Respect user's motion preferences
- **Subtlety**: Lightweight animations that don't distract from content

### Animation Behavior

#### Trigger Conditions
- **Active**: Only when viewport crosses 1024px breakpoint during resize
- **Inactive**: Initial page loads at any size (no animation on first render)
- **Disabled**: When user has `prefers-reduced-motion` enabled

#### Animation Sequences

##### Desktop → Stacked (Viewport shrinks below 1024px)
```
Neofetch:    Slides down and expands to full width
Navigation:  Slides down and right, expands to full width
Content:     Slides left and down into bottom position
```
- Duration: 400ms base + 100ms stagger
- Easing: cubic-bezier(0.4, 0.0, 0.2, 1) - Material Design "ease-out"
- Opacity: Slight fade (1.0 → 0.8 → 1.0) during transition

##### Stacked → Desktop (Viewport expands above 1024px)
```
Neofetch:    Contracts width and slides up-left into position
Navigation:  Slides up into bottom-left position
Content:     Slides right and contracts into right column
```
- Duration: 400ms base + 100ms stagger (reversed)
- Easing: cubic-bezier(0.4, 0.0, 0.2, 1)
- Opacity: Maintains full opacity for "rising" effect

### Implementation Phases

#### Phase 1: Transition State Management
1. Add transition detection logic
   ```typescript
   const [isTransitioning, setIsTransitioning] = useState(false);
   const [transitionDirection, setTransitionDirection] = useState<'toStacked' | 'toTiled' | null>(null);
   const prevIsStacked = useRef(isStacked);
   ```

2. Detect layout changes
   ```typescript
   useEffect(() => {
     if (prevIsStacked.current !== isStacked) {
       setIsTransitioning(true);
       setTransitionDirection(isStacked ? 'toStacked' : 'toTiled');
       prevIsStacked.current = isStacked;

       // Clear transition state after animation completes
       setTimeout(() => {
         setIsTransitioning(false);
         setTransitionDirection(null);
       }, 600); // Total animation duration
     }
   }, [isStacked]);
   ```

#### Phase 2: CSS Animation Classes
1. Create transition utility classes in globals.css
   ```css
   /* Base transition class */
   .layout-transition {
     transition: transform 400ms cubic-bezier(0.4, 0.0, 0.2, 1),
                 opacity 400ms cubic-bezier(0.4, 0.0, 0.2, 1);
   }

   /* Stagger delays for each tile */
   .transition-delay-0 { transition-delay: 0ms; }
   .transition-delay-100 { transition-delay: 100ms; }
   .transition-delay-200 { transition-delay: 200ms; }

   /* Reduced motion support */
   @media (prefers-reduced-motion: reduce) {
     .layout-transition {
       transition: none;
     }
   }
   ```

2. Position classes for animation states
   ```css
   /* Initial positions for desktop → stacked */
   .tile-neofetch-entering-stacked {
     transform: translateY(-20px);
     opacity: 0.8;
   }

   .tile-navigation-entering-stacked {
     transform: translateY(-20px) translateX(-20px);
     opacity: 0.8;
   }

   .tile-content-entering-stacked {
     transform: translateX(20px);
     opacity: 0.8;
   }
   ```

#### Phase 3: Component Integration
1. Apply transition classes conditionally
   ```typescript
   const getTileClasses = (tileName: string) => {
     const baseClasses = 'rounded-lg shadow-xl border';

     if (!isTransitioning) return baseClasses;

     const transitionClasses = [
       'layout-transition',
       `transition-delay-${getStaggerDelay(tileName)}`
     ];

     if (transitionDirection === 'toStacked') {
       transitionClasses.push(`tile-${tileName}-entering-stacked`);
     }

     return `${baseClasses} ${transitionClasses.join(' ')}`;
   };
   ```

2. Add GPU acceleration hints
   ```typescript
   const tileStyle = {
     ...existingStyles,
     willChange: isTransitioning ? 'transform, opacity' : 'auto'
   };
   ```

#### Phase 4: Performance Optimization
1. Debounce resize events
   ```typescript
   const debouncedCheckLayout = useMemo(
     () => debounce(() => {
       setIsStacked(window.innerWidth < 1024);
     }, 150),
     []
   );
   ```

2. Use ResizeObserver for better performance
   ```typescript
   useEffect(() => {
     const resizeObserver = new ResizeObserver((entries) => {
       for (let entry of entries) {
         const width = entry.contentRect.width;
         debouncedCheckLayout(width);
       }
     });

     resizeObserver.observe(document.body);
     return () => resizeObserver.disconnect();
   }, []);
   ```

### Technical Specifications

#### Animation Timing
| Tile | Delay | Duration | Total Time |
|------|-------|----------|------------|
| Neofetch | 0ms | 400ms | 400ms |
| Navigation | 100ms | 400ms | 500ms |
| Content | 200ms | 400ms | 600ms |

#### Browser Compatibility
- CSS Transitions: All modern browsers
- ResizeObserver: Chrome 64+, Firefox 69+, Safari 13.1+
- Fallback: Standard resize event listener

#### Performance Metrics
- Target FPS: 60fps throughout transition
- Paint time: < 16ms per frame
- No layout thrashing (transform-only animations)

### Testing Checklist
- [ ] Smooth animation when crossing 1024px breakpoint
- [ ] No animation on initial page load
- [ ] Proper stagger timing between tiles
- [ ] Animation respects prefers-reduced-motion
- [ ] Performance maintains 60fps
- [ ] No visual glitches or jumps
- [ ] Animations work in both directions
- [ ] Debouncing prevents animation spam during rapid resize

### Accessibility Considerations
1. **Motion Sensitivity**: Respect `prefers-reduced-motion` media query
2. **Focus Management**: Maintain focus state during transitions
3. **Screen Readers**: Transitions don't affect content reading order
4. **Keyboard Navigation**: Tab order remains consistent

### Future Enhancements
- Spring physics animations for more natural motion
- Configurable animation duration/easing preferences
- Alternative transition styles (fade, slide, morph)
- Per-tile animation customization
- Gesture-based transitions for touch devices

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
- [ ] Layout transition animations work smoothly when crossing breakpoint
- [ ] No animation on initial page load
- [ ] Animations respect prefers-reduced-motion setting

## Future Considerations
- Potential for user-selectable layout preference
- Remember last used layout in localStorage
- Add collapse/expand for individual tiles in stacked mode
- Consider landscape phone optimization (if needed)