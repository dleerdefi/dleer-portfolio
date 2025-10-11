'use client';

import React from 'react';

interface ParallaxBorderFrameProps {
  borderPadding: number;
}

/**
 * ParallaxBorderFrame Component
 * Renders the glass elevator effect border with diffusion strips and privacy dots
 * Creates the kyrre.dev style window frame with blur effects
 */
export const ParallaxBorderFrame: React.FC<ParallaxBorderFrameProps> = ({ borderPadding }) => {
  return (
    <>
      {/* Border Frame - Solid outline with accent color */}
      <div
        className="fixed pointer-events-none"
        style={{
          top: `${borderPadding}px`,
          left: `${borderPadding}px`,
          right: `${borderPadding}px`,
          bottom: `${borderPadding}px`,
          border: '2px solid var(--accent-color)',
          borderRadius: '0px',
          zIndex: 40
        }}
      />

      {/* Border Diffusion Strips - Blur scrolling content at top/bottom edges */}
      <div
        className="fixed pointer-events-none"
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 41
        }}
      >
        {/* Top border diffusion strip */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: `${borderPadding}px`,
            backdropFilter: 'blur(4px) saturate(120%)',
            WebkitBackdropFilter: 'blur(4px) saturate(120%)'
          }}
        />

        {/* Bottom border diffusion strip */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: `${borderPadding}px`,
            backdropFilter: 'blur(4px) saturate(120%)',
            WebkitBackdropFilter: 'blur(4px) saturate(120%)'
          }}
        />
      </div>

      {/* Privacy Glass Dot Overlay - kyrre.dev style cover piece */}
      {/* Top Border Glass Effect */}
      <div
        className="fixed gradient-dots pointer-events-none"
        style={{
          top: '0',
          left: '0',
          right: '0',
          height: `${borderPadding}px`,
          zIndex: 42
        }}
      />

      {/* Bottom Border Glass Effect */}
      <div
        className="fixed gradient-dots pointer-events-none"
        style={{
          bottom: '0',
          left: '0',
          right: '0',
          height: `${borderPadding}px`,
          transform: 'rotate(180deg)',
          zIndex: 42
        }}
      />

      {/* Solid background layer - matches interior to hide wallpaper behind dots */}
      <div
        className="fixed"
        style={{
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          backgroundColor: 'var(--theme-bg)',
          zIndex: -5
        }}
      />

      {/* Interior Window Background - Provides solid backdrop */}
      <div
        className="fixed"
        style={{
          top: `${borderPadding}px`,
          left: `${borderPadding}px`,
          right: `${borderPadding}px`,
          bottom: `${borderPadding}px`,
          backgroundColor: 'var(--theme-bg)',
          zIndex: -1
        }}
      />
    </>
  );
};