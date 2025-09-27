'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import NeofetchTile from './NeofetchTile';
import NavigationTile from './NavigationTile';
import ContentViewer from './ContentViewer';
import Background from './Background';
import Polybar from './Polybar';

export type ContentType =
  | { type: 'about' }
  | { type: 'project'; data: any }
  | { type: 'projects-overview' }
  | { type: 'blog'; data: any }
  | { type: 'blog-overview' }
  | { type: 'contact' }
  | { type: 'home' };

const LayoutManager: React.FC = () => {
  const [activeContent, setActiveContent] = useState<ContentType>({ type: 'about' });
  const [focusedTile, setFocusedTile] = useState<'neofetch' | 'navigation' | 'content'>('content');
  const [isStacked, setIsStacked] = useState(false);

  // Create refs at top level (always called, regardless of mode)
  const neofetchRef = useRef<HTMLDivElement>(null);
  const navigationRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkLayout = () => {
      setIsStacked(window.innerWidth < 1024);
    };
    checkLayout();
    window.addEventListener('resize', checkLayout);
    return () => window.removeEventListener('resize', checkLayout);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const tiles: Array<'neofetch' | 'navigation' | 'content'> = ['neofetch', 'navigation', 'content'];
        const currentIndex = tiles.indexOf(focusedTile);
        const nextIndex = (currentIndex + 1) % tiles.length;
        const nextTile = tiles[nextIndex];

        setFocusedTile(nextTile);

        // Update activeContent to match tile focus for Polybar sync
        if (nextTile === 'neofetch') {
          setActiveContent({ type: 'about' });
        }
        // Navigation and content tiles don't change activeContent
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedTile]);

  // Auto-scroll to focused tile in stacked mode only
  useEffect(() => {
    if (!isStacked) return; // Only run in stacked mode

    const tileRefs = {
      'neofetch': neofetchRef,
      'navigation': navigationRef,
      'content': contentRef
    };

    // Increased delay to account for Framer Motion layout animations
    const timer = setTimeout(() => {
      tileRefs[focusedTile]?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }, 180); // Optimized delay for responsive feel with Framer Motion

    return () => clearTimeout(timer);
  }, [focusedTile, isStacked]);

  // Framer Motion animation settings
  const layoutTransition = {
    type: "spring" as const,
    stiffness: 300,
    damping: 30,
    mass: 1
  };

  // Opacity transition for focus changes
  const opacityTransition = {
    duration: 0.2,
    ease: "easeInOut" as const
  };

  // Content-aware transparency for better readability
  const getContentTileOpacity = () => {
    // Less transparent for detail views (better readability)
    if (activeContent.type === 'project' || activeContent.type === 'blog') {
      return {
        focused: 'rgba(30, 30, 46, 0.95)',
        unfocused: 'rgba(30, 30, 46, 0.85)'
      };
    }
    // Standard transparency for other content
    return {
      focused: 'rgba(30, 30, 46, 0.75)',
      unfocused: 'rgba(30, 30, 46, 0.45)'
    };
  };

  // Handle navigation from polybar
  const handlePolybarNavigate = (section: string) => {
    switch (section) {
      case 'home':
        setActiveContent({ type: 'home' });
        break;
      case 'about':
        setActiveContent({ type: 'about' });
        break;
      case 'projects':
        setActiveContent({ type: 'projects-overview' });
        setFocusedTile('content');
        break;
      case 'blog':
        setActiveContent({ type: 'blog-overview' });
        setFocusedTile('content');
        break;
      case 'contact':
        setActiveContent({ type: 'contact' });
        setFocusedTile('content');
        break;
    }
  };

  // Stacked Layout (Mobile/Tablet)
  if (isStacked) {
    // Handle content selection with auto-scroll to content viewer
    const handleContentSelectWithScroll = (content: ContentType) => {
      setActiveContent(content);

      // Only change focus and scroll if we're not already on content tile
      // This prevents the double-scroll bounce
      if (focusedTile !== 'content') {
        setFocusedTile('content');
        // Delay to ensure content renders first
        setTimeout(() => {
          contentRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }, 100);
      }
      // If already on content, no scroll needed (user is already looking at it)
    };

    return (
      <>
        <Background wallpaperUrl="/images/rice-wallpaper.jpg" />
        <div className="min-h-screen flex flex-col">
          <div className="sticky top-0 z-50">
            <Polybar
              activeContent={activeContent}
              onNavigate={handlePolybarNavigate}
            />
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
                      focusedTile === 'neofetch' ? 'border-[#89b4fa] shadow-[#89b4fa]/30 shadow-2xl' : 'border-[#89b4fa]/30'
                    }`}
                  animate={{
                    backgroundColor: focusedTile === 'neofetch'
                      ? 'rgba(30, 30, 46, 0.75)'
                      : 'rgba(30, 30, 46, 0.45)'
                  }}
                  style={{
                    backdropFilter: 'blur(8px)',
                    borderWidth: '1px',
                    padding: '24px',
                    willChange: 'background-color'
                  }}
                  onClick={() => setFocusedTile('neofetch')}
                >
                  <NeofetchTile isBlurred={activeContent.type !== 'about'} />
                  </motion.div>
                </div>

                {/* Navigation Tile */}
                <div ref={navigationRef}>
                  <motion.div
                    layout
                    layoutId="tile-navigation"
                    transition={layoutTransition}
                    className={`rounded-lg shadow-xl border ${
                      focusedTile === 'navigation' ? 'border-[#89b4fa] shadow-[#89b4fa]/30 shadow-2xl' : 'border-[#89b4fa]/30'
                    }`}
                  animate={{
                    backgroundColor: focusedTile === 'navigation'
                      ? 'rgba(30, 30, 46, 0.8)'
                      : 'rgba(30, 30, 46, 0.5)'
                  }}
                  style={{
                    backdropFilter: 'blur(4px)',
                    borderWidth: '1px',
                    padding: '24px',
                    willChange: 'background-color'
                  }}
                  onClick={() => setFocusedTile('navigation')}
                >
                  <NavigationTile
                    onContentSelect={handleContentSelectWithScroll}
                    activeContent={activeContent}
                  />
                  </motion.div>
                </div>

                {/* Content Viewer */}
                <div ref={contentRef}>
                  <motion.div
                    layout
                    layoutId="tile-content"
                    transition={layoutTransition}
                    className={`rounded-lg shadow-xl border ${
                      focusedTile === 'content' ? 'border-[#89b4fa] shadow-[#89b4fa]/30 shadow-2xl' : 'border-[#89b4fa]/30'
                    }`}
                  animate={{
                    backgroundColor: focusedTile === 'content'
                      ? getContentTileOpacity().focused
                      : getContentTileOpacity().unfocused
                  }}
                  style={{
                    borderWidth: '1px',
                    padding: '24px',
                    minHeight: '400px',
                    willChange: 'background-color'
                  }}
                  onClick={() => setFocusedTile('content')}
                >
                  <ContentViewer content={activeContent} onNavigate={handleContentSelectWithScroll} />
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
  // Handle content selection for desktop with focus
  const handleDesktopContentSelect = (content: ContentType) => {
    setActiveContent(content);
    setFocusedTile('content');
  };

  return (
    <>
      <Background />
      <div className="h-screen overflow-hidden relative flex flex-col">
        <Polybar
          activeContent={activeContent}
          onNavigate={handlePolybarNavigate}
        />
        <div className="flex-1 overflow-hidden" style={{ padding: '12px' }}>
          <LayoutGroup>
            <motion.div className="h-full flex" style={{ gap: '12px' }}>
              {/* Left Column - 50% */}
              <motion.div className="w-1/2 flex flex-col" style={{ gap: '12px' }}>
                {/* Neofetch Tile - Top - Dynamic transparency based on content */}
                <motion.div
                  layout
                  layoutId="tile-neofetch"
                  transition={layoutTransition}
                  className={`h-2/5 rounded-lg shadow-xl border overflow-auto ${
                    focusedTile === 'neofetch' ? 'border-[#89b4fa] shadow-[#89b4fa]/30 shadow-2xl' : 'border-[#89b4fa]/30'
                  }`}
            animate={{
              backgroundColor: focusedTile === 'neofetch'
                ? 'rgba(30, 30, 46, 0.75)'
                : 'rgba(30, 30, 46, 0.45)'
            }}
            style={{
              backdropFilter: 'blur(8px)',
              borderWidth: '1px',
              padding: '24px',
              willChange: 'background-color'
            }}
            onClick={() => setFocusedTile('neofetch')}
          >
            <NeofetchTile isBlurred={activeContent.type !== 'about'} />
                </motion.div>

                {/* Navigation Tile - Bottom - Fixed transparency for readability */}
                <motion.div
                  layout
                  layoutId="tile-navigation"
                  transition={layoutTransition}
                  className={`h-3/5 rounded-lg shadow-xl border overflow-auto ${
                    focusedTile === 'navigation' ? 'border-[#89b4fa] shadow-[#89b4fa]/30 shadow-2xl' : 'border-[#89b4fa]/30'
                  }`}
            animate={{
              backgroundColor: focusedTile === 'navigation'
                ? 'rgba(30, 30, 46, 0.8)'
                : 'rgba(30, 30, 46, 0.5)'
            }}
            style={{
              backdropFilter: 'blur(4px)',
              borderWidth: '1px',
              padding: '24px',
              willChange: 'background-color'
            }}
            onClick={() => setFocusedTile('navigation')}
          >
            <NavigationTile
              onContentSelect={handleDesktopContentSelect}
              activeContent={activeContent}
            />
                </motion.div>
              </motion.div>

              {/* Right Column - 50% - High opacity for readability */}
              <motion.div
                layout
                layoutId="tile-content"
                transition={layoutTransition}
                className={`w-1/2 rounded-lg shadow-xl border overflow-auto ${
                  focusedTile === 'content' ? 'border-[#89b4fa] shadow-[#89b4fa]/30 shadow-2xl' : 'border-[#89b4fa]/30'
                }`}
              animate={{
                backgroundColor: focusedTile === 'content'
                  ? getContentTileOpacity().focused
                  : getContentTileOpacity().unfocused
              }}
              style={{
                borderWidth: '1px',
                padding: '24px',
                willChange: 'background-color'
              }}
              onClick={() => setFocusedTile('content')}
            >
              <ContentViewer content={activeContent} onNavigate={handleDesktopContentSelect} />
              </motion.div>
            </motion.div>
          </LayoutGroup>
        </div>
      </div>
    </>
  );
};

export default LayoutManager;