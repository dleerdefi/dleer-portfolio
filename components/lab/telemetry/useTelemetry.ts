'use client';

import { useLabData } from '@/hooks/useLabData';
import type { HistoryDoc, NowDoc } from '@/lib/lab/schemas/telemetry';
import type { LabPayload, LabState, LabSummary } from '@/lib/lab/types';

export type NowLive = Extract<LabPayload<NowDoc>, { state: 'live' | 'delayed' }>;
export type HistoryLive = Extract<LabPayload<HistoryDoc>, { state: 'live' | 'delayed' }>;

/** The three telemetry polls (LAB_UI_SPEC.md §6) and the view state they add up to. */
export function useTelemetry() {
  const now = useLabData<LabPayload<NowDoc>>('/api/lab/status', 30_000);
  const history = useLabData<LabPayload<HistoryDoc>>('/api/lab/status/history', 300_000);
  const summary = useLabData<LabSummary>('/api/lab/summary', 300_000);

  // The badge follows now.json. No payload yet: loading, unless the first fetch failed.
  const view: LabState | 'loading' =
    now.payload === null ? (now.error ? 'offline' : 'loading') : now.payload.state;

  return {
    view,
    now: now.payload && now.payload.state !== 'offline' ? (now.payload as NowLive) : null,
    receivedAt: now.receivedAt,
    // history only feeds the charts; while it loads they stay empty, offline they say so
    history: history.payload && history.payload.state !== 'offline' ? (history.payload as HistoryLive) : null,
    historyOffline: history.payload?.state === 'offline' || (history.payload === null && history.error),
    threats: summary.payload?.threats ?? null,
  };
}

/** The honeypot teaser shows only while the threats summary is live or delayed. */
export function threatsTeaser(threats: LabSummary['threats'] | null) {
  return threats && threats.state !== 'offline' && threats.events !== undefined ? threats : null;
}
