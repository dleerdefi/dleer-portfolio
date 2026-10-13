'use client';

import { useEffect, useRef, useState } from 'react';
import { reportFromPayload } from '@/lib/lab/status-store';

export interface LabData<P> {
  payload: P | null;
  /** The last fetch failed; `payload` is the previous one, if any. */
  error: boolean;
  /** Server clock minus local clock (from the response's Date and Age headers), or null. */
  serverOffsetMs: number | null;
  /** Local time the payload arrived, for ages that tick between polls. */
  receivedAt: number | null;
}

interface Fetched {
  payload: unknown;
  serverOffsetMs: number | null;
  receivedAt: number;
}

const SHARE_MS = 10_000;
const recent = new Map<string, { at: number; result: Promise<Fetched> }>();

/**
 * One request per URL every few seconds, shared by every hook polling it: the home page has two
 * summary consumers (the neofetch rows and the lab tile) and should fetch once (LAB_UI_SPEC.md §6).
 */
function sharedFetch(url: string): Promise<Fetched> {
  const now = Date.now();
  const hit = recent.get(url);
  if (hit && now - hit.at < SHARE_MS) return hit.result;
  const result = fetch(url, { headers: { Accept: 'application/json' } }).then(async (res) => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return { payload: await res.json(), serverOffsetMs: serverOffset(res), receivedAt: Date.now() };
  });
  recent.set(url, { at: now, result });
  return result;
}

/**
 * Polls one /api/lab/* route: on mount and every `periodMs`, only while mounted, enabled and
 * the tab is visible. On becoming visible it refetches at once if the last fetch is older than
 * `periodMs`. Hooks polling the same URL share requests; a result that arrives after the hook
 * moved on is dropped. A network failure keeps the last payload.
 */
export function useLabData<P>(url: string, periodMs: number, { enabled = true } = {}): LabData<P> {
  const [data, setData] = useState<LabData<P>>({
    payload: null,
    error: false,
    serverOffsetMs: null,
    receivedAt: null,
  });
  const lastFetch = useRef(0);

  useEffect(() => {
    if (!enabled) return;
    let runs = 0;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let disposed = false;

    const schedule = (delay: number) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(run, delay);
    };

    async function run() {
      if (disposed) return;
      if (document.visibilityState !== 'visible') return; // resumed by the visibility listener
      const generation = ++runs;
      lastFetch.current = Date.now();
      try {
        const result = await sharedFetch(url);
        if (disposed || generation !== runs) return;
        reportFromPayload(url, result.payload);
        setData({ payload: result.payload as P, error: false, serverOffsetMs: result.serverOffsetMs, receivedAt: result.receivedAt });
      } catch {
        if (disposed || generation !== runs) return;
        setData((prev) => ({ ...prev, error: true }));
      }
      if (!disposed) schedule(periodMs);
    }

    const onVisibility = () => {
      if (document.visibilityState !== 'visible') return;
      const since = Date.now() - lastFetch.current;
      schedule(since >= periodMs ? 0 : periodMs - since);
    };

    run();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      disposed = true;
      if (timer) clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [url, periodMs, enabled]);

  return data;
}

/** Server time ≈ Date + Age (the edge cache's age), compared with the local clock now. */
function serverOffset(res: Response): number | null {
  const date = Date.parse(res.headers.get('date') ?? '');
  if (Number.isNaN(date)) return null;
  const age = Number(res.headers.get('age') ?? 0);
  return date + (Number.isFinite(age) ? age * 1000 : 0) - Date.now();
}
