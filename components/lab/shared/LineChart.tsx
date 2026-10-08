'use client';

import React, { useEffect, useRef, useState } from 'react';
import { domainOf, linePaths, niceTicks } from '@/lib/lab/chart';
import { fmtAgoLong } from '@/lib/lab/format';

const M = { top: 10, right: 84, bottom: 26, left: 56 };

/**
 * One measure on one y-axis: recessive grid, three x labels, an end label with the latest value,
 * a hover crosshair and tooltip. Focusable: arrow keys move the crosshair (Shift: an hour),
 * Home and End jump. `null` breaks the line.
 */
export function LineChart({
  values,
  stepS,
  height = 200,
  format,
  ariaLabel,
  xLabels = ['-24 h', '-12 h', 'now'],
}: {
  values: (number | null)[];
  stepS: number;
  height?: number;
  format: (v: number | null) => string;
  ariaLabel: string;
  xLabels?: [string, string, string];
}) {
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [cursor, setCursor] = useState<number | null>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const n = values.length;
  const data = domainOf(values);
  const ticks = data ? niceTicks(data, 3) : [];
  const domain = ticks.length > 1 ? { min: ticks[0], max: ticks[ticks.length - 1] } : data;
  const plotW = Math.max(0, width - M.left - M.right);
  const plotH = height - M.top - M.bottom;
  const runs = domain && plotW > 0 ? linePaths(values, { width: plotW, height: plotH, domain }) : [];
  const xAt = (i: number) => (n <= 1 ? 0 : (i / (n - 1)) * plotW);
  const yAt = (v: number) =>
    domain ? (1 - (v - domain.min) / (domain.max - domain.min || 1)) * plotH : plotH / 2;
  const lastIndex = findLast(values);
  const last = lastIndex === -1 ? null : values[lastIndex];

  const move = (i: number) => setCursor(Math.max(0, Math.min(n - 1, i)));
  const onKey = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? Math.round(3600 / stepS) : 1;
    const at = cursor ?? n - 1;
    const keys: Record<string, number> = { ArrowLeft: at - step, ArrowRight: at + step, Home: 0, End: n - 1 };
    if (e.key in keys) {
      e.preventDefault();
      move(keys[e.key]);
    } else if (e.key === 'Escape') setCursor(null);
  };
  const onPointer = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left - M.left;
    move(Math.round((px / (plotW || 1)) * (n - 1)));
  };

  const cv = cursor === null ? null : values[cursor];
  const tipX = cursor === null ? 0 : xAt(cursor);
  const tipLeft = tipX > plotW - 150 ? tipX - 150 : tipX + 10;

  return (
    <div ref={box} style={{ position: 'relative', width: '100%' }}>
      {width > 0 && (
        <svg
          role="img"
          aria-label={ariaLabel}
          tabIndex={0}
          className="lab-focus"
          width={width}
          height={height}
          onPointerMove={onPointer}
          onPointerLeave={() => setCursor(null)}
          onKeyDown={onKey}
          onFocus={() => setCursor((c) => c ?? lastIndex)}
          onBlur={() => setCursor(null)}
          style={{ display: 'block', touchAction: 'pan-y' }}
        >
          <g transform={`translate(${M.left},${M.top})`} fontSize="0.8em" fill="var(--lab-text-2)">
            {ticks.map((t) => (
              <g key={t}>
                <line x1={0} x2={plotW} y1={yAt(t)} y2={yAt(t)} stroke="var(--theme-border)" strokeOpacity={0.6} />
                <text x={-8} y={yAt(t)} dy="0.35em" textAnchor="end">
                  {t.toLocaleString('en-US')}
                </text>
              </g>
            ))}
            {runs.map((r, i) => (
              <path key={`a${i}`} d={r.area} fill="var(--accent-color)" fillOpacity={0.1} />
            ))}
            {runs.map((r, i) => (
              <path key={`l${i}`} d={r.line} fill="none" stroke="var(--accent-color)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
            ))}
            {[0, 0.5, 1].map((f, i) => (
              <text key={f} x={f * plotW} y={plotH + 18} textAnchor={i === 0 ? 'start' : i === 1 ? 'middle' : 'end'}>
                {xLabels[i]}
              </text>
            ))}
            {last !== null && (
              <g>
                <circle cx={xAt(lastIndex)} cy={yAt(last)} r={3.5} fill="var(--accent-color)" />
                <text x={xAt(lastIndex) + 10} y={yAt(last)} dy="0.35em" fill="var(--theme-text)">
                  {format(last)}
                </text>
              </g>
            )}
            {cursor !== null && (
              <g pointerEvents="none">
                <line x1={tipX} x2={tipX} y1={0} y2={plotH} stroke="var(--lab-text-2)" strokeOpacity={0.7} />
                {cv !== null && <circle cx={tipX} cy={yAt(cv)} r={3.5} fill="var(--accent-color)" />}
              </g>
            )}
          </g>
        </svg>
      )}
      {cursor !== null && width > 0 && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: M.top,
            left: M.left + tipLeft,
            padding: '0.35em 0.6em',
            background: 'var(--theme-surface)',
            border: '1px solid var(--theme-border)',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            fontSize: '0.85em',
          }}
        >
          <div className="lab-text-2">{fmtAgoLong((n - 1 - cursor) * stepS)}</div>
          <div style={{ color: 'var(--theme-text)' }}>{format(cv)}</div>
        </div>
      )}
    </div>
  );
}

function findLast(values: (number | null)[]): number {
  for (let i = values.length - 1; i >= 0; i--) if (values[i] !== null) return i;
  return -1;
}
