# Feature Specification: Mobile Dual-Mode Architecture

**Version:** 1.0
**Date:** January 2025
**Status:** Draft
**Tech Stack:** Next.js 15.5.4, React 19.1.0, Framer Motion 12.23.22, Tailwind CSS v4
**Related Specs:** Mobile UX Single-Tile Viewport, Mobile UX Parallax Mode

---

## Executive Summary

### Strategic Vision
This specification defines the **architectural foundation** that enables two distinct mobile experiences to coexist seamlessly within the same application, providing users with choice while maintaining code efficiency and performance standards.

### Core Challenge
Supporting multiple mobile UX paradigms without:
- Code duplication
- Performance degradation
- Maintenance complexity
- User confusion
- State management conflicts

### Architectural Solution
A **unified dual-mode architecture** that:
- Shares core components between modes
- Dynamically loads mode-specific code
- Preserves state during mode transitions
- Enables A/B testing and gradual rollouts
- Maintains consistent data flow

### Business Value
- **Flexibility**: Support diverse user preferences
- **Innovation**: Test new UX patterns without risk
- **Performance**: Optimize for specific use cases
- **Scalability**: Add new modes without refactoring
- **Analytics**: Compare mode effectiveness directly

---

## Architecture Overview

### System Design Principles

#### 1. Strategy Pattern Implementation
```typescript
// Mobile layout strategies encapsulate mode-specific behavior
interface MobileLayoutStrategy {
  name: 'single-tile' | 'parallax' | 'classic-stack';

  // Lifecycle methods
  initialize(): Promise<void>;
  render(): JSX.Element;
  cleanup(): void;

  // State management
  saveState(): MobileState;
  restoreState(state: MobileState): void;

  // Navigation handling
  handleNavigation(target: ContentType): void;
  handleGesture(gesture: GestureType): void;

  // Performance optimization
  prefetch(): void;
  suspend(): void;
  resume(): void;
}
```

#### 2. Composition Over Inheritance
```typescript
// Shared components composed differently per mode
const MobileLayoutComposer = {
  compose(mode: MobileMode, components: SharedComponents) {
    switch (mode) {
      case 'single-tile':
        return composeSingleTileLayout(components);
      case 'parallax':
        return composeParallaxLayout(components);
      default:
        return composeClassicLayout(components);
    }
  }
};
```

#### 3. Dependency Injection
```typescript
// Inject mode-specific dependencies at runtime
class MobileLayoutContainer {
  constructor(
    private strategy: MobileLayoutStrategy,
    private services: MobileServices
  ) {}

  render() {
    return (
      <MobileContext.Provider value={{
        strategy: this.strategy,
        services: this.services
      }}>
        {this.strategy.render()}
      </MobileContext.Provider>
    );
  }
}
```

---

## Mode Selection Logic

### Decision Tree

```typescript
interface ModeSelectionCriteria {
  // Device capabilities
  deviceProfile: {
    cpu: 'low' | 'medium' | 'high';
    ram: number; // GB
    networkSpeed: '2g' | '3g' | '4g' | '5g';
    screenSize: { width: number; height: number };
    pixelRatio: number;
    touchPoints: number;
  };

  // User preferences
  userPreferences: {
    explicitModeChoice?: MobileMode;
    reduceMotion: boolean;
    dataS aver: boolean;
    accessibility: AccessibilityProfile;
  };

  // Context
  context: {
    isFirstVisit: boolean;
    referrer: string;
    experiment?: string;
    locale: string;
  };
}

class ModeSelector {
  selectMode(criteria: ModeSelectionCriteria): MobileMode {
    // 1. Check explicit user preference
    if (criteria.userPreferences.explicitModeChoice) {
      return criteria.userPreferences.explicitModeChoice;
    }

    // 2. Check A/B test assignment
    if (criteria.context.experiment) {
      return this.getExperimentMode(criteria.context.experiment);
    }

    // 3. Device capability assessment
    const capability = this.assessDeviceCapability(criteria.deviceProfile);

    if (capability === 'low') {
      return 'classic-stack'; // Simplest mode
    } else if (capability === 'high' && !criteria.userPreferences.reduceMotion) {
      return 'parallax'; // Most sophisticated
    }

    // 4. Default to single-tile
    return 'single-tile';
  }

  private assessDeviceCapability(profile: DeviceProfile): 'low' | 'medium' | 'high' {
    const score =
      (profile.cpu === 'high' ? 3 : profile.cpu === 'medium' ? 2 : 1) +
      (profile.ram >= 4 ? 3 : profile.ram >= 2 ? 2 : 1) +
      (profile.networkSpeed === '4g' || profile.networkSpeed === '5g' ? 3 :
       profile.networkSpeed === '3g' ? 2 : 1);

    if (score >= 8) return 'high';
    if (score >= 5) return 'medium';
    return 'low';
  }
}
```

