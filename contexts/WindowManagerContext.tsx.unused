'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { TileType } from './FocusContext';

// Layout modes - mimicking Hyprland's behavior
export type LayoutMode =
  | 'tiled'        // All tiles visible (default)
  | 'monocle'      // Single tile maximized
  | 'focus'        // Focus mode with dimmed surroundings
  | 'zen';         // Zen mode - single tile with wallpaper visible

// Tile visibility states
export type TileVisibility = 'visible' | 'hidden' | 'minimized' | 'dimmed';

// Window state for each tile
export interface TileWindowState {
  visibility: TileVisibility;
  opacity: number;
  zIndex: number;
  expanded: boolean;
}

// Overall window manager state
export interface WindowManagerState {
  layoutMode: LayoutMode;
  focusedTile: TileType | null;
  maximizedTile: TileType | null;
  tiles: Record<TileType, TileWindowState>;
  showBackground: boolean;
  dimBackground: boolean;
}

interface WindowManagerContextValue {
  state: WindowManagerState;

  // Layout controls
  setLayoutMode: (mode: LayoutMode) => void;
  toggleMaximize: (tile?: TileType) => void;
  toggleZenMode: () => void;

  // Tile controls
  hideTile: (tile: TileType) => void;
  showTile: (tile: TileType) => void;
  minimizeTile: (tile: TileType) => void;
  focusTile: (tile: TileType) => void;

  // Keyboard shortcuts
  handleKeyboardShortcut: (event: KeyboardEvent) => void;

  // Preset layouts
  applyPresetLayout: (preset: 'default' | 'coding' | 'reading' | 'minimal') => void;
}

const WindowManagerContext = createContext<WindowManagerContextValue | undefined>(undefined);

// Default tile states
const defaultTileState: TileWindowState = {
  visibility: 'visible',
  opacity: 1,
  zIndex: 1,
  expanded: false
};

// Initial state
const initialState: WindowManagerState = {
  layoutMode: 'tiled',
  focusedTile: null,
  maximizedTile: null,
  tiles: {
    neofetch: { ...defaultTileState },
    navigation: { ...defaultTileState },
    content: { ...defaultTileState },
    theme: { ...defaultTileState }
  },
  showBackground: true,
  dimBackground: false
};

