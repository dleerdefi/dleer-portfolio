'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// Types from spec §4
export type Mode = 'tiled' | 'fullscreen' | 'zen';
export type Section = 'about' | 'projects' | 'blog' | 'content' | 'theme' | 'neofetch';

export interface ViewState {
  mode: Mode;
  section: Section | null;        // active section (FS/Zen)
  previousMode: Mode | null;      // for Zen → FS return
  canZen: boolean;                // derived from section
  scrollPositions: Record<string, number>; // per section
  prefersZen: Record<string, boolean>;     // per-section zen preference (spec §2)
  contentData?: any;              // Store the actual project/blog data
}

interface ViewContextValue extends ViewState {
  // State transitions
  enterFullscreen: (section: Section, data?: any) => void;
  exitToTiled: () => void;
  toggleZen: () => void;

  // Guards
  canEnterFullscreen: (section: Section) => boolean;
  canEnterZen: () => boolean;

  // Scroll management
  saveScrollPosition: (section: string, position: number) => void;
  getScrollPosition: (section: string) => number;
}

const ViewContext = createContext<ViewContextValue | undefined>(undefined);

// Sections that support zen mode (per spec §2)
const ZEN_SUPPORTED_SECTIONS: Section[] = ['blog', 'projects'];

// Utility sections that never go fullscreen (per spec §2)
const UTILITY_SECTIONS: Section[] = ['content', 'theme', 'neofetch'];

export const ViewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load prefersZen from localStorage on mount
  const loadPrefersZen = (): Record<string, boolean> => {
    if (typeof window === 'undefined') return {};
    try {
      const saved = localStorage.getItem('prefersZen');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  };

  const [state, setState] = useState<ViewState>({
    mode: 'tiled',
    section: null,
    previousMode: null,
    canZen: false,
    scrollPositions: {},
    prefersZen: loadPrefersZen(),
    contentData: null
  });

  // Update canZen when section changes
  useEffect(() => {
    setState(prev => ({
      ...prev,
      canZen: prev.section ? ZEN_SUPPORTED_SECTIONS.includes(prev.section) : false
    }));
  }, [state.section]);

  // Guards per spec §4
  const canEnterFullscreen = useCallback((section: Section) => {
    // Utility sections never go fullscreen
    if (UTILITY_SECTIONS.includes(section)) {
      return false;
    }
    // Can only enter fullscreen from tiled mode
    return state.mode === 'tiled';
  }, [state.mode]);

  const canEnterZen = useCallback(() => {
    // Can only enter zen from fullscreen mode
    if (state.mode !== 'fullscreen') {
      return false;
    }
    // Section must support zen
    return state.section ? ZEN_SUPPORTED_SECTIONS.includes(state.section) : false;
  }, [state.mode, state.section]);

  // State transitions per spec §4
  const enterFullscreen = useCallback((section: Section, data?: any) => {
    // Guard: check if allowed
    if (!canEnterFullscreen(section)) {
      console.warn(`Cannot enter fullscreen for section: ${section}`);
      return;
    }

    const supportsZen = ZEN_SUPPORTED_SECTIONS.includes(section);
    const userPrefersZen = state.prefersZen[section] || false;

    setState(prev => ({
      ...prev,
      mode: supportsZen && userPrefersZen ? 'zen' : 'fullscreen',
      section,
      previousMode: 'tiled',
      canZen: supportsZen,
      contentData: data || null
    }));
  }, [canEnterFullscreen, state.prefersZen]);

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
      previousMode: prev.mode,
      canZen: false,
      contentData: null
    }));
  }, [state.section]);

  const toggleZen = useCallback(() => {
    if (state.mode === 'zen') {
      // Exit zen to fullscreen - save preference as false
      if (state.section) {
        const newPrefersZen = { ...state.prefersZen, [state.section]: false };
        localStorage.setItem('prefersZen', JSON.stringify(newPrefersZen));
        setState(prev => ({
          ...prev,
          mode: 'fullscreen',
          previousMode: 'zen',
          prefersZen: newPrefersZen
        }));
      }
    } else if (canEnterZen()) {
      // Enter zen from fullscreen - save preference as true
      if (state.section) {
        const newPrefersZen = { ...state.prefersZen, [state.section]: true };
        localStorage.setItem('prefersZen', JSON.stringify(newPrefersZen));
        setState(prev => ({
          ...prev,
          mode: 'zen',
          previousMode: 'fullscreen',
          prefersZen: newPrefersZen
        }));
      }
    }
  }, [state.mode, state.section, state.prefersZen, canEnterZen]);

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

  // Keyboard shortcuts per spec §10
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if we're in an input field
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      // Escape key: exit one layer (Zen→FS→Tiled)
      if (e.key === 'Escape') {
        e.preventDefault();
        if (state.mode === 'zen') {
          toggleZen(); // Exit to fullscreen
        } else if (state.mode === 'fullscreen') {
          exitToTiled();
        }
      }

      // Z key: toggle zen (only in fullscreen with supported section)
      if (e.key === 'z' || e.key === 'Z') {
        if (state.mode === 'fullscreen' && canEnterZen()) {
          e.preventDefault();
          toggleZen();
        }
      }

      // Alt+T: toggle file tree sidebar in FS (optional, for future)
      if (e.altKey && e.key === 't') {
        if (state.mode === 'fullscreen') {
          e.preventDefault();
          // TODO: Implement sidebar toggle
          console.log('File tree sidebar toggle (not yet implemented)');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.mode, toggleZen, exitToTiled, canEnterZen]);

  const value: ViewContextValue = {
    ...state,
    enterFullscreen,
    exitToTiled,
    toggleZen,
    canEnterFullscreen,
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