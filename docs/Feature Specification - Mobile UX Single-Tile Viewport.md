# Feature Specification: Mobile UX Single-Tile Viewport

**Version:** 1.1
**Date:** January 2025
**Status:** Draft (Updated for Dual-Mode Architecture)
**Tech Stack:** Next.js 15.5.4, React 19.1.0, Framer Motion 12.23.22, Tailwind CSS v4
**Related Specs:** Mobile UX Parallax Mode, Mobile Dual-Mode Architecture

---

## Executive Summary

### Problem Statement
The current mobile experience uses a vertically stacked layout where all tiles are visible and users scroll down to navigate. This approach:
- Feels "entry level" and lacks the sophistication of modern mobile applications
- Creates excessive scrolling requirements on smaller screens
- Dilutes focus by showing all content simultaneously
- Doesn't leverage mobile-specific interaction patterns

### Proposed Solution
Transform the mobile experience into a **single-tile viewport system** with slide-up navigation, creating an app-like experience that:
- Shows one primary tile at a time (ContentViewer)
- Uses a fixed bottom navigation bar for quick access
- Implements a slide-up sheet for detailed navigation
- Leverages native mobile gestures (swipe, drag, pull)

### Expected Outcomes
- **Professional UX**: Sophisticated mobile experience matching modern app standards
- **Improved Performance**: Reduced DOM complexity with single active viewport
- **Better Navigation**: Direct access without scrolling
- **Enhanced Engagement**: Native-feeling interactions increase user satisfaction
- **Maintained Identity**: Rice aesthetic preserved through single-tile focus

---

## Technical Requirements

### Framework Constraints

#### Next.js 15.5.4 App Router Requirements
- **Server Components First**: Leverage RSC for initial render performance
- **Client Boundary Management**: Use 'use client' only for interactive components
- **Dynamic Imports**: Utilize next/dynamic for code splitting mobile components
- **Image Optimization**: Implement next/image with responsive sizing
- **Middleware Routing**: Consider device-based routing for optimal experience

#### React 19.1.0 Considerations
- **New Hooks Integration**:
  - `useOptimistic`: Show immediate UI updates during navigation
  - `useActionState`: Handle form states in contact tile
  - `useDeferredValue`: Defer non-critical updates during animations
  - `use()` API: Read promises for content loading
- **Automatic Batching**: Leverage default state update batching
- **Concurrent Features**: Use transitions for non-blocking updates

#### Framer Motion 12.23.22 Guidelines
- **Gesture Performance**: Implement touch-action CSS for proper mobile handling
- **Hardware Acceleration**: Use only transform and opacity for animations
- **Layout Animations**: Add layoutScroll to scrollable containers
- **AnimatePresence**: Manage component mounting/unmounting gracefully
- **Spring Physics**: Use spring animations for natural mobile feel

#### TypeScript Requirements
- **Strict Mode**: Maintain type safety throughout implementation
- **Gesture Types**: Properly type all gesture event handlers
- **Context Types**: Ensure FocusContext and ThemeContext remain strongly typed
- **Component Props**: Define clear interfaces for new mobile components

### Performance Requirements

#### Core Web Vitals Targets
- **LCP (Largest Contentful Paint)**: < 1.2s on 4G mobile
- **FID (First Input Delay)**: < 100ms for gesture responsiveness
- **CLS (Cumulative Layout Shift)**: < 0.1 with fixed navigation elements
- **INP (Interaction to Next Paint)**: < 200ms for smooth transitions

#### Animation Performance
- **Frame Rate**: Maintain 60fps during all animations
- **GPU Usage**: Leverage hardware acceleration via transform/opacity
- **Memory**: Prevent memory leaks by cleaning up gesture listeners
- **Bundle Size**: Keep mobile-specific code under 50KB gzipped

---

## Architecture Design

### Component Hierarchy

