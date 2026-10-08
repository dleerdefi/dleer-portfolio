// globe.gl configuration for the threat map (THREATS_VIEW.md §5). Everything heavy (globe.gl,
// three, topojson-client and the land shape) arrives in one dynamic import, so the chunk loads
// only when a threats view shows the globe and is edge-cached with the code: no CDN, no CORS.

import type { GlobeInstance } from 'globe.gl';
import type { Feature } from 'geojson';
import type { LabColors } from '@/hooks/useLabColors';
import type { Category } from '@/lib/lab/types';
import type { Arc, Bin, Ring, TargetIn } from './globe-layers';
import { ARC_ANIMATE_MS, landBatches, landPolygons } from './globe-layers';

export interface GlobeModules {
  Globe: new (el: HTMLElement, config?: object) => GlobeInstance;
  land: Feature[];
  /** Where each land batch ends (landBatches). */
  batches: number[];
}

export async function loadGlobe(): Promise<GlobeModules> {
  const [globe, topo, atlas] = await Promise.all([
    import('globe.gl'),
    import('topojson-client'),
    import('world-atlas/land-110m.json'),
  ]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const topology = (atlas.default ?? atlas) as any;
  const land = topo.feature(topology, topology.objects.land) as unknown as { features: Feature[] };
  const multi = land.features.flatMap((f) =>
    f.geometry.type === 'MultiPolygon' ? f.geometry.coordinates : f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : [],
  ) as [number, number][][][];
  const pieces = landPolygons(multi);
  const polygons: Feature[] = pieces.map((coordinates) => ({
    type: 'Feature',
    properties: {},
    geometry: { type: 'Polygon', coordinates },
  }));
  return { Globe: globe.default as GlobeModules['Globe'], land: polygons, batches: landBatches(pieces) };
}

export function webglAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    // release the probe's context at once, so it never counts against the browser's limit
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
    return !!gl;
  } catch {
    return false;
  }
}

/** Static setup: renderer, camera, land, and the layer accessors that don't depend on colors. */
export function createGlobe(
  { Globe }: GlobeModules,
  el: HTMLElement,
  { phone, size }: { phone: boolean; size: number },
): GlobeInstance {
  const globe = new Globe(el, {
    animateIn: false,
    waitForGlobeReady: false,
    rendererConfig: { antialias: !phone, alpha: true, powerPreference: 'low-power' },
  });
  globe.renderer().setPixelRatio(Math.min(window.devicePixelRatio || 1, phone ? 1.5 : 2));
  globe
    .width(size)
    .height(size)
    .backgroundColor('rgba(0,0,0,0)')
    .showGraticules(false)
    .showAtmosphere(true)
    .atmosphereAltitude(0.12)
    .hexPolygonsTransitionDuration(0)
    .hexPolygonResolution(3)
    .hexPolygonMargin(0.35)
    .hexPolygonUseDots(true)
    .pointLat('lat')
    .pointLng('lng')
    .pointRadius('radius')
    .pointAltitude('altitude')
    .pointsMerge(false)
    .pointsTransitionDuration(0)
    .arcStartLat('startLat')
    .arcStartLng('startLng')
    .arcEndLat('endLat')
    .arcEndLng('endLng')
    .arcStroke('stroke')
    .arcDashLength(0.4)
    .arcDashGap(2)
    .arcDashInitialGap(1)
    .arcDashAnimateTime(ARC_ANIMATE_MS)
    .arcsTransitionDuration(0)
    .ringLat('lat')
    .ringLng('lng')
    .ringMaxRadius('maxRadius')
    .ringPropagationSpeed('speed')
    .ringRepeatPeriod('period')
    .htmlLat('lat')
    .htmlLng('lon')
    .htmlAltitude(0.01)
    .htmlTransitionDuration(0)
    .pointOfView({ lat: 28, lng: -100, altitude: 2.1 });
  const controls = globe.controls();
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.autoRotateSpeed = 0.35;
  return globe;
}

/**
 * The land, a batch per task: building ~11,600 dots at once blocks the main thread for
 * several hundred ms. three-globe keeps the dots it already built (same feature objects), so
 * each batch only pays for its own. Returns a cancel function.
 */
export function feedLand(globe: GlobeInstance, { land, batches }: GlobeModules): () => void {
  let i = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const step = () => {
    globe.hexPolygonsData(land.slice(0, batches[i]));
    i += 1;
    if (i < batches.length) timer = setTimeout(step, 40);
  };
  timer = setTimeout(step, 0);
  return () => clearTimeout(timer);
}

/** Colors from the theme: set the accessors again on a preset or accent change, never remount. */
export function applyColors(globe: GlobeInstance, c: LabColors) {
  const material = globe.globeMaterial() as unknown as { color?: { set: (v: string) => void } };
  material.color?.set(c.bg);
  globe
    .atmosphereColor(c.accent)
    .hexPolygonColor(() => c.textDimmed)
    .pointColor(() => c.bin)
    .arcColor((a: object) => c.cat[(a as Arc).cat as Category])
    .ringColor(() => (t: number) => `rgba(${c.accentRgb}, ${Math.max(0, 1 - t)})`);
}

/**
 * Target markers as DOM elements built with textContent and styled with CSS variables, so they
 * recolor without JavaScript: an accent dot (hollow and grey when down) and an optional label.
 */
export function targetMarkers(globe: GlobeInstance, targets: TargetIn[], labels: 'none' | 'short' | 'full') {
  globe.htmlElementsData(targets).htmlElement((d: object) => {
    const t = d as TargetIn;
    const el = document.createElement('div');
    el.className = `lab-globe-marker is-${t.id}${t.up ? '' : ' is-down'}`;
    const dot = document.createElement('span');
    dot.className = 'lab-globe-dot';
    el.appendChild(dot);
    if (labels !== 'none') {
      const label = document.createElement('span');
      label.className = 'lab-globe-label';
      label.textContent = labels === 'full' ? `${t.label} · ${t.up ? 'up' : 'down'}` : t.label;
      el.appendChild(label);
    }
    return el;
  });
}

export function setLayers(
  globe: GlobeInstance,
  { bins, arcs, rings, label }: { bins?: Bin[]; arcs?: Arc[]; rings?: Ring[]; label?: (b: Bin) => string },
) {
  if (bins) globe.pointsData(bins);
  if (label) globe.pointLabel((b: object) => label(b as Bin));
  if (arcs) globe.arcsData(arcs);
  if (rings) globe.ringsData(rings);
}

/** Pause, run the destructor, dispose the renderer and lose the WebGL context, empty the box. */
export function disposeGlobe(globe: GlobeInstance, el: HTMLElement) {
  const renderer = globe.renderer();
  globe.pauseAnimation();
  globe._destructor();
  renderer.dispose();
  renderer.forceContextLoss();
  el.replaceChildren();
}
