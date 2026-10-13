'use client';

import React from 'react';
import { useFocus, type TileType } from '@/contexts/FocusContext';

/**
 * One area of the home page: a tile in the desktop grid, a section in the phone column (the same
 * element; app/styles/15-home-layout.css decides). `data-focused` drives the desktop focus ring
 * and `data-dim` dims an unfocused tile, both in CSS; `section-<sectionId>` is the phone rail's
 * anchor. Focusable from script (hjkl) but not a Tab stop itself.
 */
export function FocusTile({
  id,
  sectionId,
  label,
  dim = false,
  className = '',
  children,
}: {
  id: TileType;
  sectionId: string;
  label: string;
  dim?: boolean;
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
      data-dim={dim || undefined}
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
