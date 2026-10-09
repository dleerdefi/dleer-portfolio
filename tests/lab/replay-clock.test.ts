import { describe, expect, it } from 'vitest';
import {
  DELAY_MS,
  ReplayClock,
  SETTLE_S,
  type ClockDeps,
  type LiveDocIn,
  type ReplayEvent,
} from '@/components/lab/threats/ReplayClock';
import { golden } from './helpers';

const iso = (ms: number) => new Date(ms).toISOString().replace(/\.\d{3}Z$/, 'Z');

/** A manual clock: timers run in order as time advances. */
function fakeClock(start: number) {
  let now = start;
  let seq = 0;
  const timers = new Map<number, { at: number; fn: () => void }>();
  const deps: ClockDeps = {
    now: () => now,
    setTimer: (fn, ms) => {
      const id = ++seq;
      timers.set(id, { at: now + ms, fn });
      return id;
    },
    clearTimer: (h) => timers.delete(h as number),
  };
  const advance = (ms: number) => {
    const end = now + ms;
    for (;;) {
      const next = [...timers.entries()].sort((a, b) => a[1].at - b[1].at)[0];
      if (!next || next[1].at > end) break;
      timers.delete(next[0]);
      now = Math.max(now, next[1].at);
      next[1].fn();
    }
    now = end;
  };
  return { deps, advance, now: () => now };
}

/** A live document generated at `generated`, window of 900 s, events at offsets `ts`. */
function doc(generated: number, ts: number[], cat = 'recon'): LiveDocIn {
  const windowStart = generated - 900_000;
  return {
    generated_at: iso(generated),
    window_start: iso(windowStart),
    events: ts.map((t) => ({ t, lat: 1, lon: 2, cc: 'NL', cat, target: 'sensor', svc: 'ssh', n: 1 })),
  };
}

function setup(start: number, isVisible?: (c: string) => boolean) {
  const clock = fakeClock(start);
  const fired: { e: ReplayEvent; at: number }[] = [];
  const prefill: ReplayEvent[] = [];
  const replay = new ReplayClock({
    deps: clock.deps,
    onFire: (e) => fired.push({ e, at: clock.now() }),
    onPrefill: (events) => prefill.push(...events),
    isVisible,
  });
  return { clock, replay, fired, prefill };
}

const T0 = Date.parse('2026-10-07T19:05:00Z');
const everyBucket = Array.from({ length: 90 }, (_, i) => i * 10);
/** The offset of the newest settled bucket in a 900 s document. */
const lastSettled = 900 - SETTLE_S - 10;

