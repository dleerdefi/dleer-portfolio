'use client';

import React, { ReactNode } from 'react';
import Background from '@/components/layout/Background';
import { ParallaxBorderFrame } from '@/components/layout/parallax/components/ParallaxBorderFrame';

interface FramedPageLayoutProps {
  children: ReactNode;
  borderPadding?: number;
  showBackground?: boolean;
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
  showBackground = true
}) => {
  return (
    <>
      {/* Animated background with orbs */}
      {showBackground && <Background />}

      {/* Border frame with glass effects */}
      <ParallaxBorderFrame borderPadding={borderPadding} />

      {/* Scrollable content container - must start at 0,0 so content can scroll through border zones */}
      <div
        className="fixed overflow-y-auto hide-scrollbar"
        style={{
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          padding: `${borderPadding}px`,
          zIndex: 2,
          scrollBehavior: 'smooth',
          overscrollBehavior: 'contain',
          WebkitOverflowScrolling: 'touch' as any
        }}
      >
        {children}
      </div>
    </>
  );
};