```
LayoutManagerWithFocus (Enhanced)
├── MobileViewport (New)
│   ├── ContentViewer (Existing, Enhanced)
│   ├── NeofetchTile (Hidden, Mounted)
│   ├── NavigationTile (Hidden, Mounted)
│   └── ThemeTile (Hidden, Mounted)
├── MobileBottomBar (New)
│   ├── NavItem (Home)
│   ├── NavItem (Projects)
│   ├── NavItem (Blog)
│   ├── NavItem (About)
│   └── NavItem (Menu)
└── MobileNavSheet (New)
    ├── SheetHandle (Drag Indicator)
    ├── NavigationTile (Embedded)
    ├── ThemeTile (Embedded)
    └── QuickActions (New)
```

### State Management Architecture

```typescript
// Mobile-specific state in FocusContext
interface MobileState {
  activeView: 'content' | 'navigation' | 'theme';
  sheetOpen: boolean;
  swipeDirection: 'left' | 'right' | null;
  gestureActive: boolean;
}

// Optimistic navigation with React 19
const [optimisticContent, setOptimisticContent] = useOptimistic(
  activeContent,
  (state, newContent) => newContent
);
```

### Animation Orchestration

```typescript
// Coordinated animation variants
const mobileVariants = {
  viewport: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  },
  sheet: {
    closed: {
      y: '100%',
      transition: { type: 'spring', damping: 25, stiffness: 300 }
    },
    open: {
      y: 0,
      transition: { type: 'spring', damping: 25, stiffness: 300 }
    }
  },
  bottomBar: {
    hidden: { y: 100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { delay: 0.2, duration: 0.4 }
    }
  }
};
```

### Mobile Navigation Pattern

#### Bottom Navigation Bar
- **Fixed Position**: Always visible at bottom of viewport
- **5 Primary Actions**: Home, Projects, Blog, About, Menu
- **Active Indicator**: Animated underline using accent color
- **Height**: 56px (following Material Design guidelines)

#### Slide-Up Navigation Sheet
- **Trigger**: Menu button in bottom bar or swipe-up gesture
- **Content**: NavigationTile + ThemeTile + Quick Actions
- **Dismissal**: Tap outside, drag down, or selection
- **Max Height**: 70vh to maintain context

#### Gesture Navigation
- **Horizontal Swipe**: Navigate between main sections
- **Vertical Drag**: Open/close navigation sheet
- **Pull-to-Refresh**: Reload current content
- **Long Press**: Show context menu (future enhancement)

---

## Implementation Phases

### Phase 1: Foundation (Week 1)

#### 1.1 Create Base Components
```typescript
// MobileViewport.tsx
interface MobileViewportProps {
  children: React.ReactNode;
  activeView: 'content' | 'navigation' | 'theme';
}

const MobileViewport: React.FC<MobileViewportProps> = ({
  children,
  activeView
}) => {
  return (
    <motion.div
      className="h-[calc(100vh-56px)] relative overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={mobileVariants.viewport}
    >
      <AnimatePresence mode="wait">
        {children}
      </AnimatePresence>
    </motion.div>
  );
};
```

#### 1.2 Implement Bottom Navigation
```typescript
// MobileBottomBar.tsx
const MobileBottomBar: React.FC = () => {
  const { activeContent, setActiveContent } = useFocus();
  const [optimisticActive, setOptimisticActive] = useOptimistic(activeContent);

  const navItems = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'projects', icon: '💼', label: 'Projects' },
    { id: 'blog', icon: '📝', label: 'Blog' },
    { id: 'about', icon: '👤', label: 'About' },
    { id: 'menu', icon: '☰', label: 'Menu' }
  ];

  return (
    <motion.nav
      className="fixed bottom-0 left-0 right-0 h-14 backdrop-blur-lg"
      style={{
        backgroundColor: 'rgba(var(--theme-surface-rgb), 0.95)',
        borderTop: '1px solid rgba(var(--accent-color-rgb), 0.3)'
      }}
      variants={mobileVariants.bottomBar}
      initial="hidden"
      animate="visible"
    >
      {/* Navigation items with touch targets */}
    </motion.nav>
  );
};
```

