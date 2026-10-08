import { describe, expect, it, vi } from 'vitest';
import { createLoader, type LoaderDeps } from '@/lib/lab/load';
import type { R2Result } from '@/lib/lab/r2';
import { NowDoc } from '@/lib/lab/schemas/telemetry';
import { DigestDoc, LiveDoc } from '@/lib/lab/schemas/threats';
import { ipShapes } from '@/lib/lab/schemas/shared';
import { golden, invalidText, readText, FIXTURES } from './helpers';
import { join } from 'node:path';

const GENERATED = '2026-10-01T17:30:15Z';
const T0 = Date.parse(GENERATED) + 12_000;

function setup(result: R2Result | (() => Promise<R2Result>), opts: Partial<{ cacheMs: number; demo: boolean }> = {}) {
  let now = T0;
  const getObject = vi.fn(typeof result === 'function' ? result : async () => result);
  const log = vi.fn();
  const deps: LoaderDeps = { getObject, now: () => now, demoMode: () => opts.demo ?? false, log };
  const load = createLoader(
    {
      key: 'v1/now.json',
      maxBytes: 16 * 1024,
      cacheMs: opts.cacheMs ?? 10_000,
      delayedCeilingS: 900,
      schema: NowDoc,
      demo: async () => golden('now.v1.json'),
    },
    deps,
  );
  return { load, getObject, log, advance: (ms: number) => (now += ms) };
}

const body = (text: string): R2Result => ({ ok: true, body: text });
const nowText = readText(join(FIXTURES, 'now.v1.json'));

describe('loader', () => {
  it('returns the parsed document with its state and age', async () => {
    const { load } = setup(body(nowText));
    const p = await load();
    expect(p.state).toBe('live');
    if (p.state === 'offline') throw new Error();
    expect(p.age_s).toBe(12);
    expect(p.lab.power_w).toBe(1028.5);
    expect(p.demo).toBeUndefined();
  });

  it.each<[string, R2Result]>([
    ['missing configuration', { ok: false, reason: 'unconfigured' }],
    ['a 404', { ok: false, reason: 'status', status: 404 }],
    ['a timeout', { ok: false, reason: 'timeout' }],
    ['an oversized body', { ok: false, reason: 'oversize' }],
    ['invalid JSON', body('{"schema_version": 1,')],
    ['NaN', body(nowText.replace('1028.5', 'NaN'))],
    ['a Zod failure', body(nowText.replace('"storage": null', '"storage": "full"'))],
  ])('is offline on %s', async (_name, result) => {
    const { load, log } = setup(result);
    expect(await load()).toEqual({ state: 'offline' });
    expect(log).toHaveBeenCalledTimes(1);
    expect(log.mock.calls[0][0]).not.toContain('1028');
  });

  it('is offline, never throwing, when the source throws', async () => {
    const { load } = setup(async () => {
      throw new Error('boom');
    });
    expect(await load()).toEqual({ state: 'offline' });
  });

  it('is offline when the document is too old', async () => {
    const { load, advance } = setup(body(nowText));
    advance(900_000);
    expect(await load()).toEqual({ state: 'offline' });
  });

  it('is offline when an IP shape passes the field patterns', async () => {
    // An IPv6 literal without `::` fits the credential pattern; only the payload scan catches it.
    const doc = golden('threats.v1.json') as { credentials: { usernames: { value: string }[] } };
    doc.credentials.usernames[0].value = '2001:db8:0:0:0:0:0:1';
    expect(DigestDoc.safeParse(doc).success).toBe(true);
    const log = vi.fn();
    const load = createLoader(
      {
        key: 'v1/threats.json',
        maxBytes: 64 * 1024,
        cacheMs: 60_000,
        delayedCeilingS: 3600,
        schema: DigestDoc,
        demo: async () => null,
      },
      {
        getObject: async () => body(JSON.stringify(doc)),
        now: () => Date.parse('2026-10-07T19:06:00Z'),
        demoMode: () => false,
        log,
      },
    );
    expect(await load()).toEqual({ state: 'offline' });
    expect(log.mock.calls[0][0]).toContain('ip shape');
    expect(log.mock.calls[0][0]).not.toContain('2001');
  });

  it('caches for the window, then fetches again', async () => {
    const { load, getObject, advance } = setup(body(nowText));
    await load();
    advance(9_999);
    await load();
    expect(getObject).toHaveBeenCalledTimes(1);
    advance(1);
    await load();
    expect(getObject).toHaveBeenCalledTimes(2);
  });

  it('caches offline results too', async () => {
    const { load, getObject, advance } = setup({ ok: false, reason: 'status', status: 404 });
    await load();
    advance(5_000);
    await load();
    expect(getObject).toHaveBeenCalledTimes(1);
  });

  it('keeps one fetch in flight for concurrent callers', async () => {
    let resolve!: (r: R2Result) => void;
    const { load, getObject } = setup(() => new Promise<R2Result>((r) => (resolve = r)));
    const a = load();
    const b = load();
    resolve(body(nowText));
    const [pa, pb] = await Promise.all([a, b]);
    expect(getObject).toHaveBeenCalledTimes(1);
    expect(pa).toEqual(pb);
  });

  it('logs a failing key at most once a minute', async () => {
    const { load, log, advance } = setup({ ok: false, reason: 'timeout' }, { cacheMs: 1_000 });
    for (let i = 0; i < 10; i++) {
      await load();
      advance(1_000);
    }
    expect(log).toHaveBeenCalledTimes(1);
    advance(60_000);
    await load();
    expect(log).toHaveBeenCalledTimes(2);
  });

  it('marks demo payloads and never calls R2 in demo mode', async () => {
    const { load, getObject } = setup(body('nope'), { demo: true });
    const p = await load();
    expect(p.state).toBe('live');
    expect(p.state !== 'offline' && p.demo).toBe(true);
    expect(getObject).not.toHaveBeenCalled();
  });
});

describe('stripped keys never reach a response', () => {
  const AT = () => Date.parse('2026-10-07T19:06:00Z');
  const source = (name: string) => async () => body(invalidText('threatsnap', name));
  const deps = (name: string): LoaderDeps => ({ getObject: source(name), now: AT, demoMode: () => false, log: () => {} });
  const check = async (payload: object, stripped: string) => {
    expect('state' in payload && payload.state).toBe('live');
    const out = JSON.stringify(payload);
    expect(out).not.toContain(`"${stripped}"`);
    expect(ipShapes(out)).toEqual([]);
  };
  const base = { maxBytes: 64 * 1024, cacheMs: 1, delayedCeilingS: 3600, demo: async () => null };

  it('threats-unknown-key.json', async () => {
    const load = createLoader({ ...base, key: 'v1/threats.json', schema: DigestDoc }, deps('threats-unknown-key.json'));
    await check(await load(), 'source_ips');
  });

  it('threats-live-source-address.json', async () => {
    const load = createLoader({ ...base, key: 'v1/threats-live.json', schema: LiveDoc }, deps('threats-live-source-address.json'));
    await check(await load(), 'src');
  });
});
