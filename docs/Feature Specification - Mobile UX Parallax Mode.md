# Feature Specification: Mobile UX Parallax Mode

**Version:** 1.0
**Date:** January 2025
**Status:** Draft
**Tech Stack:** Next.js 15.5.4, React 19.1.0, Framer Motion 12.23.22, Tailwind CSS v4
**Related Specs:** Mobile UX Single-Tile Viewport, Mobile Dual-Mode Architecture

---

## Executive Summary

### Inspiration & Vision
Inspired by the sophisticated scrolling experience of kyrre.dev, this specification defines a **parallax scroll mobile experience** that transforms the portfolio into a seamless, continuous narrative where content sections elegantly overlay a fixed background as users scroll.

### Problem Statement
The current tile-based mobile layout, while maintaining the rice aesthetic, creates a segmented experience that:
- Requires multiple taps to navigate between sections
- Hides content behind navigation decisions
- Lacks the fluidity expected in modern mobile web experiences
- Doesn't leverage natural scrolling behaviors

### Proposed Solution
Implement a **parallax scrolling system** that:
- Fixes the Neofetch tile as a persistent background element
- Renders all content sections in a continuous, scrollable view
- Creates depth through layered scrolling speeds
- Provides immediate access to all content through natural scrolling
- Maintains the rice aesthetic through thoughtful transparency and layering

### Expected Outcomes
- **Engagement**: 40% increase in content discovery through natural scrolling
- **Performance**: Smooth 60fps scrolling on mid-range devices
- **Sophistication**: Premium feel matching high-end portfolio sites
- **Accessibility**: Improved navigation for users preferring scroll over tap
- **Brand Identity**: Enhanced rice aesthetic through parallax depth

---

## Design Principles

### Core Concepts

#### 1. Fixed Background Layer
The Neofetch tile becomes a fixed backdrop that establishes the technical identity:
```css
.neofetch-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 50vh;
  z-index: 0;
  opacity: 0.7;
}
```

#### 2. Content Overlay Scroll
Content sections scroll over the fixed background with varying opacity:
```css
.content-section {
  position: relative;
  z-index: 10;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(var(--theme-bg-rgb), 0.9) 10%,
    rgba(var(--theme-bg-rgb), 0.95) 30%,
    var(--theme-bg)
  );
}
```

#### 3. Parallax Speed Differentials
Different elements move at different speeds to create depth:
- Background: Fixed (speed: 0)
- Content: Normal scroll (speed: 1)
- Decorative elements: Slow scroll (speed: 0.5)
- Quick actions: Fast scroll (speed: 1.2)

#### 4. Section Transitions
Smooth transitions between content sections using Intersection Observer:
```typescript
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-active');
        updateNavigationIndicator(entry.target.id);
      }
    });
  },
  { threshold: 0.5 }
);
```

---

## Technical Architecture

### Component Structure

```
ParallaxMobileLayout
├── FixedBackdrop
│   └── NeofetchTile (positioned fixed)
├── ScrollableContent
│   ├── HeroSection
│   │   └── Transparent spacer (50vh)
│   ├── AboutSection
│   │   └── Full about content
│   ├── ProjectsSection
│   │   └── Project grid with lazy loading
│   ├── BlogSection
│   │   └── Blog post previews
│   └── ContactSection
│       └── Contact form and links
├── ScrollProgress
│   └── Vertical progress indicator
└── FloatingControls
    ├── ThemeToggle
    └── ScrollToTop
```

### State Management

```typescript
interface ParallaxMobileState {
  // Scroll tracking
  scrollPosition: number;
  scrollDirection: 'up' | 'down';
  scrollVelocity: number;

  // Section visibility
  activeSection: ContentType;
  visibleSections: Set<ContentType>;
  sectionProgress: Map<ContentType, number>; // 0-1 for each section

  // Performance
  isScrolling: boolean;
  reduceMotion: boolean;

  // User preferences
  parallaxIntensity: 'subtle' | 'normal' | 'dramatic';
  autoPlayAnimations: boolean;
}
```

### Scroll Physics Implementation

```typescript
// Custom scroll physics for smooth parallax
const useParallaxScroll = () => {
  const scrollY = useMotionValue(0);
  const scrollYProgress = useTransform(scrollY, [0, 1000], [0, 1]);

  // Different speeds for different layers
  const backgroundY = useTransform(scrollY, [0, 1000], [0, -200]);
  const contentY = useTransform(scrollY, [0, 1000], [0, -1000]);
  const decorativeY = useTransform(scrollY, [0, 1000], [0, -500]);

  useEffect(() => {
    const handleScroll = () => {
      scrollY.set(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollY]);

  return { scrollY, scrollYProgress, backgroundY, contentY, decorativeY };
};
```