### Runtime Mode Switching

```typescript
const useModeTransition = () => {
  const [currentMode, setCurrentMode] = useState<MobileMode>('single-tile');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionProgress, setTransitionProgress] = useState(0);

  const transitionToMode = async (newMode: MobileMode) => {
    if (isTransitioning || newMode === currentMode) return;

    setIsTransitioning(true);

    try {
      // 1. Save current state
      const savedState = await saveCurrentModeState();

      // 2. Animate transition
      await animateTransition(0, 0.5, 300);

      // 3. Load new mode code
      const newStrategy = await loadModeStrategy(newMode);

      // 4. Switch mode
      setCurrentMode(newMode);

      // 5. Restore state in new mode
      await newStrategy.restoreState(savedState);

      // 6. Complete animation
      await animateTransition(0.5, 1, 300);

    } finally {
      setIsTransitioning(false);
      setTransitionProgress(0);
    }
  };

  const animateTransition = (from: number, to: number, duration: number) => {
    return new Promise<void>(resolve => {
      const startTime = performance.now();

      const animate = () => {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const value = from + (to - from) * easeInOut(progress);

        setTransitionProgress(value);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };

      requestAnimationFrame(animate);
    });
  };

  return { currentMode, transitionToMode, isTransitioning, transitionProgress };
};
```

---

## Shared Component Architecture

### Component Abstraction Layers

```typescript
// Level 1: Core Components (Mode-agnostic)
const CoreComponents = {
  ContentRenderer: React.lazy(() => import('./core/ContentRenderer')),
  ThemeController: React.lazy(() => import('./core/ThemeController')),
  NavigationController: React.lazy(() => import('./core/NavigationController')),
  GestureHandler: React.lazy(() => import('./core/GestureHandler'))
};

// Level 2: Composite Components (Mode-aware)
const CompositeComponents = {
  MobileHeader: ({ mode }: { mode: MobileMode }) => {
    switch (mode) {
      case 'single-tile':
        return null; // No header in single-tile
      case 'parallax':
        return <MinimalHeader />;
      default:
        return <StandardHeader />;
    }
  },

  NavigationSystem: ({ mode }: { mode: MobileMode }) => {
    switch (mode) {
      case 'single-tile':
        return <BottomBarNavigation />;
      case 'parallax':
        return <ScrollProgressNavigation />;
      default:
        return <TileNavigation />;
    }
  }
};

// Level 3: Layout Components (Mode-specific)
const LayoutComponents = {
  'single-tile': React.lazy(() => import('./layouts/SingleTileLayout')),
  'parallax': React.lazy(() => import('./layouts/ParallaxLayout')),
  'classic-stack': React.lazy(() => import('./layouts/ClassicStackLayout'))
};
```

### Shared State Management

