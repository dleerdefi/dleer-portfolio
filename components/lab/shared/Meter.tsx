import React from 'react';
import { fmtPct } from '@/lib/lab/format';

/**
 * A horizontal bar for a 0–1 ratio: track `--lab-track`, fill in the accent (or `color`), at
 * least 2 % visible for any value above 0, the percentage printed beside it. `null` → an empty
 * track and a dash. The bar is decorative; the printed value carries the information.
 */
export function Meter({
  value,
  width = '4.5em',
  color = 'var(--accent-color)',
  showValue = true,
  valueWidth = '3.2em',
}: {
  value: number | null;
  width?: string;
  color?: string;
  showValue?: boolean;
  valueWidth?: string;
}) {
  const pct = value === null ? 0 : value > 0 ? Math.max(2, Math.min(100, value * 100)) : 0;
  // width="100%": the bar fills whatever its cell leaves after the printed value
  const fill = width === '100%';
  return (
    <span
      style={{
        display: fill ? 'flex' : 'inline-flex',
        width: fill ? '100%' : undefined,
        alignItems: 'center',
        gap: '0.6em',
        whiteSpace: 'nowrap',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          display: 'inline-block',
          width: fill ? undefined : width,
          flex: fill ? '1 1 auto' : undefined,
          minWidth: fill ? '2rem' : undefined,
          height: '0.55em',
          background: 'var(--lab-track)',
          position: 'relative',
          flexShrink: fill ? 1 : 0,
        }}
      >
        <span style={{ position: 'absolute', inset: 0, width: `${pct}%`, background: color }} />
      </span>
      {showValue && (
        <span style={{ minWidth: valueWidth, textAlign: 'right', color: 'var(--theme-text)' }}>{fmtPct(value)}</span>
      )}
    </span>
  );
}
