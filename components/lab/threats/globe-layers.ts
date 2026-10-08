// Pure functions from the documents and the filters to globe.gl layer data (THREATS_VIEW.md §5).
// Unit-tested; no globe.gl or DOM here.

import { CATEGORIES, type Category } from '@/lib/lab/types';

export const MAX_ARCS = 150;
export const ARC_ANIMATE_MS = 1500;
export const ARC_LIFE_MS = 2400;

// When categories tie, the contract's precedence decides (threatsnap contract.top_category).
const PRECEDENCE: Category[] = ['ai_agent', 'malware', 'intrusion', 'web_exploit', 'brute_force', 'recon'];

export interface GeoBinIn {
  lat: number;
  lon: number;
  cc: string | null;
  events: number;
  sources: number;
  by_category: Record<Category, number>;
}

export interface Bin {
  lat: number;
  lng: number;
  cc: string | null;
  /** Events in the visible categories. */
  events: number;
  sources: number;
  top: Category;
  radius: number;
  altitude: number;
}

/** 24 h bins minus filtered categories; a bin with nothing visible is hidden. */
export function binsFor(geo: GeoBinIn[], hidden: ReadonlySet<Category>): Bin[] {
  const out: Bin[] = [];
  for (const g of geo) {
    const visible = CATEGORIES.filter((c) => !hidden.has(c));
    const events = visible.reduce((a, c) => a + g.by_category[c], 0);
    if (events <= 0) continue;
    const top = PRECEDENCE.filter((c) => !hidden.has(c)).reduce((best, c) =>
      g.by_category[c] > g.by_category[best] ? c : best,
    );
    const l = Math.log10(events + 1);
    out.push({
      lat: g.lat,
      lng: g.lon,
      cc: g.cc,
      events,
      sources: g.sources,
      top,
      radius: 0.25 + 0.3 * l,
      altitude: 0.004 + 0.012 * l,
    });
  }
  return out;
}

const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (ch) => ESCAPES[ch]);

/**
 * A bin's hover label. globe.gl renders labels as HTML, so it is built only from numbers, enum
 * values and the Intl.DisplayNames country name, all escaped.
 */
export function binLabel(bin: Bin, countryName: (cc: string | null) => string): string {
  const n = (v: number) => escapeHtml(Math.round(v).toLocaleString('en-US'));
  return (
    `<div class="lab-globe-tip"><b>${escapeHtml(countryName(bin.cc))}</b><br>` +
    `${n(bin.events)} events · ${n(bin.sources)} sources<br>` +
    `top: ${escapeHtml(bin.top)}</div>`
  );
}

export interface TargetIn {
  id: string;
  label: string;
  lat: number;
  lon: number;
  up: boolean;
}

export interface ArcEventIn {
  id: string;
  lat: number;
  lon: number;
  cat: string;
  target: string;
  n: number;
}

export interface Arc {
  id: string;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  cat: Category;
  n: number;
  stroke: number;
  born: number;
}

/** An arc from the event's place to its target, or null when the target is unknown. */
export function arcFor(e: ArcEventIn, targets: TargetIn[], born: number): Arc | null {
  const t = targets.find((x) => x.id === e.target);
  if (!t) return null;
  return {
    id: e.id,
    startLat: e.lat,
    startLng: e.lon,
    endLat: t.lat,
    endLng: t.lon,
    cat: e.cat as Category,
    n: e.n,
    stroke: 0.25 + 0.2 * Math.log10(e.n + 1),
    born,
  };
}

/** At most `max` arcs on screen: over that, drop the lowest `n` first (the oldest among equals). */
export function capArcs(arcs: Arc[], max = MAX_ARCS): Arc[] {
  if (arcs.length <= max) return arcs;
  const drop = new Set(
    [...arcs]
      .sort((a, b) => a.n - b.n || a.born - b.born)
      .slice(0, arcs.length - max)
      .map((a) => a.id),
  );
  return arcs.filter((a) => !drop.has(a.id));
}

/** Arcs still alive at `now` (removed about 2.4 s after they start). */
export function liveArcs(arcs: Arc[], now: number, hidden: ReadonlySet<Category>): Arc[] {
  return arcs.filter((a) => now - a.born < ARC_LIFE_MS && !hidden.has(a.cat));
}

export interface Ring {
  lat: number;
  lng: number;
  maxRadius: number;
  speed: number;
  period: number;
  /** Bursts are one-off rings when an arc lands. */
  burstAt?: number;
}

/** Steady beacons on targets that are up; the sensor pulses faster than the web target. */
export function beaconsFor(targets: TargetIn[]): Ring[] {
  return targets
    .filter((t) => t.up)
    .map((t) => ({
      lat: t.lat,
      lng: t.lon,
      maxRadius: 3,
      speed: t.id === 'sensor' ? 2.5 : 1.6,
      period: t.id === 'sensor' ? 1100 : 1700,
    }));
}

// ---- land shape for the hex dots --------------------------------------------------------

