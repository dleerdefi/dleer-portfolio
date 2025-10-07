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
import { useFocus, ContentType as FocusContentType } from '@/contexts/FocusContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useView } from '@/contexts/ViewContext';
import FocusedView from '@/components/layout/FocusedView';

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
  const { mode } = useView();

  const [isStacked, setIsStacked] = React.useState(false);

  // Check for responsive layout
  useEffect(() => {
    const checkLayout = () => {
      setIsStacked(window.innerWidth < 1024);
    };
    checkLayout();
    window.addEventListener('resize', checkLayout);
    return () => window.removeEventListener('resize', checkLayout);
  }, []);

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

  // Mobile Layout - Always use Parallax
  if (isStacked) {
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

  // Desktop Layout
  const handleDesktopContentSelect = (content: ContentType) => {
    handleContentNavigation(content);
    setFocusedTile('content');
  };

  return (
    <>
      <Background />
      <motion.div
        className="h-screen overflow-hidden relative flex flex-col"
        animate={{
          opacity: mode === 'zen' ? 0.25 : 1,
          filter: mode === 'zen' ? 'blur(6px)' : 'blur(0px)'
        }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          animate={{ opacity: mode === 'zen' ? 0 : 1 }}
          transition={{ duration: 0.16 }}
        >
          <Polybar onNavigate={handlePolybarNavigate} />
        </motion.div>
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
                  className={`h-2/5 shadow-xl border overflow-hidden ${
                    focusedTile === 'neofetch' ? 'border-[var(--accent-color)] shadow-[var(--accent-color)]/30 shadow-2xl' : 'border-[var(--accent-color)]/30'
                  }`}
                  initial={{
                    backgroundColor: getTileOpacity('neofetch', false)
                  }}
                  animate={{
                    backgroundColor: getTileOpacity('neofetch', focusedTile === 'neofetch'),
                    backdropFilter: 'blur(12px)',
                    borderRadius: '0px',
                    borderWidth: '1px',
                    padding: '24px',
                    willChange: 'background-color'
                  }}
                  onClick={() => setFocusedTile('neofetch')}
                >
                  <NeofetchTile isBlurred={focusedTile !== 'neofetch'} layout="tile" />
                </motion.div>

                {/* Bottom Section - Split Navigation and Theme */}
                <motion.div className="h-3/5 flex" style={{ gap: '12px' }}>
                  {/* Navigation Tile - 70% of bottom width */}
                  <motion.div
                    layout
                    layoutId="tile-navigation"
                    transition={layoutTransition}
                    className={`shadow-xl border overflow-auto ${
                      focusedTile === 'navigation' ? 'border-[var(--accent-color)] shadow-[var(--accent-color)]/30 shadow-2xl' : 'border-[var(--accent-color)]/30'
                    }`}
                    initial={{
                      backgroundColor: getTileOpacity('navigation', false)
                    }}
                    animate={{
                      backgroundColor: getTileOpacity('navigation', focusedTile === 'navigation'),
                      flex: '0 0 calc(70% - 6px)',
                      backdropFilter: 'blur(12px)',
                      borderRadius: '0px',
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
                    className={`shadow-xl border overflow-hidden ${
                      focusedTile === 'theme' ? 'border-[var(--accent-color)] shadow-[var(--accent-color)]/30 shadow-2xl' : 'border-[var(--accent-color)]/30'
                    }`}
                    initial={{
                      backgroundColor: getTileOpacity('theme', false)
                    }}
                    animate={{
                      backgroundColor: getTileOpacity('theme', focusedTile === 'theme'),
                      flex: '0 0 calc(30% - 6px)',
                      backdropFilter: 'blur(12px)',
                      borderRadius: '0px',
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
                className={`shadow-xl border overflow-auto ${
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
                  borderRadius: '0px',
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
      </motion.div>

      {/* Focused View for zen mode */}
      <FocusedView />
    </>
  );
};

export default LayoutManager;