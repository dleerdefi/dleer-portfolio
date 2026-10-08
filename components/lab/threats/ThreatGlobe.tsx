'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { GlobeInstance } from 'globe.gl';
import { useLabColors } from '@/hooks/useLabColors';
import { countryName } from '@/lib/lab/countries';
import type { Category } from '@/lib/lab/types';
import type { ReplayEvent } from './ReplayClock';
import { arcFor, beaconsFor, binLabel, binsFor, capArcs, liveArcs, ARC_ANIMATE_MS, type Arc, type Ring } from './globe-layers';
import { applyColors, createGlobe, disposeGlobe, feedLand, loadGlobe, setLayers, targetMarkers } from './globe-setup';
import type { DigestLive } from './useThreats';

const IDLE_ROTATE_MS = 10_000;
const BURST_MS = 1200;

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

/**
 * The 3D threat map (THREATS_VIEW.md §5): dotted land, neutral 24 h bins, replayed arcs in
 * the category colors, accent beacons on the targets. Recolors from the theme without
 * remounting; pauses off-screen and in hidden tabs; static with reduced motion; frees the
 * WebGL context on unmount.
 */
export default function ThreatGlobe({
  d,
  subscribe,
  hidden,
  maxSize,
  labels,
  phone,
}: {
  d: DigestLive;
  subscribe: (fn: (e: ReplayEvent) => void) => () => void;
  hidden: ReadonlySet<Category>;
  maxSize: number;
  labels: 'none' | 'short' | 'full';
  phone: boolean;
}) {
  const box = useRef<HTMLDivElement>(null);
  const mount = useRef<HTMLDivElement>(null);
  const [globe, setGlobe] = useState<GlobeInstance | null>(null);
  const [failed, setFailed] = useState(false);
  const colors = useLabColors();
  const reduced = useReducedMotion();
  const arcs = useRef<Arc[]>([]);
  const bursts = useRef<Ring[]>([]);
  const hiddenRef = useRef(hidden);
  hiddenRef.current = hidden;

  // Load the chunk and create the globe once; dispose it on unmount.
  useEffect(() => {
    const el = mount.current!;
    let instance: GlobeInstance | null = null;
    let stopLand = () => {};
    let disposed = false;
    loadGlobe()
      .then((mods) => {
        if (disposed) return;
        const size = Math.min(maxSize, box.current?.clientWidth || maxSize);
        instance = createGlobe(mods, el, { phone, size });
        stopLand = feedLand(instance, mods);
        if (phone) {
          // the page scrolls past the globe on touch screens. The controls stay enabled: they
          // aim the camera every frame (and drive the auto-rotate); only dragging is off.
          instance.controls().enableRotate = false;
          instance.renderer().domElement.style.touchAction = 'pan-y';
        }
        // a Kapsule instance is a function: wrap it, or React calls it as a state updater
        const created = instance;
        setGlobe(() => created);
      })
      .catch(() => !disposed && setFailed(true));
    return () => {
      disposed = true;
      stopLand();
      if (instance) disposeGlobe(instance, el);
      arcs.current = [];
      bursts.current = [];
    };
  }, [maxSize, phone]);

  // A square that follows its container.
  useEffect(() => {
    if (!globe || !box.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const size = Math.max(120, Math.min(maxSize, Math.floor(entry.contentRect.width)));
      globe.width(size).height(size);
    });
    ro.observe(box.current);
    return () => ro.disconnect();
  }, [globe, maxSize]);

  // Theme: new accessors, same globe.
  useEffect(() => {
    if (globe && colors) applyColors(globe, colors);
  }, [globe, colors]);

  useEffect(() => {
    if (globe) targetMarkers(globe, d.targets, labels);
  }, [globe, d.targets, labels]);

  // 24 h bins minus filtered categories; in-flight arcs of a hidden category go too.
  useEffect(() => {
    if (!globe) return;
    arcs.current = liveArcs(arcs.current, performance.now(), hidden);
    setLayers(globe, { bins: binsFor(d.geo, hidden), arcs: arcs.current, label: (b) => binLabel(b, countryName) });
  }, [globe, d.geo, hidden]);

  // Beacons, live arcs and landing bursts; none of it with reduced motion.
  useEffect(() => {
    if (!globe) return;
    const beacons = reduced ? [] : beaconsFor(d.targets);
    const refreshRings = () => setLayers(globe, { rings: [...beacons, ...bursts.current] });
    refreshRings();
    if (reduced) {
      arcs.current = [];
      setLayers(globe, { arcs: [] });
      return;
    }
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const unsubscribe = subscribe((e) => {
      const arc = arcFor(e, d.targets, performance.now());
      if (!arc || hiddenRef.current.has(arc.cat)) return;
      arcs.current = capArcs([...arcs.current, arc]);
      setLayers(globe, { arcs: arcs.current });
      const target = d.targets.find((t) => t.id === e.target);
      if (target?.up) {
        const id = setTimeout(() => {
          timers.delete(id);
          bursts.current = [...bursts.current, { lat: target.lat, lng: target.lon, maxRadius: 4, speed: 5, period: 0, burstAt: performance.now() }];
          refreshRings();
        }, ARC_ANIMATE_MS);
        timers.add(id);
      }
    });
    const prune = setInterval(() => {
      const now = performance.now();
      const nextArcs = liveArcs(arcs.current, now, hiddenRef.current);
      if (nextArcs.length !== arcs.current.length) {
        arcs.current = nextArcs;
        setLayers(globe, { arcs: nextArcs });
      }
      const nextBursts = bursts.current.filter((b) => now - (b.burstAt ?? 0) < BURST_MS);
      if (nextBursts.length !== bursts.current.length) {
        bursts.current = nextBursts;
        refreshRings();
      }
    }, 300);
    return () => {
      unsubscribe();
      clearInterval(prune);
      timers.forEach(clearTimeout);
    };
  }, [globe, d.targets, reduced, subscribe]);

  // Slow auto-rotate that stops on interaction and resumes after 10 s idle.
  useEffect(() => {
    if (!globe) return;
    const controls = globe.controls();
    controls.autoRotate = !reduced;
    let idle: ReturnType<typeof setTimeout> | undefined;
    const start = () => {
      clearTimeout(idle);
      controls.autoRotate = false;
    };
    const end = () => {
      clearTimeout(idle);
      idle = setTimeout(() => (controls.autoRotate = !reduced), IDLE_ROTATE_MS);
    };
    controls.addEventListener('start', start);
    controls.addEventListener('end', end);
    return () => {
      clearTimeout(idle);
      controls.removeEventListener('start', start);
      controls.removeEventListener('end', end);
    };
  }, [globe, reduced]);

  // Pause when the tab is hidden or the globe leaves the viewport.
  useEffect(() => {
    if (!globe || !box.current) return;
    let inView = true;
    const apply = () => {
      if (inView && document.visibilityState === 'visible') globe.resumeAnimation();
      else globe.pauseAnimation();
    };
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      apply();
    });
    io.observe(box.current);
    document.addEventListener('visibilitychange', apply);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', apply);
    };
  }, [globe]);

  return (
    <div ref={box} className="lab-globe" style={{ width: '100%', maxWidth: maxSize, position: 'relative' }}>
      <div ref={mount} aria-hidden="true" style={{ display: 'flex', justifyContent: 'center' }} />
      {!globe && (
        <div className="lab-text-2" style={{ aspectRatio: '1 / 1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {failed ? 'globe failed to load' : 'loading the 3D map…'}
        </div>
      )}
    </div>
  );
}