```typescript
// Unified state that works across all modes
interface UnifiedMobileState {
  // Content state (shared)
  content: {
    active: ContentType;
    history: ContentType[];
    bookmarks: Set<ContentType>;
    lastUpdated: Map<ContentType, number>;
  };

  // Navigation state (shared)
  navigation: {
    isNavigating: boolean;
    direction: 'forward' | 'backward' | null;
    gesture: GestureType | null;
  };

  // Theme state (shared)
  theme: {
    preset: ThemePreset;
    accentColor: AccentColor;
    reduceTransparency: boolean;
  };

  // Mode-specific state (dynamic)
  modeSpecific: {
    'single-tile'?: {
      sheetOpen: boolean;
      activeView: 'content' | 'navigation' | 'theme';
    };
    'parallax'?: {
      scrollPosition: number;
      activeSection: ContentType;
      parallaxIntensity: number;
    };
    'classic-stack'?: {
      focusedTile: TileType;
      expandedSections: Set<ContentType>;
    };
  };

  // Performance state (shared)
  performance: {
    fps: number;
    memoryUsage: number;
    networkSpeed: string;
  };
}

// Context that provides unified state
const UnifiedMobileContext = React.createContext<{
  state: UnifiedMobileState;
  dispatch: React.Dispatch<MobileAction>;
}>({
  state: initialState,
  dispatch: () => {}
});

// Reducer that handles both shared and mode-specific actions
const unifiedReducer = (
  state: UnifiedMobileState,
  action: MobileAction
): UnifiedMobileState => {
  // Handle shared actions
  switch (action.type) {
    case 'NAVIGATE':
      return {
        ...state,
        content: {
          ...state.content,
          active: action.payload,
          history: [...state.content.history, action.payload]
        }
      };

    case 'SET_THEME':
      return {
        ...state,
        theme: { ...state.theme, ...action.payload }
      };

    // Delegate mode-specific actions
    case 'MODE_SPECIFIC':
      return handleModeSpecificAction(state, action);

    default:
      return state;
  }
};
```

### Code Sharing Strategy

```typescript
// Shared hooks that adapt to current mode
const useNavigation = () => {
  const { mode } = useMobileMode();
  const { state, dispatch } = useUnifiedMobileState();

  const navigate = (target: ContentType) => {
    // Shared navigation logic
    dispatch({ type: 'NAVIGATE', payload: target });

    // Mode-specific behavior
    switch (mode) {
      case 'single-tile':
        // Animate tile transition
        break;
      case 'parallax':
        // Smooth scroll to section
        document.getElementById(`section-${target}`)?.scrollIntoView({
          behavior: 'smooth'
        });
        break;
      case 'classic-stack':
        // Focus new tile
        break;
    }
  };

  return { navigate, currentContent: state.content.active };
};

// Shared gesture handler with mode-specific responses
const useGestures = () => {
  const { mode } = useMobileMode();

  const handleSwipe = (direction: 'left' | 'right' | 'up' | 'down') => {
    const handlers: Record<MobileMode, () => void> = {
      'single-tile': () => {
        if (direction === 'up') openSheet();
        else if (direction === 'left') navigateNext();
        else if (direction === 'right') navigatePrevious();
      },
      'parallax': () => {
        // Parallax doesn't use swipe, relies on scroll
      },
      'classic-stack': () => {
        if (direction === 'left') focusNextTile();
        else if (direction === 'right') focusPreviousTile();
      }
    };

    handlers[mode]?.();
  };

  return { handleSwipe };
};
```

---

## Dynamic Loading & Code Splitting

### Lazy Loading Strategy

