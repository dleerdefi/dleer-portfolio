// The latest known lab states, shared by every lab view. Lab fetches write here; the nav
// tile's glyphs and the polybar only read it and never fetch on their own. Unknown → no glyph.

import { useSyncExternalStore } from 'react';
import { worse } from './freshness';
import type { LabState } from './types';

export interface LabStatus {
  telemetry?: LabState;
  /** The threats view's badge: the worse of the digest and the live document, when known. */
  threats?: LabState;
}

let digest: LabState | undefined;
let live: LabState | undefined;
let snapshot: LabStatus = {};
const listeners = new Set<() => void>();

function publish(next: LabStatus) {
  if (next.telemetry === snapshot.telemetry && next.threats === snapshot.threats) return;
  snapshot = next;
  listeners.forEach((l) => l());
}

export function reportLabState(doc: 'telemetry' | 'digest' | 'live', state: LabState) {
  if (doc === 'telemetry') return publish({ ...snapshot, telemetry: state });
  if (doc === 'digest') digest = state;
  else live = state;
  const threats = digest === undefined ? undefined : live === undefined ? digest : worse(digest, live);
  publish({ ...snapshot, threats });
}

/** Which document a lab route reports, for useLabData. */
export function reportFromPayload(url: string, payload: unknown) {
  const state = (payload as { state?: LabState } | null)?.state;
  if (url === '/api/lab/summary') {
    const s = payload as { telemetry?: { state: LabState }; threats?: { state: LabState } };
    if (s.telemetry) reportLabState('telemetry', s.telemetry.state);
    if (s.threats) reportLabState('digest', s.threats.state);
    return;
  }
  if (!state) return;
  if (url === '/api/lab/status') reportLabState('telemetry', state);
  else if (url === '/api/lab/threats') reportLabState('digest', state);
  else if (url === '/api/lab/threats/live') reportLabState('live', state);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export const getLabStatus = () => snapshot;
const serverSnapshot: LabStatus = {};

export function useLabStatus(): LabStatus {
  return useSyncExternalStore(subscribe, getLabStatus, () => serverSnapshot);
}

/** Tests only. */
export function resetLabStatus() {
  digest = undefined;
  live = undefined;
  snapshot = {};
}
