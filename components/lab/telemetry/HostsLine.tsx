import React from 'react';
import { StatusGlyph } from '@/components/lab/shared/LabStatusBadge';
import type { LabState } from '@/lib/lab/types';

/**
 * `3/3 up ●`: the glyph follows the badge, except that a missing host shows `◐` in the
 * warning color (TELEMETRY_VIEW.md §6).
 */
export function HostsGlyph({ up, expected, state }: { up: number; expected: number; state: LabState }) {
  const glyphState: LabState = up < expected ? 'delayed' : state;
  return <StatusGlyph state={glyphState} label={false} />;
}

export function hostsText(up: number, expected: number) {
  return `${up}/${expected}`;
}
