'use client';

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

// Type definitions for the focus management system
// The desktop tiles (app/page.tsx). `lab` exists only while the lab flag is on.
export type TileType = 'neofetch' | 'navigation' | 'lab' | 'content';

// Project data passed with a 'project' navigation intent
// ProjectData supports both:
// 1. MDX projects from content-collections (for detail pages)
// 2. Config projects from portfolio.config (for overview navigation)
export interface ProjectData {
  // Common fields (both sources)
  id?: string;
  name?: string;
  title?: string;
  slug?: string;
  description?: string;
  summary?: string;
  techStack?: string[];
  tech?: string[];
  github?: string;
  demo?: string;
  status?: string;

  // Config-specific fields
  displayName?: string;
  overview?: string;
  features?: string[];
  techStackDisplay?: string;
  category?: 'systems' | 'product' | 'experimental';
  role?: 'built' | 'architected' | 'led';
  visibility?: 'open-source' | 'proprietary';
  metricsSummary?: string;
  metrics?: string[];
  outcome?: string;
  screenshots?: string[];
  videoUrl?: string;
  blogUrl?: string;

  // MDX-specific fields (content-collections)
  date?: string;
  updated?: string;
  tags?: string[];
  cover?: string;
  featured?: boolean;
  html?: string;
  url?: string;
  readingTime?: string;
  readingMinutes?: number;
  ogTitle?: string;
}

export type ContentType =
  | { type: 'home' }
  | { type: 'project'; data: ProjectData }
  | { type: 'projects-overview' }
  | { type: 'blog-overview' }
  | { type: 'contact' }
  /** `section`: scroll the view to that part once its numbers are in (the home lab card's slides) */
  | { type: 'lab-telemetry'; section?: 'hosts' | 'gpus' }
  | { type: 'lab-threats' };

export interface FocusState {
  tile: TileType;
  content: ContentType;
  scrollTarget?: TileType;
  timestamp: number;
  previousTile?: TileType;
  previousContent?: ContentType;
}

interface FocusTransition {
  from: FocusState;
  to: Partial<FocusState>;
  trigger: 'tab' | 'click' | 'navigation' | 'polybar' | 'programmatic';
}

interface FocusContextValue {
  // Current state
  focusState: FocusState;

  // Simplified accessors for backward compatibility
  focusedTile: TileType;
  activeContent: ContentType;

  // State setters with validation
  setFocusedTile: (tile: TileType, trigger?: FocusTransition['trigger']) => void;
  setActiveContent: (content: ContentType, trigger?: FocusTransition['trigger']) => void;
  setFocus: (tile: TileType, content?: ContentType, trigger?: FocusTransition['trigger']) => void;

  // Navigation helpers (keys between tiles live in components/home/HomeShell.tsx)
  handleContentNavigation: (content: ContentType) => void;
  handlePolybarNavigation: (section: string) => void;

  // Scroll management
  requestScroll: (target: TileType) => void;
  clearScrollRequest: () => void;

  // Focus history
  canGoBack: () => boolean;
  goBack: () => void;

  // Debug/testing helpers
  getFocusHistory: () => FocusState[];
  validateTransition: (from: FocusState, to: Partial<FocusState>) => boolean;
}

const FocusContext = createContext<FocusContextValue | undefined>(undefined);

