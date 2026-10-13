'use client';

import { useEffect, useMemo, useState } from 'react';

/** Scroll progress (0 to 1) outside React state, so scrolling never re-renders the page. */
export interface ScrollProgressStore {
  get(): number;
  /** Calls `fn` now and on every change; returns the unsubscribe function. */
  subscribe(fn: (progress: number) => void): () => void;
}

function createProgressStore(): ScrollProgressStore & { set(progress: number): void } {
  let value = 0;
  const listeners = new Set<(progress: number) => void>();
  return {
    get: () => value,
    set(progress) {
      if (progress === value) return;
      value = progress;
      listeners.forEach((fn) => fn(value));
    },
    subscribe(fn) {
      listeners.add(fn);
      fn(value);
      return () => listeners.delete(fn);
    },
  };
}

/**
 * The phone column's scroll state, from the document's scroll (docs/PORTFOLIO_V2_SPEC.md, P6):
 * - progress for the scroll indicator: one update per animation frame, reading only `scrollY`
 *   and the sizes and offsets a ResizeObserver caches, so scrolling never forces a layout;
 * - the active section: the last `section-<id>` whose top is above 30% of the viewport (so a rail
 *   jump, which puts a section at the top, makes it active however short it is), or the last one
 *   once the page is scrolled to the end;
 * - `settled`, false while scrolling and true 400 ms after it stops (the rail hides meanwhile).
 * Attaches nothing unless `enabled`.
 */
export function usePhoneScroll(ids: string[], enabled: boolean) {
  const [active, setActive] = useState(ids[0]);
  const [settled, setSettled] = useState(true);
  const progress = useMemo(createProgressStore, []);
  const key = ids.join(',');

  useEffect(() => {
    if (!enabled) return;
    const doc = document.documentElement;
    const sections = key.split(',');
    let frame = 0;
    let max = 0;
    let tops: number[] = [];
    let timer: ReturnType<typeof setTimeout> | undefined;

    // Offsets, not bounding rects: the sections' entry animation translates them
    const pageTop = (el: HTMLElement | null) => {
      let top = 0;
      for (let node = el; node; node = node.offsetParent as HTMLElement | null) top += node.offsetTop;
      return top;
    };
    const measure = () => {
      max = doc.scrollHeight - window.innerHeight;
      tops = sections.map((id) => pageTop(document.getElementById(`section-${id}`)));
    };
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      progress.set(max > 0 ? Math.min(1, Math.max(0, y / max)) : 0);
      let at = 0;
      if (max > 0 && y >= max - 2) at = sections.length - 1;
      else tops.forEach((top, i) => { if (top - y <= window.innerHeight * 0.3) at = i; });
      setActive(sections[at]);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onScroll = () => {
      schedule();
      setSettled(false);
      clearTimeout(timer);
      timer = setTimeout(() => setSettled(true), 400);
    };

    // ResizeObserver callbacks run after layout, so measuring there is free
    const resize = new ResizeObserver(() => {
      measure();
      schedule();
    });
    resize.observe(document.body);

    window.addEventListener('scroll', onScroll, { passive: true });
    measure();
    schedule();
    return () => {
      window.removeEventListener('scroll', onScroll);
      resize.disconnect();
      clearTimeout(timer);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [enabled, key, progress]);

  return { active, settled, progress };
}