---

## Implementation Details

### Fixed Backdrop Component

```typescript
const FixedBackdrop: React.FC = () => {
  const { scrollYProgress } = useParallaxScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0.8, 0.3]);

  return (
    <motion.div
      className="fixed inset-x-0 top-0 h-[50vh] z-0"
      style={{
        opacity,
        filter: 'blur(0px)',
        willChange: 'opacity'
      }}
    >
      <div className="relative h-full w-full overflow-hidden">
        <NeofetchTile isCompact={false} />

        {/* Gradient overlay for smooth transition */}
        <div
          className="absolute inset-x-0 bottom-0 h-32"
          style={{
            background: 'linear-gradient(to bottom, transparent, var(--theme-bg))'
          }}
        />
      </div>
    </motion.div>
  );
};
```

### Scrollable Content Sections

```typescript
const ScrollableSection: React.FC<{
  id: ContentType;
  children: React.ReactNode;
  index: number;
}> = ({ id, children, index }) => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useParallaxScroll();
  const [isVisible, setIsVisible] = useState(false);

  // Calculate section-specific transforms
  const sectionStart = index * 0.25;
  const sectionEnd = sectionStart + 0.25;

  const y = useTransform(
    scrollYProgress,
    [sectionStart, sectionEnd],
    ['100px', '0px']
  );

  const opacity = useTransform(
    scrollYProgress,
    [sectionStart - 0.05, sectionStart, sectionEnd, sectionEnd + 0.05],
    [0, 1, 1, 0.8]
  );

  // Intersection Observer for active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting) {
          updateActiveSection(id);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [id]);

  return (
    <motion.section
      ref={ref}
      id={`section-${id}`}
      className="relative min-h-screen"
      style={{
        y,
        opacity,
        zIndex: 10 + index,
        willChange: 'transform, opacity'
      }}
    >
      <div
        className="px-6 py-12"
        style={{
          background: index === 0
            ? 'linear-gradient(to bottom, transparent, var(--theme-bg) 30%)'
            : 'var(--theme-bg)',
          minHeight: '100vh',
          backdropFilter: 'blur(10px)'
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      </div>
    </motion.section>
  );
};
```

### Scroll Progress Indicator

```typescript
const ParallaxScrollProgress: React.FC = () => {
  const { scrollYProgress } = useParallaxScroll();
  const [activeSection, setActiveSection] = useState<ContentType>('home');

  const sections: ContentType[] = ['home', 'about', 'projects', 'blog', 'contact'];

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50">
      <nav aria-label="Section navigation">
        {sections.map((section, index) => (
          <button
            key={section}
            aria-label={`Go to ${section}`}
            className="block w-3 h-3 mb-4 rounded-full transition-all"
            style={{
              backgroundColor: activeSection === section
                ? 'var(--accent-color)'
                : 'rgba(var(--accent-color-rgb), 0.3)',
              transform: activeSection === section ? 'scale(1.5)' : 'scale(1)'
            }}
            onClick={() => {
              document.getElementById(`section-${section}`)?.scrollIntoView({
                behavior: 'smooth'
              });
            }}
          />
        ))}
      </nav>

      {/* Progress bar */}
      <motion.div
        className="absolute left-1/2 top-0 w-0.5 h-full -translate-x-1/2"
        style={{
          background: 'rgba(var(--accent-color-rgb), 0.1)'
        }}
      >
        <motion.div
          className="absolute top-0 left-0 right-0"
          style={{
            height: useTransform(scrollYProgress, [0, 1], ['0%', '100%']),
            background: 'var(--accent-color)',
            filter: 'blur(1px)'
          }}
        />
      </motion.div>
    </div>
  );
};
```

### Floating Theme Controls

```typescript
const FloatingThemeToggle: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setThemePreset, setAccentColor } = useTheme();

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
      >
        {isOpen && (
          <motion.div
            className="absolute bottom-16 right-0 p-4 rounded-lg"
            style={{
              backgroundColor: 'rgba(var(--theme-surface-rgb), 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(var(--accent-color-rgb), 0.3)'
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <ThemeTile isCompact />
          </motion.div>
        )}

        <motion.button
          className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center"
          style={{
            backgroundColor: 'var(--accent-color)',
            color: 'var(--theme-bg)'
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
        >
          🎨
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
};
```

---

## Performance Optimizations

### Scroll Performance

```typescript
// Debounced scroll handler for non-critical updates
const useDebounceScroll = (callback: (scrollY: number) => void, delay = 100) => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleScroll = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        callback(window.scrollY);
      }, delay);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [callback, delay]);
};

// Use requestAnimationFrame for smooth animations
const useRAFScroll = (callback: (scrollY: number) => void) => {
  const rafRef = useRef<number>();
  const scrollYRef = useRef(0);

  useEffect(() => {
    const animate = () => {
      if (scrollYRef.current !== window.scrollY) {
        scrollYRef.current = window.scrollY;
        callback(scrollYRef.current);
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [callback]);
};
```

