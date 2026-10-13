// The live chart's motion (LAB_UI_SPEC.md §6): a time-based x axis whose right edge is the
// newest point when it arrives, then moves left at one step per step_s until the next point
// slides in at the right edge. Pure, for the tests.

/** The time of a series document's last point, in ms. */
export function lastPointMs(doc: { start: string; step_s: number; points: number }): number {
  return Date.parse(doc.start) + (doc.points - 1) * doc.step_s * 1000;
}

/**
 * How far the line has moved since its newest point arrived, in steps: 0 at arrival, 1 a step
 * later, and no further (with no new point the line holds; the badge says when it is late).
 * Reduced motion: always 0, the chart redraws on each poll instead.
 */
export function glideSteps(nowMs: number, arrivedMs: number | null, stepMs: number, reduced: boolean): number {
  if (reduced || arrivedMs === null || stepMs <= 0) return 0;
  return Math.min(1, Math.max(0, (nowMs - arrivedMs) / stepMs));
}

/** "10 minutes" for a 600 s window, "90 seconds" under two minutes. */
export function windowText(seconds: number): string {
  if (seconds < 120) return `${Math.round(seconds)} seconds`;
  const min = Math.round(seconds / 60);
  return `${min} minute${min === 1 ? '' : 's'}`;
}
