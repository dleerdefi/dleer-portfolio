'use client';

import React, { useEffect, useRef } from 'react';
import { motion, LayoutGroup } from 'framer-motion';
import NeofetchTile from '@/components/tiles/NeofetchTile';
import NavigationTile from '@/components/tiles/NavigationTile';
import ContentViewer from '@/components/tiles/ContentViewer';
import ThemePresetTile from '@/components/tiles/ThemePresetTile';
import AccentColorTile from '@/components/tiles/AccentColorTile';
import BackgroundTile from '@/components/tiles/BackgroundTile';
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

  // Hydration-safe mobile detection (prevents SSR/client mismatch)
  const [isStacked, setIsStacked] = React.useState(false);
  const [hasChecked, setHasChecked] = React.useState(false);

  // Detect screen size on client only (after hydration)
  useEffect(() => {
    const checkLayout = () => {
      setIsStacked(window.innerWidth < 1024);
    };

    checkLayout();
    setHasChecked(true); // Mark as client-side checked

    window.addEventListener('resize', checkLayout);
    return () => window.removeEventListener('resize', checkLayout);
  }, []);

  // Handle Tab key navigation for desktop tiled layout
  useEffect(() => {
    // Only add Tab handler for desktop (not mobile parallax)
    if (!isStacked) {
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

  // Framer Motion animation settings
  const layoutTransition = {
    type: "spring" as const,
    stiffness: 300,
    damping: 30,
    mass: 1
  };

  // Theme-aware tile opacity for better differentiation - using spec surface colors
  const getTileOpacity = (tileType: 'content' | 'navigation' | 'neofetch' | 'themePreset' | 'accentColor' | 'background', focused: boolean) => {
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

  // Prevent hydration mismatch - show neutral state during SSR/hydration
  if (!hasChecked) {
    return (
      <div className="fixed inset-0 bg-[var(--theme-bg)]">
        {/* Neutral state during SSR and hydration - prevents mismatch */}
      </div>
    );
  }

  // Mobile Layout - Always use Parallax
  if (isStacked) {
    const MobileParallaxLayout = React.lazy(() => import('@/components/layout/MobileParallaxLayout'));
    return (
      <React.Suspense fallback={
        <div className="fixed inset-0 bg-[var(--theme-bg)]">
          {/* Minimal invisible fallback - parallax loads almost instantly */}
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

                {/* Bottom Section - Navigation and 3 Theme Tiles */}
                <motion.div className="h-3/5 flex" style={{ gap: '12px', overflow: 'hidden' }}>
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

                  {/* Theme Controls Column - 30% width, 3 stacked tiles */}
                  <motion.div className="flex flex-col" style={{ flex: '0 0 calc(30% - 6px)', gap: '12px', overflow: 'hidden' }}>
                    {/* Theme Preset Tile - 15% height */}
                    <motion.div
                      layout
                      layoutId="tile-themePreset"
                      transition={layoutTransition}
                      className={`shadow-xl border overflow-hidden ${
                        focusedTile === 'themePreset' ? 'border-[var(--accent-color)] shadow-[var(--accent-color)]/30 shadow-2xl' : 'border-[var(--accent-color)]/30'
                      }`}
                      initial={{
                        backgroundColor: getTileOpacity('themePreset', false)
                      }}
                      animate={{
                        backgroundColor: getTileOpacity('themePreset', focusedTile === 'themePreset'),
                        height: 'calc((100% - 24px) * 0.15)',
                        backdropFilter: 'blur(12px)',
                        borderRadius: '0px',
                        borderWidth: '1px',
                        padding: '12px',
                        willChange: 'background-color'
                      }}
                      onClick={() => setFocusedTile('themePreset')}
                    >
                      <ThemePresetTile isBlurred={focusedTile !== 'themePreset'} />
                    </motion.div>

                    {/* Accent Color Tile - 35% height */}
                    <motion.div
                      layout
                      layoutId="tile-accentColor"
                      transition={layoutTransition}
                      className={`shadow-xl border overflow-hidden ${
                        focusedTile === 'accentColor' ? 'border-[var(--accent-color)] shadow-[var(--accent-color)]/30 shadow-2xl' : 'border-[var(--accent-color)]/30'
                      }`}
                      initial={{
                        backgroundColor: getTileOpacity('accentColor', false)
                      }}
                      animate={{
                        backgroundColor: getTileOpacity('accentColor', focusedTile === 'accentColor'),
                        height: 'calc((100% - 24px) * 0.35)',
                        backdropFilter: 'blur(12px)',
                        borderRadius: '0px',
                        borderWidth: '1px',
                        padding: '12px',
                        willChange: 'background-color'
                      }}
                      onClick={() => setFocusedTile('accentColor')}
                    >
                      <AccentColorTile isBlurred={focusedTile !== 'accentColor'} />
                    </motion.div>

                    {/* Background Tile - 50% height */}
                    <motion.div
                      layout
                      layoutId="tile-background"
                      transition={layoutTransition}
                      className={`shadow-xl border overflow-hidden ${
                        focusedTile === 'background' ? 'border-[var(--accent-color)] shadow-[var(--accent-color)]/30 shadow-2xl' : 'border-[var(--accent-color)]/30'
                      }`}
                      initial={{
                        backgroundColor: getTileOpacity('background', false)
                      }}
                      animate={{
                        backgroundColor: getTileOpacity('background', focusedTile === 'background'),
                        height: 'calc((100% - 24px) * 0.50)',
                        backdropFilter: 'blur(12px)',
                        borderRadius: '0px',
                        borderWidth: '1px',
                        padding: '12px',
                        willChange: 'background-color'
                      }}
                      onClick={() => setFocusedTile('background')}
                    >
                      <BackgroundTile isBlurred={focusedTile !== 'background'} />
                    </motion.div>
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
      </div>

      {/* Focused View for zen mode - overlays on top without affecting tiled layout */}
      <FocusedView />
    </>
  );
};

export default LayoutManager;