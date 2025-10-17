'use client';

import React from 'react';

interface DleerVectorLogoProps {
  /** Triggers the draw-in animation */
  isAnimating?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

/**
 * Vectorized DL logo - Abstract geometric shapes inspired by fastfetch
 * Slanted/diagonal forms filled with horizontal colored bars
 */
export function DleerVectorLogo({
  isAnimating = false,
  className = '',
  style = {}
}: DleerVectorLogoProps) {
  return (
    <svg
      viewBox="0 0 140 80"
      xmlns="http://www.w3.org/2000/svg"
      className={`dleer-vector-logo ${isAnimating ? 'animating' : ''} ${className}`}
      style={{
        width: '100%',
        height: 'auto',
        ...style,
      }}
      aria-label="DL Logo"
      role="img"
    >
      {/* D Shape - Slanted parallelogram/diamond with horizontal bars */}
      <g className="shape-d">
        <rect className="bar bar-1" x="5" y="10" width="50" height="6" fill="var(--theme-error)" />
        <rect className="bar bar-2" x="8" y="19" width="50" height="6" fill="var(--theme-warning)" />
        <rect className="bar bar-3" x="11" y="28" width="50" height="6" fill="var(--theme-success)" />
        <rect className="bar bar-4" x="14" y="37" width="50" height="6" fill="var(--accent-color)" />
        <rect className="bar bar-5" x="17" y="46" width="50" height="6" fill="var(--theme-info)" />
        <rect className="bar bar-6" x="20" y="55" width="50" height="6" fill="var(--theme-primary)" />
        <rect className="bar bar-7" x="23" y="64" width="50" height="6" fill="var(--theme-success)" />
      </g>

      {/* L Shape - Angular L form with horizontal bars */}
      <g className="shape-l">
        <rect className="bar bar-8" x="85" y="10" width="8" height="50" fill="var(--theme-error)" />
        <rect className="bar bar-9" x="93" y="52" width="40" height="8" fill="var(--accent-color)" />
      </g>

      {/* Internal CSS for animation */}
      <style>{`
        .dleer-vector-logo .bar {
          transform-origin: left center;
          transform: scaleX(0);
          transition: transform 400ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Stagger delays for draw-in effect */
        .dleer-vector-logo.animating .bar-1 { transform: scaleX(1); transition-delay: 0ms; }
        .dleer-vector-logo.animating .bar-2 { transform: scaleX(1); transition-delay: 50ms; }
        .dleer-vector-logo.animating .bar-3 { transform: scaleX(1); transition-delay: 100ms; }
        .dleer-vector-logo.animating .bar-4 { transform: scaleX(1); transition-delay: 150ms; }
        .dleer-vector-logo.animating .bar-5 { transform: scaleX(1); transition-delay: 200ms; }
        .dleer-vector-logo.animating .bar-6 { transform: scaleX(1); transition-delay: 250ms; }
        .dleer-vector-logo.animating .bar-7 { transform: scaleX(1); transition-delay: 300ms; }
        .dleer-vector-logo.animating .bar-8 { transform: scaleX(1); transition-delay: 350ms; }
        .dleer-vector-logo.animating .bar-9 { transform: scaleX(1); transition-delay: 400ms; }

        /* Initial state when not animating - show all bars */
        .dleer-vector-logo:not(.animating) .bar {
          transform: scaleX(1);
          transition: none;
        }
      `}</style>
    </svg>
  );
}
