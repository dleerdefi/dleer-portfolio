'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useIsDesktop, useMediaQuery } from '@/hooks/useMediaQuery';

export interface LabSlide {
  key: string;
  /** For the dot: "Show <label>" */
  label: string;
  href: string;
  onClick?: (e: React.MouseEvent) => void;
  /** The slide's first line: its path on the left, a status badge on the right */
  path: string;
  badge?: React.ReactNode;
  body: React.ReactNode;
  cta: string;
}

const ADVANCE_MS = 6000;

/**
 * The home page's lab card (docs/PORTFOLIO_V2_SPEC.md §4.6): one card that shows one slide at a
 * time, each a link to its part of the lab. A row with scroll snapping, so a phone swipes it and a
 * dot or a key scrolls it. On desktop it advances every six seconds, but never while the pointer
 * or focus is on it, while it is off screen or the tab is hidden, after the viewer pauses it, or
 * with reduced motion (WCAG 2.2.2). Phones never advance on their own. Assistive technology sees
 * the slide in view only, and hears the next one when the viewer moves (the row is a polite live
 * region except while it plays).
 */
export function LabCarousel({ slides }: { slides: LabSlide[] }) {
  const rail = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [seen, setSeen] = useState(false);
  const isDesktop = useIsDesktop();
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)', false);
  const count = slides.length;
  const auto = isDesktop && !reduced && count > 1;
  const playing = auto && !paused && !hovered && !focused && seen;

  const go = useCallback(
    (i: number) => {
      const el = rail.current;
      if (el) el.scrollTo({ left: i * el.clientWidth, behavior: reduced ? 'auto' : 'smooth' });
    },
    [reduced]
  );

  // The slide in view, from the scroll position (one read per frame)
  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setActive(Math.round(el.scrollLeft / Math.max(1, el.clientWidth)));
      });
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // On screen and in a visible tab
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let onScreen = false;
    const update = () => setSeen(onScreen && document.visibilityState === 'visible');
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      update();
    });
    io.observe(el);
    document.addEventListener('visibilitychange', update);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', update);
    };
  }, []);

  useEffect(() => {
    if (!playing) return;
    const id = setTimeout(() => go((active + 1) % count), ADVANCE_MS);
    return () => clearTimeout(id);
  }, [playing, active, count, go]);

  return (
    <section
      ref={root}
      className="lab-carousel"
      aria-roledescription="carousel"
      aria-label="The lab, live"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
      }}
    >
      <div ref={rail} className="lab-slides" aria-live={playing ? 'off' : 'polite'}>
        {slides.map((s, i) => (
          <Link
            key={s.key}
            href={s.href}
            onClick={s.onClick}
            className="lab-slide lab-focus"
            aria-roledescription="slide"
            aria-hidden={i !== active || undefined}
            tabIndex={i === active ? 0 : -1}
          >
            <span className="lab-slide-head">
              <span className="font-bold">{s.path}</span>
              {s.badge}
            </span>
            {s.body}
            <span className="lab-slide-cta">{s.cta}</span>
          </Link>
        ))}
      </div>
      {count > 1 && (
        <div className="lab-carousel-controls">
          <span className="lab-dots">
            {slides.map((s, i) => (
              <button
                key={s.key}
                type="button"
                className="lab-dot"
                aria-label={`Show ${s.label}`}
                aria-current={i === active || undefined}
                onClick={() => go(i)}
              />
            ))}
          </span>
          {auto && (
            <button type="button" className="lab-pause" onClick={() => setPaused(!paused)}>
              {paused ? 'play' : 'pause'}
            </button>
          )}
        </div>
      )}
    </section>
  );
}