```typescript
// Mode-specific chunks loaded on demand
const ModeLoader = {
  async loadMode(mode: MobileMode): Promise<MobileLayoutStrategy> {
    switch (mode) {
      case 'single-tile':
        const { SingleTileStrategy } = await import(
          /* webpackChunkName: "mobile-single-tile" */
          './strategies/SingleTileStrategy'
        );
        return new SingleTileStrategy();

      case 'parallax':
        const { ParallaxStrategy } = await import(
          /* webpackChunkName: "mobile-parallax" */
          './strategies/ParallaxStrategy'
        );
        return new ParallaxStrategy();

      case 'classic-stack':
        const { ClassicStackStrategy } = await import(
          /* webpackChunkName: "mobile-classic" */
          './strategies/ClassicStackStrategy'
        );
        return new ClassicStackStrategy();

      default:
        throw new Error(`Unknown mode: ${mode}`);
    }
  },

  // Preload adjacent modes for faster switching
  preloadAdjacentModes(currentMode: MobileMode) {
    const preloadMap: Record<MobileMode, MobileMode[]> = {
      'single-tile': ['parallax'],
      'parallax': ['single-tile'],
      'classic-stack': ['single-tile']
    };

    preloadMap[currentMode]?.forEach(mode => {
      import(
        /* webpackPreload: true */
        `./strategies/${mode}Strategy`
      );
    });
  }
};

// Resource hints for critical mode assets
const ModeResourceHints: React.FC<{ mode: MobileMode }> = ({ mode }) => {
  useEffect(() => {
    const links: Record<MobileMode, string[]> = {
      'single-tile': [
        '/assets/mobile/bottom-bar.css',
        '/assets/mobile/sheet.css'
      ],
      'parallax': [
        '/assets/mobile/parallax.css',
        '/assets/mobile/scroll-progress.css'
      ],
      'classic-stack': [
        '/assets/mobile/tiles.css'
      ]
    };

    // Add preload links
    links[mode]?.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = href;
      document.head.appendChild(link);

      return () => document.head.removeChild(link);
    });
  }, [mode]);

  return null;
};
```

### Progressive Enhancement

```typescript
// Start with minimal mode, enhance based on capability
const useProgressiveEnhancement = () => {
  const [mode, setMode] = useState<MobileMode>('classic-stack'); // Start simple
  const [enhancements, setEnhancements] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Progressive capability detection
    const enhance = async () => {
      // Check for touch support
      if ('ontouchstart' in window) {
        setEnhancements(prev => new Set([...prev, 'touch']));
      }

      // Check for smooth scroll support
      if (CSS.supports('scroll-behavior', 'smooth')) {
        setEnhancements(prev => new Set([...prev, 'smooth-scroll']));
      }

      // Check for IntersectionObserver
      if ('IntersectionObserver' in window) {
        setEnhancements(prev => new Set([...prev, 'intersection-observer']));
      }

      // Check for good performance
      if (navigator.hardwareConcurrency >= 4) {
        setEnhancements(prev => new Set([...prev, 'high-performance']));
      }

      // Upgrade mode based on capabilities
      if (enhancements.has('touch') && enhancements.has('smooth-scroll')) {
        setMode('single-tile');
      }

      if (enhancements.has('intersection-observer') &&
          enhancements.has('high-performance')) {
        setMode('parallax');
      }
    };

    enhance();
  }, []);

  return { mode, enhancements };
};
```

---

## State Preservation & Synchronization

### Cross-Mode State Persistence

