'use client';

import React, { useEffect, useState } from 'react';
import { fmtAge } from '@/lib/lab/format';
import type { LabState } from '@/lib/lab/types';

const LOOK: Record<LabState, { icon: string; word: string; color: string }> = {
  live: { icon: '●', word: 'live', color: 'var(--theme-success)' },
  delayed: { icon: '◐', word: 'delayed', color: 'var(--theme-warning)' },
  offline: { icon: '○', word: 'offline', color: 'var(--theme-error)' },
};

/** Ticks once a second so "12 s ago" stays true between polls. */
function useAge(ageS: number | undefined, receivedAt: number | undefined): number | undefined {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (ageS === undefined) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [ageS]);
  if (ageS === undefined) return undefined;
  return ageS + Math.max(0, (now - (receivedAt ?? now)) / 1000);
}

/**
 * `● live 42 s ago`, `◐ delayed as of 7 min ago`, `○ offline`: icon + word + color, never color
 * alone. Demo data is a separate, neutral badge (it is not a status).
 */
export function LabStatusBadge({
  state,
  ageS,
  receivedAt,
  demo,
  compact = false,
  style,
}: {
  state: LabState | null;
  ageS?: number;
  receivedAt?: number;
  demo?: boolean;
  /** Phones: the word only. */
  compact?: boolean;
  style?: React.CSSProperties;
}) {
  const age = useAge(state === 'offline' ? undefined : ageS, receivedAt);
  if (!state) return null;
  const look = LOOK[state];
  const when =
    compact || age === undefined || state === 'offline'
      ? null
      : state === 'delayed'
        ? `as of ${fmtAge(age)}`
        : fmtAge(age);
  return (
    <span style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '0.5em', ...style }}>
      <span role="status" className="lab-badge" style={{ borderColor: look.color }}>
        <span aria-hidden="true" style={{ color: look.color }}>
          {look.icon}
        </span>
        <span style={{ color: 'var(--theme-text)' }}>{look.word}</span>
        {when && <span className="lab-text-2">{when}</span>}
      </span>
      {demo && (
        <span className="lab-badge lab-badge-demo">
          <span aria-hidden="true">◇</span> demo data
        </span>
      )}
    </span>
  );
}

/** The glyph alone (nav tile, neofetch, hosts line): `●` live, `◐` delayed, `○` offline. */
export function StatusGlyph({ state, label = true }: { state: LabState; label?: boolean }) {
  const look = LOOK[state];
  return (
    <span style={{ color: look.color, whiteSpace: 'nowrap' }}>
      <span aria-hidden={label ? 'true' : undefined}>{look.icon}</span>
      {label ? <span style={{ marginLeft: '0.4em' }}>{look.word}</span> : <span className="sr-only">{look.word}</span>}
    </span>
  );
}