describe('ReplayClock', () => {
  it('schedules only settled buckets: start + 10 s ≤ generated_at − SETTLE_S', () => {
    const { replay, clock, fired } = setup(T0);
    replay.ingest(doc(T0, everyBucket), 'live');
    clock.advance(DELAY_MS + 120_000);
    const latest = Math.max(...fired.map((f) => f.e.bucketStart));
    expect(latest).toBe(T0 - 900_000 + lastSettled * 1000);
  });

  it('still plays a bucket whose events arrive 4.5 min late (the sensor ingest lag)', () => {
    const { replay, clock, fired } = setup(T0);
    const B = T0 + 30_000; // the late bucket's start
    const at = (generated: number): LiveDocIn => {
      const d = doc(generated, everyBucket);
      // the sensor's event shows up only in documents generated 270 s or more after it happened
      if (generated >= B + 270_000) d.events.push({ ...d.events[0], t: (B - (generated - 900_000)) / 1000, cat: 'exploit' });
      return d;
    };
    replay.ingest(at(T0), 'live');
    for (let i = 1; i <= 8; i++) {
      clock.advance(60_000);
      replay.ingest(at(T0 + i * 60_000), 'live');
    }
    clock.advance(B + DELAY_MS + 30_000 - clock.now());
    expect(fired.some((f) => f.e.bucketStart === B && f.e.cat === 'exploit')).toBe(true);
  });

  it('never schedules an event twice across overlapping documents', () => {
    const { replay, clock, fired } = setup(T0);
    replay.ingest(doc(T0, everyBucket), 'live');
    for (let i = 1; i <= 5; i++) {
      clock.advance(60_000);
      // the next document overlaps by 840 s, and adds a late event to an already-played bucket
      replay.ingest(doc(T0 + i * 60_000, [...everyBucket, 700]), 'live');
    }
    clock.advance(DELAY_MS + 120_000);
    const ids = fired.map((f) => `${f.e.bucketStart}`);
    const perBucket = new Map<string, number>();
    ids.forEach((id) => perBucket.set(id, (perBucket.get(id) ?? 0) + 1));
    expect([...perBucket.values()].every((n) => n === 1)).toBe(true);
  });

  it('never fires before its time, nor more than 5 s late', () => {
    const { replay, clock, fired } = setup(T0);
    replay.ingest(doc(T0, everyBucket), 'live');
    clock.advance(60_000);
    replay.ingest(doc(T0 + 60_000, everyBucket), 'live');
    clock.advance(DELAY_MS + 120_000);
    const normal = fired.filter((f) => f.e.fireAt >= T0); // not the warm start
    expect(normal.length).toBeGreaterThan(0);
    for (const f of normal) {
      expect(f.at).toBeGreaterThanOrEqual(f.e.fireAt);
      expect(f.at - f.e.fireAt).toBeLessThanOrEqual(5_000);
    }
  });

  it('drops events more than 5 s overdue when they arrive', () => {
    const { replay, clock, fired } = setup(T0);
    replay.ingest(doc(T0, everyBucket), 'live');
    // a document generated at T0 + 120 s that arrives late: its newest settled bucket
    // (T0 − SETTLE_S − 10 s + 120 s) was due 60 s ago, so none of its new buckets may fire
    clock.advance(DELAY_MS - SETTLE_S * 1000 + 180_000);
    const before = fired.length;
    replay.ingest(doc(T0 + 120_000, everyBucket), 'live');
    clock.advance(30_000);
    expect(fired.length).toBe(before);
  });

  it('warm-starts: the 30 s before playback over about 3 s, and 8 events into the feed', () => {
    const { replay, clock, fired, prefill } = setup(T0);
    replay.ingest(doc(T0 - 20_000, everyBucket), 'live');
    expect(prefill).toHaveLength(8);
    expect(prefill.every((e) => e.bucketStart < T0 - DELAY_MS - 30_000)).toBe(true);
    clock.advance(3_000);
    const warm = fired.map((f) => f.e.bucketStart);
    expect(warm.length).toBe(3); // buckets in [playback − 30 s, playback)
    expect(warm.every((s) => s >= T0 - DELAY_MS - 30_000 && s < T0 - DELAY_MS)).toBe(true);
  });

  it('stops on delayed or offline and resumes from the high-water mark', () => {
    const { replay, clock, fired } = setup(T0);
    replay.ingest(doc(T0, everyBucket), 'live');
    const hwm = replay.highWaterMark!;
    clock.advance(10_000);
    const firedBefore = fired.length;
    replay.ingest(doc(T0 + 10_000, everyBucket), 'delayed');
    expect(replay.pending).toBe(0);
    clock.advance(120_000);
    expect(fired.length).toBe(firedBefore);
    replay.ingest(doc(T0 + 130_000, everyBucket), 'live');
    clock.advance(DELAY_MS + 120_000);
    const resumed = fired.slice(firedBefore);
    expect(resumed.length).toBeGreaterThan(0);
    expect(resumed.every((f) => f.e.bucketStart > hwm)).toBe(true);
    replay.ingest(doc(T0 + 600_000, everyBucket), 'offline');
    expect(replay.pending).toBe(0);
  });

  it('applies filters at fire time', () => {
    let showRecon = false;
    const { replay, clock, fired } = setup(T0, (c) => c !== 'recon' || showRecon);
    replay.ingest(doc(T0, everyBucket), 'live');
    // the last scheduled bucket plays about DELAY − SETTLE_S after T0; stop a minute before it
    clock.advance(DELAY_MS - SETTLE_S * 1000 - 60_000);
    expect(fired).toHaveLength(0);
    showRecon = true; // toggled back on after scheduling
    clock.advance(60_000);
    expect(fired.length).toBeGreaterThan(0);
  });

  it('spreads a bucket evenly across its 10 s', () => {
    const { replay, clock, fired } = setup(T0);
    replay.ingest(doc(T0, everyBucket), 'live');
    clock.advance(60_000);
    // a bucket that the second document newly settles, past the first one's high-water mark
    const t = lastSettled - 10;
    replay.ingest(doc(T0 + 60_000, [t, t, t, t, t]), 'live');
    clock.advance(DELAY_MS + 60_000);
    const bucket = fired.filter((f) => f.e.bucketStart === T0 + 60_000 - 900_000 + t * 1000);
    expect(bucket).toHaveLength(5);
    const offsets = bucket.map((f) => f.e.fireAt - f.e.bucketStart - DELAY_MS);
    expect(Math.min(...offsets)).toBeGreaterThanOrEqual(0);
    expect(Math.max(...offsets)).toBeLessThan(10_000);
    expect(Math.max(...offsets) - Math.min(...offsets)).toBeGreaterThan(5_000);
  });

  it('replays the golden live document', () => {
    const live = golden('threats-live.v1.json') as LiveDocIn;
    const start = Date.parse(live.generated_at);
    const { replay, clock, fired, prefill } = setup(start);
    replay.ingest(live, 'live');
    clock.advance(DELAY_MS);
    expect(prefill.length).toBe(8);
    expect(fired.length).toBeGreaterThan(50);
  });
});
