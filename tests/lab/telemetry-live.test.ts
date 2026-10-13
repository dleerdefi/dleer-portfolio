import { afterEach, describe, expect, it, vi } from 'vitest';
import React from 'react';
import { join } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { HistoryDoc, TelemetryLiveDoc } from '@/lib/lab/schemas/telemetry';
import { demoTelemetryLive } from '@/lib/lab/demo/rebase';
import { glideSteps, lastPointMs, windowText } from '@/lib/lab/live';
import { observeOnScreen } from '@/hooks/useOnScreen';
import { LivePlot } from '@/components/lab/shared/LiveChart';
import { compactBytes, golden, invalid, readText, FIXTURES } from './helpers';

// v1/live.json (homelab PR #31): the last 10 minutes at 10 s steps, and the chart that glides.

const getObject = vi.hoisted(() => vi.fn());
vi.mock('@/lib/lab/r2', async (orig) => ({ ...(await orig<typeof import('@/lib/lab/r2')>()), getObject }));

afterEach(() => {
  vi.useRealTimers();
  getObject.mockReset();
});

describe('TelemetryLiveDoc', () => {
  it('accepts the golden example and fits the 32 KiB cap', () => {
    expect(TelemetryLiveDoc.safeParse(golden('live.v1.json')).success).toBe(true);
    expect(compactBytes(golden('live.v1.json'))).toBeLessThanOrEqual(32 * 1024);
  });

  it('rejects a history document (5-minute steps) as a live one', () => {
    expect(TelemetryLiveDoc.safeParse(invalid('labsnap', 'live-history-steps.json')).success).toBe(false);
    expect(HistoryDoc.safeParse(invalid('labsnap', 'live-history-steps.json')).success).toBe(true);
    expect(HistoryDoc.safeParse(golden('live.v1.json')).success).toBe(false);
  });

  it('keeps the series-length rule', () => {
    const doc = golden('live.v1.json') as { gpus: { util_ratio: unknown[] }[] };
    doc.gpus[1].util_ratio.push(0.5);
    expect(TelemetryLiveDoc.safeParse(doc).success).toBe(false);
  });

  it('takes the contract bounds: 721 points, steps of 5 to 60 s', () => {
    const doc = golden('live.v1.json') as Record<string, unknown>;
    expect(TelemetryLiveDoc.safeParse({ ...doc, step_s: 61 }).success).toBe(false);
    expect(TelemetryLiveDoc.safeParse({ ...doc, interval_s: 4 }).success).toBe(false);
    expect(TelemetryLiveDoc.safeParse({ ...doc, points: 722 }).success).toBe(false);
  });
});

describe('demo live.json', () => {
  it('is 61 valid points ending at the last whole step, and moves one step every 10 s', async () => {
    const t = Date.parse('2026-10-13T12:00:07Z');
    const doc = TelemetryLiveDoc.parse(await demoTelemetryLive(t));
    expect(doc.points).toBe(61);
    expect(lastPointMs(doc)).toBe(Date.parse('2026-10-13T11:59:50Z'));
    expect(Date.parse(doc.generated_at)).toBeLessThanOrEqual(t);
    const next = TelemetryLiveDoc.parse(await demoTelemetryLive(t + 10_000));
    expect(next.lab.power_w.slice(0, 60)).toEqual(doc.lab.power_w.slice(1));
  });
});

describe('loadTelemetryLive', () => {
  const text = readText(join(FIXTURES, 'live.v1.json'));
  const generated = Date.parse(JSON.parse(text).generated_at);

  it('reads v1/live.json under a 32 KiB cap and keeps it 5 s in memory', async () => {
    vi.stubEnv('LAB_DEMO_DATA', 'false');
    vi.useFakeTimers({ now: generated + 3_000 });
    getObject.mockResolvedValue({ ok: true, body: text });
    const { loadTelemetryLive } = await import('@/lib/lab/loaders');
    const first = await loadTelemetryLive();
    expect(first.state).toBe('live');
    expect(getObject).toHaveBeenCalledWith('v1/live.json', 32 * 1024);
    vi.advanceTimersByTime(4_000);
    await loadTelemetryLive();
    expect(getObject).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(1_000);
    await loadTelemetryLive();
    expect(getObject).toHaveBeenCalledTimes(2);
    vi.unstubAllEnvs();
  });

  it('is delayed past stale_after_s (40 s)', async () => {
    vi.stubEnv('LAB_DEMO_DATA', 'false');
    vi.useFakeTimers({ now: generated + 60_000 });
    getObject.mockResolvedValue({ ok: true, body: text });
    vi.resetModules();
    const { loadTelemetryLive } = await import('@/lib/lab/loaders');
    expect((await loadTelemetryLive()).state).toBe('delayed');
    vi.unstubAllEnvs();
  });
});

describe('polling only on screen', () => {
  it('reports what the IntersectionObserver sees, and stops observing on cleanup', () => {
    const seen: boolean[] = [];
    let fire: IntersectionObserverCallback = () => {};
    const disconnect = vi.fn();
    class FakeIO {
      constructor(cb: IntersectionObserverCallback) {
        fire = cb;
      }
      observe() {}
      disconnect = disconnect;
    }
    const stop = observeOnScreen({} as Element, (v) => seen.push(v), FakeIO);
    const entry = (isIntersecting: boolean) => [{ isIntersecting }] as unknown as IntersectionObserverEntry[];
    fire(entry(false), {} as IntersectionObserver);
    fire(entry(true), {} as IntersectionObserver);
    fire(entry(false), {} as IntersectionObserver);
    expect(seen).toEqual([false, true, false]);
    stop();
    expect(disconnect).toHaveBeenCalled();
  });

  it('without IntersectionObserver counts as on screen', () => {
    const seen: boolean[] = [];
    observeOnScreen({} as Element, (v) => seen.push(v), undefined);
    expect(seen).toEqual([true]);
  });
});

describe('the live chart', () => {
  const plot = (values: (number | null)[], extra: Partial<React.ComponentProps<typeof LivePlot>> = {}) =>
    renderToStaticMarkup(
      React.createElement(LivePlot, { values, width: 600, height: 100, ariaLabel: 'test', clipId: 'c', ...extra }),
    );
  const lines = (html: string) => (html.match(/stroke="var\(--accent-color\)"/g) ?? []).length;

  it('breaks the line at null (a gap, never a zero)', () => {
    expect(lines(plot([1, 2, 3, 4]))).toBe(1);
    expect(lines(plot([1, 2, null, 4, 5]))).toBe(2);
    expect(lines(plot([null, null]))).toBe(0);
  });

  it('draws axes with time labels only when asked', () => {
    const labels: [string, string, string] = ['-10 min', '-5 min', 'now'];
    expect(plot([1000, 1100], { axes: true, xLabels: labels })).toContain('-10 min');
    expect(plot([1000, 1100])).not.toContain('-10 min');
  });

  it('glides one step per step_s and then holds; reduced motion never moves', () => {
    expect(glideSteps(5_000, 0, 10_000, false)).toBe(0.5);
    expect(glideSteps(25_000, 0, 10_000, false)).toBe(1);
    expect(glideSteps(-1_000, 0, 10_000, false)).toBe(0);
    expect(glideSteps(5_000, 0, 10_000, true)).toBe(0);
    expect(glideSteps(5_000, null, 10_000, false)).toBe(0);
  });

  it('names the window', () => {
    expect(windowText(600)).toBe('10 minutes');
    expect(windowText(60)).toBe('60 seconds');
  });
});
