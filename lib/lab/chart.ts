// Pure helpers for the lab's small SVG charts. A `null` value breaks the line: it is never
// drawn as zero.

export interface Domain {
  min: number;
  max: number;
}

/** Min and max over every known value in every series, or null when there are none. */
export function domainOf(...series: (number | null)[][]): Domain | null {
  let min = Infinity;
  let max = -Infinity;
  for (const s of series) {
    for (const v of s) {
      if (v === null) continue;
      if (v < min) min = v;
      if (v > max) max = v;
    }
  }
  return min === Infinity ? null : { min, max };
}

/**
 * Line and area paths in a `width` × `height` box, one pair per unbroken run of values.
 * A run of one point draws a zero-length segment (a dot with round caps).
 */
export function linePaths(
  values: (number | null)[],
  { width, height, domain, pad = 0 }: { width: number; height: number; domain: Domain; pad?: number },
): { line: string; area: string }[] {
  const n = values.length;
  const span = domain.max - domain.min || 1;
  const x = (i: number) => (n <= 1 ? width / 2 : (i / (n - 1)) * width);
  const y = (v: number) => pad + (1 - (v - domain.min) / span) * (height - 2 * pad);
  const runs: { line: string; area: string }[] = [];
  let run: [number, number][] = [];
  const flush = () => {
    if (run.length === 0) return;
    const pts = run.length === 1 ? [run[0], run[0]] : run;
    const line = pts.map(([px, py], i) => `${i ? 'L' : 'M'}${round(px)} ${round(py)}`).join('');
    const area = `${line}L${round(pts[pts.length - 1][0])} ${height}L${round(pts[0][0])} ${height}Z`;
    runs.push({ line, area });
    run = [];
  };
  values.forEach((v, i) => {
    if (v === null || !Number.isFinite(v)) flush();
    else run.push([x(i), y(v)]);
  });
  flush();
  return runs;
}

const round = (v: number) => Math.round(v * 100) / 100;

/** About `count` round ticks (1, 2 or 5 × 10^k steps) covering the domain. */
export function niceTicks(domain: Domain, count = 3): number[] {
  const span = domain.max - domain.min;
  if (span <= 0) return [domain.min];
  const raw = span / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => span / s <= count) ?? 10 * mag;
  const ticks: number[] = [];
  for (let t = Math.floor(domain.min / step) * step; t <= domain.max + step * 1e-9; t += step) {
    ticks.push(Number(t.toFixed(10)));
  }
  if (ticks[ticks.length - 1] < domain.max) ticks.push(ticks[ticks.length - 1] + step);
  return ticks;
}