export const WindowManagerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<WindowManagerState>(initialState);

  // Set layout mode
  const setLayoutMode = useCallback((mode: LayoutMode) => {
    setState(current => {
      const newState = { ...current, layoutMode: mode };

      // Apply mode-specific changes
      switch (mode) {
        case 'tiled':
          // Show all tiles
          Object.keys(newState.tiles).forEach(tile => {
            newState.tiles[tile as TileType] = {
              ...newState.tiles[tile as TileType],
              visibility: 'visible',
              opacity: 1,
              expanded: false
            };
          });
          newState.maximizedTile = null;
          newState.dimBackground = false;
          break;

        case 'monocle':
          // Maximize focused tile or content if none focused
          const tileToMaximize = current.focusedTile || 'content';
          Object.keys(newState.tiles).forEach(tile => {
            const tileKey = tile as TileType;
            newState.tiles[tileKey] = {
              ...newState.tiles[tileKey],
              visibility: tileKey === tileToMaximize ? 'visible' : 'hidden',
              opacity: tileKey === tileToMaximize ? 1 : 0,
              expanded: tileKey === tileToMaximize
            };
          });
          newState.maximizedTile = tileToMaximize;
          newState.focusedTile = tileToMaximize;
          break;

        case 'focus':
          // Dim non-focused tiles
          const focusedTile = current.focusedTile || 'content';
          Object.keys(newState.tiles).forEach(tile => {
            const tileKey = tile as TileType;
            newState.tiles[tileKey] = {
              ...newState.tiles[tileKey],
              visibility: 'visible',
              opacity: tileKey === focusedTile ? 1 : 0.3,
              zIndex: tileKey === focusedTile ? 10 : 1
            };
          });
          newState.focusedTile = focusedTile;
          newState.dimBackground = true;
          break;

        case 'zen':
          // Single tile with background
          const zenTile = current.focusedTile || 'content';
          Object.keys(newState.tiles).forEach(tile => {
            const tileKey = tile as TileType;
            newState.tiles[tileKey] = {
              ...newState.tiles[tileKey],
              visibility: tileKey === zenTile ? 'visible' : 'hidden',
              opacity: tileKey === zenTile ? 0.95 : 0,
              expanded: false
            };
          });
          newState.maximizedTile = zenTile;
          newState.focusedTile = zenTile;
          newState.showBackground = true;
          newState.dimBackground = false;
          break;
      }

      return newState;
    });
  }, []);

  // Toggle maximize for a tile
  const toggleMaximize = useCallback((tile?: TileType) => {
    setState(current => {
      const targetTile = tile || current.focusedTile || 'content';

      // If already maximized, restore tiled layout
      if (current.maximizedTile === targetTile && current.layoutMode === 'monocle') {
        return {
          ...current,
          layoutMode: 'tiled',
          maximizedTile: null,
          tiles: {
            neofetch: { ...defaultTileState },
            navigation: { ...defaultTileState },
            content: { ...defaultTileState },
            theme: { ...defaultTileState }
          }
        };
      }

      // Maximize the tile
      const newState = { ...current, layoutMode: 'monocle', maximizedTile: targetTile, focusedTile: targetTile };
      Object.keys(newState.tiles).forEach(t => {
        const tileKey = t as TileType;
        newState.tiles[tileKey] = {
          ...newState.tiles[tileKey],
          visibility: tileKey === targetTile ? 'visible' : 'hidden',
          opacity: tileKey === targetTile ? 1 : 0,
          expanded: tileKey === targetTile,
          zIndex: tileKey === targetTile ? 100 : 1
        };
      });

      return newState;
    });
  }, []);

  // Toggle zen mode
  const toggleZenMode = useCallback(() => {
    setState(current => {
      if (current.layoutMode === 'zen') {
        return {
          ...current,
          layoutMode: 'tiled',
          maximizedTile: null,
          tiles: {
            neofetch: { ...defaultTileState },
            navigation: { ...defaultTileState },
            content: { ...defaultTileState },
            theme: { ...defaultTileState }
          },
          dimBackground: false
        };
      }

      const focusedTile = current.focusedTile || 'content';
      return {
        ...current,
        layoutMode: 'zen',
        focusedTile,
        maximizedTile: focusedTile,
        tiles: {
          neofetch: { ...defaultTileState, visibility: 'hidden', opacity: 0 },
          navigation: { ...defaultTileState, visibility: 'hidden', opacity: 0 },
          content: { ...defaultTileState, visibility: 'hidden', opacity: 0 },
          theme: { ...defaultTileState, visibility: 'hidden', opacity: 0 },
          [focusedTile]: {
            visibility: 'visible',
            opacity: 0.95,
            zIndex: 10,
            expanded: false
          }
        },
        showBackground: true,
        dimBackground: false
      };
    });
  }, []);

  // Hide a tile
  const hideTile = useCallback((tile: TileType) => {
    setState(current => ({
      ...current,
      tiles: {
        ...current.tiles,
        [tile]: {
          ...current.tiles[tile],
          visibility: 'hidden',
          opacity: 0
        }
      }
    }));
  }, []);

  // Show a tile
  const showTile = useCallback((tile: TileType) => {
    setState(current => ({
      ...current,
      tiles: {
        ...current.tiles,
        [tile]: {
          ...current.tiles[tile],
          visibility: 'visible',
          opacity: 1
        }
      }
    }));
  }, []);

  // Minimize a tile
  const minimizeTile = useCallback((tile: TileType) => {
    setState(current => ({
      ...current,
      tiles: {
        ...current.tiles,
        [tile]: {
          ...current.tiles[tile],
          visibility: 'minimized',
          opacity: 0.1
        }
      }
    }));
  }, []);

  // Focus a tile
  const focusTile = useCallback((tile: TileType) => {
    setState(current => {
      const newState = { ...current, focusedTile: tile };

      // If in focus mode, update opacities
      if (current.layoutMode === 'focus') {
        Object.keys(newState.tiles).forEach(t => {
          const tileKey = t as TileType;
          newState.tiles[tileKey] = {
            ...newState.tiles[tileKey],
            opacity: tileKey === tile ? 1 : 0.3,
            zIndex: tileKey === tile ? 10 : 1
          };
        });
      }

      return newState;
    });
  }, []);

  // Apply preset layouts
  const applyPresetLayout = useCallback((preset: 'default' | 'coding' | 'reading' | 'minimal') => {
    setState(current => {
      switch (preset) {
        case 'default':
          return initialState;

        case 'coding':
          // Hide neofetch, focus on content, minimize theme
          return {
            ...current,
            layoutMode: 'focus',
            focusedTile: 'content',
            tiles: {
              neofetch: { visibility: 'hidden', opacity: 0, zIndex: 1, expanded: false },
              navigation: { visibility: 'visible', opacity: 0.3, zIndex: 1, expanded: false },
              content: { visibility: 'visible', opacity: 1, zIndex: 10, expanded: false },
              theme: { visibility: 'minimized', opacity: 0.1, zIndex: 1, expanded: false }
            },
            dimBackground: true
          };

        case 'reading':
          // Zen mode on content
          return {
            ...current,
            layoutMode: 'zen',
            focusedTile: 'content',
            maximizedTile: 'content',
            tiles: {
              neofetch: { visibility: 'hidden', opacity: 0, zIndex: 1, expanded: false },
              navigation: { visibility: 'hidden', opacity: 0, zIndex: 1, expanded: false },
              content: { visibility: 'visible', opacity: 0.95, zIndex: 10, expanded: false },
              theme: { visibility: 'hidden', opacity: 0, zIndex: 1, expanded: false }
            },
            showBackground: true,
            dimBackground: false
          };

        case 'minimal':
          // Show only navigation and content
          return {
            ...current,
            layoutMode: 'tiled',
            tiles: {
              neofetch: { visibility: 'hidden', opacity: 0, zIndex: 1, expanded: false },
              navigation: { visibility: 'visible', opacity: 1, zIndex: 1, expanded: false },
              content: { visibility: 'visible', opacity: 1, zIndex: 1, expanded: false },
              theme: { visibility: 'hidden', opacity: 0, zIndex: 1, expanded: false }
            }
          };

        default:
          return current;
      }
    });
  }, []);

  // Keyboard shortcut handler
  const handleKeyboardShortcut = useCallback((event: KeyboardEvent) => {
    // Check if we're in an input field
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      return;
    }

    // Super (Windows/Cmd) key combinations
    if (event.metaKey || event.ctrlKey) {
      switch (event.key) {
        case 'm':
          event.preventDefault();
          toggleMaximize();
          break;
        case 'z':
          event.preventDefault();
          toggleZenMode();
          break;
        case '1':
          event.preventDefault();
          setLayoutMode('tiled');
          break;
        case '2':
          event.preventDefault();
          setLayoutMode('monocle');
          break;
        case '3':
          event.preventDefault();
          setLayoutMode('focus');
          break;
        case '4':
          event.preventDefault();
          setLayoutMode('zen');
          break;
        case 'h':
          if (event.shiftKey) {
            // Ctrl/Cmd + Shift + H: Show all tiles
            event.preventDefault();
            setLayoutMode('tiled');
          } else {
            // Ctrl/Cmd + H: Hide current tile
            event.preventDefault();
            if (state.focusedTile) hideTile(state.focusedTile);
          }
          break;
      }

      // Preset shortcuts with Shift
      if (event.shiftKey) {
        switch (event.key) {
          case '!': // Shift + 1
            event.preventDefault();
            applyPresetLayout('default');
            break;
          case '@': // Shift + 2
            event.preventDefault();
            applyPresetLayout('coding');
            break;
          case '#': // Shift + 3
            event.preventDefault();
            applyPresetLayout('reading');
            break;
          case '$': // Shift + 4
            event.preventDefault();
            applyPresetLayout('minimal');
            break;
        }
      }
    }

    // Alt key combinations
    if (event.altKey) {
      switch (event.key) {
        case 'Tab':
          event.preventDefault();
          // Cycle through visible tiles
          const visibleTiles = (Object.keys(state.tiles) as TileType[])
            .filter(t => state.tiles[t].visibility === 'visible');
          if (visibleTiles.length > 0) {
            const currentIndex = state.focusedTile ? visibleTiles.indexOf(state.focusedTile) : -1;
            const nextIndex = (currentIndex + 1) % visibleTiles.length;
            focusTile(visibleTiles[nextIndex]);
          }
          break;
        case '1':
          event.preventDefault();
          focusTile('neofetch');
          break;
        case '2':
          event.preventDefault();
          focusTile('navigation');
          break;
        case '3':
          event.preventDefault();
          focusTile('content');
          break;
        case '4':
          event.preventDefault();
          focusTile('theme');
          break;
      }
    }

    // Escape key to return to default
    if (event.key === 'Escape') {
      event.preventDefault();
      setLayoutMode('tiled');
    }
  }, [state, toggleMaximize, toggleZenMode, setLayoutMode, hideTile, focusTile, applyPresetLayout]);

  // Register keyboard listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyboardShortcut);
    return () => window.removeEventListener('keydown', handleKeyboardShortcut);
  }, [handleKeyboardShortcut]);

  const value: WindowManagerContextValue = {
    state,
    setLayoutMode,
    toggleMaximize,
    toggleZenMode,
    hideTile,
    showTile,
    minimizeTile,
    focusTile,
    handleKeyboardShortcut,
    applyPresetLayout
  };

  return (
    <WindowManagerContext.Provider value={value}>
      {children}
    </WindowManagerContext.Provider>
  );
};

export const useWindowManager = () => {
  const context = useContext(WindowManagerContext);
  if (!context) {
    throw new Error('useWindowManager must be used within a WindowManagerProvider');
  }
  return context;
};