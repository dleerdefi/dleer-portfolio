'use client';

import React, { useEffect, useState } from 'react';
import { useLabStatus } from '@/lib/lab/status-store';
import { fmtWatts } from '@/lib/lab/format';

const LABELS: Record<string, string> = {
  top: 'Top',
  home: 'Featured',
  lab: 'Lab',
  about: 'About',
  stack: 'Stack',
  projects: 'Projects',
  contact: 'Contact',
};

/**
 * The phone's polybar (docs/PORTFOLIO_V2_SPEC.md §4.2): one dot per section, the current one
 * filled; tap to jump. It fades out while the page scrolls and back once it settles, hides while
 * the on-screen keyboard is up, and shows the lab's live power next to its dot.
 */
export function SectionRail({ ids, active, settled }: { ids: string[]; active: string; settled: boolean }) {
  const status = useLabStatus();
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const onResize = () => setKeyboardOpen(vv.height < window.innerHeight * 0.75);
    vv.addEventListener('resize', onResize);
    return () => vv.removeEventListener('resize', onResize);
  }, []);

  const jump = (id: string) => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };
  const power = status.telemetry === 'live' && typeof status.power_w === 'number' ? fmtWatts(status.power_w) : null;

  return (
    <nav className="section-rail" aria-label="Sections" data-hidden={!settled || keyboardOpen || undefined}>
      {ids.map((id) => (
        <button
          key={id}
          type="button"
          className="rail-dot"
          aria-label={id === 'lab' && power ? `${LABELS[id]}, ${power}` : (LABELS[id] ?? id)}
          aria-current={active === id ? 'true' : undefined}
          onClick={() => jump(id)}
        >
          <span className="rail-dot-mark" aria-hidden="true" />
          {id === 'lab' && power && (
            <span className="rail-power" aria-hidden="true">
              {power}
            </span>
          )}
        </button>
      ))}
    </nav>
  );
}
