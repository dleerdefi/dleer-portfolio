'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useFocusNavigation } from '@/contexts/FocusContext';
import { useAfterIdle } from '@/hooks/useAfterIdle';
import { useLabData } from '@/hooks/useLabData';
import { isDesktopNow } from '@/hooks/useMediaQuery';
import { fmtCount, fmtInt, fmtUsd, fmtWatts } from '@/lib/lab/format';
import { COST_NOTE } from '@/lib/lab/names';
import type { LabSummary } from '@/lib/lab/types';
import { StatusGlyph } from '@/components/lab/shared/LabStatusBadge';
import { HostsGlyph } from '@/components/lab/telemetry/HostsLine';

/**
 * The neofetch tile's two lab rows, from /api/lab/summary: `Lab: 1,029 W · 3/3 hosts ●` and
 * `Honeypot: 15.4k events/24h · 31 countries`. A row is hidden while its state is offline or
 * unknown, and the Honeypot row while the summary has no threats block (threat map off).
 * Clicking a row opens its view in the content tile on desktop, and its page on a phone (the
 * same rows are the phone hero's). Dimming while the tile is unfocused is CSS.
 */
export default function NeofetchLabRows() {
  const idle = useAfterIdle();
  const { payload } = useLabData<LabSummary>('/api/lab/summary', 300_000, { enabled: idle });
  const { handleContentNavigation } = useFocusNavigation();
  const router = useRouter();
  if (!payload) return null;
  const { telemetry: tel, threats } = payload;

  const label = { color: 'var(--theme-primary)' };
  const row: React.CSSProperties = {
    display: 'block',
    // At least WCAG's 24 px target: the two rows sit 4 px apart
    minHeight: '24px',
    background: 'none',
    border: 0,
    // A wrapped row indents under its key, like the rows above (.neofetch-rows > li)
    padding: '0 0 0 2ch',
    textIndent: '-2ch',
    font: 'inherit',
    color: 'inherit',
    textAlign: 'left',
    cursor: 'pointer',
    pointerEvents: 'auto',
  };
  const open = (type: 'lab-telemetry' | 'lab-threats') => (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDesktopNow()) handleContentNavigation({ type });
    else router.push(type === 'lab-telemetry' ? '/lab' : '/lab/threats');
  };

  return (
    <>
      {tel.state !== 'offline' && tel.hosts_up !== undefined && tel.hosts_expected !== undefined && (
        <button type="button" className="lab-focus hover:underline" style={row} onClick={open('lab-telemetry')}>
          <span className="font-bold" style={label}>Lab</span>: {fmtWatts(tel.power_w)} · {tel.hosts_up}/
          {tel.hosts_expected} hosts{' '}
          <HostsGlyph up={tel.hosts_up} expected={tel.hosts_expected} state={tel.state} />
          {typeof tel.energy_cost_usd_24h === 'number' && (
            <span title={COST_NOTE}> · {fmtUsd(tel.energy_cost_usd_24h)}/day</span>
          )}
        </button>
      )}
      {threats && threats.state !== 'offline' && threats.events !== undefined && (
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