### Lazy Loading & Code Splitting

```typescript
// Lazy load heavy content sections
const ProjectsSection = dynamic(
  () => import('./sections/ProjectsSection'),
  {
    loading: () => <SectionSkeleton />,
    ssr: false
  }
);

const BlogSection = dynamic(
  () => import('./sections/BlogSection'),
  {
    loading: () => <SectionSkeleton />,
    ssr: false
  }
);

// Progressive image loading
const useProgressiveImage = (src: string, placeholder: string) => {
  const [imgSrc, setImgSrc] = useState(placeholder);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setImgSrc(src);
  }, [src]);

  return imgSrc;
};
```

### Memory Management

```typescript
// Clean up observers and listeners
const useCleanupOnUnmount = () => {
  const observersRef = useRef<IntersectionObserver[]>([]);
  const listenersRef = useRef<Array<[string, EventListener]>>([]);

  const registerObserver = (observer: IntersectionObserver) => {
    observersRef.current.push(observer);
  };

  const registerListener = (event: string, listener: EventListener) => {
    listenersRef.current.push([event, listener]);
    window.addEventListener(event, listener);
  };

  useEffect(() => {
    return () => {
      observersRef.current.forEach(obs => obs.disconnect());
      listenersRef.current.forEach(([event, listener]) => {
        window.removeEventListener(event, listener);
      });
    };
  }, []);

  return { registerObserver, registerListener };
};
```

---

## Accessibility Features

### Reduced Motion Support

```typescript
const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

// Apply reduced motion variants
const getMotionVariants = (prefersReducedMotion: boolean) => {
  if (prefersReducedMotion) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    };
  }

  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };
};
```

### Keyboard Navigation

```typescript
// Enable keyboard scrolling between sections
const useKeyboardNavigation = () => {
  const sections = ['home', 'about', 'projects', 'blog', 'contact'];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
        case 'PageDown':
          e.preventDefault();
          navigateToSection(Math.min(currentIndex + 1, sections.length - 1));
          break;
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault();
          navigateToSection(Math.max(currentIndex - 1, 0));
          break;
        case 'Home':
          e.preventDefault();
          navigateToSection(0);
          break;
        case 'End':
          e.preventDefault();
          navigateToSection(sections.length - 1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  const navigateToSection = (index: number) => {
    setCurrentIndex(index);
    document.getElementById(`section-${sections[index]}`)?.scrollIntoView({
      behavior: 'smooth'
    });
  };
};
```

### Screen Reader Announcements

```typescript
// Announce section changes to screen readers
const useSectionAnnouncements = (activeSection: ContentType) => {
  useEffect(() => {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = `Now viewing ${activeSection} section`;

    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, [activeSection]);
};
```

---

## Testing Specifications

### Performance Benchmarks

```typescript
// Performance monitoring
const performanceMetrics = {
  scrollFPS: {
    target: 60,
    minimum: 30,
    measure: () => {
      let lastTime = performance.now();
      let fps = 0;

      const measureFPS = () => {
        const currentTime = performance.now();
        fps = 1000 / (currentTime - lastTime);
        lastTime = currentTime;

        if (fps < 30) {
          console.warn(`Low FPS detected: ${fps.toFixed(2)}`);
        }

        requestAnimationFrame(measureFPS);
      };

      measureFPS();
    }
  },

  paintComplexity: {
    target: 3,
    maximum: 5,
    measure: () => {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'paint') {
            console.log(`${entry.name}: ${entry.startTime}ms`);
          }
        }
      });
      observer.observe({ entryTypes: ['paint'] });
    }
  },

  memoryUsage: {
    target: 50, // MB
    maximum: 100, // MB
    measure: () => {
      if ('memory' in performance) {
        const used = (performance as any).memory.usedJSHeapSize / 1048576;
        const total = (performance as any).memory.totalJSHeapSize / 1048576;
        console.log(`Memory: ${used.toFixed(2)}MB / ${total.toFixed(2)}MB`);
      }
    }
  }
};
```

### E2E Test Scenarios

