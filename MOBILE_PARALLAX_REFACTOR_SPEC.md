# Mobile Parallax Layout Refactoring Specification

**Project**: dleer-portfolio
**Component**: MobileParallaxLayout.tsx
**Current Size**: 939 lines
**Date**: 2025-09-30
**Status**: Specification Phase

---

## Executive Summary

This specification outlines a comprehensive refactoring plan for the `MobileParallaxLayout.tsx` component, which has grown to 939 lines and contains multiple distinct responsibilities. The refactoring will follow established codebase patterns, fix the critical snap scrolling issue, and improve maintainability while preserving the unique parallax experience.

---

## Table of Contents

1. [Current State Analysis](#1-current-state-analysis)
2. [Established Patterns](#2-established-patterns)
3. [Problems Identified](#3-problems-identified)
4. [Target Architecture](#4-target-architecture)
5. [Snap Scrolling Issue Analysis](#5-snap-scrolling-issue-analysis)
6. [Component Breakdown Strategy](#6-component-breakdown-strategy)
7. [Implementation Phases](#7-implementation-phases)
8. [Testing Strategy](#8-testing-strategy)
9. [Risk Assessment](#9-risk-assessment)

---

## 1. Current State Analysis

### 1.1 Architecture Overview

The dleer-portfolio follows a well-organized Next.js 15 App Router architecture with:

```
/components
  /layout          - Layout managers and background
  /tiles           - Content tile components (Neofetch, Navigation, Content, Theme)
  /ui              - Reusable UI components
  /assets          - Static assets (ASCII art)

/contexts          - React Context for state management
  FocusContext     - Tile focus and content navigation
  ThemeContext     - Theme presets and accent colors

/hooks             - Custom React hooks
  useFocus         - Focus management utilities
  useResponsive    - Responsive breakpoint detection

/lib               - Configuration and utilities
```

### 1.2 MobileParallaxLayout Responsibilities

Analysis reveals **7 distinct responsibilities** in the 939-line file:

#### 1. **State Management** (Lines 22-28, scattered)
- Active section tracking
- Theme panel visibility
- Form data management
- Project/blog selection state
- Scroll position tracking

#### 2. **Scroll Behavior Management** (Lines 30-99)
- Framer Motion scroll tracking
- Active section detection with debouncing
- Scroll position percentage calculation
- Section snap detection

#### 3. **Keyboard Navigation** (Lines 101-243)
- Section navigation (Tab, Arrow keys, Page keys, Home/End)
- Number key shortcuts (1-4)
- Escape key for theme panel
- Smart form input detection
- Wrapping navigation logic

#### 4. **Content Rendering** (Lines 245-673)
- About section with skills display
- Projects list and detail views
- Blog list and detail views
- Contact form with validation
- Social links rendering
- Back navigation breadcrumbs

#### 5. **Layout Structure** (Lines 675-844)
- Fixed background with Neofetch
- Window border frame
- Scrollable content container
- Section dividers and transitions
- Spacer management

#### 6. **UI Controls** (Lines 846-935)
- Navigation dots
- Theme selector panel
- Mode toggle button
- Floating controls positioning

#### 7. **Integration Logic**
- Context integration (Theme, Focus)
- Config data consumption
- Animation orchestration
- Event handling coordination

### 1.3 Codebase Patterns Identified

#### Component Organization Patterns

**1. Small, Focused Components** (50-150 lines typical)
- `NeofetchTile.tsx`: 110 lines - Single responsibility (system info display)
- `NavigationTile.tsx`: 290 lines - Navigation tree with expansion
- `ThemeTile.tsx`: 122 lines - Theme selection UI
- `ScrollProgress.tsx`: 122 lines - Scroll indicator
- `Background.tsx`: 76 lines - Animated background effects

**2. Context-Based State Management**
- `FocusContext.tsx`: 316 lines - Comprehensive focus/navigation state
- `ThemeContext.tsx`: 205 lines - Theme and accent color management
- Components consume contexts via custom hooks (`useFocus`, `useTheme`)

**3. Separation of Concerns**
- **Layout** components (`/layout`) manage structure and arrangement
- **Tile** components (`/tiles`) handle specific content areas
- **UI** components (`/ui`) provide reusable, generic elements
- **Hooks** (`/hooks`) extract reusable logic

**4. Props Interface Patterns**
```typescript
interface ComponentNameProps {
  isBlurred?: boolean;           // Common across tiles
  onContentSelect?: (content: ContentType) => void;  // Navigation callback
  onNavigate?: (content: ContentType) => void;       // Alternative callback name
}
```

**5. Styling Patterns**
- CSS variables for theming: `var(--theme-*)`, `var(--accent-color)`
- Inline styles for dynamic theme-aware colors
- Tailwind classes for layout and spacing
- Framer Motion for animations
- Responsive design via Tailwind breakpoints

**6. File Naming Conventions**
- PascalCase for components: `MobileParallaxLayout.tsx`
- camelCase for hooks: `useFocus.ts`
- lowercase for utilities: `config.ts`

---

## 2. Established Patterns

### 2.1 Component Architecture Patterns

**Pattern: Layout Manager with Mode Detection**
```typescript
// From LayoutManager.tsx (lines 44-52)
useEffect(() => {
  const checkLayout = () => {
    setIsStacked(window.innerWidth < 1024);
  };
  checkLayout();
  window.addEventListener('resize', checkLayout);
  return () => window.removeEventListener('resize', checkLayout);
}, []);
```

**Pattern: Context Integration**
```typescript
// Standard pattern from all tile components
const { focusedTile, activeContent, setFocusedTile } = useFocus();
const { theme, setThemePreset, setAccentColor } = useTheme();
```

**Pattern: Theme-Aware Styling**
```typescript
// Inline styles with CSS variables (from NeofetchTile.tsx)
style={{
  color: isBlurred
    ? 'rgba(var(--accent-color-rgb), 0.6)'
    : 'var(--accent-color)'
}}
```

**Pattern: Keyboard Navigation Handling**
```typescript
// From LayoutManager.tsx (lines 54-72)
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      handleTabNavigation(e.shiftKey);
    }
  };
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [handleTabNavigation]);
```

### 2.2 Hooks Architecture

**Pattern: Scroll-to-Focus Hook** (`hooks/useFocus.ts`)
```typescript
export const useScrollToFocus = <T extends HTMLElement = HTMLElement>(
  tileRef: React.RefObject<T | null>,
  tileType: TileType,
  focusedTile: TileType,
  isStacked: boolean
) => {
  // RAF-based scrolling for smooth coordination with Framer Motion
  // Only scrolls when tile is focused
  // Cancels pending animations on cleanup
};
```

**Pattern: Custom Hook for Specific Feature**
- Extract complex logic into reusable hooks
- Type-safe with generics
- Side-effect management with useEffect
- Proper cleanup functions

### 2.3 Data Flow Patterns

**Configuration → Context → Components**
```typescript
// lib/config.ts provides data
export const useProjects = () => {...};
export const usePersonalInfo = () => {...};

// Components consume via hooks
const projects = useProjects();
const personal = usePersonalInfo();
```

**Context State Updates**
```typescript
// FocusContext provides navigation helpers
const { handleContentNavigation, handlePolybarNavigation } = useFocus();

// Components call helpers instead of direct state updates
onClick={() => handleContentNavigation({ type: 'about' })}
```

### 2.4 Responsive Design Patterns

**Breakpoints**:
- Mobile: `< 768px`
- Tablet: `768px - 1024px`
- Desktop: `>= 1024px`

**Layout Switching**:
```typescript
// LayoutManager checks for stacked layout
const [isStacked, setIsStacked] = React.useState(false);

if (isStacked) {
  // Check for mode preference
  if (localStorage.getItem('mobile-mode') === 'parallax') {
    return <MobileParallaxLayout />;
  }
  // Otherwise render stacked tiles
}

// Desktop gets tiled layout
return <DesktopTiledLayout />;
```

### 2.5 Animation Patterns

**Framer Motion Integration**
```typescript
// From LayoutManager (lines 148-153)
const layoutTransition = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
  mass: 1
};

<motion.div
  layout
  layoutId="tile-content"
  transition={layoutTransition}
  animate={{ backgroundColor, backdropFilter, ... }}
/>
```

**Scroll Progress Tracking**
```typescript
// From MobileParallaxLayout (lines 30-39)
const { scrollYProgress } = useScroll({
  container: scrollRef
});

const backgroundOpacity = useTransform(
  scrollYProgress,
  [0, 0.2],
  [0.7, 0.3]
);
```

---

## 3. Problems Identified

### 3.1 Critical Issues

#### **P1: Snap Scrolling Behavior**
**Location**: Lines 738, 757-759, 775-777
**Severity**: High - Degrades user experience

**Current Implementation**:
```typescript
// Container (line 738)
scrollSnapType: 'y mandatory',

// Spacer (lines 757-759)
<div style={{
  height: '60vh',
  scrollSnapAlign: 'start',
  scrollSnapStop: 'always'
}} />

// Sections (lines 775-777)
scrollSnapAlign: 'start',
scrollSnapStop: 'always',
scrollMarginTop: index === 0 ? '-60vh' : '0px'
```

**Problems**:
1. **Spacer as snap point**: The 60vh spacer creates an unintended snap target
2. **Negative scroll margin**: First section has `-60vh` margin, causing positioning issues
3. **Competing scroll behaviors**: Both container and individual sections set snap points
4. **Inconsistent snapping**: Sometimes lands on spacer, sometimes on content

**Expected Behavior**:
- Sections (About, Projects, Blog, Contact) should be snap targets
- Neofetch background should be visible during scroll but not a snap target
- Smooth transitions between sections without getting stuck

#### **P2: Component Size and Complexity**
**Severity**: Medium - Maintainability issue

- 939 lines violates single responsibility principle
- 7 distinct responsibilities in one file
- Difficult to test individual features
- Hard to reuse logic in other contexts
- Contradicts established codebase patterns (50-150 line components)

#### **P3: Code Duplication**
**Severity**: Medium - Violates DRY

- Content rendering logic duplicated from `ContentViewer.tsx`
- Form handling similar to contact form in standard layout
- Navigation logic reimplements concepts from `NavigationTile.tsx`
- Section tracking logic could be abstracted

### 3.2 Minor Issues

#### **Issue: Hardcoded Magic Numbers**
```typescript
if (scrollPosition < windowHeight * 0.4) { ... }  // Line 61
if (Math.abs(rect.top) < 50 || ...) { ... }        // Line 85
setTimeout(() => { ... }, 150);                    // Line 78
```

**Solution**: Extract to named constants

#### **Issue: Console Logging in Production**
```typescript
console.log('navigateToSection called for:', sectionId);  // Line 107
console.log('Element found:', !!element);                 // Line 111
```

**Solution**: Use development-only logging or proper logger

#### **Issue: Mixed Concerns in Effects**
- Lines 50-99: Single effect handles scroll listening, section detection, and debouncing
- Could be split into separate concerns

---

## 4. Target Architecture

### 4.1 Proposed Component Structure

```
/components/layout/MobileParallaxLayout/
├── index.tsx                          (~100 lines)
│   └── Main orchestrator, exports public API
│
├── ParallaxContainer.tsx              (~120 lines)
│   └── Scroll container with Framer Motion integration
│
├── ParallaxSection.tsx                (~80 lines)
│   └── Individual section wrapper with snap behavior
│
├── FixedNeofetchBackground.tsx        (~60 lines)
│   └── Fixed background with parallax opacity
│
├── WindowFrame.tsx                    (~40 lines)
│   └── Border frame decoration
│
├── FloatingControls.tsx               (~100 lines)
│   ├── NavigationDots
│   ├── ThemeButton
│   └── ModeToggle
│
├── sections/
│   ├── AboutSection.tsx               (~120 lines)
│   ├── ProjectsSection.tsx            (~150 lines)
│   ├── BlogSection.tsx                (~140 lines)
│   └── ContactSection.tsx             (~130 lines)
│
└── hooks/
    ├── useParallaxScroll.ts           (~80 lines)
    │   └── Scroll tracking and section detection
    │
    ├── useParallaxKeyboard.ts         (~100 lines)
    │   └── Keyboard navigation for parallax mode
    │
    └── useSectionNavigation.ts        (~70 lines)
        └── Section switching and scrollTo logic
```

**Total**: ~1,290 lines across 14 files (avg 92 lines/file)
**Current**: 939 lines in 1 file

**Benefits**:
- Each file has single responsibility
- Easier to test in isolation
- Reusable hooks for other layouts
- Follows established codebase patterns
- Better code discoverability

### 4.2 Component Responsibilities

#### **index.tsx** - Orchestrator
```typescript
export default function MobileParallaxLayout() {
  const { theme } = useTheme();
  const { activeContent } = useFocus();
  const {
    activeSection,
    scrollPercent,
    scrollRef
  } = useParallaxScroll();

  return (
    <>
      <Background />
      <WindowFrame />
      <FixedNeofetchBackground />
      <ParallaxContainer ref={scrollRef}>
        <AboutSection />
        <ProjectsSection />
        <BlogSection />
        <ContactSection />
      </ParallaxContainer>
      <FloatingControls
        activeSection={activeSection}
        scrollPercent={scrollPercent}
      />
    </>
  );
}
```

#### **useParallaxScroll.ts** - Scroll Management
```typescript
export function useParallaxScroll() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState('about');
  const [scrollPercent, setScrollPercent] = useState(0);

  // Scroll tracking with Framer Motion
  const { scrollYProgress } = useScroll({ container: scrollRef });

  // Section detection with debouncing
  useEffect(() => { /* ... */ }, []);

  // Scroll percentage calculation
  useEffect(() => { /* ... */ }, []);

  return { scrollRef, activeSection, scrollPercent, scrollYProgress };
}
```

#### **ParallaxSection.tsx** - Section Wrapper
```typescript
interface ParallaxSectionProps {
  id: string;
  index: number;
  isFirst?: boolean;
  minHeight?: string;
  children: React.ReactNode;
}

export function ParallaxSection({
  id,
  index,
  isFirst,
  minHeight = '70vh',
  children
}: ParallaxSectionProps) {
  return (
    <motion.section
      id={`section-${id}`}
      className={`relative px-6 sm:px-8 md:px-12 ${minHeight}`}
      style={{
        paddingTop: '48px',
        paddingBottom: '48px',
        backgroundColor: 'var(--theme-bg)',
        scrollSnapAlign: 'start',
        scrollSnapStop: 'always',
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      viewport={{ once: false, amount: 0.3 }}
    >
      {isFirst && <SectionDivider />}
      <div className="max-w-4xl mx-auto">
        {children}
      </div>
      {index < 3 && <SectionDivider />}
    </motion.section>
  );
}
```

### 4.3 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    MobileParallaxLayout                      │
│                      (Orchestrator)                          │
└──────────────┬────────────────────────────────┬──────────────┘
               │                                │
      ┌────────▼─────────┐            ┌────────▼─────────┐
      │  Scroll Hooks    │            │  UI Components   │
      │                  │            │                  │
      │ useParallaxScroll│            │ ParallaxContainer│
      │ useParallaxKbd   │            │ ParallaxSection  │
      │ useSectionNav    │            │ FixedBackground  │
      └────────┬─────────┘            │ FloatingControls │
               │                      └────────┬─────────┘
               │                               │
      ┌────────▼──────────────────────────────▼─────────┐
      │              Global Contexts                     │
      │                                                  │
      │  FocusContext  │  ThemeContext  │  ConfigData   │
      └──────────────────────────────────────────────────┘
```

**Key Principles**:
1. **Unidirectional data flow**: Context → Hooks → Components
2. **Separation of concerns**: Logic in hooks, presentation in components
3. **Context consumption**: Via custom hooks (`useFocus`, `useTheme`)
4. **Event handling**: Callbacks passed down, state lives at appropriate level
5. **Configuration**: External config consumed via custom hooks

---

## 5. Snap Scrolling Issue Analysis

### 5.1 Root Cause Analysis

**Current Structure**:
```typescript
<ScrollContainer style={{ scrollSnapType: 'y mandatory' }}>
  {/* PROBLEM 1: This spacer is a snap point */}
  <div style={{
    height: '60vh',
    scrollSnapAlign: 'start',      // ← Makes it a snap target
    scrollSnapStop: 'always'        // ← Forces stop here
  }} />

  {/* PROBLEM 2: First section has negative scroll margin */}
  {sections.map((section, index) => (
    <section style={{
      scrollSnapAlign: 'start',
      scrollSnapStop: 'always',
      scrollMarginTop: index === 0 ? '-60vh' : '0px'  // ← Conflicts with spacer
    }}>
      {renderSection(section.id)}
    </section>
  ))}
</ScrollContainer>
```

**Why It Fails**:
1. **Spacer snap point**: Browser tries to snap to spacer, which shows mostly blank Neofetch area
2. **Negative margin conflict**: First section's `-60vh` margin tries to compensate but creates janky positioning
3. **Competing snap targets**: Browser must choose between spacer and first section
4. **Inconsistent behavior**: Depending on scroll velocity, lands on different targets

### 5.2 Solution Strategy

**Goal**: Sections snap cleanly, Neofetch background remains visible during scroll but isn't a snap target.

**Approach 1: Remove Spacer Snap** ⭐ **RECOMMENDED**
```typescript
<ScrollContainer style={{ scrollSnapType: 'y mandatory' }}>
  {/* Fixed background - no snap */}
  <div style={{
    height: '60vh',
    scrollSnapAlign: 'none',  // ← KEY: Don't snap to this
    pointerEvents: 'none'      // ← Prevent interaction
  }} />

  {/* Sections all snap normally */}
  {sections.map((section, index) => (
    <section style={{
      scrollSnapAlign: 'start',
      scrollSnapStop: 'always',
      // NO scroll margin needed now
    }}>
      {renderSection(section.id)}
    </section>
  ))}
</ScrollContainer>
```

**Why This Works**:
- Spacer exists for parallax background positioning only
- No longer a snap target
- Sections snap cleanly without negative margins
- Simple, maintainable solution

**Approach 2: Scroll Margin Adjustment** (Alternative)
```typescript
<ScrollContainer style={{ scrollSnapType: 'y mandatory' }}>
  {/* Spacer with no snap properties */}
  <div style={{ height: '60vh' }} />

  {sections.map((section, index) => (
    <section style={{
      scrollSnapAlign: 'start',
      scrollSnapStop: 'always',
      // Positive margin to account for spacer
      scrollMarginTop: index === 0 ? '0px' : '0px'
    }}>
      {renderSection(section.id)}
    </section>
  ))}
</ScrollContainer>
```

**Approach 3: CSS Scroll Padding** (Alternative)
```typescript
<ScrollContainer style={{
  scrollSnapType: 'y mandatory',
  scrollPaddingTop: '60vh'  // ← Account for spacer globally
}}>
  <div style={{ height: '60vh' }} />

  {sections.map((section, index) => (
    <section style={{
      scrollSnapAlign: 'start',
      scrollSnapStop: 'always'
    }}>
      {renderSection(section.id)}
    </section>
  ))}
</ScrollContainer>
```

### 5.3 Testing Plan for Snap Fix

**Test Cases**:
1. **Slow scroll down**: Should snap to About → Projects → Blog → Contact
2. **Slow scroll up**: Should snap in reverse order
3. **Fast flick down**: Should skip sections but still snap cleanly
4. **Fast flick up**: Same as down but reverse
5. **Programmatic navigation**: Dots/keyboard should scroll to exact section
6. **Page load**: Should start at top (Neofetch visible)
7. **Mobile devices**: iOS Safari, Chrome, Firefox

**Success Criteria**:
- ✅ Never snaps to blank/spacer area
- ✅ All 4 content sections are reliably reachable
- ✅ No jittery or fighting scroll behavior
- ✅ Smooth transitions between sections
- ✅ Keyboard navigation works correctly

---

## 6. Component Breakdown Strategy

### 6.1 Phase 1: Extract Hooks (Low Risk)

**New Files**:
```typescript
// hooks/useParallaxScroll.ts
export function useParallaxScroll(sections: Section[]) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState('about');
  const [scrollPercent, setScrollPercent] = useState(0);

  const { scrollYProgress } = useScroll({ container: scrollRef });

  // Extract lines 50-99: Section detection logic
  useEffect(() => {
    // Scroll listener with debouncing
    // Active section detection
  }, [sections]);

  // Extract scroll percentage calculation
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const scrollTop = target.scrollTop;
    const scrollHeight = target.scrollHeight - target.clientHeight;
    const percent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    setScrollPercent(percent);
  }, []);

  return {
    scrollRef,
    activeSection,
    setActiveSection,
    scrollPercent,
    scrollYProgress,
    handleScroll
  };
}
```

```typescript
// hooks/useParallaxKeyboard.ts
export function useParallaxKeyboard(
  sections: Section[],
  activeSection: string,
  navigateToSection: (id: string) => void,
  navigateToNextSection: (reverse?: boolean) => void,
  additionalHandlers?: {
    onEscape?: () => void;
  }
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Extract lines 166-243: Keyboard navigation logic
      // Tab, Arrow keys, Page keys, Home/End, Number keys
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSection, navigateToSection, navigateToNextSection, additionalHandlers]);
}
```

```typescript
// hooks/useSectionNavigation.ts
export function useSectionNavigation(
  sections: Section[],
  activeSection: string,
  setActiveSection: (id: string) => void,
  scrollRef: RefObject<HTMLDivElement>
) {
  // Extract lines 102-163: Navigation functions
  const navigateToSection = useCallback((sectionId: string) => {
    // Calculate scroll position
    // Smooth scroll to target
  }, [sections, scrollRef]);

  const navigateToNextSection = useCallback((reverse = false) => {
    // Handle wrapping navigation
  }, [sections, activeSection, navigateToSection]);

  return { navigateToSection, navigateToNextSection };
}
```

**Benefits**:
- Extracted logic can be tested independently
- No changes to rendering logic (low risk)
- Hooks can be reused in other layouts
- Main file becomes smaller and more readable

### 6.2 Phase 2: Extract Section Components (Medium Risk)

**New Files**:
```typescript
// components/layout/MobileParallaxLayout/sections/AboutSection.tsx
export function AboutSection() {
  const personal = usePersonalInfo();
  const skills = useSkills();

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold" style={{ color: 'var(--accent-color)' }}>
        {personal.title}
      </h2>
      {/* Extract lines 250-293: About content */}
    </div>
  );
}
```

```typescript
// components/layout/MobileParallaxLayout/sections/ProjectsSection.tsx
export function ProjectsSection() {
  const projects = useProjects();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  if (selectedProject) {
    return <ProjectDetail project={project} onBack={() => setSelectedProject(null)} />;
  }

  return <ProjectsList projects={projects} onSelect={setSelectedProject} />;
}
```

**Similar extractions for BlogSection and ContactSection**

**Benefits**:
- Sections can be developed/tested independently
- Easier to add new sections in future
- Follows established pattern (separate files for different content types)
- State management localized to relevant section

### 6.3 Phase 3: Extract Layout Components (Low Risk)

```typescript
// components/layout/MobileParallaxLayout/FixedNeofetchBackground.tsx
export function FixedNeofetchBackground({ opacity }: { opacity: MotionValue<number> }) {
  return (
    <motion.div
      className="fixed flex items-center justify-center pointer-events-none"
      style={{
        top: '28px',
        left: '28px',
        right: '28px',
        height: '60vh',
        opacity,
        backgroundColor: 'rgba(var(--theme-bg-rgb), 0.9)',
        backdropFilter: 'blur(10px)',
        zIndex: 0
      }}
    >
      {/* Extract lines 705-727 */}
    </motion.div>
  );
}
```

```typescript
// components/layout/MobileParallaxLayout/WindowFrame.tsx
export function WindowFrame() {
  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{
        top: '12px',
        left: '12px',
        right: '12px',
        bottom: '12px',
        border: '2px solid rgba(var(--accent-color-rgb), 0.6)',
        borderRadius: '0px',
        boxShadow: '0 0 20px rgba(var(--accent-color-rgb), 0.2)'
      }}
    />
  );
}
```

```typescript
// components/layout/MobileParallaxLayout/FloatingControls.tsx
export function FloatingControls({
  activeSection,
  scrollPercent,
  sections,
  onNavigate
}: FloatingControlsProps) {
  const [showThemePanel, setShowThemePanel] = useState(false);

  return (
    <>
      <NavigationDots
        sections={sections}
        activeSection={activeSection}
        onNavigate={onNavigate}
      />
      <ThemeSelectorButton
        showPanel={showThemePanel}
        onToggle={() => setShowThemePanel(!showThemePanel)}
      />
      <ModeToggleButton />
      <ScrollProgress scrollPercent={scrollPercent} />
    </>
  );
}
```

### 6.4 Phase 4: Refactor Main Component (Low Risk)

```typescript
// components/layout/MobileParallaxLayout/index.tsx
export default function MobileParallaxLayout() {
  const { theme } = useTheme();
  const { activeContent } = useFocus();

  // Phase 1: Use extracted hooks
  const sections = useMemo(() => [
    { id: 'about', title: 'About' },
    { id: 'projects', title: 'Projects' },
    { id: 'blog', title: 'Blog' },
    { id: 'contact', title: 'Contact' }
  ], []);

  const {
    scrollRef,
    activeSection,
    setActiveSection,
    scrollPercent,
    scrollYProgress,
    handleScroll
  } = useParallaxScroll(sections);

  const { navigateToSection, navigateToNextSection } = useSectionNavigation(
    sections,
    activeSection,
    setActiveSection,
    scrollRef
  );

  useParallaxKeyboard(
    sections,
    activeSection,
    navigateToSection,
    navigateToNextSection,
    { onEscape: () => setShowThemePanel(false) }
  );

  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.2], [0.7, 0.3]);

  return (
    <>
      <Background />

      {/* Phase 3: Use extracted layout components */}
      <WindowFrame />
      <FixedNeofetchBackground opacity={backgroundOpacity} />

      {/* Phase 2: Use ParallaxContainer wrapper */}
      <ParallaxContainer ref={scrollRef} onScroll={handleScroll}>
        <Spacer height="60vh" />

        {/* Phase 2: Use extracted section components */}
        <ParallaxSection id="about" index={0} isFirst>
          <AboutSection />
        </ParallaxSection>

        <ParallaxSection id="projects" index={1}>
          <ProjectsSection />
        </ParallaxSection>

        <ParallaxSection id="blog" index={2}>
          <BlogSection />
        </ParallaxSection>

        <ParallaxSection id="contact" index={3}>
          <ContactSection />
        </ParallaxSection>

        <Spacer height="10vh" />
      </ParallaxContainer>

      {/* Phase 3: Use extracted floating controls */}
      <FloatingControls
        activeSection={activeSection}
        scrollPercent={scrollPercent}
        sections={sections}
        onNavigate={navigateToSection}
      />
    </>
  );
}
```

**Final Result**: ~100 lines, highly readable, follows all established patterns

---

## 7. Implementation Phases

### 7.1 Phase 0: Preparation (1 hour)

**Tasks**:
- [x] Create specification document
- [ ] Set up feature branch: `feature/parallax-refactor`
- [ ] Create backup of current implementation
- [ ] Review with stakeholder (user approval)
- [ ] Set up testing environment

**Deliverable**: Approved specification, clean branch

### 7.2 Phase 1: Fix Snap Scrolling (2-3 hours)

**Priority**: **CRITICAL** - User experience issue

**Tasks**:
1. **Implement snap fix** (30 min)
   - Remove `scrollSnapAlign` and `scrollSnapStop` from spacer div
   - Remove negative `scrollMarginTop` from first section
   - Test basic scrolling behavior

2. **Test on multiple devices** (1 hour)
   - Chrome desktop
   - Firefox desktop
   - Safari desktop
   - iOS Safari (via device or simulator)
   - Chrome Android (via device or emulator)

3. **Fine-tune if needed** (30 min - 1 hour)
   - Adjust `scrollSnapStop` (try `normal` vs `always`)
   - Test scroll velocity handling
   - Verify programmatic navigation still works

4. **Commit snap fix** (15 min)
   - Commit with message: "fix: Resolve snap scrolling issues in parallax mode"
   - Tag as `snap-fix-v1` for easy rollback if needed

**Success Criteria**:
- ✅ All 4 sections reliably reachable via scroll
- ✅ No snapping to blank spacer area
- ✅ Smooth transitions without jitter
- ✅ Keyboard navigation works
- ✅ Navigation dots work

**Risk**: Low - Changes are localized to scroll container styles

---

### 7.3 Phase 2: Extract Hooks (3-4 hours)

**Priority**: Medium - Improves maintainability, low risk

**Tasks**:
1. **Create `useParallaxScroll` hook** (1.5 hours)
   - Extract lines 30-99 from MobileParallaxLayout.tsx
   - Move scroll tracking, section detection, debouncing
   - Add TypeScript interfaces
   - Write JSDoc comments
   - Test with existing layout (should be drop-in replacement)

2. **Create `useParallaxKeyboard` hook** (1 hour)
   - Extract lines 166-243
   - Move all keyboard event handling
   - Parameterize callbacks
   - Add escape hatch for additional handlers
   - Test all keyboard shortcuts

3. **Create `useSectionNavigation` hook** (1 hour)
   - Extract lines 102-163
   - Move `navigateToSection` and `navigateToNextSection`
   - Add proper TypeScript types
   - Test programmatic navigation

4. **Update main component** (30 min)
   - Import and use new hooks
   - Verify no regressions
   - Test all functionality

**Deliverable**: Three new custom hooks, main component 200 lines smaller

**Commit Message**: `refactor: Extract parallax hooks for better separation of concerns`

**Risk**: Low - Hooks don't change rendering, easy to test independently

---

### 7.4 Phase 3: Extract Section Components (4-5 hours)

**Priority**: Medium - Improves code organization

**Tasks**:
1. **Create section component files** (30 min)
   ```
   components/layout/MobileParallaxLayout/sections/
   ├── AboutSection.tsx
   ├── ProjectsSection.tsx
   ├── BlogSection.tsx
   └── ContactSection.tsx
   ```

2. **Extract AboutSection** (1 hour)
   - Move lines 248-293
   - Consume `usePersonalInfo()` and `useSkills()`
   - Preserve styling and structure
   - Add TypeScript props interface (if needed)

3. **Extract ProjectsSection** (1.5 hours)
   - Move lines 295-423
   - Handle project selection state locally
   - Split into `ProjectsList` and `ProjectDetail` sub-components
   - Preserve navigation and styling

4. **Extract BlogSection** (1.5 hours)
   - Move lines 425-529
   - Handle blog selection state locally
   - Similar structure to Projects
   - Preserve styling

5. **Extract ContactSection** (1 hour)
   - Move lines 531-668
   - Keep form state management within section
   - Preserve form validation and submit handling

6. **Create `ParallaxSection` wrapper** (30 min)
   - Extract common section structure (lines 764-834)
   - Handle animation, styling, snap behavior
   - Reusable for all sections

7. **Update main component** (30 min)
   - Import section components
   - Use `ParallaxSection` wrapper
   - Verify rendering

**Deliverable**: 5 new section component files, main file 400+ lines smaller

**Commit Message**: `refactor: Extract section components from parallax layout`

**Risk**: Medium - More complex extraction, but no logic changes

---

### 7.5 Phase 4: Extract Layout Components (2-3 hours)

**Priority**: Low - Polish and consistency

**Tasks**:
1. **Create layout component directory** (5 min)
   ```
   components/layout/MobileParallaxLayout/
   ├── FixedNeofetchBackground.tsx
   ├── WindowFrame.tsx
   ├── ParallaxContainer.tsx
   └── FloatingControls.tsx
   ```

2. **Extract `FixedNeofetchBackground`** (45 min)
   - Move lines 705-727
   - Accept `opacity` MotionValue prop
   - Handle Neofetch rendering and gradient overlay

3. **Extract `WindowFrame`** (30 min)
   - Move lines 691-702
   - Simple static component
   - Theme-aware border

4. **Extract `ParallaxContainer`** (1 hour)
   - Move lines 730-844
   - Handle scroll container setup
   - Pass refs and event handlers
   - Configure snap scrolling

5. **Extract `FloatingControls`** (1 hour)
   - Move lines 846-935
   - Combine navigation dots, theme button, mode toggle
   - Create sub-components if needed
   - Handle all floating UI

**Deliverable**: 4 new layout component files

**Commit Message**: `refactor: Extract layout components from parallax mode`

**Risk**: Low - Mostly presentational components

---

### 7.6 Phase 5: Final Cleanup & Optimization (2-3 hours)

**Priority**: Low - Final polish

**Tasks**:
1. **Extract constants** (30 min)
   - Create `constants.ts` with section definitions, magic numbers
   - Replace hardcoded values throughout

2. **Remove dead code** (30 min)
   - Remove commented code
   - Remove unused imports
   - Remove debug console.logs

3. **Add JSDoc comments** (1 hour)
   - Document all public interfaces
   - Add component usage examples
   - Document hook parameters and return values

4. **Performance audit** (30 min)
   - Check for unnecessary re-renders
   - Verify `useCallback`/`useMemo` usage
   - Test scroll performance on mobile

5. **Accessibility review** (30 min)
   - Verify ARIA attributes
   - Check keyboard navigation
   - Test with screen reader (if possible)

**Deliverable**: Polished, documented, optimized codebase

**Commit Message**: `refactor: Final cleanup and documentation for parallax layout`

---

### 7.7 Phase 6: Testing & Documentation (2-3 hours)

**Priority**: High - Ensure quality

**Tasks**:
1. **Manual testing** (1.5 hours)
   - Test all sections and navigation
   - Test on desktop (Chrome, Firefox, Safari)
   - Test on mobile (iOS Safari, Chrome Android)
   - Test keyboard shortcuts
   - Test theme switching
   - Test mode toggle
   - Verify no regressions in standard tiled mode

2. **Update CLAUDE.md** (1 hour)
   - Document new architecture
   - Update component structure section
   - Add parallax-specific documentation
   - Document hooks and their usage

3. **Create usage guide** (30 min)
   - How to add new sections
   - How to customize behavior
   - How to extend hooks

**Deliverable**: Fully tested implementation, updated documentation

---

### 7.8 Timeline Estimate

| Phase | Duration | Cumulative | Priority |
|-------|----------|------------|----------|
| **Phase 0**: Preparation | 1 hour | 1 hour | Required |
| **Phase 1**: Fix Snap Scrolling | 2-3 hours | 3-4 hours | **CRITICAL** |
| **Phase 2**: Extract Hooks | 3-4 hours | 6-8 hours | Medium |
| **Phase 3**: Extract Sections | 4-5 hours | 10-13 hours | Medium |
| **Phase 4**: Extract Layout | 2-3 hours | 12-16 hours | Low |
| **Phase 5**: Cleanup | 2-3 hours | 14-19 hours | Low |
| **Phase 6**: Testing & Docs | 2-3 hours | 16-22 hours | High |

**Total Estimated Time**: 16-22 hours

**Recommended Approach**:
- **Must Do**: Phases 0, 1, 6 (5-8 hours) - Fixes critical issue
- **Should Do**: Phases 2, 3 (13-19 hours) - Major refactoring benefits
- **Nice to Have**: Phases 4, 5 (16-22 hours) - Complete implementation

---

## 8. Testing Strategy

### 8.1 Unit Testing (Future Enhancement)

**Note**: The project currently has no test infrastructure. This section documents testing approach if tests are added later.

**Hook Tests** (if test infrastructure added):
```typescript
// hooks/__tests__/useParallaxScroll.test.ts
describe('useParallaxScroll', () => {
  it('should track active section based on scroll position', () => {
    // Mock scroll container
    // Simulate scroll events
    // Assert activeSection updates
  });

  it('should calculate scroll percentage correctly', () => {
    // Mock scroll container
    // Test edge cases (0%, 50%, 100%)
  });

  it('should debounce section detection', () => {
    // Fast scroll simulation
    // Verify debouncing works
  });
});
```

### 8.2 Integration Testing

**Manual Test Checklist**:

**Snap Scrolling** (Priority: CRITICAL)
- [ ] Slow scroll down reaches all sections
- [ ] Slow scroll up reaches all sections
- [ ] Fast flick down snaps correctly
- [ ] Fast flick up snaps correctly
- [ ] Never gets stuck on spacer
- [ ] No jittery behavior

**Keyboard Navigation**
- [ ] Tab key cycles through sections
- [ ] Shift+Tab cycles backwards
- [ ] Arrow Down goes to next section
- [ ] Arrow Up goes to previous section
- [ ] Page Down goes to next section
- [ ] Page Up goes to previous section
- [ ] Home goes to first section (About)
- [ ] End goes to last section (Contact)
- [ ] Number keys 1-4 jump to sections
- [ ] Escape closes theme panel

**Navigation Dots**
- [ ] Dots update to show active section
- [ ] Clicking dots navigates to section
- [ ] Active dot is visually distinct
- [ ] Dots are accessible with keyboard

**Content Rendering**
- [ ] About section shows bio and skills
- [ ] Projects section shows project list
- [ ] Clicking project shows detail view
- [ ] Back button returns to project list
- [ ] Blog section shows post list
- [ ] Clicking post shows detail view
- [ ] Back button returns to blog list
- [ ] Contact form accepts input
- [ ] Social links are clickable

**Theme Integration**
- [ ] Theme button opens panel
- [ ] Switching themes updates colors
- [ ] Accent color changes apply
- [ ] Background effect toggle works
- [ ] Theme persists after reload

**Mode Toggle**
- [ ] "Switch to Tiles" button visible
- [ ] Clicking toggles to stacked mode
- [ ] Mode preference persists in localStorage

**Cross-Browser** (Desktop)
- [ ] Chrome: All functionality works
- [ ] Firefox: All functionality works
- [ ] Safari: All functionality works
- [ ] Edge: All functionality works (if applicable)

**Mobile Devices**
- [ ] iOS Safari: Snap scrolling works
- [ ] iOS Safari: Touch targets adequate
- [ ] Chrome Android: Snap scrolling works
- [ ] Chrome Android: Touch targets adequate
- [ ] Portrait orientation works
- [ ] Landscape orientation works

**Performance**
- [ ] No noticeable lag during scroll
- [ ] Animations are smooth (60fps target)
- [ ] Theme transitions are smooth
- [ ] No memory leaks during extended use

### 8.3 Regression Testing

**Test Against Standard Tiled Mode**:
- [ ] Desktop layout still works (unchanged)
- [ ] Mobile stacked layout still works (unchanged)
- [ ] Mode switching between parallax and stacked works
- [ ] Navigation tile functions normally
- [ ] Content viewer functions normally
- [ ] Theme tile functions normally
- [ ] Polybar navigation works

**Test Focus Context Integration**:
- [ ] Focus state updates correctly
- [ ] Content navigation still works
- [ ] Polybar navigation still works
- [ ] Tab navigation in tiled mode unchanged

**Test Theme Context Integration**:
- [ ] All three theme presets work (Tokyo Night, Nord, Solarized)
- [ ] Accent color changes work
- [ ] Background effect toggle works
- [ ] Theme persistence works

### 8.4 Acceptance Criteria

**Phase 1 (Snap Fix) - MUST PASS**:
- ✅ All 4 sections reachable via scroll
- ✅ No blank/spacer snapping
- ✅ Smooth scroll behavior on desktop
- ✅ Smooth scroll behavior on iOS Safari
- ✅ Keyboard navigation works
- ✅ Navigation dots work

**Phase 2-5 (Refactoring) - MUST PASS**:
- ✅ All Phase 1 criteria still pass
- ✅ No visual changes from user perspective
- ✅ No functional changes from user perspective
- ✅ Code is more maintainable (subjective, but measurable via metrics)
- ✅ No performance degradation

**Code Quality Metrics**:
- Average file size: < 150 lines (currently 939)
- Main file size: < 150 lines (currently 939)
- Files with single responsibility: 100% (target)
- Reusable hooks: >= 3
- Component nesting depth: <= 4 levels

---

## 9. Risk Assessment

### 9.1 Technical Risks

**Risk: Snap Scrolling Fix Fails**
- **Probability**: Low-Medium
- **Impact**: High (UX remains broken)
- **Mitigation**:
  - Test multiple approaches (documented 3 options)
  - Test on multiple browsers/devices before committing
  - Keep original implementation in git history for quick rollback
  - Tag commit for easy revert: `snap-fix-v1`

**Risk: Refactoring Introduces Regressions**
- **Probability**: Medium
- **Impact**: Medium (functionality breaks)
- **Mitigation**:
  - Incremental refactoring (small commits)
  - Test after each phase
  - Comprehensive manual testing checklist
  - Keep browser DevTools open for console errors
  - Git bisect available if issues arise

**Risk: Performance Degradation**
- **Probability**: Low
- **Impact**: Medium (scroll becomes janky)
- **Mitigation**:
  - Profile before and after refactoring
  - Monitor React DevTools profiler
  - Test on lower-end mobile devices
  - Ensure proper `useCallback`/`useMemo` usage
  - Verify no unnecessary re-renders

**Risk: Breaking Mobile Experience**
- **Probability**: Low
- **Impact**: High (mobile users affected)
- **Mitigation**:
  - Test on actual devices (not just desktop responsive mode)
  - Test both iOS and Android
  - Test portrait and landscape
  - Verify touch targets remain adequate
  - Check for iOS-specific quirks (rubber-banding, etc.)

### 9.2 Project Risks

**Risk: Scope Creep**
- **Probability**: Medium
- **Impact**: Low-Medium (timeline extends)
- **Mitigation**:
  - Strict adherence to specification
  - Phase-based approach allows stopping early
  - "Must Do" vs "Nice to Have" prioritization
  - Time-box each phase

**Risk: Incomplete Testing**
- **Probability**: Medium
- **Impact**: High (bugs reach users)
- **Mitigation**:
  - Comprehensive test checklist
  - Test on multiple browsers/devices
  - Phased rollout (test locally, then deploy)
  - Easy rollback plan (feature flag or git revert)

**Risk: Documentation Becomes Outdated**
- **Probability**: Medium
- **Impact**: Low (developer confusion)
- **Mitigation**:
  - Update CLAUDE.md as part of refactoring
  - Include documentation in Phase 6 (required)
  - Keep inline comments up to date
  - JSDoc for all public interfaces

### 9.3 Rollback Plan

**If Snap Fix Fails**:
1. `git revert <commit-hash>` - Snap fix commit
2. Return to investigating alternative solutions
3. Consider disabling parallax mode temporarily
4. Communicate with users about issue

**If Refactoring Introduces Bugs**:
1. Identify which phase introduced the issue (git bisect)
2. Fix the specific bug (preferred)
3. OR revert the phase that introduced it
4. Re-test and continue

**If Performance Degrades**:
1. Profile with React DevTools
2. Identify bottleneck components
3. Add `React.memo`, `useCallback`, `useMemo` as needed
4. Consider lazy loading heavy sections
5. Worst case: revert to Phase 1 (snap fix only)

**Nuclear Option**:
```bash
# Return to pre-refactor state
git checkout main
git checkout -b rollback-parallax
git revert <range-of-commits>
git push origin rollback-parallax
```

### 9.4 Success Metrics

**Quantitative**:
- File count: 1 file → ~14 files ✅
- Average file size: 939 lines → ~92 lines ✅
- Main file size: 939 lines → ~100 lines ✅
- Reusable hooks: 0 → 3+ ✅
- Snap scrolling issues: 1 → 0 ✅

**Qualitative**:
- Code readability: Improved ✅
- Component reusability: Improved ✅
- Maintainability: Significantly improved ✅
- Test coverage: Easier to add tests ✅
- Developer onboarding: Faster understanding ✅

---

## 10. Conclusion

### 10.1 Summary

This specification provides a comprehensive plan to:
1. **Fix the critical snap scrolling issue** (Phase 1 - 2-3 hours)
2. **Refactor the 939-line component** into a maintainable, modular structure (Phases 2-5 - 11-16 hours)
3. **Ensure quality through testing** (Phase 6 - 2-3 hours)

The refactoring follows established codebase patterns:
- Small, focused components (50-150 lines)
- Context-based state management
- Custom hooks for reusable logic
- Clear separation of concerns
- Consistent naming conventions

### 10.2 Recommended Approach

**Minimum Viable Refactoring** (5-8 hours):
- Phase 0: Preparation
- Phase 1: Fix snap scrolling (CRITICAL)
- Phase 6: Testing and documentation

This addresses the user experience issue and ensures quality.

**Recommended Full Refactoring** (16-22 hours):
- All phases completed
- Significantly improved codebase maintainability
- Sets foundation for future parallax features
- Aligns with project architecture standards

### 10.3 Next Steps

1. **Review Specification**: User/stakeholder approval
2. **Create Feature Branch**: `feature/parallax-refactor`
3. **Begin Phase 1**: Fix snap scrolling (highest priority)
4. **Iterate Through Phases**: Following the plan
5. **Deploy & Monitor**: Watch for issues in production

### 10.4 Long-Term Benefits

**For Developers**:
- Easier to understand and modify
- Faster onboarding for new contributors
- Reusable hooks for other layouts
- Better testability

**For Users**:
- Fixed snap scrolling (immediate)
- Smoother experience (performance)
- Consistent behavior across devices
- Foundation for future enhancements

**For Project**:
- Aligned with architecture standards
- Reduced technical debt
- Easier to maintain long-term
- Better code quality metrics

---

## Appendix A: File Structure After Refactoring

```
/components/layout/MobileParallaxLayout/
├── index.tsx                          (100 lines) - Main orchestrator
│
├── ParallaxContainer.tsx              (120 lines) - Scroll container
├── ParallaxSection.tsx                (80 lines)  - Section wrapper
├── FixedNeofetchBackground.tsx        (60 lines)  - Fixed background
├── WindowFrame.tsx                    (40 lines)  - Border frame
├── FloatingControls.tsx               (100 lines) - Floating UI
│
├── sections/
│   ├── AboutSection.tsx               (120 lines) - About content
│   ├── ProjectsSection.tsx            (150 lines) - Projects content
│   ├── BlogSection.tsx                (140 lines) - Blog content
│   └── ContactSection.tsx             (130 lines) - Contact form
│
└── hooks/
    ├── useParallaxScroll.ts           (80 lines)  - Scroll management
    ├── useParallaxKeyboard.ts         (100 lines) - Keyboard navigation
    └── useSectionNavigation.ts        (70 lines)  - Section switching

