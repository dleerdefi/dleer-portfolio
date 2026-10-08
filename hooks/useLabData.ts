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

/**
 * Polls one /api/lab/* route: on mount and every `periodMs`, only while mounted, enabled and
 * the tab is visible. On becoming visible it refetches at once if the last fetch is older than
 * `periodMs`. One AbortController per request. A network failure keeps the last payload.
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
    let controller: AbortController | null = null;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let disposed = false;

    const schedule = (delay: number) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(run, delay);
    };

    async function run() {
      if (disposed) return;
      if (document.visibilityState !== 'visible') return; // resumed by the visibility listener
      controller?.abort();
      const current = new AbortController();
      controller = current;
      lastFetch.current = Date.now();
      try {
        const res = await fetch(url, { signal: current.signal, headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const payload = (await res.json()) as P;
        if (disposed || current.signal.aborted) return;
        reportFromPayload(url, payload);
        setData({ payload, error: false, serverOffsetMs: serverOffset(res), receivedAt: Date.now() });
      } catch {
        if (disposed || current.signal.aborted) return;
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
      controller?.abort();
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
