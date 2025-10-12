'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TileType } from '@/contexts/FocusContext';
import { useWindowManager } from '@/contexts/WindowManagerContext';
import { useFocus } from '@/contexts/FocusContext';

interface WindowTileProps {
  tileType: TileType;
  children: React.ReactNode;
  className?: string;
  layoutId: string;
  onClick?: () => void;
}

const WindowTile: React.FC<WindowTileProps> = ({
  tileType,
  children,
  className = '',
  layoutId,
  onClick
}) => {
  const { state: wmState, focusTile, toggleMaximize } = useWindowManager();
  const { setFocusedTile } = useFocus();

  const tileState = wmState.tiles[tileType];
  const isMaximized = wmState.maximizedTile === tileType;
  const isFocused = wmState.focusedTile === tileType;
  const layoutMode = wmState.layoutMode;

  // Don't render if hidden
  if (tileState.visibility === 'hidden') {
    return null;
  }

  // Calculate position and size based on layout mode
  const getLayoutStyles = () => {
    const baseStyles: React.CSSProperties = {
      opacity: tileState.opacity,
      zIndex: tileState.zIndex,
      transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
      backdropFilter: 'blur(12px)',
      willChange: 'transform, opacity'
    };

    // Monocle mode - full screen
    if (layoutMode === 'monocle' && isMaximized) {
      return {
        ...baseStyles,
        position: 'fixed' as const,
        top: '36px', // Account for Polybar
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: 'calc(100vh - 36px)',
        padding: '24px',
        zIndex: 100
      };
    }

    // Zen mode - centered with padding
    if (layoutMode === 'zen' && isMaximized) {
      return {
        ...baseStyles,
        position: 'fixed' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80vw',
        maxWidth: '1200px',
        height: '80vh',
        padding: '32px',
        borderRadius: '8px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        zIndex: 100
      };
    }

    // Focus mode - adjust opacity but keep position
    if (layoutMode === 'focus') {
      return {
        ...baseStyles,
        filter: isFocused ? 'none' : 'brightness(0.7)'
      };
    }

    // Default tiled mode
    return baseStyles;
  };

  // Handle click with double-click to maximize
  const handleClick = (e: React.MouseEvent) => {
    // Single click - focus
    focusTile(tileType);
    setFocusedTile(tileType);
    onClick?.();

    // Double click - toggle maximize
    if (e.detail === 2) {
      e.preventDefault();
      toggleMaximize(tileType);
    }
  };

  // Visual indicators for focus and hover
  const getBorderStyles = () => {
    if (isFocused) {
      return {
        borderColor: 'var(--accent-color)',
        boxShadow: '0 0 0 2px rgba(var(--accent-color-rgb), 0.3), 0 25px 50px -12px rgba(var(--accent-color-rgb), 0.2)'
      };
    }
    if (tileState.visibility === 'minimized') {
      return {
        borderColor: 'rgba(var(--accent-color-rgb), 0.1)',
        borderStyle: 'dashed' as const
      };
    }
    return {
      borderColor: 'rgba(var(--accent-color-rgb), 0.3)'
    };
  };

  return (
    <AnimatePresence mode="wait">
      {tileState.visibility !== 'hidden' && (
        <motion.div
          layout
          layoutId={layoutId}
          className={`border overflow-hidden relative group ${className}`}
          style={{
            ...getLayoutStyles(),
            ...getBorderStyles(),
            borderWidth: '1px',
            cursor: 'pointer'
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{
            opacity: tileState.opacity,
            scale: 1
          }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
          onClick={handleClick}
          onMouseEnter={() => {
            // Add hover indicator
            if (!isFocused && wmState.layoutMode === 'tiled') {
              // Visual feedback on hover
            }
          }}
        >
          {/* Maximize/Minimize indicators */}
          {wmState.layoutMode === 'tiled' && (
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <button
                className="p-1 rounded hover:bg-white/10"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMaximize(tileType);
                }}
                title="Maximize (Double-click or Ctrl+M)"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor">
                  <rect x="2" y="2" width="10" height="10" strokeWidth="1.5" />
                </svg>
              </button>
            </div>
          )}

          {/* Minimized indicator */}
          {tileState.visibility === 'minimized' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <span className="text-xs opacity-50">Minimized</span>
            </div>
          )}

          {/* Content */}
          <div style={{ opacity: tileState.visibility === 'minimized' ? 0.3 : 1 }}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WindowTile;