'use client';

import React, { useEffect, useRef } from 'react';
import type { ScrollProgressStore } from '@/components/layout/parallax/hooks/useParallaxScroll';

interface ScrollProgressProps {
  progress: ScrollProgressStore;
  position?: 'left' | 'right';
}

const dots = (alpha: number) =>
  `radial-gradient(circle at center, rgba(var(--accent-color-rgb), ${alpha}) 0.5px, transparent 0.5px)`;

/** Where the highlight sits: 20 px from the top at 0, 20 px from the bottom at 1, minus `offset`. */
const track = (offset: number) => `translateY(calc(20px + var(--scroll-p, 0) * (100dvh - 40px) - ${offset}px))`;

/**
 * The dotted scroll indicator outside the phone layout's frame. It reads the scroll position from
 * a store and writes one CSS variable, so scrolling never re-renders React; a short CSS transition
 * smooths the movement.
 */
const ScrollProgress: React.FC<ScrollProgressProps> = ({ progress, position = 'right' }) => {
  const root = useRef<HTMLDivElement>(null);

  useEffect(
    () => progress.subscribe((p) => root.current?.style.setProperty('--scroll-p', p.toFixed(4))),
    [progress]
  );

  const moving: React.CSSProperties = {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    pointerEvents: 'none',
    transition: 'transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1)',
  };

  return (
    <div ref={root} className="fixed top-0 bottom-0 pointer-events-none z-50" style={{ [position]: '0px', width: '4px' }}>
      {/* Full-height dotted track */}
      <div className="absolute inset-0" style={{ backgroundImage: dots(0.05), backgroundSize: '2px 4px', backgroundPosition: 'center' }} />

      {/* Highlight around the current position */}
      <div
        style={{
          ...moving,
          height: 80,
          transform: track(40),
          background:
            'linear-gradient(to bottom, transparent, rgba(var(--accent-color-rgb), 0.15) 20%, rgba(var(--accent-color-rgb), 0.25) 50%, rgba(var(--accent-color-rgb), 0.15) 80%, transparent)',
          mixBlendMode: 'screen',
          filter: 'blur(2px)',
        }}
      />

      {/* Denser dots in the highlighted area */}
      <div
        style={{
          ...moving,
          height: 60,
          opacity: 0.6,
          transform: track(30),
          backgroundImage: dots(0.2),
          backgroundSize: '2px 4px',
          backgroundPosition: 'center',
        }}
      />
    </div>
  );
};

export default ScrollProgress;
