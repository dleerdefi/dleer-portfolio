import { describe, expect, it } from 'vitest';
import { buildSummary, downsample } from '@/lib/lab/loaders';
import { HistoryDoc, NowDoc } from '@/lib/lab/schemas/telemetry';
import { DigestDoc } from '@/lib/lab/schemas/threats';
import { demoHistory } from '@/lib/lab/demo/history';
import { golden } from './helpers';

const now = { state: 'live' as const, age_s: 12, ...NowDoc.parse(golden('now.v1.json')) };
const history = {
  state: 'live' as const,
  age_s: 60,
  ...HistoryDoc.parse(demoHistory(Date.now(), golden('now.v1.json') as Parameters<typeof demoHistory>[1])),
};
const digest = { state: 'delayed' as const, age_s: 1500, demo: true as const, ...DigestDoc.parse(golden('threats.v1.json')) };

describe('downsample', () => {
  it('averages the last 288 points in threes', () => {
    const series = Array.from({ length: 289 }, (_, i) => i);
    const out = downsample(series);
    expect(out).toHaveLength(96);
    expect(out[0]).toBe(2); // mean of 1, 2, 3
    expect(out[95]).toBe(287);
  });

  it('keeps a window with a null as null', () => {
    const series: (number | null)[] = Array.from({ length: 289 }, () => 10);
    series[4] = null; // in the second window (points 4–6 of the last 288)
    const out = downsample(series);
    expect(out[0]).toBe(10);
    expect(out[1]).toBeNull();
    expect(out[2]).toBe(10);
  });

  it('handles short series', () => {
    expect(downsample([1, 2, 3, 4, 5, 6, 7])).toEqual([3, 6]);
  });
});

describe('buildSummary', () => {
  it('summarises the three documents', () => {
    const s = buildSummary(now, history, digest);
    expect(s.demo).toBe(true);
    expect(s.telemetry).toMatchObject({ state: 'live', power_w: 1028.5, energy_kwh_24h: 24.14, hosts_up: 3, hosts_expected: 3 });
    expect(s.telemetry.power_24h).toHaveLength(96);
    expect(s.telemetry.power_24h!.filter((v) => v === null)).toHaveLength(1);
    expect(s.threats).toEqual({
      state: 'delayed',
      age_s: 1500,
      events: 15447,
      sources: 1143,
      countries: 31,
      by_category: { recon: 9234, brute_force: 5088, web_exploit: 887, intrusion: 168, malware: 66, ai_agent: 4 },
    });
  });

  it('carries only the state of an offline block, and no history when it is offline', () => {
    const s = buildSummary({ state: 'offline' }, { state: 'offline' }, { state: 'offline' });
    expect(s).toEqual({ telemetry: { state: 'offline' }, threats: { state: 'offline' } });
    const t = buildSummary(now, { state: 'offline' }, { state: 'offline' });
    expect(t.telemetry.power_24h).toBeUndefined();
    expect(t.telemetry.power_w).toBe(1028.5);
  });
});
