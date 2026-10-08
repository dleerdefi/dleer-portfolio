'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Category } from '@/lib/lab/types';
import { ReplayClock, type ReplayEvent } from './ReplayClock';
import type { LiveLive } from './useThreats';

export const FEED_LINES = 50;

/**
 * Runs the ReplayClock over the live document: fired events go to the feed (the last 50) and
 * to subscribers (the globe's arcs). Hidden categories are skipped at fire time and hidden in
 * the feed, so toggling one back on takes effect at once.
 */
export function useReplayFeed(
  live: LiveLive | null,
  replaying: boolean,
  serverOffsetMs: number | null,
  hidden: ReadonlySet<Category>,
) {
  const [lines, setLines] = useState<ReplayEvent[]>([]);
  const hiddenRef = useRef(hidden);
  hiddenRef.current = hidden;
  const listeners = useRef(new Set<(e: ReplayEvent) => void>());
  const clock = useRef<ReplayClock | null>(null);

  useEffect(() => {
    const visible = (cat: string) => !hiddenRef.current.has(cat as Category);
    const c = new ReplayClock({
      isVisible: visible,
      onFire: (e) => {
        setLines((prev) => [...prev, e].slice(-FEED_LINES));
        listeners.current.forEach((l) => l(e));
      },
      onPrefill: (events) => setLines((prev) => [...events.filter((e) => visible(e.cat)), ...prev].slice(-FEED_LINES)),
    });
    clock.current = c;
    return () => {
      c.dispose();
      clock.current = null;
    };
  }, []);

  useEffect(() => {
    clock.current?.setOffset(serverOffsetMs);
  }, [serverOffsetMs]);

  useEffect(() => {
    const c = clock.current;
    if (!c) return;
    if (!live) c.pause();
    else c.ingest(live, replaying ? 'live' : 'delayed');
  }, [live, replaying]);

  /** The globe subscribes to fired events; returns the unsubscribe. */
  const subscribe = useCallback((fn: (e: ReplayEvent) => void) => {
    listeners.current.add(fn);
    return () => {
      listeners.current.delete(fn);
    };
  }, []);

  return { lines: lines.filter((l) => !hidden.has(l.cat as Category)), subscribe };
}
