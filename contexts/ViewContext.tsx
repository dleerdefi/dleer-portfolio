'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// Types - simplified two-mode system
export type Mode = 'tiled' | 'zen';
export type Section = 'about' | 'projects' | 'blog' | 'content' | 'theme' | 'neofetch';

export interface ViewState {
  mode: Mode;
  section: Section | null;        // active section (Zen)
  scrollPositions: Record<string, number>; // per section
  contentData?: any;              // Store the actual project/blog data
}

interface ViewContextValue extends ViewState {
  // State transitions
  enterZen: (section: Section, data?: any) => void;
  exitToTiled: () => void;

  // Guards
  canEnterZen: (section: Section) => boolean;

  // Scroll management
  saveScrollPosition: (section: string, position: number) => void;
  getScrollPosition: (section: string) => number;
}

const ViewContext = createContext<ViewContextValue | undefined>(undefined);

// Sections that support zen mode (immersive content sections)
const ZEN_SUPPORTED_SECTIONS: Section[] = ['blog', 'projects', 'about'];

// Utility sections that never go zen (per spec §2)
const UTILITY_SECTIONS: Section[] = ['content', 'theme', 'neofetch'];

export const ViewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ViewState>({
    mode: 'tiled',
    section: null,
    scrollPositions: {},
    contentData: null
  });

  // Guards - simplified
  const canEnterZen = useCallback((section: Section) => {
    // Utility sections never go zen
    if (UTILITY_SECTIONS.includes(section)) {
      return false;
    }
    // Can only enter zen from tiled mode
    return state.mode === 'tiled';
  }, [state.mode]);

  // State transitions - simplified two-mode system
  const enterZen = useCallback((section: Section, data?: any) => {
    // Guard: check if allowed
    if (!canEnterZen(section)) {
      console.warn(`Cannot enter zen for section: ${section}`);
      return;
    }

    setState(prev => ({
      ...prev,
      mode: 'zen',
      section,
      contentData: data || null
    }));
  }, [canEnterZen]);

  const exitToTiled = useCallback(() => {
    // Save scroll position before exiting
    if (state.section) {
      const scrollEl = document.querySelector('[data-scroll-container]');
      if (scrollEl) {
        setState(prev => ({
          ...prev,
          scrollPositions: {
            ...prev.scrollPositions,
            [state.section!]: scrollEl.scrollTop
          }
        }));
      }
    }

    setState(prev => ({
      ...prev,
      mode: 'tiled',
      section: null,
      contentData: null
    }));
  }, [state.section]);

  // Scroll position management
  const saveScrollPosition = useCallback((section: string, position: number) => {
    setState(prev => ({
      ...prev,
      scrollPositions: {
        ...prev.scrollPositions,
        [section]: position
      }
    }));
  }, []);

  const getScrollPosition = useCallback((section: string) => {
    return state.scrollPositions[section] || 0;
  }, [state.scrollPositions]);

  // Keyboard shortcuts - simplified
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if we're in an input field
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      // Escape key: exit zen to tiled
      if (e.key === 'Escape') {
        if (state.mode === 'zen') {
          e.preventDefault();
          exitToTiled();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.mode, exitToTiled]);

  const value: ViewContextValue = {
    ...state,
    enterZen,
    exitToTiled,
    canEnterZen,
    saveScrollPosition,
    getScrollPosition
  };

  return (
    <ViewContext.Provider value={value}>
      {children}
    </ViewContext.Provider>
  );
};

export const useView = () => {
  const context = useContext(ViewContext);
  if (!context) {
    throw new Error('useView must be used within a ViewProvider');
  }
  return context;
};