```typescript
// Playwright test for parallax scrolling
test.describe('Parallax Mobile Experience', () => {
  test('should maintain 60fps while scrolling', async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize({ width: 375, height: 812 });

    // Start performance monitoring
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        const frames = [];
        let rafId;
        let lastTime = performance.now();

        const measureFrame = () => {
          const currentTime = performance.now();
          const fps = 1000 / (currentTime - lastTime);
          frames.push(fps);
          lastTime = currentTime;

          if (frames.length < 100) {
            rafId = requestAnimationFrame(measureFrame);
          } else {
            resolve(frames);
          }
        };

        // Trigger scroll
        window.scrollTo({ top: 2000, behavior: 'smooth' });
        measureFrame();
      });
    });

    const avgFPS = metrics.reduce((a, b) => a + b) / metrics.length;
    expect(avgFPS).toBeGreaterThan(55);
  });

  test('should have smooth section transitions', async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize({ width: 375, height: 812 });

    // Scroll to each section
    const sections = ['about', 'projects', 'blog', 'contact'];

    for (const section of sections) {
      await page.evaluate((s) => {
        document.getElementById(`section-${s}`)?.scrollIntoView({
          behavior: 'smooth'
        });
      }, section);

      await page.waitForTimeout(1000);

      // Check if section is visible
      const isVisible = await page.locator(`#section-${section}`).isVisible();
      expect(isVisible).toBe(true);

      // Check opacity animation completed
      const opacity = await page.locator(`#section-${section}`).evaluate(
        el => window.getComputedStyle(el).opacity
      );
      expect(parseFloat(opacity)).toBeGreaterThan(0.9);
    }
  });
});
```

---

## Migration Strategy

### Gradual Rollout Plan

```typescript
// Feature flag configuration
const PARALLAX_MODE_CONFIG = {
  enabled: process.env.NEXT_PUBLIC_PARALLAX_MODE === 'true',
  percentage: parseInt(process.env.NEXT_PUBLIC_PARALLAX_ROLLOUT || '0'),

  isEnabledForUser: (userId: string) => {
    if (!PARALLAX_MODE_CONFIG.enabled) return false;

    // Use consistent hashing for A/B testing
    const hash = userId.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);

    return (hash % 100) < PARALLAX_MODE_CONFIG.percentage;
  },

  // Override for testing
  forceEnable: () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('parallax') === 'true';
    }
    return false;
  }
};
```

### Analytics Integration

```typescript
// Track parallax mode performance and engagement
const trackParallaxMetrics = () => {
  // Scroll depth tracking
  let maxScroll = 0;

  window.addEventListener('scroll', throttle(() => {
    const scrollPercentage = (window.scrollY /
      (document.documentElement.scrollHeight - window.innerHeight)) * 100;

    if (scrollPercentage > maxScroll) {
      maxScroll = scrollPercentage;

      if (scrollPercentage >= 25 && maxScroll < 26) {
        analytics.track('Parallax Scroll Depth', { depth: '25%' });
      } else if (scrollPercentage >= 50 && maxScroll < 51) {
        analytics.track('Parallax Scroll Depth', { depth: '50%' });
      } else if (scrollPercentage >= 75 && maxScroll < 76) {
        analytics.track('Parallax Scroll Depth', { depth: '75%' });
      } else if (scrollPercentage >= 90) {
        analytics.track('Parallax Scroll Depth', { depth: '90%' });
      }
    }
  }, 1000));

  // Section engagement tracking
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          analytics.track('Parallax Section View', {
            section: entry.target.id,
            viewportPercentage: entry.intersectionRatio * 100
          });
        }
      });
    },
    { threshold: [0.25, 0.5, 0.75, 1.0] }
  );

  document.querySelectorAll('section').forEach(section => {
    sectionObserver.observe(section);
  });
};
```

---

## Future Enhancements

### Phase 2 Features
1. **Scroll-triggered Animations**: Reveal content as user scrolls
2. **Dynamic Parallax Intensity**: Adjust based on device performance
3. **Gesture Controls**: Pinch to zoom, two-finger navigation
4. **Content Preloading**: Predictive loading based on scroll velocity

### Phase 3 Features
1. **3D Parallax Effects**: WebGL-powered depth layers
2. **Scroll-synced Audio**: Ambient sounds that change with sections
3. **Interactive Backgrounds**: Respond to scroll position
4. **AI-powered Scroll Suggestions**: Predict next section of interest

---

## Success Criteria

### Performance Metrics
- Maintain 60fps during scroll on 80% of devices
- First Contentful Paint < 1.5s
- Time to Interactive < 3s
- Cumulative Layout Shift < 0.05

### Engagement Metrics
- 40% increase in average scroll depth
- 25% increase in time on page
- 35% reduction in bounce rate
- 50% increase in section discoveries

### User Satisfaction
- Mobile NPS score > 8.5
- 90% positive feedback on scroll experience
- < 2% accessibility complaints
- 95% successful section navigation rate

---

**Document Status**: Ready for Review
**Next Steps**: Technical review → Prototype development → User testing → Phased rollout
**Dependencies**: Mobile Dual-Mode Architecture specification completion