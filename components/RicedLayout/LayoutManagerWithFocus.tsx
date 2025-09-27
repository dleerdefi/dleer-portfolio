'use client';

import React, { useEffect, useRef } from 'react';
import { motion, LayoutGroup } from 'framer-motion';
import NeofetchTile from './NeofetchTile';
import NavigationTile from './NavigationTileWithFocus';
import ContentViewer from './ContentViewerWithFocus';
import ThemeTile from './ThemeTile';
import Background from './Background';
import Polybar from './PolybarWithFocus';
import { useFocus, ContentType as FocusContentType } from '@/contexts/FocusContext';
import { useScrollToFocus } from '@/hooks/useFocus';
import { useTheme } from '@/contexts/ThemeContext';

// Bridge the content types
type ContentType = FocusContentType;

const LayoutManagerWithFocus: React.FC = () => {
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

  // Create refs at top level
  const neofetchRef = useRef<HTMLDivElement>(null);
  const navigationRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);

  // Check for responsive layout
  useEffect(() => {
    const checkLayout = () => {
      setIsStacked(window.innerWidth < 1024);
    };
    checkLayout();
    window.addEventListener('resize', checkLayout);
    return () => window.removeEventListener('resize', checkLayout);
  }, []);

  // Handle Tab key navigation using context
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

  // Theme-aware tile opacity for better differentiation
  const getTileOpacity = (tileType: 'content' | 'navigation' | 'neofetch' | 'theme', focused: boolean) => {
    const isContentHeavy = tileType === 'content' && (activeContent.type === 'project' || activeContent.type === 'blog');

    // Tokyo Night - cooler, sharper contrasts
    if (theme.preset === 'tokyo-night') {
      if (isContentHeavy) {
        return focused ? 'rgba(var(--theme-surface-rgb), 0.95)' : 'rgba(var(--theme-surface-rgb), 0.4)';
      }
      return focused ? 'rgba(var(--theme-surface-rgb), 0.9)' : 'rgba(var(--theme-surface-rgb), 0.25)';
    }

    // Catppuccin Mocha - warmer, softer
    if (theme.preset === 'catppuccin-mocha') {
      if (isContentHeavy) {
        return focused ? 'rgba(var(--theme-surface-rgb), 0.92)' : 'rgba(var(--theme-surface-rgb), 0.5)';
      }
      return focused ? 'rgba(var(--theme-surface-rgb), 0.85)' : 'rgba(var(--theme-surface-rgb), 0.4)';
    }

    // Catppuccin Latte - light theme needs different approach
    if (theme.preset === 'catppuccin-latte') {
      if (isContentHeavy) {
        return focused ? 'rgba(var(--theme-surface-rgb), 0.98)' : 'rgba(var(--theme-surface-rgb), 0.7)';
      }
      return focused ? 'rgba(var(--theme-surface-rgb), 0.95)' : 'rgba(var(--theme-surface-rgb), 0.6)';
    }

    // Default fallback
    return focused ? 'rgba(var(--theme-surface-rgb), 0.85)' : 'rgba(var(--theme-surface-rgb), 0.35)';
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
    const handleContentSelectWithScroll = (content: ContentType) => {
      handleContentNavigation(content);

      // All content navigation goes to content tile
      setFocusedTile('content');

      // Force scroll to content tile
      // This is crucial for content-to-content navigation (e.g., project to project)
      // where the tile remains 'content' but we still need to scroll
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          contentRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        });
      });
    };

    return (
      <>
        <Background />
        <div className="min-h-screen flex flex-col">
          <div className="sticky top-0 z-50">
            <Polybar onNavigate={handlePolybarNavigate} />
          </div>
          <div className="flex-1 overflow-y-auto" style={{ padding: '12px' }}>
            <LayoutGroup>
              <motion.div className="flex flex-col" style={{ gap: '12px' }}>
                {/* Neofetch Tile */}
                <div ref={neofetchRef}>
                  <motion.div
                    layout
                    layoutId="tile-neofetch"
                    transition={layoutTransition}
                    className={`rounded-lg shadow-xl border ${
                      focusedTile === 'neofetch' ? 'shadow-2xl' : ''
                    }`}
                    initial={{
                      backgroundColor: getTileOpacity('neofetch', false)
                    }}
                    animate={{
                      backgroundColor: getTileOpacity('neofetch', focusedTile === 'neofetch')
                    }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    style={{
                      backdropFilter: 'blur(8px)',
                      borderWidth: '1px',
                      borderColor: focusedTile === 'neofetch' ? 'var(--accent-color)' : 'rgba(var(--accent-color-rgb), 0.3)',
                      padding: '24px',
                      willChange: 'background-color',
                      boxShadow: focusedTile === 'neofetch' ? '0 25px 50px -12px rgba(var(--accent-color-rgb), 0.3)' : undefined
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
                      focusedTile === 'navigation' ? 'shadow-2xl' : ''
                    }`}
                    initial={{
                      backgroundColor: getTileOpacity('navigation', false)
                    }}
                    animate={{
                      backgroundColor: getTileOpacity('navigation', focusedTile === 'navigation')
                    }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    style={{
                      backdropFilter: 'blur(4px)',
                      borderWidth: '1px',
                      borderColor: focusedTile === 'navigation' ? 'var(--accent-color)' : 'rgba(var(--accent-color-rgb), 0.3)',
                      padding: '24px',
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
                      focusedTile === 'content' ? 'shadow-2xl' : ''
                    }`}
                    initial={{
                      backgroundColor: getContentTileOpacity().unfocused
                    }}
                    animate={{
                      backgroundColor: focusedTile === 'content'
                        ? getContentTileOpacity().focused
                        : getContentTileOpacity().unfocused
                    }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    style={{
                      borderWidth: '1px',
                      borderColor: focusedTile === 'content' ? 'var(--accent-color)' : 'rgba(var(--accent-color-rgb), 0.3)',
                      padding: '24px',
                      minHeight: '400px',
                      willChange: 'background-color',
                      boxShadow: focusedTile === 'content' ? '0 25px 50px -12px rgba(var(--accent-color-rgb), 0.3)' : undefined
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
                      focusedTile === 'theme' ? 'shadow-2xl' : ''
                    }`}
                    initial={{
                      backgroundColor: getTileOpacity('theme', false)
                    }}
                    animate={{
                      backgroundColor: getTileOpacity('theme', focusedTile === 'theme')
                    }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    style={{
                      backdropFilter: 'blur(8px)',
                      borderWidth: '1px',
                      borderColor: focusedTile === 'theme' ? 'var(--accent-color)' : 'rgba(var(--accent-color-rgb), 0.3)',
                      padding: '24px',
                      minHeight: '300px',
                      willChange: 'background-color',
                      boxShadow: focusedTile === 'theme' ? '0 25px 50px -12px rgba(var(--accent-color-rgb), 0.3)' : undefined
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
                  className={`h-2/5 rounded-lg shadow-xl border overflow-auto ${
                    focusedTile === 'neofetch' ? 'border-[var(--accent-color)] shadow-[var(--accent-color)]/30 shadow-2xl' : 'border-[var(--accent-color)]/30'
                  }`}
                  initial={{
                    backgroundColor: getTileOpacity('neofetch', false)
                  }}
                  animate={{
                    backgroundColor: getTileOpacity('neofetch', focusedTile === 'neofetch')
                  }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  style={{
                    backdropFilter: 'blur(8px)',
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
                      backgroundColor: getTileOpacity('navigation', focusedTile === 'navigation')
                    }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    style={{
                      flex: '0 0 calc(70% - 6px)',
                      backdropFilter: 'blur(4px)',
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
                    className={`rounded-lg shadow-xl border overflow-auto ${
                      focusedTile === 'theme' ? 'border-[var(--accent-color)] shadow-[var(--accent-color)]/30 shadow-2xl' : 'border-[var(--accent-color)]/30'
                    }`}
                    initial={{
                      backgroundColor: getTileOpacity('theme', false)
                    }}
                    animate={{
                      backgroundColor: getTileOpacity('theme', focusedTile === 'theme')
                    }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    style={{
                      flex: '0 0 calc(30% - 6px)',
                      backdropFilter: 'blur(8px)',
                      borderWidth: '1px',
                      padding: '16px',
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
                    : getContentTileOpacity().unfocused
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                style={{
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

export default LayoutManagerWithFocus;