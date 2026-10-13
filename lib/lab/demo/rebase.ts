import 'server-only';
import { demoHistory } from './history';

// Demo mode (LAB_DEMO_DATA=true): the vendored golden examples with their timestamps moved to
// "now", so every view is live without R2. The fixtures are imported here, inside the demo
// branch, so production never loads them.

export function isoSeconds(ms: number): string {
  return new Date(ms).toISOString().replace(/\.\d{3}Z$/, 'Z');
}

const floorTo = (ms: number, stepMs: number) => Math.floor(ms / stepMs) * stepMs;

export async function demoNow(now: number): Promise<unknown> {
  const doc = structuredClone((await import('../fixtures/now.v1.json')).default);
  doc.generated_at = isoSeconds(now - 12_000);
  return doc;
}

export async function demoHistoryDoc(now: number): Promise<unknown> {
  const nowFixture = (await import('../fixtures/now.v1.json')).default;
  return demoHistory(now, nowFixture);
}

/**
 * live.json: the fixture's series stretched to the real 61 points (10 minutes at 10 s steps) and
 * moved with the clock, so the demo chart glides. Slot k of the window takes the fixture's entry
 * at k mirrored back and forth over its length, so the line never jumps where it wraps.
 */
export async function demoTelemetryLive(now: number): Promise<unknown> {
  const doc = structuredClone((await import('../fixtures/live.v1.json')).default) as LiveShape;
  const stepMs = doc.step_s * 1000;
  const points = 61;
  const last = floorTo(now, stepMs) - stepMs;
  const first = last - (points - 1) * stepMs;
  const period = 2 * (doc.points - 1);
  const pick = <T,>(series: T[]) =>
    Array.from({ length: points }, (_, i) => {
      const k = (first / stepMs + i) % period;
      return series[k < doc.points ? k : period - k];
    });
  doc.lab.power_w = pick(doc.lab.power_w);
  for (const h of doc.hosts) {
    h.power_w = pick(h.power_w);
    h.cpu_ratio = pick(h.cpu_ratio);
  }
  for (const g of doc.gpus) {
    g.util_ratio = pick(g.util_ratio);
    g.power_w = pick(g.power_w);
    g.enc_ratio = pick(g.enc_ratio);
  }
  if (doc.nas) {
    doc.nas.read_bytes_s = pick(doc.nas.read_bytes_s);
    doc.nas.write_bytes_s = pick(doc.nas.write_bytes_s);
  }
  if (doc.ci) doc.ci.runners_busy = pick(doc.ci.runners_busy);
  if (doc.media) doc.media.streams = pick(doc.media.streams);
  doc.points = points;
  doc.start = isoSeconds(first);
  doc.generated_at = isoSeconds(last + 5_000);
  return doc;
}

type Series = (number | null)[];
interface LiveShape {
  generated_at: string;
  start: string;
  step_s: number;
  points: number;
  lab: { power_w: Series };
  hosts: { power_w: Series; cpu_ratio: Series }[];
  gpus: { util_ratio: Series; power_w: Series; enc_ratio: Series }[];
  nas: { read_bytes_s: Series; write_bytes_s: Series } | null;
  ci: { runners_busy: Series } | null;
  media: { streams: Series } | null;
}

export async function demoDigest(now: number): Promise<unknown> {
  const doc = structuredClone((await import('../fixtures/threats.v1.json')).default);
  const generated = floorTo(now, 1000) - 42_000;
  const delta = generated - Date.parse(doc.generated_at);
  doc.generated_at = isoSeconds(generated);
  doc.hourly.start = isoSeconds(floorTo(now, 3_600_000) - 23 * 3_600_000);
  for (const m of doc.malware) m.first_seen = isoSeconds(Date.parse(m.first_seen) + delta);
  return doc;
}

export async function demoLive(now: number): Promise<unknown> {
  const doc = structuredClone((await import('../fixtures/threats-live.v1.json')).default);
  const generated = floorTo(now, 10_000) - 20_000;
  doc.generated_at = isoSeconds(generated);
  doc.window_start = isoSeconds(generated - 900_000);
  return doc;
}