### Phase 2: Interactions (Week 2)

#### 2.1 Slide-Up Sheet Implementation
```typescript
// MobileNavSheet.tsx
const MobileNavSheet: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const y = useMotionValue(0);
  const controls = useDragControls();

  return (
    <motion.div
      className="fixed inset-x-0 bottom-0 z-50"
      style={{
        height: '70vh',
        backgroundColor: 'var(--theme-surface)',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        touchAction: 'none' // Critical for mobile gestures
      }}
      drag="y"
      dragControls={controls}
      dragConstraints={{ top: 0 }}
      dragElastic={0.2}
      onDragEnd={(e, { offset, velocity }) => {
        if (offset.y > 100 || velocity.y > 500) {
          setIsOpen(false);
        }
      }}
      animate={isOpen ? "open" : "closed"}
      variants={mobileVariants.sheet}
    >
      <div className="w-12 h-1 bg-gray-400 rounded-full mx-auto mt-2" />
      {/* Sheet content */}
    </motion.div>
  );
};
```

#### 2.2 Swipe Navigation
```typescript
// useSwipeNavigation.ts
const useSwipeNavigation = () => {
  const { activeContent, handleContentNavigation } = useFocus();
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      setSwipeDirection('left');
      navigateNext();
    },
    onSwipedRight: () => {
      setSwipeDirection('right');
      navigatePrevious();
    },
    trackMouse: false,
    trackTouch: true,
    delta: 50, // Minimum swipe distance
    preventDefaultTouchmoveEvent: true
  });

  return { handlers, swipeDirection };
};
```

### Phase 3: Polish (Week 3)

#### 3.1 Haptic Feedback
```typescript
// useHaptic.ts
const useHaptic = () => {
  const triggerHaptic = (type: 'light' | 'medium' | 'heavy') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30]
      };
      navigator.vibrate(patterns[type]);
    }
  };

  return { triggerHaptic };
};
```

#### 3.2 Performance Optimizations
```typescript
// Lazy load non-critical components
const MobileNavSheet = dynamic(() => import('./MobileNavSheet'), {
  loading: () => <div className="animate-pulse" />,
  ssr: false
});

// Debounce expensive operations
const debouncedSearch = useMemo(
  () => debounce((term: string) => searchContent(term), 300),
  []
);

// Use React 19's deferred values
const deferredContent = useDeferredValue(content);
```

---

## Code Examples

### Complete Mobile Detection Hook
```typescript
// hooks/useMobileDetection.ts
import { useState, useEffect } from 'react';

interface MobileDetection {
  isMobile: boolean;
  isTablet: boolean;
  isTouchDevice: boolean;
  viewport: { width: number; height: number };
}

export const useMobileDetection = (): MobileDetection => {
  const [detection, setDetection] = useState<MobileDetection>({
    isMobile: false,
    isTablet: false,
    isTouchDevice: false,
    viewport: { width: 0, height: 0 }
  });

  useEffect(() => {
    const updateDetection = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setDetection({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isTouchDevice: 'ontouchstart' in window,
        viewport: { width, height }
      });
    };

    updateDetection();
    window.addEventListener('resize', updateDetection);
    return () => window.removeEventListener('resize', updateDetection);
  }, []);

  return detection;
};
```

### Gesture-Enabled Content Switcher
```typescript
// components/MobileContentSwitcher.tsx
const MobileContentSwitcher: React.FC = () => {
  const { activeContent } = useFocus();
  const [displayContent, setDisplayContent] = useOptimistic(activeContent);

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={(e, { offset, velocity }) => {
        const swipe = Math.abs(offset.x) * velocity.x;

        if (swipe < -10000) {
          // Swipe left - next content
          navigateToNext();
        } else if (swipe > 10000) {
          // Swipe right - previous content
          navigateToPrevious();
        }
      }}
      style={{ touchAction: 'pan-y' }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={displayContent.type}
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
        >
          <ContentViewer />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};
```

---

## Testing Strategy

