'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import NeofetchTile from './NeofetchTile';
import NavigationTile from './NavigationTile';
import ContentViewer from './ContentViewer';
import Background from './Background';
import Polybar from './Polybar';

// Simple debounce utility
const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export type ContentType =
  | { type: 'about' }
  | { type: 'project'; data: any }
  | { type: 'blog'; data: any }
  | { type: 'contact' }
  | { type: 'home' };

const LayoutManager: React.FC = () => {
  const [activeContent, setActiveContent] = useState<ContentType>({ type: 'about' });
  const [focusedTile, setFocusedTile] = useState<'neofetch' | 'navigation' | 'content'>('content');
  const [isStacked, setIsStacked] = useState(false);

  // Animation state management
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<'toStacked' | 'toTiled' | null>(null);
  const prevIsStacked = useRef<boolean | null>(null);
  const isInitialMount = useRef(true);

  // Create refs at top level (always called, regardless of mode)
  const neofetchRef = useRef<HTMLDivElement>(null);
  const navigationRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Create debounced layout check function
  const debouncedCheckLayout = useCallback(
    debounce(() => {
      setIsStacked(window.innerWidth < 1024);
    }, 150),
    []
  );

  useEffect(() => {
    // Initial check without debounce
    setIsStacked(window.innerWidth < 1024);

    // Use debounced version for resize events
    window.addEventListener('resize', debouncedCheckLayout);
    return () => window.removeEventListener('resize', debouncedCheckLayout);
  }, [debouncedCheckLayout]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const tiles: Array<'neofetch' | 'navigation' | 'content'> = ['neofetch', 'navigation', 'content'];
        const currentIndex = tiles.indexOf(focusedTile);
        const nextIndex = (currentIndex + 1) % tiles.length;
        setFocusedTile(tiles[nextIndex]);
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

    // Small delay to ensure DOM updates
    const timer = setTimeout(() => {
      tileRefs[focusedTile]?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }, 50);

    return () => clearTimeout(timer);
  }, [focusedTile, isStacked]);

  // Detect layout changes and trigger transitions
  useEffect(() => {
    // Skip animation on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevIsStacked.current = isStacked;
      return;
    }

    // Detect if layout actually changed
    if (prevIsStacked.current !== null && prevIsStacked.current !== isStacked) {
      setIsTransitioning(true);
      setTransitionDirection(isStacked ? 'toStacked' : 'toTiled');

      // Clear transition state after animation completes
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setTransitionDirection(null);
      }, 600); // Total animation duration (400ms + 200ms max stagger)

      prevIsStacked.current = isStacked;

      return () => clearTimeout(timer);
    }
  }, [isStacked]);

  // Helper function to build tile classes with animation support
  const getTileClasses = (tileName: 'neofetch' | 'navigation' | 'content', baseClasses: string) => {
    if (!isTransitioning) return baseClasses;

    const transitionClasses = ['layout-transition'];

    // Add stagger delay based on tile
    const delays = { neofetch: '0', navigation: '100', content: '200' };
    transitionClasses.push(`transition-delay-${delays[tileName]}`);

    // Add direction-specific animation classes
    if (transitionDirection === 'toStacked') {
      transitionClasses.push(`tile-${tileName}-entering-stacked`);
    } else if (transitionDirection === 'toTiled') {
      transitionClasses.push(`tile-${tileName}-entering-tiled`);
    }

    return `${baseClasses} ${transitionClasses.join(' ')}`;
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
        setActiveContent({ type: 'home' }); // Reset to home to see projects list
        setFocusedTile('navigation');
        break;
      case 'blog':
        setActiveContent({ type: 'blog', data: { id: 'blog-list', title: 'Blog Posts' } });
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
      // Delay to ensure content renders first
      setTimeout(() => {
        contentRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    };

    return (
      <>
        <Background />
        <div className="min-h-screen overflow-y-auto flex flex-col">
          <Polybar
            activeContent={activeContent}
            onNavigate={handlePolybarNavigate}
            tileCount={3}
          />
          <div className="flex-1" style={{ padding: '12px' }}>
            <div className="flex flex-col" style={{ gap: '12px' }}>
              {/* Neofetch Tile */}
              <div
                ref={neofetchRef}
                className={getTileClasses('neofetch', `rounded-lg shadow-xl border transition-all duration-300 ${
                  focusedTile === 'neofetch' ? 'border-[#89b4fa] shadow-[#89b4fa]/30 shadow-2xl' : 'border-[#89b4fa]/30'
                }`)}
                style={{
                  backgroundColor: activeContent.type === 'about' ? 'rgba(30, 30, 46, 1)' : 'rgba(30, 30, 46, 0.6)',
                  backdropFilter: activeContent.type === 'about' ? 'blur(0px)' : 'blur(8px)',
                  borderWidth: '1px',
                  padding: '24px'
                }}
                onClick={() => setFocusedTile('neofetch')}
              >
                <NeofetchTile isBlurred={activeContent.type !== 'about'} />
              </div>

              {/* Navigation Tile */}
              <div
                ref={navigationRef}
                className={getTileClasses('navigation', `rounded-lg shadow-xl border transition-all duration-300 ${
                  focusedTile === 'navigation' ? 'border-[#89b4fa] shadow-[#89b4fa]/30 shadow-2xl' : 'border-[#89b4fa]/30'
                }`)}
                style={{
                  backgroundColor: 'rgba(30, 30, 46, 0.8)',
                  borderWidth: '1px',
                  padding: '24px'
                }}
                onClick={() => setFocusedTile('navigation')}
              >
                <NavigationTile
                  onContentSelect={handleContentSelectWithScroll}
                  activeContent={activeContent}
                />
              </div>

              {/* Content Viewer */}
              <div
                ref={contentRef}
                className={getTileClasses('content', `rounded-lg shadow-xl border transition-all duration-300 ${
                  focusedTile === 'content' ? 'border-[#89b4fa] shadow-[#89b4fa]/30 shadow-2xl' : 'border-[#89b4fa]/30'
                }`)}
                style={{
                  backgroundColor: 'rgba(30, 30, 46, 0.95)',
                  borderWidth: '1px',
                  padding: '24px',
                  minHeight: '400px'
                }}
                onClick={() => setFocusedTile('content')}
              >
                <ContentViewer content={activeContent} />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Desktop Layout
  return (
    <>
      <Background />
      <div className="h-screen overflow-hidden relative flex flex-col">
        <Polybar
          activeContent={activeContent}
          onNavigate={handlePolybarNavigate}
          tileCount={3}
          isMobile={false}
        />
        <div className="flex-1 overflow-hidden" style={{ padding: '12px' }}>
          <div className="h-full flex" style={{ gap: '12px' }}>
            {/* Left Column - 50% */}
            <div className="w-1/2 flex flex-col" style={{ gap: '12px' }}>
          {/* Neofetch Tile - Top - Dynamic transparency based on content */}
          <div
            className={getTileClasses('neofetch', `h-1/2 rounded-lg shadow-xl border transition-all duration-300 overflow-auto ${
              focusedTile === 'neofetch' ? 'border-[#89b4fa] shadow-[#89b4fa]/30 shadow-2xl' : 'border-[#89b4fa]/30'
            }`)}
            style={{
              backgroundColor: activeContent.type === 'about' ? 'rgba(30, 30, 46, 1)' : 'rgba(30, 30, 46, 0.6)',
              backdropFilter: activeContent.type === 'about' ? 'blur(0px)' : 'blur(8px)',
              borderWidth: '1px',
              padding: '24px'
            }}
            onClick={() => setFocusedTile('neofetch')}
          >
            <NeofetchTile isBlurred={activeContent.type !== 'about'} />
          </div>

          {/* Navigation Tile - Bottom - Fixed transparency for readability */}
          <div
            className={getTileClasses('navigation', `h-1/2 rounded-lg shadow-xl border transition-all duration-300 overflow-auto ${
              focusedTile === 'navigation' ? 'border-[#89b4fa] shadow-[#89b4fa]/30 shadow-2xl' : 'border-[#89b4fa]/30'
            }`)}
            style={{
              backgroundColor: 'rgba(30, 30, 46, 0.8)',
              borderWidth: '1px',
              padding: '24px'
            }}
            onClick={() => setFocusedTile('navigation')}
          >
            <NavigationTile
              onContentSelect={setActiveContent}
              activeContent={activeContent}
            />
          </div>
            </div>

            {/* Right Column - 50% - High opacity for readability */}
            <div
              className={getTileClasses('content', `w-1/2 rounded-lg shadow-xl border transition-all duration-300 overflow-auto ${
                focusedTile === 'content' ? 'border-[#89b4fa] shadow-[#89b4fa]/30 shadow-2xl' : 'border-[#89b4fa]/30'
              }`)}
              style={{
                backgroundColor: 'rgba(30, 30, 46, 0.95)',
                borderWidth: '1px',
                padding: '24px'
              }}
              onClick={() => setFocusedTile('content')}
            >
              <ContentViewer content={activeContent} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LayoutManager;