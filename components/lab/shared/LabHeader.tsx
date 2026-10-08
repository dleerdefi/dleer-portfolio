'use client';

import React from 'react';
import { LabStatusBadge } from './LabStatusBadge';
import type { LabState } from '@/lib/lab/types';

/** `❯ ~/lab/telemetry` in the accent, with the status and demo badges on the right. */
export function LabHeader({
  title,
  state,
  ageS,
  receivedAt,
  demo,
  titleSize,
  badgeSize,
  compactBadge,
}: {
  title: string;
  state: LabState | null;
  ageS?: number;
  receivedAt?: number | null;
  demo?: boolean;
  titleSize: string;
  badgeSize: string;
  compactBadge?: boolean;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
      <h2 className="font-bold" style={{ color: 'var(--accent-color)', fontSize: titleSize, margin: 0 }}>
        <span aria-hidden="true">❯ </span>
        {title}
      </h2>
      <LabStatusBadge
        state={state}
        ageS={ageS}
        receivedAt={receivedAt ?? undefined}
        demo={demo}
        compact={compactBadge}
        style={{ fontSize: badgeSize }}
      />
    </div>
  );
}

/** The one line a view shows instead of numbers: `○ lab offline`, `loading…`. */
export function LabStateLine({ offline, children }: { offline?: boolean; children: React.ReactNode }) {
  return (
    <p style={{ margin: 0, color: offline ? 'var(--theme-text)' : 'var(--lab-text-2)' }}>
      {offline && (
        <span aria-hidden="true" style={{ color: 'var(--theme-error)', marginRight: '0.6em' }}>
          ○
        </span>
      )}
      {children}
    </p>
  );
}