```typescript
class StatePreservation {
  private storage = new Map<string, any>();

  // Save state before mode transition
  async saveState(mode: MobileMode, state: UnifiedMobileState): Promise<void> {
    const snapshot = {
      mode,
      timestamp: Date.now(),
      content: state.content,
      theme: state.theme,
      modeSpecific: state.modeSpecific[mode],

      // Save scroll positions
      scrollPositions: this.captureScrollPositions(),

      // Save animation states
      animationStates: this.captureAnimationStates(),

      // Save form data
      formData: this.captureFormData()
    };

    // Store in memory
    this.storage.set(mode, snapshot);

    // Persist to sessionStorage
    sessionStorage.setItem(`mode-state-${mode}`, JSON.stringify(snapshot));
  }

  // Restore state after mode transition
  async restoreState(mode: MobileMode): Promise<Partial<UnifiedMobileState>> {
    // Try memory first
    let snapshot = this.storage.get(mode);

    // Fall back to sessionStorage
    if (!snapshot) {
      const stored = sessionStorage.getItem(`mode-state-${mode}`);
      if (stored) {
        snapshot = JSON.parse(stored);
      }
    }

    if (!snapshot) {
      return {};
    }

    // Restore state
    await this.restoreScrollPositions(snapshot.scrollPositions);
    await this.restoreAnimationStates(snapshot.animationStates);
    await this.restoreFormData(snapshot.formData);

    return {
      content: snapshot.content,
      theme: snapshot.theme,
      modeSpecific: { [mode]: snapshot.modeSpecific }
    };
  }

  private captureScrollPositions(): Record<string, number> {
    const positions: Record<string, number> = {};

    // Capture main scroll
    positions.main = window.scrollY;

    // Capture scrollable elements
    document.querySelectorAll('[data-scrollable]').forEach(element => {
      const id = element.getAttribute('data-scrollable-id');
      if (id) {
        positions[id] = element.scrollTop;
      }
    });

    return positions;
  }

  private restoreScrollPositions(positions: Record<string, number>): Promise<void> {
    return new Promise(resolve => {
      requestAnimationFrame(() => {
        // Restore main scroll
        window.scrollTo(0, positions.main || 0);

        // Restore scrollable elements
        Object.entries(positions).forEach(([id, position]) => {
          if (id !== 'main') {
            const element = document.querySelector(`[data-scrollable-id="${id}"]`);
            if (element) {
              element.scrollTop = position;
            }
          }
        });

        resolve();
      });
    });
  }

  private captureAnimationStates(): Record<string, any> {
    // Capture Framer Motion animation states
    const states: Record<string, any> = {};

    document.querySelectorAll('[data-framer-motion]').forEach(element => {
      const id = element.getAttribute('data-motion-id');
      if (id) {
        const transform = window.getComputedStyle(element).transform;
        const opacity = window.getComputedStyle(element).opacity;
        states[id] = { transform, opacity };
      }
    });

    return states;
  }

  private restoreAnimationStates(states: Record<string, any>): Promise<void> {
    // Animation states will be handled by Framer Motion's AnimatePresence
    return Promise.resolve();
  }

  private captureFormData(): Record<string, FormData> {
    const forms: Record<string, FormData> = {};

    document.querySelectorAll('form').forEach(form => {
      const id = form.getAttribute('id');
      if (id) {
        forms[id] = new FormData(form);
      }
    });

    return forms;
  }

  private restoreFormData(forms: Record<string, FormData>): Promise<void> {
    return new Promise(resolve => {
      Object.entries(forms).forEach(([id, formData]) => {
        const form = document.getElementById(id) as HTMLFormElement;
        if (form) {
          formData.forEach((value, key) => {
            const input = form.elements.namedItem(key) as HTMLInputElement;
            if (input) {
              input.value = value.toString();
            }
          });
        }
      });
      resolve();
    });
  }
}
```

### Real-time Synchronization

```typescript
// Sync state across browser tabs
const useCrossTabSync = () => {
  const [sharedState, setSharedState] = useState<SharedState>();

  useEffect(() => {
    // BroadcastChannel for cross-tab communication
    const channel = new BroadcastChannel('mobile-mode-sync');

    channel.onmessage = (event) => {
      if (event.data.type === 'MODE_CHANGED') {
        setSharedState(event.data.state);
      }
    };

    return () => channel.close();
  }, []);

  const broadcastModeChange = (mode: MobileMode, state: SharedState) => {
    const channel = new BroadcastChannel('mobile-mode-sync');
    channel.postMessage({ type: 'MODE_CHANGED', mode, state });
    channel.close();
  };

  return { sharedState, broadcastModeChange };
};
```

---

## Performance Optimization

### Mode-Specific Optimization

