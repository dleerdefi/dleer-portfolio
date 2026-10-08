import { beforeEach, describe, expect, it } from 'vitest';
import { domainOf, linePaths, niceTicks } from '@/lib/lab/chart';
import { getLabStatus, reportFromPayload, reportLabState, resetLabStatus } from '@/lib/lab/status-store';
import { categoryVar, gpuName } from '@/lib/lab/names';

describe('chart helpers', () => {
  it('breaks the line at null, never drawing it as zero', () => {
    const runs = linePaths([1, 2, null, 3, 4], { width: 40, height: 10, domain: { min: 0, max: 4 } });
    expect(runs).toHaveLength(2);
    expect(runs[0].line).toBe('M0 7.5L10 5');
    expect(runs[1].line).toBe('M30 2.5L40 0');
  });

  it('draws a lone point as a dot', () => {
    const runs = linePaths([null, 2, null], { width: 20, height: 10, domain: { min: 0, max: 4 } });
    expect(runs).toEqual([{ line: 'M10 5L10 5', area: 'M10 5L10 5L10 10L10 10Z' }]);
  });

  it('shares a domain across series and skips nulls', () => {
    expect(domainOf([1, null, 5], [null, -2])).toEqual({ min: -2, max: 5 });
    expect(domainOf([null])).toBeNull();
  });

  it('picks round ticks', () => {
    expect(niceTicks({ min: 940, max: 1165 })).toEqual([900, 1000, 1100, 1200]);
    expect(niceTicks({ min: 0, max: 1 })).toEqual([0, 0.5, 1]);
  });
});

describe('status store', () => {
  beforeEach(() => resetLabStatus());

  it('exposes the worse of the digest and live states for threats', () => {
    reportLabState('digest', 'live');
    expect(getLabStatus().threats).toBe('live');
    reportLabState('live', 'delayed');
    expect(getLabStatus().threats).toBe('delayed');
  });

  it('reads the summary for both views', () => {
    reportFromPayload('/api/lab/summary', { telemetry: { state: 'live' }, threats: { state: 'offline' } });
    expect(getLabStatus()).toEqual({ telemetry: 'live', threats: 'offline' });
  });
});

describe('names', () => {
  it('names known GPUs and falls back for new ones', () => {
    expect(gpuName('gpu', 1)).toBe('RTX A4000 #1');
    expect(gpuName('apps', 2)).toBe('GPU apps:2');
  });

  it('maps categories to their CSS variables', () => {
    expect(categoryVar('brute_force')).toBe('var(--lab-brute-force)');
  });
});
