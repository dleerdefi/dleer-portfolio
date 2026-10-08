import React from 'react';
import { domainOf, linePaths, type Domain } from '@/lib/lab/chart';

const W = 1000;
const H = 100;

/**
 * A full-width SVG sparkline: a 2 px line in the accent (or a category color) over a 10 % wash.
 * `null` breaks the line. Small multiples pass one shared `domain` and say so in their caption.
 * Decorative (`aria-hidden`): the printed value beside it carries the information.
 */
export function Sparkline({
  values,
  height = 56,
  domain,
  color = 'var(--accent-color)',
  endLabel,
  style,
}: {
  values: (number | null)[];
  height?: number;
  domain?: Domain | null;
  color?: string;
  endLabel?: string;
  style?: React.CSSProperties;
}) {
  const d = domain ?? domainOf(values);
  // A flat series sits in the middle rather than on an edge.
  const box = d && d.max === d.min ? { min: d.min - 1, max: d.max + 1 } : d;
  const runs = box ? linePaths(values, { width: W, height: H, domain: box, pad: 4 }) : [];
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: '0.6em', minWidth: 0, ...style }}>
      <svg
        aria-hidden="true"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        style={{ display: 'block', width: '100%', height, flex: '1 1 auto', minWidth: 0, overflow: 'visible' }}
      >
        {runs.map((r, i) => (
          <path key={`a${i}`} d={r.area} fill={color} fillOpacity={0.1} stroke="none" />
        ))}
        {runs.map((r, i) => (
          <path
            key={`l${i}`}
            d={r.line}
            fill="none"
            stroke={color}
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      {endLabel && <span style={{ whiteSpace: 'nowrap', color: 'var(--theme-text)' }}>{endLabel}</span>}
    </span>
  );
}