```typescript
class PerformanceOptimizer {
  private metrics: Map<MobileMode, PerformanceMetrics> = new Map();

  optimizeForMode(mode: MobileMode): OptimizationConfig {
    switch (mode) {
      case 'single-tile':
        return {
          animations: {
            duration: 300,
            easing: 'ease-out',
            willChange: ['transform', 'opacity']
          },
          rendering: {
            compositing: 'auto',
            containment: 'layout style paint',
            contentVisibility: 'auto'
          },
          resources: {
            prefetch: ['adjacent-tiles'],
            lazy: ['non-visible-content'],
            priority: ['active-tile', 'navigation']
          }
        };

      case 'parallax':
        return {
          animations: {
            duration: 0, // Use scroll-linked
            easing: 'linear',
            willChange: ['transform']
          },
          rendering: {
            compositing: 'force', // Force GPU layers
            containment: 'none', // Allow scroll effects
            contentVisibility: 'visible'
          },
          resources: {
            prefetch: ['next-section', 'images'],
            lazy: ['below-fold'],
            priority: ['visible-sections', 'background']
          }
        };

      case 'classic-stack':
        return {
          animations: {
            duration: 200,
            easing: 'ease',
            willChange: []
          },
          rendering: {
            compositing: 'auto',
            containment: 'content',
            contentVisibility: 'auto'
          },
          resources: {
            prefetch: [],
            lazy: ['all-images'],
            priority: ['visible-tiles']
          }
        };

      default:
        return this.getDefaultConfig();
    }
  }

  measurePerformance(mode: MobileMode): PerformanceMetrics {
    const metrics: PerformanceMetrics = {
      fps: this.measureFPS(),
      memoryUsage: this.measureMemory(),
      paintComplexity: this.measurePaintComplexity(),
      interactionLatency: this.measureInteractionLatency()
    };

    this.metrics.set(mode, metrics);
    this.reportMetrics(mode, metrics);

    return metrics;
  }

  private measureFPS(): number {
    let fps = 60;
    let lastTime = performance.now();
    let frame = 0;

    const measureFrame = () => {
      const currentTime = performance.now();
      frame++;

      if (currentTime >= lastTime + 1000) {
        fps = Math.round((frame * 1000) / (currentTime - lastTime));
        frame = 0;
        lastTime = currentTime;
      }

      if (frame < 100) {
        requestAnimationFrame(measureFrame);
      }
    };

    measureFrame();
    return fps;
  }

  private measureMemory(): number {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize / 1048576; // MB
    }
    return 0;
  }

  private measurePaintComplexity(): number {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      // Analyze paint timing
    });
    observer.observe({ entryTypes: ['paint'] });
    return 0; // Placeholder
  }

  private measureInteractionLatency(): number {
    // Measure time from interaction to visual response
    return 0; // Placeholder
  }

  private reportMetrics(mode: MobileMode, metrics: PerformanceMetrics) {
    // Send to analytics
    if (window.analytics) {
      window.analytics.track('Mobile Mode Performance', {
        mode,
        ...metrics
      });
    }
  }
}
```

### Resource Management

```typescript
// Intelligent resource loading based on mode and network
class ResourceManager {
  private loadedResources = new Set<string>();
  private pendingLoads = new Map<string, Promise<void>>();

  async loadForMode(mode: MobileMode, priority: 'critical' | 'high' | 'low') {
    const resources = this.getResourcesForMode(mode, priority);

    const loadPromises = resources.map(resource => {
      if (this.loadedResources.has(resource)) {
        return Promise.resolve();
      }

      if (this.pendingLoads.has(resource)) {
        return this.pendingLoads.get(resource)!;
      }

      const loadPromise = this.loadResource(resource, priority);
      this.pendingLoads.set(resource, loadPromise);

      return loadPromise;
    });

    await Promise.all(loadPromises);
  }

  private getResourcesForMode(mode: MobileMode, priority: string): string[] {
    const resourceMap: Record<MobileMode, Record<string, string[]>> = {
      'single-tile': {
        critical: ['SingleTileLayout.js', 'MobileBottomBar.js'],
        high: ['MobileNavSheet.js', 'SwipeHandler.js'],
        low: ['HapticFeedback.js']
      },
      'parallax': {
        critical: ['ParallaxLayout.js', 'ScrollController.js'],
        high: ['IntersectionObserver.js', 'SectionAnimator.js'],
        low: ['ParallaxEffects.js']
      },
      'classic-stack': {
        critical: ['StackedLayout.js'],
        high: ['TileManager.js'],
        low: ['TileAnimations.js']
      }
    };

    return resourceMap[mode]?.[priority] || [];
  }

  private async loadResource(resource: string, priority: string): Promise<void> {
    const script = document.createElement('script');
    script.src = `/mobile-assets/${resource}`;
    script.async = true;

    if (priority === 'critical') {
      script.setAttribute('fetchpriority', 'high');
    }

    return new Promise((resolve, reject) => {
      script.onload = () => {
        this.loadedResources.add(resource);
        this.pendingLoads.delete(resource);
        resolve();
      };

      script.onerror = () => {
        this.pendingLoads.delete(resource);
        reject(new Error(`Failed to load ${resource}`));
      };

      document.head.appendChild(script);
    });
  }

  unloadForMode(mode: MobileMode) {
    // Remove non-critical resources when switching modes
    const resources = this.getResourcesForMode(mode, 'low');
    resources.forEach(resource => {
      this.loadedResources.delete(resource);
      // Remove script tags if needed
    });
  }
}
```

