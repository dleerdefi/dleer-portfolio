import { describe, expect, it } from 'vitest';
import {
  DASH,
  fmtAge,
  fmtAgoLong,
  fmtCelsius,
  fmtCount,
  fmtDecimal,
  fmtInt,
  fmtKwh,
  fmtPct,
  fmtTB,
  fmtWatts,
} from '@/lib/lab/format';

describe('format', () => {
  it('renders null as a dash with no unit', () => {
    for (const f of [fmtInt, fmtCount, fmtDecimal, fmtPct, fmtWatts, fmtCelsius, fmtKwh, fmtTB]) {
      expect(f(null)).toBe(DASH);
      expect(f(undefined)).toBe(DASH);
    }
    expect(fmtWatts(null)).not.toContain('W');
  });

  it('never renders null as 0', () => {
    expect(fmtWatts(0)).toBe('0 W');
    expect(fmtWatts(null)).not.toBe('0 W');
  });

  it('formats numbers with units', () => {
    expect(fmtInt(1028.5)).toBe('1,029');
    expect(fmtWatts(231.4)).toBe('231 W');
    expect(fmtKwh(24.14)).toBe('24.1 kWh');
    expect(fmtCelsius(22)).toBe('22 °C');
    expect(fmtPct(0.1234)).toBe('12%');
    expect(fmtPct(0)).toBe('0%');
    expect(fmtTB(41.2e12)).toBe('41.2');
  });

  it('compacts counts from 10,000', () => {
    expect(fmtCount(9234)).toBe('9,234');
    expect(fmtCount(15447)).toBe('15.4k');
    expect(fmtCount(20000)).toBe('20k');
    expect(fmtCount(1_234_567)).toBe('1.2M');
  });

  it('formats ages', () => {
    expect(fmtAge(42)).toBe('42 s ago');
    expect(fmtAge(420)).toBe('7 min ago');
    expect(fmtAge(7300)).toBe('2 h ago');
    expect(fmtAgoLong(5 * 3600)).toBe('5 h 0 min ago');
    expect(fmtAgoLong(35 * 60)).toBe('35 min ago');
  });
});
