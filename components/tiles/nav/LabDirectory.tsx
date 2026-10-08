'use client';

import React, { useEffect, useState } from 'react';
import type { ContentType } from '@/contexts/FocusContext';
import { useLabStatus } from '@/lib/lab/status-store';
import type { LabState } from '@/lib/lab/types';
import { StatusGlyph } from '@/components/lab/shared/LabStatusBadge';

const reset: React.CSSProperties = { background: 'none', border: 0, font: 'inherit', color: 'inherit', textAlign: 'left' };

/**
 * `Lab/` in the nav tile, between `Blog/` and `Contact`. Clicking it opens the telemetry view;
 * the arrow toggles `telemetry` and `threats`, which open their views in the content tile.
 * Each child shows its view's status glyph once a lab fetch has reported it.
 */
export function LabDirectory({
  activeType,
  onSelect,
}: {
  activeType: ContentType['type'];
  onSelect: (content: ContentType, e: React.MouseEvent) => void;
}) {
  const [open, setOpen] = useState(false);
  const status = useLabStatus();
  const inLab = activeType === 'lab-telemetry' || activeType === 'lab-threats';
  // Opening a lab view (from here, the polybar or neofetch) shows its entry; the arrow still toggles.
  useEffect(() => {
    if (inLab) setOpen(true);
  }, [inLab]);
  const expanded = open;

  const children: { type: 'lab-telemetry' | 'lab-threats'; label: string; state?: LabState }[] = [
    { type: 'lab-telemetry', label: 'telemetry', state: status.telemetry },
    { type: 'lab-threats', label: 'threats', state: status.threats },
  ];

  return (
    <div>
      <div
        className="touch-target touch-feedback px-2 py-1 rounded transition-all duration-200 flex items-center justify-between"
        style={{ backgroundColor: inLab && !expanded ? 'rgba(var(--accent-color-rgb), 0.2)' : 'transparent' }}
        onMouseEnter={(e) => {
          if (!(inLab && !expanded)) e.currentTarget.style.backgroundColor = 'rgba(var(--accent-color-rgb), 0.1)';
        }}
        onMouseLeave={(e) => {
          if (!(inLab && !expanded)) e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <button
          type="button"
          className="cursor-pointer lab-focus"
          style={reset}
          onClick={(e) => onSelect({ type: 'lab-telemetry' }, e)}
        >
          <span style={{ color: 'var(--accent-color)' }}>├──</span>{' '}
          <span style={{ color: inLab ? 'var(--accent-color)' : 'var(--theme-text)', fontWeight: inLab ? 'bold' : 'normal' }}>
            Lab/
          </span>
        </button>
        <button
          type="button"
          aria-expanded={expanded}
          aria-label={expanded ? 'Collapse Lab' : 'Expand Lab'}
          className="hover:opacity-80 px-2 -mr-1 rounded cursor-pointer lab-focus"
          style={{ ...reset, color: 'var(--accent-color)' }}
          onClick={(e) => {
            e.stopPropagation();
            setOpen(!expanded);
          }}
        >
          {expanded ? '▼' : '▶'}
        </button>
      </div>
      {expanded && (
        <div className="ml-4">
          {children.map((child, i) => {
            const active = activeType === child.type;
            return (
              <button
                key={child.type}
                type="button"
                aria-current={active ? 'page' : undefined}
                className="touch-target touch-feedback cursor-pointer px-2 py-1 rounded transition-all duration-200 flex items-center justify-between w-full lab-focus"
                style={{
                  ...reset,
                  backgroundColor: active ? 'rgba(var(--accent-color-rgb), 0.2)' : 'transparent',
                  color: active ? 'var(--accent-color)' : 'inherit',
                }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.backgroundColor = 'rgba(var(--accent-color-rgb), 0.1)';
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.backgroundColor = 'transparent';
                }}
                onClick={(e) => onSelect({ type: child.type }, e)}
              >
                <span>
                  <span style={{ color: 'var(--accent-color)' }}>{i === children.length - 1 ? '└──' : '├──'}</span>{' '}
                  {child.label}
                </span>
                {child.state && (
                  <span style={{ fontSize: '0.85em', marginLeft: 'auto', paddingLeft: '1em' }}>
                    <StatusGlyph state={child.state} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