export const FocusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // The stage opens on the home view
  const [focusState, setFocusState] = useState<FocusState>({
    tile: 'content',
    content: { type: 'home' },
    timestamp: Date.now()
  });

  // Focus history for back navigation
  const focusHistory = useRef<FocusState[]>([focusState]);
  const maxHistorySize = 10;

  // Scroll request queue
  const scrollQueue = useRef<TileType | null>(null);

  // Add state to history
  const addToHistory = (state: FocusState) => {
    focusHistory.current = [...focusHistory.current, state].slice(-maxHistorySize);
  };

  // Validate state transition
  // Every transition is valid today: the content tile accepts every content type
  const validateTransition = useCallback((_from: FocusState, _to: Partial<FocusState>): boolean => true, []);

  // Core state setter with validation
  const updateFocusState = useCallback((updates: Partial<FocusState>, trigger: FocusTransition['trigger'] = 'programmatic') => {
    setFocusState(current => {
      const newState: FocusState = {
        ...current,
        ...updates,
        timestamp: Date.now(),
        previousTile: current.tile,
        previousContent: current.content
      };

      // Validate transition
      if (!validateTransition(current, updates)) {
        console.error('Focus transition validation failed', { current, updates, trigger });
        return current;
      }

      // Add to history
      addToHistory(newState);

      // Log transition for debugging
      if (process.env.NODE_ENV === 'development') {
        console.log('Focus transition', {
          trigger,
          from: { tile: current.tile, content: current.content.type },
          to: { tile: newState.tile, content: newState.content.type }
        });
      }

      return newState;
    });
  }, [validateTransition]);

  // Simplified setters for backward compatibility
  const setFocusedTile = useCallback((tile: TileType, trigger: FocusTransition['trigger'] = 'programmatic') => {
    // Simply set the tile focus, no special content rules needed
    updateFocusState({
      tile
    }, trigger);
  }, [updateFocusState]);

  const setActiveContent = useCallback((content: ContentType, trigger: FocusTransition['trigger'] = 'programmatic') => {
    // Simply set the content, no special tile rules
    updateFocusState({
      content
    }, trigger);
  }, [updateFocusState]);

  const setFocus = useCallback((tile: TileType, content?: ContentType, trigger: FocusTransition['trigger'] = 'programmatic') => {
    updateFocusState({
      tile,
      ...(content && { content })
    }, trigger);
  }, [updateFocusState]);

  // Content navigation handler
  const handleContentNavigation = useCallback((content: ContentType) => {
    // All content navigation goes to content tile
    updateFocusState({
      tile: 'content',
      content
    }, 'navigation');
  }, [updateFocusState]);

  // Polybar navigation handler
  const handlePolybarNavigation = useCallback((section: string) => {
    let content: ContentType;

    switch (section) {
      case 'home':
        content = { type: 'home' };
        break;
      case 'projects':
        content = { type: 'projects-overview' };
        break;
      case 'blog':
        content = { type: 'blog-overview' };
        break;
      case 'contact':
        content = { type: 'contact' };
        break;
      case 'lab':
        content = { type: 'lab-telemetry' };
        break;
      default:
        return;
    }

    // Polybar navigation always goes to content tile
    updateFocusState({
      tile: 'content',
      content
    }, 'polybar');
  }, [updateFocusState]);

  // Scroll management
  const requestScroll = useCallback((target: TileType) => {
    scrollQueue.current = target;

    // Update focus state with scroll target
    updateFocusState({
      scrollTarget: target
    }, 'programmatic');
  }, [updateFocusState]);

  const clearScrollRequest = useCallback(() => {
    scrollQueue.current = null;

    updateFocusState({
      scrollTarget: undefined
    }, 'programmatic');
  }, [updateFocusState]);

  // History navigation
  const canGoBack = useCallback(() => {
    return focusHistory.current.length > 1;
  }, []);

  const goBack = useCallback(() => {
    if (focusHistory.current.length > 1) {
      // Remove current state
      focusHistory.current.pop();
      // Get previous state
      const previousState = focusHistory.current[focusHistory.current.length - 1];

      if (previousState) {
        setFocusState(previousState);
      }
    }
  }, []);

  // Debug helpers
  const getFocusHistory = useCallback(() => {
    return [...focusHistory.current];
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const value: FocusContextValue = React.useMemo(() => ({
    focusState,
    focusedTile: focusState.tile,
    activeContent: focusState.content,
    setFocusedTile,
    setActiveContent,
    setFocus,
    handleContentNavigation,
    handlePolybarNavigation,
    requestScroll,
    clearScrollRequest,
    canGoBack,
    goBack,
    getFocusHistory,
    validateTransition
  }), [
    focusState,
    setFocusedTile,
    setActiveContent,
    setFocus,
    handleContentNavigation,
    handlePolybarNavigation,
    requestScroll,
    clearScrollRequest,
    canGoBack,
    goBack,
    getFocusHistory,
    validateTransition
  ]);

  return (
    <FocusContext.Provider value={value}>
      {children}
    </FocusContext.Provider>
  );
};

// Custom hook for using focus context
export const useFocus = () => {
  const context = useContext(FocusContext);

  if (!context) {
    throw new Error('useFocus must be used within a FocusProvider');
  }

  return context;
};

// Optional: Hook for components that only need read access
export const useFocusState = () => {
  const { focusState, focusedTile, activeContent } = useFocus();
  return { focusState, focusedTile, activeContent };
};

// Optional: Hook for components that need navigation
export const useFocusNavigation = () => {
  const { handleContentNavigation, handlePolybarNavigation } = useFocus();
  return { handleContentNavigation, handlePolybarNavigation };
};