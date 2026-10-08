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