Total: ~1,290 lines across 14 files (avg 92 lines/file)
Previous: 939 lines in 1 file
```

## Appendix B: Key Constants

```typescript
// constants.ts
export const PARALLAX_CONSTANTS = {
  // Scroll detection
  NEOFETCH_THRESHOLD: 0.4,        // 40% of viewport for Neofetch detection
  SNAP_THRESHOLD: 50,             // 50px for snap position detection
  SCROLL_DEBOUNCE_MS: 150,        // 150ms debounce for scroll events

  // Spacing
  NEOFETCH_HEIGHT: '60vh',        // Fixed background height
  SECTION_MIN_HEIGHT: '70vh',     // Default section minimum height
  ABOUT_MIN_HEIGHT: '100vh',      // About section minimum height
  FOOTER_SPACER: '10vh',          // Bottom spacer height

  // Layout
  WINDOW_FRAME_INSET: '12px',     // Frame distance from edge
  CONTENT_INSET: '28px',          // Content distance from frame
  MAX_CONTENT_WIDTH: '1024px',    // Max content width (4xl)

  // Sections
  SECTIONS: [
    { id: 'about', title: 'About' },
    { id: 'projects', title: 'Projects' },
    { id: 'blog', title: 'Blog' },
    { id: 'contact', title: 'Contact' }
  ] as const
};
```

## Appendix C: Snap Scrolling Fix - Code Comparison

### Before (Current Implementation)
```typescript
<div
  ref={scrollRef}
  className="fixed overflow-y-auto hide-scrollbar"
  style={{
    top: '28px',
    left: '28px',
    right: '28px',
    bottom: '28px',
    scrollSnapType: 'y mandatory',
    scrollBehavior: 'smooth',
    overscrollBehavior: 'contain',
    WebkitOverflowScrolling: 'touch' as any
  }}
