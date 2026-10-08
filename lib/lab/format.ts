// Number and time formatting for the lab. `null` means unknown: it renders as a dash with no
// unit, never as 0. A fixed locale keeps server and client output identical.

export const DASH = '—';
const LOCALE = 'en-US';

type N = number | null | undefined;
const known = (n: N): n is number => typeof n === 'number' && Number.isFinite(n);

/** 1,029 */
export function fmtInt(n: N): string {
  return known(n) ? Math.round(n).toLocaleString(LOCALE) : DASH;
}

/** 15,447 below 10,000; 15.4k and 1.2M from 10,000 up. */
export function fmtCount(n: N): string {
  if (!known(n)) return DASH;
  if (Math.abs(n) < 10_000) return fmtInt(n);
  if (Math.abs(n) < 1_000_000) return `${trim1(n / 1000)}k`;
  return `${trim1(n / 1_000_000)}M`;
}

const trim1 = (v: number) => (Math.round(v * 10) / 10).toFixed(1).replace(/\.0$/, '');

/** One decimal, thousands separators: 24.1 */
export function fmtDecimal(n: N, decimals = 1): string {
  return known(n)
    ? n.toLocaleString(LOCALE, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : DASH;
}

/** 12% from a 0–1 ratio */
export function fmtPct(ratio: N): string {
  return known(ratio) ? `${Math.round(ratio * 100)}%` : DASH;
}

/** A value with its unit, or a bare dash: withUnit(231.4, 'W') → "231 W". */
export function withUnit(n: N, unit: string, decimals = 0): string {
  if (!known(n)) return DASH;
  return `${decimals ? fmtDecimal(n, decimals) : fmtInt(n)} ${unit}`;
}

export const fmtWatts = (n: N) => withUnit(n, 'W');
export const fmtCelsius = (n: N) => withUnit(n, '°C');
export const fmtKwh = (n: N) => withUnit(n, 'kWh', 1);

/** Decimal terabytes, one decimal: 41.2 */
export function fmtTB(bytes: N): string {
  return known(bytes) ? (bytes / 1e12).toFixed(1) : DASH;
}

/** A short age: "42 s ago", "7 min ago", "3 h ago". */
export function fmtAge(seconds: number): string {
  const s = Math.max(0, Math.round(seconds));
  if (s < 60) return `${s} s ago`;
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  return `${Math.floor(s / 3600)} h ago`;
}

/** A chart tooltip age: "5 h 0 min ago", "35 min ago". */
export function fmtAgoLong(seconds: number): string {
  const m = Math.max(0, Math.round(seconds / 60));
  if (m < 60) return `${m} min ago`;
  return `${Math.floor(m / 60)} h ${m % 60} min ago`;
}

/** 19:04:30 in the visitor's time zone. Client-side only. */
export function fmtClock(ms: number): string {
  return new Date(ms).toLocaleTimeString(LOCALE, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  });
}
