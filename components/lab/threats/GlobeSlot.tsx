'use client';

import React, { useEffect, useRef, useState } from 'react';
import { fmtInt } from '@/lib/lab/format';
import type { Category } from '@/lib/lab/types';
import type { ReplayEvent } from './ReplayClock';
import { webglAvailable } from './globe-setup';
import ThreatGlobe from './ThreatGlobe';
import type { DigestLive } from './useThreats';

/** The globe chunk's measured transfer size (gzipped globe.gl, three, topojson and land). */
export const GLOBE_KB = 590;

type Mode = 'pending' | 'auto' | 'tap' | 'nowebgl';

/**
 * Where the globe goes. Desktop (≥ 1024 px, no Save-Data) loads it when the box enters the
 * viewport; phones and Save-Data show `▶ ./render-globe` and load it on tap, with
 * `■ stop globe` to unload it again. No WebGL: the placeholder, disabled. The stats, legend and
 * feed never depend on it.
 */
export function GlobeSlot({
  d,
  maxSize,
  labels,
  subscribe,
  hidden,
}: {
  d: DigestLive;
  maxSize: number;
  labels: 'none' | 'short' | 'full';
  subscribe: (fn: (e: ReplayEvent) => void) => () => void;
  hidden: ReadonlySet<Category>;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>('pending');
  const [phone, setPhone] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const isPhone = window.innerWidth < 1024;
    const saveData = !!(navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    setPhone(isPhone);
    setMode(!webglAvailable() ? 'nowebgl' : isPhone || saveData ? 'tap' : 'auto');
  }, []);

  // Desktop: load once the box is in (or near) the viewport.
  useEffect(() => {
    if (mode !== 'auto' || show || !box.current) return;
    const io = new IntersectionObserver(([entry]) => entry.isIntersecting && setShow(true), { rootMargin: '200px' });
    io.observe(box.current);
    return () => io.disconnect();
  }, [mode, show]);

  return (
    <div ref={box} style={{ width: '100%', maxWidth: maxSize, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
      <GlobeSummary d={d} />
      {show ? (
        <>
          {/* phones: 300 px, beacons only (THREATS_VIEW.md §4.3) */}
          <ThreatGlobe
            d={d}
            subscribe={subscribe}
            hidden={hidden}
            maxSize={phone ? Math.min(300, maxSize) : maxSize}
            labels={phone ? 'none' : labels}
            phone={phone}
          />
          {mode === 'tap' && (
            <button type="button" className="lab-focus lab-globe-button" onClick={() => setShow(false)} style={{ alignSelf: 'flex-end' }}>
              <span aria-hidden="true">■</span> stop globe
            </button>
          )}
        </>
      ) : mode === 'auto' || mode === 'pending' ? (
        <div style={{ width: '100%', aspectRatio: '1 / 1' }} aria-hidden="true" />
      ) : (
        <GlobePlaceholder disabled={mode === 'nowebgl'} onLoad={() => setShow(true)} />
      )}
    </div>
  );
}

function GlobePlaceholder({ disabled, onLoad }: { disabled: boolean; onLoad: () => void }) {
  return (
    <div
      style={{
        width: '100%',
        border: '1px dashed var(--theme-border)',
        padding: '2.5rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.9rem',
        textAlign: 'center',
      }}
    >
      <button type="button" className="lab-focus lab-globe-button is-primary" disabled={disabled} onClick={onLoad}>
        <span aria-hidden="true">▶</span> ./render-globe
      </button>
      <span className="lab-text-2">
        {disabled ? 'WebGL not available' : `loads the 3D map (about ${GLOBE_KB} KB) on tap`}
      </span>
    </div>
  );
}

/**
 * The canvas is decorative (`aria-hidden`); this sentence summarises it for screen readers and
 * is updated with the digest.
 */
export function GlobeSummary({ d }: { d: DigestLive }) {
  return (
    <p className="sr-only">
      Live map: {fmtInt(d.totals.events)} attacks in the last 24 hours from {fmtInt(d.totals.countries)} countries
    </p>
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