---

## Testing Strategy

### Multi-Mode Testing Framework

```typescript
// Test utilities for dual-mode architecture
describe('Dual-Mode Architecture', () => {
  describe('Mode Selection', () => {
    it('should select appropriate mode based on device capabilities', () => {
      const selector = new ModeSelector();

      const lowEndDevice: ModeSelectionCriteria = {
        deviceProfile: {
          cpu: 'low',
          ram: 1,
          networkSpeed: '3g',
          screenSize: { width: 320, height: 568 },
          pixelRatio: 2,
          touchPoints: 1
        },
        userPreferences: {
          reduceMotion: false,
          dataSaver: true,
          accessibility: {}
        },
        context: {
          isFirstVisit: true,
          referrer: '',
          locale: 'en'
        }
      };

      expect(selector.selectMode(lowEndDevice)).toBe('classic-stack');
    });

    it('should respect user preference over device assessment', () => {
      const selector = new ModeSelector();

      const criteria: ModeSelectionCriteria = {
        deviceProfile: { /* high-end device */ },
        userPreferences: {
          explicitModeChoice: 'single-tile',
          reduceMotion: false,
          dataSaver: false,
          accessibility: {}
        },
        context: { /* ... */ }
      };

      expect(selector.selectMode(criteria)).toBe('single-tile');
    });
  });

  describe('Mode Transitions', () => {
    it('should preserve content state during mode switch', async () => {
      const { result } = renderHook(() => useModeTransition());

      // Set initial state
      act(() => {
        result.current.setContent({ type: 'projects', data: projectData });
      });

      // Transition to different mode
      await act(async () => {
        await result.current.transitionToMode('parallax');
      });

      // Verify state preserved
      expect(result.current.content).toEqual({ type: 'projects', data: projectData });
    });

    it('should maintain scroll position equivalence', async () => {
      const { result } = renderHook(() => useModeTransition());

      // Scroll in single-tile mode
      window.scrollY = 500;

      // Transition to parallax
      await act(async () => {
        await result.current.transitionToMode('parallax');
      });

      // Verify equivalent section is visible
      const activeSection = document.querySelector('.section-active');
      expect(activeSection?.id).toBe('section-projects');
    });
  });

  describe('Shared Components', () => {
    it('should render correctly in all modes', () => {
      const modes: MobileMode[] = ['single-tile', 'parallax', 'classic-stack'];

      modes.forEach(mode => {
        const { container } = render(
          <MobileContext.Provider value={{ mode }}>
            <ContentRenderer content={mockContent} />
          </MobileContext.Provider>
        );

        expect(container.querySelector('.content-renderer')).toBeInTheDocument();
        expect(container.textContent).toContain(mockContent.title);
      });
    });
  });

  describe('Performance', () => {
    it('should only load mode-specific code', async () => {
      const networkRequests: string[] = [];

      // Mock fetch to track requests
      global.fetch = jest.fn((url) => {
        networkRequests.push(url.toString());
        return Promise.resolve(new Response());
      });

      // Load single-tile mode
      await ModeLoader.loadMode('single-tile');

      // Should not load parallax assets
      expect(networkRequests).not.toContain(
        expect.stringContaining('ParallaxLayout')
      );

      // Should load single-tile assets
      expect(networkRequests).toContain(
        expect.stringContaining('SingleTileStrategy')
      );
    });

    it('should maintain 60fps during mode transitions', async () => {
      const fps: number[] = [];

      // Monitor FPS during transition
      const measureFPS = () => {
        let lastTime = performance.now();
        let frames = 0;

        const checkFrame = () => {
          const currentTime = performance.now();
          frames++;

          if (currentTime >= lastTime + 100) {
            fps.push((frames * 1000) / (currentTime - lastTime));
            frames = 0;
            lastTime = currentTime;
          }

          if (fps.length < 10) {
            requestAnimationFrame(checkFrame);
          }
        };

        checkFrame();
      };

      measureFPS();

      // Perform transition
      const { result } = renderHook(() => useModeTransition());
      await act(async () => {
        await result.current.transitionToMode('parallax');
      });

      // Check FPS stayed above 55
      const avgFPS = fps.reduce((a, b) => a + b) / fps.length;
      expect(avgFPS).toBeGreaterThan(55);
    });
  });
});
```

