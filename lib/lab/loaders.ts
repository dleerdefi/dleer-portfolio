import 'server-only';
import { createLoader } from './load';
import { demoDigest, demoHistoryDoc, demoLive, demoNow } from './demo/rebase';
import { HistoryDoc, NowDoc } from './schemas/telemetry';
import { DigestDoc, LiveDoc } from './schemas/threats';
import type { LabPayload, LabSummary } from './types';

// The four documents (LAB_UI_SPEC.md §5: key, size cap, memory cache, delayed ceiling) and the
// home page summary built from them.

const KiB = 1024;

export const loadNow = createLoader({
  key: 'v1/now.json',
  maxBytes: 16 * KiB,
  cacheMs: 10_000,
  delayedCeilingS: 900,
  schema: NowDoc,
  demo: demoNow,
});

export const loadHistory = createLoader({
  key: 'v1/history.json',
  maxBytes: 512 * KiB,
  cacheMs: 60_000,
  delayedCeilingS: 3600,
  schema: HistoryDoc,
  demo: demoHistoryDoc,
});

export const loadDigest = createLoader({
  key: 'v1/threats.json',
  maxBytes: 64 * KiB,
  cacheMs: 60_000,
  delayedCeilingS: 3600,
  schema: DigestDoc,
  demo: demoDigest,
});

export const loadLive = createLoader({
  key: 'v1/threats-live.json',
  maxBytes: 48 * KiB,
  cacheMs: 20_000,
  delayedCeilingS: 900,
  schema: LiveDoc,
  demo: demoLive,
});

export async function loadSummary(): Promise<LabSummary> {
  const [now, history, digest] = await Promise.all([loadNow(), loadHistory(), loadDigest()]);
  return buildSummary(now, history, digest);
}

/** Pure: the summary from the three payloads. */
export function buildSummary(
  now: LabPayload<NowDoc>,
  history: LabPayload<HistoryDoc>,
  digest: LabPayload<DigestDoc>,
): LabSummary {
  const telemetry: LabSummary['telemetry'] =
    now.state === 'offline'
      ? { state: 'offline' }
      : {
          state: now.state,
          age_s: now.age_s,
          power_w: now.lab.power_w,
          energy_kwh_24h: now.lab.energy_kwh_24h,
          hosts_up: now.lab.hosts_up,
          hosts_expected: now.lab.hosts_expected,
          ...(history.state === 'offline' ? {} : { power_24h: downsample(history.lab.power_w) }),
        };
  const threats: LabSummary['threats'] =
    digest.state === 'offline'
      ? { state: 'offline' }
      : {
          state: digest.state,
          age_s: digest.age_s,
          events: digest.totals.events,
          sources: digest.totals.sources,
          countries: digest.totals.countries,
          by_category: digest.totals.by_category,
        };
  const demo = [now, history, digest].some((p) => p.state !== 'offline' && p.demo);
  return { ...(demo ? { demo: true as const } : {}), telemetry, threats };
}

/** The last 288 points averaged in threes (96 points); a window containing a null stays null. */
export function downsample(series: (number | null)[], keep = 288, by = 3): (number | null)[] {
  const n = Math.floor(Math.min(keep, series.length) / by) * by;
  const tail = series.slice(series.length - n);
  const out: (number | null)[] = [];
  for (let i = 0; i < n; i += by) {
    const win = tail.slice(i, i + by);
    out.push(win.some((v) => v === null) ? null : Number((win.reduce<number>((a, v) => a + (v ?? 0), 0) / by).toFixed(1)));
  }
  return out;
}
