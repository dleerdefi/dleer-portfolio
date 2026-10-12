import { afterEach, describe, expect, it, vi } from 'vitest';
import * as status from '@/app/api/lab/status/route';
import * as history from '@/app/api/lab/status/history/route';
import * as threats from '@/app/api/lab/threats/route';
import * as live from '@/app/api/lab/threats/live/route';
import * as summary from '@/app/api/lab/summary/route';
import { ipShapes } from '@/lib/lab/schemas/shared';

// The sitemap reads the content collections, which a build generates; the lab entries are what
// is under test here.
vi.mock('content-collections', () => ({ allBlogs: [], allProjects: [] }));

const ROUTES = [
  ['/api/lab/status', status, 'public, max-age=15, s-maxage=15, stale-while-revalidate=30', 'telemetry'],
  ['/api/lab/status/history', history, 'public, max-age=60, s-maxage=120, stale-while-revalidate=300', 'telemetry'],
  ['/api/lab/threats', threats, 'public, max-age=60, s-maxage=120, stale-while-revalidate=300', 'threats'],
  ['/api/lab/threats/live', live, 'public, max-age=0, s-maxage=30, stale-while-revalidate=30', 'threats'],
  ['/api/lab/summary', summary, 'public, max-age=30, s-maxage=30, stale-while-revalidate=60', 'telemetry'],
] as const;

// NEXT_PUBLIC_FEATURE_LAB, NEXT_PUBLIC_FEATURE_LAB_THREATS → which routes answer. The threats
// flag only counts while the lab is on.
const COMBOS = [
  { name: 'both flags off', lab: 'false', threats: 'false', telemetry: false, threatMap: false },
  { name: 'threats on without the lab', lab: 'false', threats: 'true', telemetry: false, threatMap: false },
  { name: 'lab on, threats off', lab: 'true', threats: 'false', telemetry: true, threatMap: false },
  { name: 'lab on, threats unset', lab: 'true', threats: undefined, telemetry: true, threatMap: false },
  { name: 'both flags on', lab: 'true', threats: 'true', telemetry: true, threatMap: true },
] as const;

function flags(lab: string, threatsFlag: string | undefined) {
  vi.stubEnv('NEXT_PUBLIC_FEATURE_LAB', lab);
  vi.stubEnv('NEXT_PUBLIC_FEATURE_LAB_THREATS', threatsFlag);
  vi.stubEnv('LAB_DEMO_DATA', 'true');
}

afterEach(() => vi.unstubAllEnvs());

describe.each(ROUTES)('%s', (_path, route) => {
  it('is dynamic', () => {
    expect(route.dynamic).toBe('force-dynamic');
  });
});

describe.each(COMBOS)('$name', ({ lab, threats: threatsFlag, telemetry, threatMap }) => {
  it.each(ROUTES)('%s', async (_path, route, cacheControl, needs) => {
    flags(lab, threatsFlag);
    const res = await route.GET();
    const open = needs === 'telemetry' ? telemetry : threatMap;
    if (!open) {
      expect(res.status).toBe(404);
      expect(await res.text()).toBe('');
      return;
    }
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toBe('application/json');
    expect(res.headers.get('cache-control')).toBe(cacheControl);
    const text = await res.text();
    expect(JSON.parse(text).demo).toBe(true);
    expect(ipShapes(text)).toEqual([]);
  });

  if (telemetry)
    it('summary: a threats block only with the threat map', async () => {
      flags(lab, threatsFlag);
      const body = await (await summary.GET()).json();
      expect(body.telemetry.state).toBe('live');
      expect('threats' in body).toBe(threatMap);
    });

  it('sitemap: /lab with the lab, /lab/threats only with the threat map', async () => {
    flags(lab, threatsFlag);
    const { default: sitemap } = await import('@/app/sitemap');
    const urls = sitemap().map((e) => new URL(e.url).pathname);
    expect(urls.includes('/lab')).toBe(telemetry);
    expect(urls.includes('/lab/threats')).toBe(threatMap);
  });
});

describe('without R2 configuration or demo data', () => {
  it('is offline with the offline cache header', async () => {
    vi.stubEnv('NEXT_PUBLIC_FEATURE_LAB', 'true');
    vi.stubEnv('NEXT_PUBLIC_FEATURE_LAB_THREATS', 'true');
    vi.stubEnv('LAB_DEMO_DATA', 'false');
    vi.stubEnv('R2_ACCOUNT_ID', '');
    vi.resetModules();
    const fresh = await import('@/app/api/lab/threats/route');
    const res = await fresh.GET();
    expect(await res.json()).toEqual({ state: 'offline' });
    expect(res.headers.get('cache-control')).toBe('public, max-age=30, s-maxage=30');
  });
});

describe('the summary from R2', () => {
  afterEach(() => vi.unstubAllGlobals());

  it.each([
    ['lab on, threats off', 'false', ['v1/now.json', 'v1/history.json']],
    ['both flags on', 'true', ['v1/now.json', 'v1/history.json', 'v1/threats.json']],
  ])('%s: reads only the documents it shows', async (_name, threatsFlag, keys) => {
    vi.stubEnv('NEXT_PUBLIC_FEATURE_LAB', 'true');
    vi.stubEnv('NEXT_PUBLIC_FEATURE_LAB_THREATS', threatsFlag);
    vi.stubEnv('LAB_DEMO_DATA', 'false');
    for (const [k, v] of Object.entries({ R2_ACCOUNT_ID: 'a', R2_LAB_BUCKET: 'b', R2_LAB_READ_KEY_ID: 'k', R2_LAB_READ_SECRET: 's' }))
      vi.stubEnv(k, v);
    const fetch = vi.fn(async (_req: Request) => new Response('missing', { status: 404 }));
    vi.stubGlobal('fetch', fetch);
    vi.resetModules(); // fresh loader caches
    const fresh = await import('@/app/api/lab/summary/route');
    const body = await (await fresh.GET()).json();
    const read = fetch.mock.calls.map(([req]) => new URL(req.url).pathname.replace('/b/', '')).sort();
    expect(read).toEqual([...keys].sort());
    expect('threats' in body).toBe(threatsFlag === 'true');
  });
});
