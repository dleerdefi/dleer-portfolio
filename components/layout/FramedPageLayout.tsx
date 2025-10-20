'use client';

import React, { ReactNode, useEffect, useRef } from 'react';
import Background from '@/components/layout/Background';
import { ParallaxBorderFrame } from '@/components/layout/parallax/components/ParallaxBorderFrame';

interface FramedPageLayoutProps {
  children: ReactNode;
  borderPadding?: number;
  showBackground?: boolean;
  autoFocus?: boolean;
}

/**
 * Framed Page Layout
 * Provides the signature windowed aesthetic with border, glass effects, and background
 * Creates a single fullscreen "tile" with accent border and glass diffusion
 *
 * Used by:
 * - Blog detail pages
 * - Project detail pages
 * - Mobile parallax layout (via same components)
 *
 * Features:
 * - 2px accent color border with configurable padding
 * - Gradient dot glass effects at top/bottom edges
 * - Animated background with orbs and wallpaper
 * - Scrollable content area within frame
 *
 * @param children - Content to display inside the framed window
 * @param borderPadding - Distance from screen edge (default: 16px)
 * @param showBackground - Whether to show animated background (default: true)
 */
export const FramedPageLayout: React.FC<FramedPageLayoutProps> = ({
  children,
  borderPadding = 16,
  showBackground = true,
  autoFocus = true,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-focus container on mount for immediate keyboard event handling
  // (disabled when wrapping interactive components like ZenList that handle their own focus)
  useEffect(() => {
    if (autoFocus) {
      scrollContainerRef.current?.focus();
    }
  }, [autoFocus]);

  return (
    <>
      {/* Animated background with orbs */}
      {showBackground && <Background />}

      {/* Border frame with glass effects */}
      <ParallaxBorderFrame borderPadding={borderPadding} />

      {/* Scrollable content container - positioned inside border frame */}
      <div
        ref={scrollContainerRef}
        tabIndex={0}
        className="fixed overflow-y-auto hide-scrollbar outline-none"
        style={{
          top: `${borderPadding}px`,
          left: `${borderPadding}px`,
          right: `${borderPadding}px`,
          bottom: `${borderPadding}px`,
          zIndex: 2,
          overscrollBehavior: 'contain',
          WebkitOverflowScrolling: 'touch' as any
        }}
      >
        {children}
      </div>
    </>
  );
};
