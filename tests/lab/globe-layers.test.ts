import { describe, expect, it } from 'vitest';
import {
  arcFor,
  beaconsFor,
  binLabel,
  binsFor,
  capArcs,
  clipRing,
  escapeHtml,
  landBatches,
  landPolygons,
  unwrapRing,
  liveArcs,
  MAX_ARCS,
  type Arc,
  type GeoBinIn,
} from '@/components/lab/threats/globe-layers';
import type { Category } from '@/lib/lab/types';
import { feature } from 'topojson-client';
import { join } from 'node:path';
import { golden, readText, ROOT } from './helpers';

const digest = golden('threats.v1.json') as { geo: GeoBinIn[]; targets: Parameters<typeof beaconsFor>[0] };

const arc = (id: string, n: number, born = 0): Arc => ({
  id,
  startLat: 0,
  startLng: 0,
  endLat: 1,
  endLng: 1,
  cat: 'recon',
  n,
  stroke: 1,
  born,
});

describe('arcs', () => {
  it('caps arcs at 150, dropping the lowest n first', () => {
    const arcs = Array.from({ length: 160 }, (_, i) => arc(`a${i}`, i < 10 ? 1 : 5 + (i % 7), i));
    const kept = capArcs(arcs);
    expect(kept).toHaveLength(MAX_ARCS);
    expect(kept.some((a) => a.n === 1)).toBe(false);
  });

  it('drops the oldest among equal n', () => {
    const arcs = Array.from({ length: 151 }, (_, i) => arc(`a${i}`, 3, i));
    expect(capArcs(arcs).find((a) => a.id === 'a0')).toBeUndefined();
  });

  it('leaves 150 or fewer alone', () => {
    const arcs = Array.from({ length: 150 }, (_, i) => arc(`a${i}`, 1, i));
    expect(capArcs(arcs)).toBe(arcs);
  });

  it('runs from the place to its target with a stroke that grows with n', () => {
    const a = arcFor({ id: 'x', lat: 31.2, lon: 121.5, cat: 'brute_force', target: 'web', n: 9 }, digest.targets, 5)!;
    expect(a).toMatchObject({ startLat: 31.2, startLng: 121.5, endLat: 39, endLng: -77.5, born: 5 });
    expect(a.stroke).toBeCloseTo(0.45);
    expect(arcFor({ id: 'y', lat: 0, lon: 0, cat: 'recon', target: 'nowhere', n: 1 }, digest.targets, 0)).toBeNull();
  });

  it('expires arcs after about 2.4 s and drops filtered ones', () => {
    const arcs = [arc('old', 1, 0), arc('new', 1, 2000)];
    expect(liveArcs(arcs, 2500, new Set()).map((a) => a.id)).toEqual(['new']);
    expect(liveArcs(arcs, 2500, new Set<Category>(['recon']))).toEqual([]);
  });
});

describe('bins', () => {
  it('keeps every golden bin with nothing filtered', () => {
    const bins = binsFor(digest.geo, new Set());
    expect(bins).toHaveLength(digest.geo.length);
    expect(bins[0].events).toBe(digest.geo[0].events);
  });

  it('shrinks bins by subtracting filtered categories', () => {
    const all = binsFor(digest.geo, new Set());
    const noRecon = binsFor(digest.geo, new Set<Category>(['recon']));
    const first = digest.geo[0];
    const shrunk = noRecon.find((b) => b.lat === first.lat && b.lng === first.lon)!;
    expect(shrunk.events).toBe(first.events - first.by_category.recon);
    expect(shrunk.radius).toBeLessThan(all[0].radius);
    expect(shrunk.top).not.toBe('recon');
  });

  it('hides bins with nothing visible', () => {
    const geo: GeoBinIn[] = [
      { lat: 1, lon: 2, cc: 'NL', events: 3, sources: 1, by_category: { recon: 3, brute_force: 0, web_exploit: 0, intrusion: 0, malware: 0, ai_agent: 0 } },
    ];
    expect(binsFor(geo, new Set<Category>(['recon']))).toEqual([]);
  });
});

describe('labels', () => {
  it('escapes everything that goes into the HTML label', () => {
    expect(escapeHtml(`<img src=x onerror="a">&'`)).toBe('&lt;img src=x onerror=&quot;a&quot;&gt;&amp;&#39;');
    const [bin] = binsFor(digest.geo.slice(0, 1), new Set());
    const label = binLabel(bin, () => '<script>alert(1)</script>');
    expect(label).not.toContain('<script>');
    expect(label).toContain('&lt;script&gt;');
    expect(label).toContain('2,153 events');
  });

  it('names an unknown country', () => {
    const [bin] = binsFor([{ ...digest.geo[0], cc: null }], new Set());
    expect(binLabel(bin, (cc) => (cc === null ? 'unknown country' : cc))).toContain('unknown country');
  });
});

describe('beacons', () => {
  it('rings only targets that are up, the sensor faster', () => {
    const [sensor, web] = beaconsFor(digest.targets);
    expect(sensor.speed).toBeGreaterThan(web.speed);
    expect(beaconsFor(digest.targets.map((t) => ({ ...t, up: t.id !== 'web' })))).toHaveLength(1);
  });
});

describe('land polygons', () => {
  it('unwraps a ring across the antimeridian', () => {
    const ring: [number, number][] = [[170, 0], [179, 1], [-179, 2], [-170, 3], [170, 0]];
    expect(unwrapRing(ring).map((p) => p[0])).toEqual([170, 179, 181, 190, 170]);
  });

  it('clips a ring to a slab and closes it', () => {
    const square: [number, number][] = [[0, 0], [10, 0], [10, 10], [0, 10], [0, 0]];
    const half = clipRing(square, 0, 5);
    expect(half[0]).toEqual(half[half.length - 1]);
    expect(Math.max(...half.map((p) => p[0]))).toBe(5);
    expect(clipRing(square, 20, 30)).toEqual([]);
  });

  it('leaves every land-110m polygon within ±180°, under 180° wide and with no jumps', () => {
    const topology = JSON.parse(readText(join(ROOT, 'node_modules', 'world-atlas', 'land-110m.json'))) as never;
    const land = feature(topology, (topology as { objects: { land: never } }).objects.land) as unknown as {
      features: { geometry: { coordinates: [number, number][][][] } }[];
    };
    const multi = land.features[0].geometry.coordinates;
    const polys = landPolygons(multi);
    expect(polys.length).toBeGreaterThan(multi.length);
    for (const p of polys) {
      for (const ring of p) {
        const lons = ring.map((q) => q[0]);
        expect(Math.max(...lons) - Math.min(...lons)).toBeLessThan(180);
        expect(Math.max(...lons.map(Math.abs))).toBeLessThanOrEqual(180);
        ring.forEach((q, i) => i > 0 && expect(Math.abs(q[0] - ring[i - 1][0])).toBeLessThanOrEqual(180));
      }
    }
  });
});

describe('land batches', () => {
  it('splits the land into batches of about 2,000 dots, in order, covering everything', () => {
    const topology = JSON.parse(readText(join(ROOT, 'node_modules', 'world-atlas', 'land-110m.json'))) as never;
    const land = feature(topology, (topology as { objects: { land: never } }).objects.land) as unknown as {
      features: { geometry: { coordinates: [number, number][][][] } }[];
    };
    const polys = landPolygons(land.features[0].geometry.coordinates);
    const ends = landBatches(polys);
    expect(ends[ends.length - 1]).toBe(polys.length);
    expect([...ends].sort((a, b) => a - b)).toEqual(ends);
    expect(ends.length).toBeGreaterThan(3);
  });
});
