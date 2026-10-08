// Replays threats-live.json on a delay so the globe and feed keep moving between polls
// (THREATS_VIEW.md §6). Pure: the clock and timers are injected, so it is unit-tested.

import type { LabState } from '@/lib/lab/types';

export const DELAY_MS = 300_000;
const BUCKET_MS = 10_000;
const SETTLE_MS = 60_000;
const MAX_LATE_MS = 5_000;
const WARM_SPAN_MS = 30_000;
const WARM_PLAY_MS = 3_000;
const WARM_PREFILL = 8;
const JITTER_MS = 300;

export interface LiveEventIn {
  t: number;
  lat: number;
  lon: number;
  cc: string | null;
  cat: string;
  target: string;
  svc: string;
  n: number;
}

export interface LiveDocIn {
  generated_at: string;
  window_start: string;
  events: LiveEventIn[];
}

export interface ReplayEvent extends LiveEventIn {
  id: string;
  /** Server time of the bucket's start: what the feed prints. */
  bucketStart: number;
  /** Server time the event fires. */
  fireAt: number;
}

export interface ClockDeps {
  /** Local clock; the server offset is added to it. */
  now: () => number;
  setTimer: (fn: () => void, ms: number) => unknown;
  clearTimer: (handle: unknown) => void;
}

const defaultDeps: ClockDeps = {
  now: () => Date.now(),
  setTimer: (fn, ms) => setTimeout(fn, ms),
  clearTimer: (h) => clearTimeout(h as ReturnType<typeof setTimeout>),
};

export interface ReplayOptions {
  /** An event's time has come and its category is visible. */
  onFire: (e: ReplayEvent) => void;
  /** Warm start: the settled events just before the replay window, for the feed only. */
  onPrefill?: (events: ReplayEvent[]) => void;
  /** Filters apply at fire time, so a category toggled back on takes effect at once. */
  isVisible?: (category: string) => boolean;
  deps?: ClockDeps;
}

/** A small deterministic jitter from the bucket and position (no Math.random). */
function jitter(bucketStart: number, i: number): number {
  let h = (bucketStart / 1000) ^ (i * 0x9e3779b1);
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  h ^= h >>> 16;
  return ((h >>> 0) / 4294967296 - 0.5) * 2 * JITTER_MS;
}

export class ReplayClock {
  private queue: ReplayEvent[] = [];
  private timer: unknown = null;
  private hwm: number | null = null;
  private offsetMs = 0;
  private stopped = false;
  private readonly deps: ClockDeps;

  constructor(private readonly opts: ReplayOptions) {
    this.deps = opts.deps ?? defaultDeps;
  }

  /** Server time minus local time, from the live response's Date and Age headers. */
  setOffset(ms: number | null) {
    if (ms !== null && Number.isFinite(ms)) this.offsetMs = ms;
  }

  private now() {
    return this.deps.now() + this.offsetMs;
  }

  /** The latest bucket start already scheduled (tests and debugging). */
  get highWaterMark() {
    return this.hwm;
  }

  get pending() {
    return this.queue.length;
  }

  /** Feed a new live document. Only settled buckets after the high-water mark are scheduled. */
  ingest(doc: LiveDocIn, state: LabState) {
    if (state !== 'live') {
      this.pause();
      return;
    }
    this.stopped = false;
    const generated = Date.parse(doc.generated_at);
    const windowStart = Date.parse(doc.window_start);
    if (!Number.isFinite(generated) || !Number.isFinite(windowStart)) return;
    const now = this.now();

    // Group settled events by bucket, keeping the producer's order within a bucket.
    const buckets = new Map<number, LiveEventIn[]>();
    for (const e of doc.events) {
      const start = windowStart + e.t * 1000;
      if (start + BUCKET_MS > generated - SETTLE_MS) continue; // not settled yet
      const list = buckets.get(start);
      if (list) list.push(e);
      else buckets.set(start, [e]);
    }
    const starts = [...buckets.keys()].sort((a, b) => a - b);

    const spread = (start: number) =>
      buckets.get(start)!.map((e, i, all) => {
        const offset = ((i + 0.5) / all.length) * BUCKET_MS + jitter(start, i);
        return { ...e, id: `${start}:${i}`, bucketStart: start, fireAt: start + DELAY_MS + Math.min(BUCKET_MS - 1, Math.max(0, offset)) };
      });

    const fresh: ReplayEvent[] = [];
    if (this.hwm === null) {
      // Warm start: the 30 s just before the playback time, played over about 3 s, and the
      // settled events before that into the feed (no arcs), so nothing starts empty.
      const playback = now - DELAY_MS;
      const warmFrom = playback - WARM_SPAN_MS;
      const before: ReplayEvent[] = [];
      for (const start of starts) {
        if (start >= playback) continue;
        const events = spread(start);
        if (start < warmFrom) before.push(...events);
        else
          for (const e of events)
            fresh.push({ ...e, fireAt: now + ((e.fireAt - DELAY_MS - warmFrom) / WARM_SPAN_MS) * WARM_PLAY_MS });
      }
      if (before.length) this.opts.onPrefill?.(before.slice(-WARM_PREFILL));
    }
    for (const start of starts) {
      if (this.hwm !== null && start <= this.hwm) continue;
      if (this.hwm === null && start < now - DELAY_MS) continue; // covered by the warm start
      for (const e of spread(start)) if (now - e.fireAt <= MAX_LATE_MS) fresh.push(e);
    }
    if (starts.length) this.hwm = Math.max(this.hwm ?? -Infinity, starts[starts.length - 1]);

    if (fresh.length) {
      this.queue.push(...fresh);
      this.queue.sort((a, b) => a.fireAt - b.fireAt);
      this.arm();
    }
  }

  /** Delayed or offline: stop scheduling and drop what is pending. Resume with the next live ingest. */
  pause() {
    this.stopped = true;
    this.queue = [];
    this.disarm();
  }

  dispose() {
    this.pause();
  }

  private disarm() {
    if (this.timer !== null) this.deps.clearTimer(this.timer);
    this.timer = null;
  }

  private arm() {
    this.disarm();
    if (this.stopped || this.queue.length === 0) return;
    const wait = Math.max(0, this.queue[0].fireAt - this.now());
    this.timer = this.deps.setTimer(() => this.fire(), wait);
  }

  private fire() {
    this.timer = null;
    const now = this.now();
    while (this.queue.length && this.queue[0].fireAt <= now) {
      const e = this.queue.shift()!;
      if (this.opts.isVisible?.(e.cat) ?? true) this.opts.onFire(e);
    }
    this.arm();
  }
}
