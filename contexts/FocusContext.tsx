'use client';

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

// Type definitions for the focus management system
export type TileType = 'neofetch' | 'navigation' | 'content' | 'themePreset' | 'accentColor' | 'background';

// Blog and Project data types (from content-collections schema)
export interface BlogData {
  title: string;
  slug: string;
  summary: string;
  date: string;
  updated?: string;
  tags: string[];
  cover?: string;
  status: 'draft' | 'published';
  series?: string;
  html: string;
  url: string;
  readingTime: string;
  readingMinutes: number;
  ogTitle: string;
}

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
  | { type: 'about' }
  | { type: 'project'; data: ProjectData }
  | { type: 'projects-overview' }
  | { type: 'blog'; data: BlogData }
  | { type: 'blog-overview' }
  | { type: 'contact' };

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

  // Navigation helpers
  handleTabNavigation: (reverse?: boolean) => void;
  handleDirectionalNavigation: (direction: 'up' | 'down' | 'left' | 'right') => void;
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

// Validation rules for state transitions
const transitionRules = {
  // Neofetch tile shows system info (no content requirements)
  neofetch: {},

  // Navigation tile doesn't change content
  navigation: { maintainContent: true },

  // Content tile can show any content type
  content: {
    validContent: ['home', 'about', 'projects-overview', 'blog-overview', 'contact', 'project', 'blog']
  },

  // Theme control tiles don't change content
  themePreset: { maintainContent: true },
  accentColor: { maintainContent: true },
  background: { maintainContent: true }
};

export const FocusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with About section as default
  const [focusState, setFocusState] = useState<FocusState>({
    tile: 'content',
    content: { type: 'about' },
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
  const validateTransition = useCallback((from: FocusState, to: Partial<FocusState>): boolean => {
    const newTile = to.tile || from.tile;
    const newContent = to.content || from.content;

    // Simplified validation - content tile accepts all content types
    // No special rules for neofetch or about content

    return true;
  }, []);

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

  // Tab navigation handler (linear cycle through all tiles)
  const handleTabNavigation = useCallback((reverse = false) => {
    const tiles: TileType[] = ['neofetch', 'navigation', 'content', 'themePreset', 'accentColor', 'background'];
    const currentIndex = tiles.indexOf(focusState.tile);
    const direction = reverse ? -1 : 1;
    const nextIndex = (currentIndex + direction + tiles.length) % tiles.length;
    const nextTile = tiles[nextIndex];

    setFocusedTile(nextTile, 'tab');
  }, [focusState.tile, setFocusedTile]);

  // Directional (hjkl) navigation handler - vim-style 2D navigation
  const handleDirectionalNavigation = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    // Define tile layout in 2D columns
    const leftColumn: TileType[] = ['neofetch', 'navigation', 'themePreset', 'accentColor', 'background'];
    const rightColumn: TileType[] = ['content'];

    const currentTile = focusState.tile;
    let nextTile: TileType = currentTile; // Initialize with current to prevent undefined

    // Determine which column we're in
    const inLeftColumn = leftColumn.includes(currentTile);
    const inRightColumn = rightColumn.includes(currentTile);

    // Vertical navigation (j/k - up/down within column)
    if (direction === 'up' || direction === 'down') {
      if (inLeftColumn) {
        // Navigate within left column
        const currentIndex = leftColumn.indexOf(currentTile);
        const delta = direction === 'down' ? 1 : -1;
        const nextIndex = (currentIndex + delta + leftColumn.length) % leftColumn.length;
        nextTile = leftColumn[nextIndex];
      } else if (inRightColumn) {
        // Content tile is alone in right column, stay on content
        nextTile = 'content';
      } else {
        // Fallback to neofetch if somehow in unknown state
        nextTile = 'neofetch';
      }
    }
    // Horizontal navigation (h/l - left/right between columns)
    else if (direction === 'left') {
      // h key: move to left column
      if (inRightColumn) {
        // From content, jump to neofetch (top of left column)
        nextTile = 'neofetch';
      } else {
        // Already on left, stay put
        nextTile = currentTile;
      }
    }
    else if (direction === 'right') {
      // l key: move to right column
      if (inLeftColumn) {
        // From any left tile, jump to content
        nextTile = 'content';
      } else {
        // Already on content, stay put
        nextTile = 'content';
      }
    }

    setFocusedTile(nextTile, 'navigation');
  }, [focusState.tile, setFocusedTile]);

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
      case 'about':
        content = { type: 'about' };
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
    handleTabNavigation,
    handleDirectionalNavigation,
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
    handleTabNavigation,
    handleDirectionalNavigation,
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
  const {
    handleTabNavigation,
    handleDirectionalNavigation,
    handleContentNavigation,
    handlePolybarNavigation
  } = useFocus();

  return {
    handleTabNavigation,
    handleDirectionalNavigation,
    handleContentNavigation,
    handlePolybarNavigation
  };
};