### Unit Testing
```typescript
// __tests__/MobileBottomBar.test.tsx
describe('MobileBottomBar', () => {
  it('should render 5 navigation items', () => {
    render(<MobileBottomBar />);
    expect(screen.getAllByRole('button')).toHaveLength(5);
  });

  it('should have minimum touch target size', () => {
    const { container } = render(<MobileBottomBar />);
    const buttons = container.querySelectorAll('button');
    buttons.forEach(button => {
      const rect = button.getBoundingClientRect();
      expect(rect.width).toBeGreaterThanOrEqual(44);
      expect(rect.height).toBeGreaterThanOrEqual(44);
    });
  });
});
```

### E2E Testing
```typescript
// e2e/mobile-navigation.spec.ts
test('slide-up sheet interaction', async ({ page }) => {
  await page.goto('/');
  await page.setViewportSize({ width: 375, height: 667 }); // iPhone size

  // Open sheet via menu button
  await page.locator('[data-testid="menu-button"]').tap();
  await expect(page.locator('[data-testid="nav-sheet"]')).toBeVisible();

  // Drag to dismiss
  const sheet = page.locator('[data-testid="nav-sheet"]');
  await sheet.dragTo(sheet, {
    sourcePosition: { x: 50, y: 50 },
    targetPosition: { x: 50, y: 300 }
  });
  await expect(sheet).not.toBeVisible();
});
```

### Performance Testing
```javascript
// lighthouse-mobile-config.js
module.exports = {
  extends: 'lighthouse:default',
  settings: {
    emulatedFormFactor: 'mobile',
    throttling: {
      rttMs: 150,
      throughputKbps: 1638.4,
      cpuSlowdownMultiplier: 4
    },
    screenEmulation: {
      mobile: true,
      width: 375,
      height: 667,
      deviceScaleFactor: 2
    }
  },
  categories: {
    performance: {
      auditRefs: [
        { id: 'first-contentful-paint', weight: 3 },
        { id: 'largest-contentful-paint', weight: 3 },
        { id: 'cumulative-layout-shift', weight: 2 },
        { id: 'total-blocking-time', weight: 2 }
      ]
    }
  }
};
```

---

## Accessibility Considerations

### Touch Targets
- **Minimum Size**: 44x44px (iOS) / 48x48dp (Android)
- **Spacing**: 8px minimum between interactive elements
- **Visual Feedback**: Show pressed states immediately

### Screen Reader Support
```typescript
// Proper ARIA attributes
<nav role="navigation" aria-label="Main navigation">
  <button
    aria-label={`Navigate to ${item.label}`}
    aria-current={isActive ? 'page' : undefined}
    role="tab"
    aria-selected={isActive}
  >
    {item.label}
  </button>
</nav>

<div
  role="dialog"
  aria-modal="true"
  aria-label="Navigation menu"
  aria-describedby="nav-sheet-description"
>
  {/* Sheet content */}
</div>
```

### Reduced Motion
```typescript
// Respect user preferences
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

const animationVariants = prefersReducedMotion
  ? { visible: { opacity: 1 }, hidden: { opacity: 0 } }
  : mobileVariants;
```

### Keyboard Navigation
- Maintain keyboard accessibility for users with external keyboards
- Tab order should match visual hierarchy
- Escape key closes modals/sheets
- Arrow keys navigate between sections

---

## Browser & Device Support

### Minimum Requirements
- **iOS**: Safari 14+ (iOS 14+)
- **Android**: Chrome 90+ (Android 7+)
- **Screen Sizes**: 320px minimum width
- **JavaScript**: ES2020 support required

### Progressive Enhancement
```typescript
// Feature detection
const supportsHaptic = 'vibrate' in navigator;
const supportsTouch = 'ontouchstart' in window;
const supportsIntersectionObserver = 'IntersectionObserver' in window;

// Provide fallbacks
if (!supportsTouch) {
  // Add mouse event handlers as fallback
}
```

### Viewport Configuration
```html
<!-- _document.tsx -->
<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes"
/>
<meta name="theme-color" content="#1a1b26" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
```

