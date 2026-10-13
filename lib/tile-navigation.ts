/**
 * hjkl between the desktop tiles, by geometry: from the current tile, the nearest tile in that
 * direction, preferring ones that line up with it. Works for any grid, so the lab tile can come
 * and go with its flag.
 */
export type Direction = 'left' | 'right' | 'up' | 'down';

export interface TileBox {
  id: string;
  left: number;
  top: number;
  right: number;
  bottom: number;
}

/** Gap between [a1, a2] and [b1, b2]; 0 when they overlap. */
const gap = (a1: number, a2: number, b1: number, b2: number) => Math.max(0, Math.max(a1, b1) - Math.min(a2, b2));
const overlap = (a1: number, a2: number, b1: number, b2: number) => Math.max(0, Math.min(a2, b2) - Math.max(a1, b1));

export function neighbor(from: TileBox, tiles: TileBox[], direction: Direction): string | null {
  const horizontal = direction === 'left' || direction === 'right';
  let best: { id: string; score: number; tie: number } | null = null;
  for (const t of tiles) {
    if (t.id === from.id) continue;
    // Must lie beyond the current tile's edge in that direction (a little slack for borders)
    const distance =
      direction === 'right' ? t.left - from.right :
      direction === 'left' ? from.left - t.right :
      direction === 'down' ? t.top - from.bottom :
      from.top - t.bottom;
    if (distance < -2) continue;
    // Prefer tiles that line up across the other axis; then the larger shared edge
    const offAxis = horizontal ? gap(from.top, from.bottom, t.top, t.bottom) : gap(from.left, from.right, t.left, t.right);
    const shared = horizontal ? overlap(from.top, from.bottom, t.top, t.bottom) : overlap(from.left, from.right, t.left, t.right);
    const score = Math.max(0, distance) + 2 * offAxis;
    if (!best || score < best.score - 0.5 || (Math.abs(score - best.score) <= 0.5 && shared > best.tie)) {
      best = { id: t.id, score, tie: shared };
    }
  }
  return best?.id ?? null;
}
