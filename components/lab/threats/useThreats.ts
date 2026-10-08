'use client';

import { useLabData } from '@/hooks/useLabData';
import { worse } from '@/lib/lab/freshness';
import type { DigestDoc, LiveDoc } from '@/lib/lab/schemas/threats';
import type { LabPayload, LabState } from '@/lib/lab/types';

export type DigestLive = Extract<LabPayload<DigestDoc>, { state: 'live' | 'delayed' }>;
export type LiveLive = Extract<LabPayload<LiveDoc>, { state: 'live' | 'delayed' }>;

/**
 * The two threat polls (LAB_UI_SPEC.md §6) and what they add up to (THREATS_VIEW.md §3, §10):
 * the badge shows the worse state; the digest decides offline; the replay runs only while
 * both documents are live.
 */
export function useThreats() {
  const digest = useLabData<LabPayload<DigestDoc>>('/api/lab/threats', 300_000);
  const live = useLabData<LabPayload<LiveDoc>>('/api/lab/threats/live', 60_000);

  const stateOf = (d: { payload: { state: LabState } | null; error: boolean }): LabState | null =>
    d.payload ? d.payload.state : d.error ? 'offline' : null;
  const digestState = stateOf(digest);
  const liveState = stateOf(live);

  const view: LabState | 'loading' =
    digestState === null ? 'loading' : liveState === null ? digestState : worse(digestState, liveState);
  // The badge's age belongs to the document that sets its state (the digest on a tie).
  const ageFrom =
    liveState && digestState && view === liveState && view !== digestState ? live.payload : digest.payload;

  const d = digest.payload && digest.payload.state !== 'offline' ? (digest.payload as DigestLive) : null;
  const l = live.payload && live.payload.state !== 'offline' ? (live.payload as LiveLive) : null;

  return {
    view,
    digest: d,
    live: l,
    liveState,
    /** Arcs and feed replay only while both documents are live. */
    replaying: digestState === 'live' && liveState === 'live',
    ageS: ageFrom && ageFrom.state !== 'offline' ? ageFrom.age_s : undefined,
    receivedAt: ageFrom === live.payload ? live.receivedAt : digest.receivedAt,
    serverOffsetMs: live.serverOffsetMs ?? digest.serverOffsetMs,
    demo: !!(d?.demo || l?.demo),
  };
}

export type Threats = ReturnType<typeof useThreats>;
