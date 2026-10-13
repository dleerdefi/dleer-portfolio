'use client';

import React from 'react';
import { useFocus, type TileType } from '@/contexts/FocusContext';

/**
 * One area of the home page: a tile in the desktop grid, a section in the phone column (the same
 * element; app/styles/15-home-layout.css decides). `data-focused` drives the desktop focus ring
 * and the more opaque glass, in CSS (an unfocused tile's text is not dimmed: it must read at 4.5:1
 * over the wallpaper); `section-<sectionId>` is the phone rail's anchor. Focusable from script
 * (hjkl) but not a Tab stop itself.
 */
export function FocusTile({
  id,
  sectionId,
  label,
  className = '',
  children,
}: {
  id: TileType;
  sectionId: string;
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  const { focusedTile, setFocusedTile } = useFocus();
  const focused = focusedTile === id;
  return (
    <section
      id={`section-${sectionId}`}
      data-tile={id}
      data-focused={focused || undefined}
      className={`tile tile-${id} ${className}`}
      tabIndex={-1}
      aria-label={label}
      onClick={() => {
        if (!focused) setFocusedTile(id, 'click');
      }}
    >
      <div className="tile-body">{children}</div>
    </section>
  );
}