---

## Migration Path

### Dual-Mode Architecture Integration

This single-tile viewport mode is now part of the broader dual-mode mobile architecture. See the [Mobile Dual-Mode Architecture](./Feature%20Specification%20-%20Mobile%20Dual-Mode%20Architecture.md) specification for complete integration details.

### Feature Flag Implementation
```typescript
// lib/featureFlags.ts
export const FEATURES = {
  MOBILE_DUAL_MODE: process.env.NEXT_PUBLIC_ENABLE_DUAL_MODE === 'true',
  DEFAULT_MOBILE_MODE: process.env.NEXT_PUBLIC_DEFAULT_MODE || 'single-tile'
};

// LayoutManagerWithFocus.tsx
const LayoutManager = () => {
  const { isMobile } = useMobileDetection();
  const { mode } = useMobileMode(); // From dual-mode architecture

  if (isMobile && FEATURES.MOBILE_DUAL_MODE) {
    switch (mode) {
      case 'single-tile':
        return <MobileSingleViewportLayout />;
      case 'parallax':
        return <MobileParallaxLayout />;
      default:
        return <CurrentStackedLayout />;
    }
  }

  return <CurrentStackedLayout />;
};
```

### Gradual Rollout Strategy
1. **Phase 1**: Deploy behind feature flag to 10% of mobile users
2. **Phase 2**: Monitor metrics, expand to 50% if successful
3. **Phase 3**: Full rollout after 2 weeks of stable performance
4. **Rollback Plan**: Feature flag allows instant reversion

### State Preservation
```typescript
// Preserve state during layout switch
const preserveStateOnLayoutChange = () => {
  const currentState = {
    activeContent,
    scrollPosition: window.scrollY,
    focusedElement: document.activeElement
  };

  localStorage.setItem('layoutTransitionState', JSON.stringify(currentState));
};
```

---

## Risk Assessment

### Potential Risks & Mitigations

#### Performance Risks
- **Risk**: Complex animations causing jank on low-end devices
- **Mitigation**: Use CSS transforms only, implement frame rate monitoring
- **Fallback**: Reduce animation complexity based on device capabilities

#### Browser Compatibility
- **Risk**: Gesture APIs not supported in older browsers
- **Mitigation**: Progressive enhancement with mouse event fallbacks
- **Testing**: BrowserStack testing on real devices

#### User Experience
- **Risk**: Users confused by new navigation pattern
- **Mitigation**: Onboarding tooltip on first visit
- **Analytics**: Track navigation patterns and bounce rates

#### Technical Debt
- **Risk**: Maintaining two mobile layouts increases complexity
- **Mitigation**: Share components where possible, clear documentation
- **Timeline**: Remove old layout after successful migration

### Success Metrics
- **Performance**: LCP < 1.2s on 90% of page loads
- **Engagement**: 25% increase in mobile session duration
- **Navigation**: 40% reduction in time to find content
- **Satisfaction**: Mobile NPS score > 8.0

---

## Appendix

### References
- [Next.js 15 Mobile Optimization Guide](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Framer Motion Gesture Documentation](https://www.framer.com/motion/gestures/)
- [React 19 Performance Features](https://react.dev/blog/2024/12/05/react-19)
- [Material Design Touch Targets](https://m3.material.io/foundations/layout/applying-layout/touch-targets)

### Related Documents
- [Current Mobile Implementation Analysis](./mobile-current-state.md)
- [Competitive Analysis - kyrre.dev](./competitive-analysis-kyrre.md)
- [Theme System Specification](./theme-system-spec.md)

### Version History
- v1.0 (January 2025): Initial specification
- v1.1 (January 2025): Updated for Dual-Mode Architecture integration
  - Added mode selection logic
  - Integrated shared component strategy
  - Updated migration path for multi-mode support
- Future: Add voice navigation support
- Future: Implement offline capabilities

---

**Document Status**: Ready for Review
**Next Steps**: Technical review → Implementation planning → Phase 1 development