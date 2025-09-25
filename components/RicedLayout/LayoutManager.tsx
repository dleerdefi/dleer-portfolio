'use client';

import React, { useState, useEffect } from 'react';
import NeofetchTile from './NeofetchTile';
import NavigationTile from './NavigationTile';
import ContentViewer from './ContentViewer';
import Background from './Background';
import Polybar from './Polybar';

export type ContentType =
  | { type: 'about' }
  | { type: 'project'; data: any }
  | { type: 'blog'; data: any }
  | { type: 'contact' }
  | { type: 'home' };

const LayoutManager: React.FC = () => {
  const [activeContent, setActiveContent] = useState<ContentType>({ type: 'home' });
  const [focusedTile, setFocusedTile] = useState<'neofetch' | 'navigation' | 'content'>('navigation');
  const [isMobile, setIsMobile] = useState(false);
  const [tileCount, setTileCount] = useState(3); // Default 3 tiles in desktop view

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  // Mobile Layout
  if (isMobile) {
    return (
      <>
        <Background />
        <div className="h-screen flex flex-col relative">
          <Polybar
            activeContent={activeContent}
            onNavigate={handlePolybarNavigate}
            tileCount={1}
            isMobile={true}
          />
          <div className="flex border-b-2 border-[#414868]/50 bg-[#24283b]/80 backdrop-blur-md">
          <button
            onClick={() => setFocusedTile('neofetch')}
            className={`flex-1 p-3 text-sm font-mono ${focusedTile === 'neofetch' ? 'text-[#7aa2f7] border-b-2 border-[#7aa2f7]' : 'text-[#565f89]'}`}
          >
            Info
          </button>
          <button
            onClick={() => setFocusedTile('navigation')}
            className={`flex-1 p-3 text-sm font-mono ${focusedTile === 'navigation' ? 'text-[#7aa2f7] border-b-2 border-[#7aa2f7]' : 'text-[#565f89]'}`}
          >
            Files
          </button>
          <button
            onClick={() => setFocusedTile('content')}
            className={`flex-1 p-3 text-sm font-mono ${focusedTile === 'content' ? 'text-[#7aa2f7] border-b-2 border-[#7aa2f7]' : 'text-[#565f89]'}`}
          >
            Content
          </button>
        </div>
        <div className="flex-1 bg-[#24283b]/80 backdrop-blur-md overflow-auto">
          {focusedTile === 'neofetch' && <NeofetchTile />}
          {focusedTile === 'navigation' && (
            <NavigationTile
              onContentSelect={(content) => {
                setActiveContent(content);
                setFocusedTile('content');
              }}
              activeContent={activeContent}
            />
          )}
          {focusedTile === 'content' && <ContentViewer content={activeContent} />}
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
        <div className="flex-1" style={{ padding: '12px' }}>
          <div className="h-full flex" style={{ gap: '12px' }}>
            {/* Left Column - 50% */}
            <div className="w-1/2 flex flex-col" style={{ gap: '12px' }}>
          {/* Neofetch Tile - Top */}
          <div
            className={`h-1/2 bg-[#24283b]/75 backdrop-blur-md rounded-lg shadow-xl border-2 transition-all duration-200 ${
              focusedTile === 'neofetch' ? 'border-[#7aa2f7] shadow-[#7aa2f7]/20 shadow-2xl' : 'border-[#414868]/50'
            } overflow-hidden`}
            onClick={() => setFocusedTile('neofetch')}
          >
            <NeofetchTile />
          </div>

          {/* Navigation Tile - Bottom */}
          <div
            className={`h-1/2 bg-[#24283b]/75 backdrop-blur-md rounded-lg shadow-xl border-2 transition-all duration-200 ${
              focusedTile === 'navigation' ? 'border-[#7aa2f7] shadow-[#7aa2f7]/20 shadow-2xl' : 'border-[#414868]/50'
            } overflow-hidden`}
            onClick={() => setFocusedTile('navigation')}
          >
            <NavigationTile
              onContentSelect={setActiveContent}
              activeContent={activeContent}
            />
          </div>
            </div>

            {/* Right Column - 50% */}
            <div
              className={`w-1/2 bg-[#24283b]/75 backdrop-blur-md rounded-lg shadow-xl border-2 transition-all duration-200 ${
                focusedTile === 'content' ? 'border-[#7aa2f7] shadow-[#7aa2f7]/20 shadow-2xl' : 'border-[#414868]/50'
              } overflow-hidden`}
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