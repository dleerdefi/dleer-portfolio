import { describe, expect, it } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { costAtDraw, fmtPerDay, fmtPerHour } from '@/lib/lab/format';
import { buildSummary } from '@/lib/lab/loaders';
import { NowDoc } from '@/lib/lab/schemas/telemetry';
import { AtDraw } from '@/components/lab/telemetry/LabExtras';
import { LiveCost } from '@/components/lab/telemetry/LivePanel';
import { PowerSlide } from '@/components/lab/home/LabSlides';
import type { LabSummary } from '@/lib/lab/types';
import { golden } from './helpers';

// homelab PR #32: lab.energy_rate_usd_per_kwh, and the cost of the current draw from it.

const RATE = 0.205634;
const text = (el: React.ReactElement) => renderToStaticMarkup(el).replace(/<[^>]+>/g, '');

describe('costAtDraw', () => {
  it('prices the draw per hour, day and month (30 days)', () => {
    const c = costAtDraw(750, RATE)!;
    expect(c.perHour).toBeCloseTo(0.1542255, 7);
    expect(c.perDay).toBeCloseTo(3.701412, 6);
    expect(c.perMonth).toBeCloseTo(c.perDay * 30, 9);
  });

  it('is null when either input is', () => {
    expect(costAtDraw(null, RATE)).toBeNull();
    expect(costAtDraw(750, null)).toBeNull();
    expect(costAtDraw(null, null)).toBeNull();
    expect(costAtDraw(Number.NaN, RATE)).toBeNull();
  });

  it('rounds to three decimals an hour and two a day, so a 10 W step shows per day', () => {
    expect(fmtPerHour(costAtDraw(750, RATE)!.perHour)).toBe('$0.154/h');
    expect(fmtPerDay(costAtDraw(750, RATE)!.perDay)).toBe('$3.70/day');
    expect(fmtPerDay(costAtDraw(760, RATE)!.perDay)).toBe('$3.75/day');
    expect(fmtPerHour(costAtDraw(1000, 0.2)!.perHour)).toBe('$0.200/h');
    expect(fmtPerDay(costAtDraw(0, RATE)!.perDay)).toBe('$0.00/day');
  });
});

describe('now.json energy_rate_usd_per_kwh', () => {
  it('parses the re-synced fixture with the rate', () => {
    expect(NowDoc.parse(golden('now.v1.json')).lab.energy_rate_usd_per_kwh).toBe(RATE);
  });

  it('parses a now.json from before homelab PR #32 (no key) as null', () => {
    const doc = golden('now.v1.json') as { lab: Record<string, unknown> };
    delete doc.lab.energy_rate_usd_per_kwh;
    expect(NowDoc.parse(doc).lab.energy_rate_usd_per_kwh).toBeNull();
  });

  it('keeps the contract bounds', () => {
    const doc = golden('now.v1.json') as { lab: Record<string, unknown> };
    doc.lab.energy_rate_usd_per_kwh = 6;
    expect(NowDoc.safeParse(doc).success).toBe(false);
  });

  it('reaches the home summary', () => {
    const now = { state: 'live' as const, age_s: 12, ...NowDoc.parse(golden('now.v1.json')) };
    const s = buildSummary(now, { state: 'offline' }, null);
    expect(s.telemetry.energy_rate_usd_per_kwh).toBe(RATE);
  });
});

describe('the at-draw figure', () => {
  it('shows ≈ $/day at this draw, with the rate in its hover text', () => {
    const html = renderToStaticMarkup(React.createElement(AtDraw, { watts: 750, rate: RATE }));
    expect(html).toContain('≈ $3.70/day at this draw');
    expect(html).toContain('$0.2056/kWh');
  });

  it('is hidden while the rate or the power is unknown', () => {
    expect(renderToStaticMarkup(React.createElement(AtDraw, { watts: 750, rate: null }))).toBe('');
    expect(renderToStaticMarkup(React.createElement(AtDraw, { watts: null, rate: RATE }))).toBe('');
    expect(renderToStaticMarkup(React.createElement(LiveCost, { watts: 750, rate: null }))).toBe('');
  });

  it('follows the live line per hour and per day', () => {
    expect(text(React.createElement(LiveCost, { watts: 750, rate: RATE }))).toBe(' · $0.154/h · $3.70/day');
  });

  it('on the home slide: at this draw with a rate, the last 24 h without one', () => {
    const tel: LabSummary['telemetry'] = { state: 'live', power_w: 750, energy_kwh_24h: 18.2, energy_cost_usd_24h: 3.74, hosts_up: 3, hosts_expected: 3 };
    const withRate = text(React.createElement(PowerSlide, { tel: { ...tel, energy_rate_usd_per_kwh: RATE } }));
    expect(withRate).toContain('≈ $3.70/day at this draw');
    expect(withRate).not.toContain('last 24 h');
    const without = text(React.createElement(PowerSlide, { tel: { ...tel, energy_rate_usd_per_kwh: null } }));
    expect(without).not.toContain('at this draw');
    expect(without).toContain('≈ $3.74 last 24 h');
  });
});
