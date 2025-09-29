'use client';

import React, { useEffect, useRef } from 'react';
import { motion, LayoutGroup } from 'framer-motion';
import NeofetchTile from '@/components/tiles/NeofetchTile';
import NavigationTile from '@/components/tiles/NavigationTile';
import ContentViewer from '@/components/tiles/ContentViewer';
import ThemeTile from '@/components/tiles/ThemeTile';
import Background from '@/components/layout/Background';
import Polybar from '@/components/layout/Polybar';
import BorderedContainer from '@/components/ui/BorderedContainer';
import ScrollProgress from '@/components/ui/ScrollProgress';
import { useFocus, ContentType as FocusContentType } from '@/contexts/FocusContext';
import { useScrollToFocus } from '@/hooks/useFocus';
import { useTheme } from '@/contexts/ThemeContext';

// Bridge the content types
type ContentType = FocusContentType;

const LayoutManager: React.FC = () => {
  const {
    focusedTile,
    activeContent,
    setFocusedTile,
    setActiveContent,
    handleTabNavigation,
    handleContentNavigation,
    handlePolybarNavigation
  } = useFocus();

  const { theme } = useTheme();

  const [isStacked, setIsStacked] = React.useState(false);
  const [scrollPercent, setScrollPercent] = React.useState(0);

  // Create refs at top level
  const neofetchRef = useRef<HTMLDivElement>(null);
  const navigationRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Check for responsive layout
  useEffect(() => {
    const checkLayout = () => {
      setIsStacked(window.innerWidth < 1024);
    };
    checkLayout();
    window.addEventListener('resize', checkLayout);
    return () => window.removeEventListener('resize', checkLayout);
  }, []);

  // Handle Tab key navigation using context (only in tiled mode, not parallax)
  useEffect(() => {
    // Check if we're in parallax mode
    const isParallaxMode = isStacked &&
      typeof window !== 'undefined' &&
      localStorage.getItem('mobile-mode') === 'parallax';

    // Only add Tab handler if NOT in parallax mode
    if (!isParallaxMode) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          e.preventDefault();
          handleTabNavigation(e.shiftKey);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleTabNavigation, isStacked]);

  // Use scroll hook for each tile in stacked mode
  useScrollToFocus<HTMLDivElement>(neofetchRef, 'neofetch', focusedTile, isStacked);
  useScrollToFocus<HTMLDivElement>(navigationRef, 'navigation', focusedTile, isStacked);
  useScrollToFocus<HTMLDivElement>(contentRef, 'content', focusedTile, isStacked);
  useScrollToFocus<HTMLDivElement>(themeRef, 'theme', focusedTile, isStacked);

  // Framer Motion animation settings
  const layoutTransition = {
    type: "spring" as const,
    stiffness: 300,
    damping: 30,
    mass: 1
  };

  // Theme-aware tile opacity for better differentiation - using spec surface colors
  const getTileOpacity = (tileType: 'content' | 'navigation' | 'neofetch' | 'theme', focused: boolean) => {
    const isContentHeavy = tileType === 'content' && (activeContent.type === 'project' || activeContent.type === 'blog');

    // Tokyo Night - cooler, sharper contrasts
    if (theme.preset === 'tokyo-night') {
      if (isContentHeavy) {
        return focused ? 'rgba(var(--color-surface-rgb), 0.95)' : 'rgba(var(--color-surface-rgb), 0.4)';
      }
      return focused ? 'rgba(var(--color-surface-rgb), 0.9)' : 'rgba(var(--color-surface-rgb), 0.25)';
    }

    // Nord - Arctic dark
    if (theme.preset === 'nord') {
      if (isContentHeavy) {
        return focused ? 'rgba(var(--color-surface-rgb), 0.92)' : 'rgba(var(--color-surface-rgb), 0.5)';
      }
      return focused ? 'rgba(var(--color-surface-rgb), 0.85)' : 'rgba(var(--color-surface-rgb), 0.4)';
    }

    // Solarized Light - light theme needs different approach
    if (theme.preset === 'solarized-light') {
      if (isContentHeavy) {
        return focused ? 'rgba(var(--color-surface-rgb), 0.98)' : 'rgba(var(--color-surface-rgb), 0.7)';
      }
      return focused ? 'rgba(var(--color-surface-rgb), 0.95)' : 'rgba(var(--color-surface-rgb), 0.6)';
    }

    // Default fallback
    return focused ? 'rgba(var(--color-surface-rgb), 0.85)' : 'rgba(var(--color-surface-rgb), 0.35)';
  };

  // Content-aware transparency for better readability
  const getContentTileOpacity = () => {
    const focused = getTileOpacity('content', focusedTile === 'content');
    const unfocused = getTileOpacity('content', false);
    return { focused, unfocused };
  };

  // Handle navigation from polybar - now using context
  const handlePolybarNavigate = (section: string) => {
    handlePolybarNavigation(section);
  };

  // Stacked Layout (Mobile/Tablet)
  if (isStacked) {
    // Check for parallax mode preference
    const useParallaxMode = typeof window !== 'undefined' &&
      localStorage.getItem('mobile-mode') === 'parallax';

    // Use parallax layout if preferred
    if (useParallaxMode) {
      const MobileParallaxLayout = React.lazy(() => import('@/components/layout/MobileParallaxLayout'));
      return (
        <React.Suspense fallback={
          <div className="flex items-center justify-center h-screen">
            <div className="animate-pulse">Loading...</div>
          </div>
        }>
          <MobileParallaxLayout />
        </React.Suspense>
      );
    }

    const handleContentSelectWithScroll = (content: ContentType) => {
      handleContentNavigation(content);
      setFocusedTile('content');

      // Scroll to content tile after navigation
      setTimeout(() => {
        if (contentRef.current) {
          contentRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
          });
        }
      }, 50);
    };

    return (
      <>
        <Background />

        {/* Custom scrollbar positioned outside content */}
        <ScrollProgress scrollPercent={scrollPercent} />

        {/* Fixed scrollable container similar to BorderedContainer but without border */}
        <div
          ref={scrollContainerRef}
          className="fixed inset-0 overflow-y-auto hide-scrollbar"
          style={{
            scrollBehavior: 'smooth'
          }}
          onScroll={(e) => {
            const target = e.target as HTMLDivElement;
            const scrollTop = target.scrollTop;
            const scrollHeight = target.scrollHeight - target.clientHeight;
            const percent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
            setScrollPercent(percent);
          }}
        >
          <div className="min-h-screen flex flex-col">
            <div className="sticky top-0 z-30" style={{ backgroundColor: 'var(--theme-bg)' }}>
              <Polybar onNavigate={handlePolybarNavigate} />
            </div>
            <div className="flex-1" style={{ padding: '12px' }}>
            <LayoutGroup>
              <motion.div className="flex flex-col" style={{ gap: '12px' }}>
                {/* Neofetch Tile */}
                <div ref={neofetchRef}>
                  <motion.div
                    layout
                    layoutId="tile-neofetch"
                    transition={layoutTransition}
                    className={`rounded-lg shadow-xl border ${
                      focusedTile === 'neofetch' ? 'border-[var(--accent-color)] shadow-[var(--accent-color)]/30 shadow-2xl' : 'border-[var(--accent-color)]/30'
                    }`}
                    initial={{
                      backgroundColor: getTileOpacity('neofetch', false)
                    }}
                    animate={{
                      backgroundColor: getTileOpacity('neofetch', focusedTile === 'neofetch'),
                      backdropFilter: 'blur(8px)',
                      borderRadius: '8px',
                      padding: '24px',
                      marginBottom: '8px',
                      willChange: 'background-color'
                    }}
                    onClick={() => setFocusedTile('neofetch')}
                  >
                    <NeofetchTile isBlurred={focusedTile !== 'neofetch'} />
                  </motion.div>
                </div>

                {/* Navigation Tile */}
                <div ref={navigationRef}>
                  <motion.div
                    layout
                    layoutId="tile-navigation"
                    transition={layoutTransition}
                    className={`rounded-lg shadow-xl border ${
                      focusedTile === 'navigation' ? 'border-[var(--accent-color)] shadow-[var(--accent-color)]/30 shadow-2xl' : 'border-[var(--accent-color)]/30'
                    }`}
                    initial={{
                      backgroundColor: getTileOpacity('navigation', false)
                    }}
                    animate={{
                      backgroundColor: getTileOpacity('navigation', focusedTile === 'navigation'),
                      backdropFilter: 'blur(8px)',
                      borderRadius: '8px',
                      padding: '24px',
                      marginBottom: '8px',
                      willChange: 'background-color'
                    }}
                    onClick={() => setFocusedTile('navigation')}
                  >
                    <NavigationTile onContentSelect={handleContentSelectWithScroll} isBlurred={focusedTile !== 'navigation'} />
                  </motion.div>
                </div>

                {/* Content Viewer */}
                <div ref={contentRef}>
                  <motion.div
                    layout
                    layoutId="tile-content"
                    transition={layoutTransition}
                    className={`rounded-lg shadow-xl border ${
                      focusedTile === 'content' ? 'border-[var(--accent-color)] shadow-[var(--accent-color)]/30 shadow-2xl' : 'border-[var(--accent-color)]/30'
                    }`}
                    initial={{
                      backgroundColor: getContentTileOpacity().unfocused
                    }}
                    animate={{
                      backgroundColor: focusedTile === 'content'
                        ? getContentTileOpacity().focused
                        : getContentTileOpacity().unfocused,
                      backdropFilter: 'blur(8px)',
                      borderRadius: '8px',
                      padding: '24px',
                      marginBottom: '8px',
                      minHeight: '400px',
                      willChange: 'background-color'
                    }}
                    onClick={() => setFocusedTile('content')}
                  >
                    <ContentViewer onNavigate={handleContentSelectWithScroll} />
                  </motion.div>
                </div>

                {/* Theme Tile */}
                <div ref={themeRef}>
                  <motion.div
                    layout
                    layoutId="tile-theme"
                    transition={layoutTransition}
                    className={`rounded-lg shadow-xl border ${
                      focusedTile === 'theme' ? 'border-[var(--accent-color)] shadow-[var(--accent-color)]/30 shadow-2xl' : 'border-[var(--accent-color)]/30'
                    }`}
                    initial={{
                      backgroundColor: getTileOpacity('theme', false)
                    }}
                    animate={{
                      backgroundColor: getTileOpacity('theme', focusedTile === 'theme'),
                      backdropFilter: 'blur(8px)',
                      borderRadius: '8px',
                      padding: '24px',
                      marginBottom: '8px',
                      minHeight: '300px',
                      willChange: 'background-color'
                    }}
                    onClick={() => setFocusedTile('theme')}
                  >
                    <ThemeTile isBlurred={focusedTile !== 'theme'} />
                  </motion.div>
                </div>
              </motion.div>
            </LayoutGroup>
          </div>
          </div>
        </div>

        {/* Mode Toggle Button */}
        <motion.button
          className="fixed bottom-6 left-6 z-40 px-4 py-2 rounded-lg shadow-lg text-sm font-medium"
          style={{
            backgroundColor: 'rgba(var(--theme-surface-rgb), 0.95)',
            color: 'var(--theme-text)',
            border: '1px solid rgba(var(--accent-color-rgb), 0.3)',
            backdropFilter: 'blur(10px)'
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            localStorage.setItem('mobile-mode', 'parallax');
            window.location.reload();
          }}
        >
          Try Parallax View
        </motion.button>
      </>
    );
  }

  // Desktop Layout
  const handleDesktopContentSelect = (content: ContentType) => {
    handleContentNavigation(content);
    setFocusedTile('content');
  };

  return (
    <>
      <Background />
      <div className="h-screen overflow-hidden relative flex flex-col">
        <Polybar onNavigate={handlePolybarNavigate} />
        <div className="flex-1 overflow-hidden" style={{ padding: '12px' }}>
          <LayoutGroup>
            <motion.div className="h-full flex" style={{ gap: '12px' }}>
              {/* Left Column - Adjusted for gap */}
              <motion.div className="flex flex-col" style={{ gap: '12px', width: 'calc(50% - 6px)' }}>
                {/* Neofetch Tile */}
                <motion.div
                  layout
                  layoutId="tile-neofetch"
                  transition={layoutTransition}
                  className={`h-2/5 rounded-lg shadow-xl border overflow-hidden ${
                    focusedTile === 'neofetch' ? 'border-[var(--accent-color)] shadow-[var(--accent-color)]/30 shadow-2xl' : 'border-[var(--accent-color)]/30'
                  }`}
                  initial={{
                    backgroundColor: getTileOpacity('neofetch', false)
                  }}
                  animate={{
                    backgroundColor: getTileOpacity('neofetch', focusedTile === 'neofetch'),
                    backdropFilter: 'blur(12px)',
                    borderRadius: '10px',
                    borderWidth: '1px',
                    padding: '24px',
                    willChange: 'background-color'
                  }}
                  onClick={() => setFocusedTile('neofetch')}
                >
                  <NeofetchTile isBlurred={focusedTile !== 'neofetch'} />
                </motion.div>

                {/* Bottom Section - Split Navigation and Theme */}
                <motion.div className="h-3/5 flex" style={{ gap: '12px' }}>
                  {/* Navigation Tile - 70% of bottom width */}
                  <motion.div
                    layout
                    layoutId="tile-navigation"
                    transition={layoutTransition}
                    className={`rounded-lg shadow-xl border overflow-auto ${
                      focusedTile === 'navigation' ? 'border-[var(--accent-color)] shadow-[var(--accent-color)]/30 shadow-2xl' : 'border-[var(--accent-color)]/30'
                    }`}
                    initial={{
                      backgroundColor: getTileOpacity('navigation', false)
                    }}
                    animate={{
                      backgroundColor: getTileOpacity('navigation', focusedTile === 'navigation'),
                      flex: '0 0 calc(70% - 6px)',
                      backdropFilter: 'blur(12px)',
                      borderRadius: '10px',
                      borderWidth: '1px',
                      borderColor: focusedTile === 'navigation' ? 'var(--accent-color)' : 'rgba(var(--accent-color-rgb), 0.3)',
                      padding: '24px',
                      willChange: 'background-color',
                      boxShadow: focusedTile === 'navigation' ? '0 25px 50px -12px rgba(var(--accent-color-rgb), 0.3)' : undefined
                    }}
                    onClick={() => setFocusedTile('navigation')}
                  >
                    <NavigationTile onContentSelect={handleDesktopContentSelect} isBlurred={focusedTile !== 'navigation'} />
                  </motion.div>

                  {/* Theme Tile - 30% of bottom width */}
                  <motion.div
                    layout
                    layoutId="tile-theme"
                    transition={layoutTransition}
                    className={`rounded-lg shadow-xl border overflow-hidden ${
                      focusedTile === 'theme' ? 'border-[var(--accent-color)] shadow-[var(--accent-color)]/30 shadow-2xl' : 'border-[var(--accent-color)]/30'
                    }`}
                    initial={{
                      backgroundColor: getTileOpacity('theme', false)
                    }}
                    animate={{
                      backgroundColor: getTileOpacity('theme', focusedTile === 'theme'),
                      flex: '0 0 calc(30% - 6px)',
                      backdropFilter: 'blur(12px)',
                      borderRadius: '10px',
                      borderWidth: '1px',
                      padding: '12px',
                      willChange: 'background-color'
                    }}
                    onClick={() => setFocusedTile('theme')}
                  >
                    <ThemeTile isBlurred={focusedTile !== 'theme'} />
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Right Column - Content - Adjusted for gap */}
              <motion.div
                layout
                layoutId="tile-content"
                transition={layoutTransition}
                className={`rounded-lg shadow-xl border overflow-auto ${
                  focusedTile === 'content' ? 'border-[var(--accent-color)] shadow-[var(--accent-color)]/30 shadow-2xl' : 'border-[var(--accent-color)]/30'
                }`}
                initial={{
                  backgroundColor: getContentTileOpacity().unfocused
                }}
                animate={{
                  backgroundColor: focusedTile === 'content'
                    ? getContentTileOpacity().focused
                    : getContentTileOpacity().unfocused,
                  backdropFilter: 'blur(12px)',
                  borderRadius: '10px',
                  borderWidth: '1px',
                  padding: '24px',
                  willChange: 'background-color',
                  width: 'calc(50% - 6px)'
                }}
                onClick={() => setFocusedTile('content')}
              >
                <ContentViewer onNavigate={handleDesktopContentSelect} />
              </motion.div>
            </motion.div>
          </LayoutGroup>
        </div>
      </div>
    </>
  );
};

export default LayoutManager;