'use client';

import React from 'react';
import { fmtInt } from '@/lib/lab/format';
import type { DigestLive } from './useThreats';

/**
 * Where the globe goes. The canvas is decorative (`aria-hidden`); this sentence beside it
 * summarises it for screen readers and is updated with the digest.
 */
export function GlobeSummary({ d }: { d: DigestLive }) {
  return (
    <p className="sr-only">
      Live map: {fmtInt(d.totals.events)} attacks in the last 24 hours from {fmtInt(d.totals.countries)} countries
    </p>
  );
}

/** Phase 3 stand-in for the globe (docs/lab/LAB_UI_SPEC.md §13): the box, the targets, the summary. */
export function GlobeSlot({ d, size }: { d: DigestLive; size: number | string }) {
  return (
    <div style={{ width: size, maxWidth: '100%', aspectRatio: '1 / 1', position: 'relative' }}>
      <GlobeSummary d={d} />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          border: '1px dashed var(--theme-border)',
          borderRadius: '50%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
          color: 'var(--lab-text-2)',
        }}
      >
        {d.targets.map((t) => (
          <span key={t.id}>
            {t.label} · {t.up ? 'up' : 'down'}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Under the globe while the live document is not live but the digest is. */
export function FeedPaused() {
  return (
    <p className="lab-text-2" style={{ margin: '0.5rem 0 0', textAlign: 'center' }}>
      live feed paused
    </p>
  );
}
