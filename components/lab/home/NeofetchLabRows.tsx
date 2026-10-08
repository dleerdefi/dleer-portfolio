'use client';

import React, { useEffect, useState } from 'react';
import { useFocusNavigation } from '@/contexts/FocusContext';
import { useLabData } from '@/hooks/useLabData';
import { fmtCount, fmtInt, fmtWatts } from '@/lib/lab/format';
import type { LabSummary } from '@/lib/lab/types';
import { StatusGlyph } from '@/components/lab/shared/LabStatusBadge';
import { HostsGlyph } from '@/components/lab/telemetry/HostsLine';

/** True once the browser is idle after first paint (requestIdleCallback, else 1 s). */
function useAfterIdle(): boolean {
  const [idle, setIdle] = useState(false);
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(() => setIdle(true), { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(() => setIdle(true), 1000);
    return () => clearTimeout(id);
  }, []);
  return idle;
}

/**
 * The neofetch tile's two lab rows, from /api/lab/summary: `Lab: 1,029 W · 3/3 hosts ●` and
 * `Honeypot: 15.4k events/24h · 31 countries`. A row is hidden while its state is offline or
 * unknown; clicking it opens its view in the content tile.
 */
export default function NeofetchLabRows({ isBlurred }: { isBlurred: boolean }) {
  const idle = useAfterIdle();
  const { payload } = useLabData<LabSummary>('/api/lab/summary', 300_000, { enabled: idle });
  const { handleContentNavigation } = useFocusNavigation();
  if (!payload) return null;
  const { telemetry: tel, threats } = payload;

  const label = { color: isBlurred ? 'rgba(var(--theme-primary-rgb), 0.6)' : 'var(--theme-primary)' };
  const row: React.CSSProperties = {
    display: 'block',
    background: 'none',
    border: 0,
    padding: 0,
    font: 'inherit',
    color: 'inherit',
    textAlign: 'left',
    cursor: 'pointer',
    pointerEvents: 'auto',
  };
  const open = (type: 'lab-telemetry' | 'lab-threats') => (e: React.MouseEvent) => {
    e.stopPropagation();
    handleContentNavigation({ type });
  };

  return (
    <>
      {tel.state !== 'offline' && tel.hosts_up !== undefined && tel.hosts_expected !== undefined && (
        <button type="button" className="lab-focus hover:underline" style={row} onClick={open('lab-telemetry')}>
          <span className="font-bold" style={label}>Lab</span>: {fmtWatts(tel.power_w)} · {tel.hosts_up}/
          {tel.hosts_expected} hosts{' '}
          <HostsGlyph up={tel.hosts_up} expected={tel.hosts_expected} state={tel.state} />
        </button>
      )}
      {threats.state !== 'offline' && threats.events !== undefined && (
        <button type="button" className="lab-focus hover:underline" style={row} onClick={open('lab-threats')}>
          <span className="font-bold" style={label}>Honeypot</span>: {fmtCount(threats.events)} events/24h ·{' '}
          {fmtInt(threats.countries)} countries
          {threats.state === 'delayed' && (
            <>
              {' '}
              <StatusGlyph state="delayed" label={false} />
            </>
          )}
        </button>
      )}
    </>
  );
}
