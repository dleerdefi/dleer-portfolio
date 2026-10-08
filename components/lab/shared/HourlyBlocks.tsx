import React from 'react';
import { fmtInt } from '@/lib/lab/format';

export interface HourlyRow {
  key: string;
  /** Rendered in the first column (swatch and name); omitted for a single unlabelled row. */
  label?: React.ReactNode;
  color: string;
  values: number[];
}

/**
 * Rows of 24 hourly bars. Each row is scaled to its own maximum (shape over magnitude), so the
 * caption must say `each row its own scale`; the row total is printed at the end. The bars are
 * decorative: the totals carry the numbers.
 */
export function HourlyBlocks({
  rows,
  caption,
  barHeight = 14,
  showTotals = true,
}: {
  rows: HourlyRow[];
  caption?: React.ReactNode;
  barHeight?: number;
  showTotals?: boolean;
}) {
  return (
    <table className="lab-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
      {caption && (
        <caption className="lab-text-2" style={{ textAlign: 'left', paddingBottom: '0.4em' }}>
          {caption}
        </caption>
      )}
      <tbody>
        {rows.map((row) => {
          const total = row.values.reduce((a, v) => a + v, 0);
          return (
            <tr key={row.key}>
              {row.label !== undefined && (
                <th scope="row" style={{ whiteSpace: 'nowrap', color: 'var(--theme-text)' }}>
                  {row.label}
                </th>
              )}
              <td style={{ width: '100%', paddingRight: showTotals ? '0.75em' : 0 }}>
                <Bars values={row.values} color={row.color} height={barHeight} />
              </td>
              {showTotals && <td className="lab-num">{fmtInt(total)}</td>}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function Bars({ values, color, height }: { values: number[]; color: string; height: number }) {
  const max = Math.max(...values, 0);
  const n = values.length;
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${n * 10} 100`}
      preserveAspectRatio="none"
      style={{ display: 'block', width: '100%', height }}
    >
      {values.map((v, i) => {
        // zero hours keep a faint baseline so the row still reads as 24 slots
        const h = max > 0 && v > 0 ? Math.max(8, (v / max) * 100) : 6;
        return (
          <rect
            key={i}
            x={i * 10 + 1}
            y={100 - h}
            width={8}
            height={h}
            fill={color}
            fillOpacity={v > 0 ? 1 : 0.3}
          />
        );
      })}
    </svg>
  );
}