type Pt = [number, number];
type PolygonCoords = Pt[][];

/** Longitudes made continuous: a ring that crosses the antimeridian jumps no more than 180°. */
export function unwrapRing(ring: Pt[]): Pt[] {
  const out: Pt[] = [];
  let shift = 0;
  ring.forEach(([lon, lat], i) => {
    if (i > 0) {
      const prev = ring[i - 1][0];
      if (lon - prev > 180) shift -= 360;
      else if (prev - lon > 180) shift += 360;
    }
    out.push([lon + shift, lat]);
  });
  return out;
}

/** Sutherland–Hodgman against the slab min ≤ lon ≤ max; an empty result means "outside". */
export function clipRing(ring: Pt[], min: number, max: number): Pt[] {
  const edge = (pts: Pt[], inside: (p: Pt) => boolean, x: number): Pt[] => {
    const out: Pt[] = [];
    pts.forEach((cur, i) => {
      const prev = pts[(i + pts.length - 1) % pts.length];
      const cross = (): Pt => [x, prev[1] + ((cur[1] - prev[1]) * (x - prev[0])) / (cur[0] - prev[0])];
      if (inside(cur)) {
        if (!inside(prev)) out.push(cross());
        out.push(cur);
      } else if (inside(prev)) out.push(cross());
    });
    return out;
  };
  const open = ring.length > 1 && ring[0][0] === ring[ring.length - 1][0] && ring[0][1] === ring[ring.length - 1][1] ? ring.slice(0, -1) : ring;
  const clipped = edge(edge(open, (p) => p[0] >= min, min), (p) => p[0] <= max, max);
  return clipped.length >= 3 ? [...clipped, clipped[0]] : [];
}

const lonSpan = (ring: Pt[]) => {
  const lons = ring.map((p) => p[0]);
  return [Math.min(...lons), Math.max(...lons)];
};

/**
 * Land polygons that h3 (inside globe.gl's hex layer) can fill: every vertex within ±180° and
 * no ring wider than 180°. Rings are unwrapped across the antimeridian, cut there, and any
 * polygon wider than 45° is cut into slabs (also keeps each piece's dot work small). land-110m's Afro-Eurasia ring crosses the
 * antimeridian at Chukotka, which h3 otherwise rejects.
 */
const SLAB = 45;

export function landPolygons(multi: PolygonCoords[]): PolygonCoords[] {
  const out: PolygonCoords[] = [];
  for (const poly of multi) {
    let rings = poly.map(unwrapRing);
    const [lo0] = lonSpan(rings[0]);
    const shift = -360 * Math.floor((lo0 + 180) / 360);
    if (shift) rings = rings.map((r) => r.map(([x, y]) => [x + shift, y] as Pt));
    const [lo, hi] = lonSpan(rings[0]);
    if (hi - lo <= SLAB && hi <= 180) {
      out.push(rings);
      continue;
    }
    const cuts = [lo];
    for (let x = lo + SLAB; x < hi; x += SLAB) cuts.push(x);
    if (lo < 180 && hi > 180 && !cuts.includes(180)) cuts.push(180);
    cuts.sort((a, b) => a - b).push(hi);
    for (let s = 0; s < cuts.length - 1; s++) {
      const [a, b] = [cuts[s], cuts[s + 1]];
      if (b - a < 1e-9) continue;
      const outer = clipRing(rings[0], a, b);
      if (outer.length === 0) continue;
      const holes = rings.slice(1).map((h) => clipRing(h, a, b)).filter((h) => h.length > 0);
      const back = a >= 180 ? -360 : 0;
      out.push([outer, ...holes].map((r) => r.map(([x, y]) => [x + back, y] as Pt)));
    }
  }
  return out;
}

/**
 * About how many res-3 h3 cells (≈ 1 deg² each) a polygon fills: the planar area of its outer
 * ring with longitudes scaled by cos(latitude).
 */
export function approxCells(poly: PolygonCoords): number {
  const ring = poly[0];
  let a = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    const [x1, y1] = ring[i];
    const [x2, y2] = ring[i + 1];
    const k = Math.cos((((y1 + y2) / 2) * Math.PI) / 180);
    a += (x1 * k * y2 - x2 * k * y1) / 2;
  }
  return Math.abs(a);
}

/**
 * Index boundaries for feeding the land to the globe a batch at a time, each batch about
 * `maxCells` dots, so building the dots never blocks the main thread for long (§8: no long
 * task over 200 ms). A polygon bigger than the budget gets a batch of its own.
 */
export function landBatches(polys: PolygonCoords[], maxCells = 2000): number[] {
  const ends: number[] = [];
  let acc = 0;
  polys.forEach((p, i) => {
    const c = approxCells(p);
    if (acc > 0 && acc + c > maxCells) {
      ends.push(i);
      acc = 0;
    }
    acc += c;
  });
  if (polys.length) ends.push(polys.length);
  return ends;
}
