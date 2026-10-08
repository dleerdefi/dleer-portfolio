import React from 'react';

/** A bordered statistics block with its caption; an empty list says so (THREATS_VIEW.md §10). */
export function StatBox({
  caption,
  empty = false,
  children,
  style,
}: {
  caption: React.ReactNode;
  empty?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <section className="lab-card" style={{ minWidth: 0, ...style }}>
      <h3 className="lab-text-2" style={{ margin: '0 0 0.6rem', fontSize: 'inherit', fontWeight: 400 }}>
        {caption}
      </h3>
      {empty ? <p className="lab-text-2" style={{ margin: 0 }}>none in the last 24 h</p> : children}
    </section>
  );
}

/** A full-width two-column table: label | number(s). */
export function KvTable({ rows, label }: { rows: [React.ReactNode, React.ReactNode][]; label: string }) {
  return (
    <table className="lab-table" style={{ width: '100%', borderCollapse: 'collapse' }} aria-label={label}>
      <tbody>
        {rows.map(([k, v], i) => (
          <tr key={i}>
            <th scope="row">{k}</th>
            <td className="lab-num" style={{ paddingRight: 0 }}>
              {v}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** A bar scaled to the list's first value, in the accent (or a category color). Decorative. */
export function Bar({ value, max, color = 'var(--accent-color)' }: { value: number; max: number; color?: string }) {
  const pct = max > 0 ? Math.max(value > 0 ? 2 : 0, (value / max) * 100) : 0;
  return (
    <span aria-hidden="true" style={{ display: 'block', height: '0.65em', background: 'var(--lab-track)' }}>
      <span style={{ display: 'block', height: '100%', width: `${pct}%`, background: color }} />
    </span>
  );
}
