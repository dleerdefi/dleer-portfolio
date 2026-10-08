'use client';

import React from 'react';
import { fmtClock, DASH } from '@/lib/lab/format';
import { countryName } from '@/lib/lab/countries';
import type { Category } from '@/lib/lab/types';
import { Swatch } from '@/components/lab/shared/Swatch';
import type { ReplayEvent } from './ReplayClock';

/**
 * A journalctl-style log of replayed events, newest at the bottom. Text only, no links, and
 * `aria-live="off"`: announcing every line would be noise. The page shows the service and
 * target columns; `sensor` prints as `honeypot`, `web` as the web target's label.
 */
export function ThreatFeed({
  lines,
  webLabel,
  full = false,
  rows,
  columns = 1,
}: {
  lines: ReplayEvent[];
  webLabel: string;
  full?: boolean;
  /** Visible rows per column. */
  rows: number;
  columns?: 1 | 2;
}) {
  const shown = lines.slice(-rows * columns);
  const cols = columns === 2 ? [shown.slice(0, Math.max(0, shown.length - rows)), shown.slice(-rows)] : [shown];
  return (
    <div
      aria-live="off"
      style={{
        display: 'grid',
        gridTemplateColumns: columns === 2 ? 'repeat(2, minmax(0, 1fr))' : 'minmax(0, 1fr)',
        columnGap: '2rem',
        height: `calc(${rows} * 1.75em)`,
        overflow: 'hidden',
      }}
    >
      {cols.map((col, ci) => (
        <ol key={ci} style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', minWidth: 0 }}>
          {col.map((e) => (
            <FeedLine key={e.id} e={e} webLabel={webLabel} full={full} />
          ))}
        </ol>
      ))}
    </div>
  );
}

function FeedLine({ e, webLabel, full }: { e: ReplayEvent; webLabel: string; full: boolean }) {
  const cell = (ch: number): React.CSSProperties => ({ display: 'inline-block', minWidth: `${ch}ch` });
  return (
    <li style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'clip', lineHeight: 1.75 }}>
      <span className="lab-text-2" style={cell(9)}>
        {fmtClock(e.bucketStart)}
      </span>
      <span style={{ ...cell(13), display: 'inline-flex', alignItems: 'center', gap: '0.5ch' }}>
        <Swatch category={e.cat as Category} />
        {e.cat}
      </span>
      {full && <span style={cell(7)}>{e.svc}</span>}
      <span style={cell(3)} title={countryName(e.cc)}>
        {e.cc ?? DASH}
      </span>
      <span className="lab-text-2" style={cell(full ? 6 : 4)}>
        {e.n > 1 ? ` ×${e.n}` : ''}
      </span>
      {full && <span className="lab-text-2">→ {e.target === 'sensor' ? 'honeypot' : webLabel}</span>}
    </li>
  );
}
