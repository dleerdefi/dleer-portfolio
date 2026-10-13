'use client';

import React, { useEffect, useState } from 'react';
import type { ContentType } from '@/contexts/FocusContext';
import { useLabStatus } from '@/lib/lab/status-store';
import type { LabState } from '@/lib/lab/types';
import { StatusGlyph } from '@/components/lab/shared/LabStatusBadge';

/**
 * `lab/` in the contents tree (components/home/NavTree.tsx), between `projects/` and `about`.
 * Clicking it opens the telemetry view; the arrow toggles `telemetry` and `threats` (only
 * `telemetry` while the threat map is off), which open their views in the stage.
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

  const telemetry = { type: 'lab-telemetry' as const, label: 'telemetry', state: status.telemetry };
  // Rendered only while the lab is on, so the threats flag alone decides. Read directly (not via
  // labThreatsEnabled) so the build folds it and the home bundle carries no threats entry.
  const children: { type: 'lab-telemetry' | 'lab-threats'; label: string; state?: LabState }[] =
    process.env.NEXT_PUBLIC_FEATURE_LAB_THREATS === 'true'
      ? [telemetry, { type: 'lab-threats', label: 'threats', state: status.threats }]
      : [telemetry];

  return (
    <>
      <div className="nav-dir">
        <button
          type="button"
          className="nav-entry"
          aria-current={inLab && !open ? 'page' : undefined}
          onClick={(e) => onSelect({ type: 'lab-telemetry' }, e)}
        >
          <span className="tree-branch" aria-hidden="true">
            ├──
          </span>{' '}
          lab/
        </button>
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-label={open ? 'Collapse lab' : 'Expand lab'}
          onClick={(e) => {
            e.stopPropagation();
            setOpen(!open);
          }}
        >
          {open ? '▼' : '▶'}
        </button>
      </div>
      {open && (
        <ul className="nav-children" role="list">
          {children.map((child, i) => (
            <li key={child.type}>
              <button
                type="button"
                className="nav-entry"
                aria-current={activeType === child.type ? 'page' : undefined}
                onClick={(e) => onSelect({ type: child.type }, e)}
              >
                <span className="tree-branch" aria-hidden="true">
                  {i === children.length - 1 ? '└──' : '├──'}
                </span>{' '}
                {child.label}
                {child.state && (
                  <span style={{ fontSize: '0.85em', marginLeft: 'auto', paddingLeft: '1em' }}>
                    <StatusGlyph state={child.state} />
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
