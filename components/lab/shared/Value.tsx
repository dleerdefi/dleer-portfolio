import React from 'react';
import { DASH } from '@/lib/lab/format';

/**
 * A formatted number with its unit beside it (smaller, secondary), or a bare dash for `null`:
 * the dash never carries a unit.
 */
export function Value({
  text,
  unit,
  unitScale = 0.45,
  unitStyle,
}: {
  /** Already formatted (fmtInt, fmtDecimal…); DASH for unknown. */
  text: string;
  unit?: string;
  unitScale?: number;
  unitStyle?: React.CSSProperties;
}) {
  if (text === DASH || !unit) return <>{text}</>;
  return (
    <>
      {text}
      <span className="lab-text-2" style={{ fontSize: `${unitScale}em`, marginLeft: '0.35em', ...unitStyle }}>
        {unit}
      </span>
    </>
  );
}
