import { describe, expect, it } from 'vitest';
import { freshness, worse } from '@/lib/lab/freshness';

const NOW = Date.parse('2026-10-08T12:00:00Z');
const at = (ageS: number) => new Date(NOW - ageS * 1000).toISOString().replace(/\.\d{3}Z$/, 'Z');
const state = (ageS: number, staleAfterS: number, delayedCeilingS: number) =>
  freshness({ generatedAt: at(ageS), staleAfterS, delayedCeilingS, now: NOW }).state;

// Exact boundaries per document (stale_after_s from the golden examples, ceilings from §5).
describe.each([
  ['now', 120, 900],
  ['history', 900, 3600],
  ['digest', 1200, 3600],
  ['live', 300, 900],
])('%s', (_doc, stale, ceiling) => {
  it(`is live at ${stale} s and delayed at ${stale + 1} s`, () => {
    expect(state(stale, stale, ceiling)).toBe('live');
    expect(state(stale + 1, stale, ceiling)).toBe('delayed');
  });

  it(`is delayed at ${ceiling} s and offline at ${ceiling + 1} s`, () => {
    expect(state(ceiling, stale, ceiling)).toBe('delayed');
    expect(state(ceiling + 1, stale, ceiling)).toBe('offline');
  });
});

describe('clock skew', () => {
  it('clamps a document slightly in the future to age 0, live', () => {
    expect(freshness({ generatedAt: at(-30), staleAfterS: 120, delayedCeilingS: 900, now: NOW })).toEqual({
      state: 'live',
      ageS: 0,
    });
  });

  it('treats a document more than 300 s in the future as offline', () => {
    expect(state(-300, 120, 900)).toBe('live');
    expect(state(-301, 120, 900)).toBe('offline');
  });

  it('rounds the age', () => {
    const r = freshness({ generatedAt: at(42), staleAfterS: 120, delayedCeilingS: 900, now: NOW + 400 });
    expect(r.ageS).toBe(42);
  });
});

describe('worse', () => {
  it('orders live < delayed < offline', () => {
    expect(worse('live', 'delayed')).toBe('delayed');
    expect(worse('offline', 'live')).toBe('offline');
    expect(worse('live', 'live')).toBe('live');
  });
});
