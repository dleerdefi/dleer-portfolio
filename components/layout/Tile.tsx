import React from 'react';

/**
 * One desktop tile. Its chrome (border, glass, focus ring, transitions) is the `.tile` class in
 * app/styles/11-glass-effects.css, so the very first render already has its padding and border:
 * nothing animates into place after hydration (docs/PORTFOLIO_V2_SPEC.md, P11).
 */
export function Tile({
  id,
  focused,
  background,
  padding,
  scroll = false,
  style,
  onFocus,
  children,
}: {
  id: string;
  focused: boolean;
  /** The tile's surface color; changes with focus and theme, and transitions in CSS */
  background: string;
  padding: number;
  /** Scrolls its own content (no visible scrollbar) instead of clipping it */
  scroll?: boolean;
  /** Sizing within the grid: flex, width, height */
  style?: React.CSSProperties;
  onFocus: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      data-tile={id}
      data-focused={focused || undefined}
      className={`tile ${scroll ? 'overflow-auto no-scrollbar' : 'overflow-hidden'}`}
      style={{ ...style, backgroundColor: background, padding }}
      onClick={onFocus}
    >
      {children}
    </div>
  );
}
