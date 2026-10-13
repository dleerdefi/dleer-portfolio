import { useEffect, useMemo, useRef, useState, RefObject } from 'react';

interface Section {
  id: string;
  title: string;
}

/** Scroll progress (0 to 1) outside React state, so scrolling never re-renders the layout. */
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
 * Scroll behavior for the phone layout (docs/PORTFOLIO_V2_SPEC.md, P6):
 * - at most one update per animation frame, which reads only `scrollTop` and sizes cached by a
 *   ResizeObserver, so scrolling never forces a synchronous layout;
 * - the hero's opacity and the scroll indicator are written to the DOM directly, not through state;
 * - the active section comes from an IntersectionObserver on a line across the middle of the
 *   viewport, and is the only state that changes (rarely).
 */
export function useParallaxScroll(
  scrollRef: RefObject<HTMLDivElement>,
  sections: Section[],
  heroRef: RefObject<HTMLDivElement | null>
): { activeSection: string; progress: ScrollProgressStore } {
  const [activeSection, setActiveSection] = useState('neofetch');
  const progress = useMemo(createProgressStore, []);
  const centered = useRef<string | null>(null);
  const sectionKey = sections.map((s) => s.id).join(',');

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let frame = 0;
    let maxScroll = 0;
    let viewport = window.innerHeight;
    const measure = () => {
      maxScroll = container.scrollHeight - container.clientHeight;
      viewport = window.innerHeight;
    };

    const update = () => {
      frame = 0;
      const top = container.scrollTop;
      const p = maxScroll > 0 ? Math.min(1, Math.max(0, top / maxScroll)) : 0;
      progress.set(p);
      // The hero fades from 0.7 to 0.3 over the first fifth of the page
      if (heroRef.current) heroRef.current.style.opacity = String(0.7 - 0.4 * Math.min(p / 0.2, 1));
      // Near the top the neofetch hero is "active"; below it, whichever section crosses the middle
      setActiveSection(top < viewport * 0.4 ? 'neofetch' : centered.current ?? 'neofetch');
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    // Sizes change when sections load data or the viewport resizes; ResizeObserver callbacks
    // run after layout, so measuring there is free
    const resize = new ResizeObserver(() => {
      measure();
      schedule();
    });
    resize.observe(container);
    Array.from(container.children).forEach((child) => resize.observe(child));

    const middle = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) centered.current = entry.target.id.replace(/^section-/, '');
        }
        schedule();
      },
      { root: container, rootMargin: '-50% 0px -50% 0px' }
    );
    sectionKey.split(',').forEach((id) => {
      const el = document.getElementById(`section-${id}`);
      if (el) middle.observe(el);
    });

    container.addEventListener('scroll', schedule, { passive: true });
    measure();
    schedule();

    return () => {
      container.removeEventListener('scroll', schedule);
      resize.disconnect();
      middle.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [scrollRef, heroRef, progress, sectionKey]);

  return { activeSection, progress };
}