>
  {/* PROBLEM: This spacer is a snap point */}
  <div
    style={{
      height: '60vh',
      scrollSnapAlign: 'start',      // ← Remove this
      scrollSnapStop: 'always'        // ← Remove this
    }}
  />

  {sections.map((section, index) => (
    <section
      key={section.id}
      id={`section-${section.id}`}
      style={{
        scrollSnapAlign: 'start',
        scrollSnapStop: 'always',
        scrollMarginTop: index === 0 ? '-60vh' : '0px'  // ← Remove negative margin
      }}
    >
      {renderSection(section.id)}
    </section>
  ))}
</div>
```

### After (Fixed Implementation)
```typescript
<div
  ref={scrollRef}
  className="fixed overflow-y-auto hide-scrollbar"
  style={{
    top: '28px',
    left: '28px',
    right: '28px',
    bottom: '28px',
    scrollSnapType: 'y mandatory',
    scrollBehavior: 'smooth',
    overscrollBehavior: 'contain',
    WebkitOverflowScrolling: 'touch' as any
  }}
>
  {/* FIX: Spacer no longer a snap point */}
  <div
    style={{
      height: '60vh',
      pointerEvents: 'none'  // ← Prevent interaction
      // NO scroll snap properties
    }}
  />

  {sections.map((section, index) => (
    <section
      key={section.id}
      id={`section-${section.id}`}
      style={{
        scrollSnapAlign: 'start',
        scrollSnapStop: 'always'
        // NO negative scroll margin needed
      }}
    >
      {renderSection(section.id)}
    </section>
  ))}
</div>
```

**Key Changes**:
1. Remove `scrollSnapAlign: 'start'` from spacer
2. Remove `scrollSnapStop: 'always'` from spacer
3. Remove `scrollMarginTop: '-60vh'` from first section
4. Add `pointerEvents: 'none'` to spacer (best practice)

---

**End of Specification**