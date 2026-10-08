import 'server-only';
import type { z } from 'zod';
import { freshness } from './freshness';
import { getObject, type LabKey, type R2Result } from './r2';
import { ipShapes } from './schemas/shared';
import type { LabPayload } from './types';

// One loader per document: an in-memory cache with one in-flight fetch, R2 (or the demo
// fixtures) → JSON.parse → Zod → IP-shape scan. Any failure is `offline`; nothing throws to
// the client, and offline results are cached too so an outage doesn't multiply R2 reads.

type Freshable = { generated_at: string; stale_after_s: number };

export interface LoaderOptions<T extends Freshable> {
  key: LabKey;
  maxBytes: number;
  cacheMs: number;
  delayedCeilingS: number;
  schema: z.ZodType<T>;
  /** Demo mode: the vendored fixture, rebased to `now`. */
  demo: (now: number) => Promise<unknown>;
}

export interface LoaderDeps {
  getObject: (key: LabKey, maxBytes: number) => Promise<R2Result>;
  now: () => number;
  demoMode: () => boolean;
  log: (message: string) => void;
}

export const defaultDeps: LoaderDeps = {
  getObject,
  now: () => Date.now(),
  demoMode: () => process.env.LAB_DEMO_DATA === 'true',
  log: (message) => console.warn(message),
};

type Fetched<T> = { ok: true; doc: T; demo: boolean } | { ok: false; reason: string };

const LOG_EVERY_MS = 60_000;

export function createLoader<T extends Freshable>(
  opts: LoaderOptions<T>,
  deps: LoaderDeps = defaultDeps,
): () => Promise<LabPayload<T>> {
  let cached: { at: number; value: Fetched<T> } | null = null;
  let inflight: Promise<Fetched<T>> | null = null;
  let lastLog = -Infinity;

  const fail = (reason: string): Fetched<T> => {
    const now = deps.now();
    if (now - lastLog >= LOG_EVERY_MS) {
      lastLog = now;
      // The reason and status only: never the body or headers.
      deps.log(`[lab] ${opts.key}: offline (${reason})`);
    }
    return { ok: false, reason };
  };

  const fetchDoc = async (): Promise<Fetched<T>> => {
    const demo = deps.demoMode();
    let raw: unknown;
    if (demo) {
      raw = await opts.demo(deps.now());
    } else {
      const res = await deps.getObject(opts.key, opts.maxBytes);
      if (!res.ok) return fail(res.status ? `${res.reason} ${res.status}` : res.reason);
      try {
        raw = JSON.parse(res.body);
      } catch {
        return fail('invalid json');
      }
    }
    const parsed = opts.schema.safeParse(raw);
    if (!parsed.success) return fail('schema');
    // The producer's last-word filter, repeated over what would leave this server.
    if (ipShapes(JSON.stringify(parsed.data)).length > 0) return fail('ip shape');
    return { ok: true, doc: parsed.data, demo };
  };

  return async () => {
    const now = deps.now();
    if (!cached || now - cached.at >= opts.cacheMs) {
      if (!inflight) {
        inflight = fetchDoc()
          .catch(() => fail('error'))
          .then((value) => {
            cached = { at: deps.now(), value };
            return value;
          })
          .finally(() => {
            inflight = null;
          });
      }
      await inflight;
    }
    return toPayload(cached!.value, opts, deps.now(), fail);
  };
}

function toPayload<T extends Freshable>(
  fetched: Fetched<T>,
  opts: LoaderOptions<T>,
  now: number,
  fail: (reason: string) => Fetched<T>,
): LabPayload<T> {
  if (!fetched.ok) return { state: 'offline' };
  const { state, ageS } = freshness({
    generatedAt: fetched.doc.generated_at,
    staleAfterS: fetched.doc.stale_after_s,
    delayedCeilingS: opts.delayedCeilingS,
    now,
  });
  if (state === 'offline') {
    fail('stale');
    return { state: 'offline' };
  }
  return { state, age_s: ageS, ...(fetched.demo ? { demo: true as const } : {}), ...fetched.doc };
}