---

## Migration Strategy

### Phased Rollout Plan

#### Phase 1: Infrastructure (Week 1)
1. Implement mode selection logic
2. Create shared component abstractions
3. Set up dynamic loading system
4. Build state preservation layer

#### Phase 2: Single-Tile Mode (Week 2-3)
1. Migrate existing mobile layout to strategy pattern
2. Implement as default mode
3. Add feature flag for testing

#### Phase 3: Parallax Mode (Week 4-5)
1. Develop parallax strategy
2. Implement scroll-based navigation
3. Add to mode selector with 10% rollout

#### Phase 4: Integration Testing (Week 6)
1. Cross-mode state preservation
2. Performance benchmarking
3. A/B test configuration

#### Phase 5: Production Rollout (Week 7-8)
1. Gradual percentage increase
2. Monitor metrics and feedback
3. Full rollout decision

### Feature Flag Configuration

```typescript
// Progressive rollout with feature flags
const FeatureFlags = {
  DUAL_MODE_ENABLED: process.env.NEXT_PUBLIC_DUAL_MODE === 'true',

  MODE_ROLLOUT_PERCENTAGE: {
    'single-tile': 100, // Already in production
    'parallax': parseInt(process.env.NEXT_PUBLIC_PARALLAX_ROLLOUT || '0'),
    'classic-stack': 100 // Fallback always available
  },

  isModEnabledForUser(mode: MobileMode, userId: string): boolean {
    if (!this.DUAL_MODE_ENABLED) return false;

    const percentage = this.MODE_ROLLOUT_PERCENTAGE[mode];
    if (percentage === 0) return false;
    if (percentage === 100) return true;

    // Consistent hashing for stable assignment
    const hash = userId.split('').reduce((acc, char) => {
      return ((acc << 5) - acc) + char.charCodeAt(0);
    }, 0);

    return (Math.abs(hash) % 100) < percentage;
  },

  // Override for testing
  forceMode(mode: MobileMode) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('force-mobile-mode', mode);
      window.location.reload();
    }
  },

  getForcedMode(): MobileMode | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('force-mobile-mode') as MobileMode;
    }
    return null;
  }
};
```

---

## Success Metrics

### Technical Metrics
- **Code Reuse**: >60% shared components between modes
- **Bundle Size**: <10KB additional per mode
- **Load Time**: <200ms mode switch time
- **Memory Usage**: <10MB additional per mode

### User Experience Metrics
- **Mode Preference**: Track which modes users prefer
- **Transition Success**: >95% successful mode switches
- **State Preservation**: 100% content state maintained
- **Performance Consistency**: <10% FPS variance between modes

### Business Metrics
- **Engagement Increase**: 25% higher with mode choice
- **Bounce Rate Reduction**: 15% lower with optimal mode
- **Conversion Rate**: 10% improvement with parallax mode
- **User Satisfaction**: NPS increase of 2+ points

---

**Document Status**: Ready for Technical Review
**Next Steps**: Architecture review → Prototype development → Testing framework setup
**Dependencies**: Completion of individual mode specifications