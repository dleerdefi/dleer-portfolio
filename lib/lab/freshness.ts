// Freshness of a document, decided on the server from its own generated_at and stale_after_s
// (both homelab contracts): live, then delayed up to the loader's ceiling, then offline.

import type { LabState } from './types';

/** A document stamped further ahead than this is treated as broken, not as clock skew. */
export const MAX_FUTURE_S = 300;

export function freshness({
  generatedAt,
  staleAfterS,
  delayedCeilingS,
  now,
}: {
  generatedAt: string;
  staleAfterS: number;
  delayedCeilingS: number;
  now: number;
}): { state: LabState; ageS: number } {
  const generated = Date.parse(generatedAt);
  if (Number.isNaN(generated)) return { state: 'offline', ageS: 0 };
  const age = (now - generated) / 1000;
  if (age < -MAX_FUTURE_S) return { state: 'offline', ageS: 0 };
  const ageS = Math.max(0, Math.round(age));
  if (age <= staleAfterS) return { state: 'live', ageS };
  if (age <= delayedCeilingS) return { state: 'delayed', ageS };
  return { state: 'offline', ageS };
}

/** The worse of two states, for views that combine documents. */
export function worse(a: LabState, b: LabState): LabState {
  const rank: Record<LabState, number> = { live: 0, delayed: 1, offline: 2 };
  return rank[a] >= rank[b] ? a : b;
}
