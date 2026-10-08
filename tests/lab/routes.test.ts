import { afterEach, describe, expect, it, vi } from 'vitest';
import * as status from '@/app/api/lab/status/route';
import * as history from '@/app/api/lab/status/history/route';
import * as threats from '@/app/api/lab/threats/route';
import * as live from '@/app/api/lab/threats/live/route';
import * as summary from '@/app/api/lab/summary/route';
import { ipShapes } from '@/lib/lab/schemas/shared';

const ROUTES = [
  ['/api/lab/status', status, 'public, max-age=15, s-maxage=15, stale-while-revalidate=30'],
  ['/api/lab/status/history', history, 'public, max-age=60, s-maxage=120, stale-while-revalidate=300'],
  ['/api/lab/threats', threats, 'public, max-age=60, s-maxage=120, stale-while-revalidate=300'],
  ['/api/lab/threats/live', live, 'public, max-age=0, s-maxage=30, stale-while-revalidate=30'],
  ['/api/lab/summary', summary, 'public, max-age=30, s-maxage=30, stale-while-revalidate=60'],
] as const;

afterEach(() => vi.unstubAllEnvs());

describe.each(ROUTES)('%s', (_path, route, cacheControl) => {
  it('is dynamic', () => {
    expect(route.dynamic).toBe('force-dynamic');
  });

  it('returns 404 with an empty body when the flag is off', async () => {
    vi.stubEnv('NEXT_PUBLIC_FEATURE_LAB', 'false');
    vi.stubEnv('LAB_DEMO_DATA', 'true');
    const res = await route.GET();
    expect(res.status).toBe(404);
    expect(await res.text()).toBe('');
  });

  it('serves demo data with its cache headers when the flag is on', async () => {
    vi.stubEnv('NEXT_PUBLIC_FEATURE_LAB', 'true');
    vi.stubEnv('LAB_DEMO_DATA', 'true');
    const res = await route.GET();
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toBe('application/json');
    expect(res.headers.get('cache-control')).toBe(cacheControl);
    const text = await res.text();
    const body = JSON.parse(text);
    expect(body.demo).toBe(true);
    expect(ipShapes(text)).toEqual([]);
  });
});

describe('without R2 configuration or demo data', () => {
  it('is offline with the offline cache header', async () => {
    vi.stubEnv('NEXT_PUBLIC_FEATURE_LAB', 'true');
    vi.stubEnv('LAB_DEMO_DATA', 'false');
    vi.stubEnv('R2_ACCOUNT_ID', '');
    vi.resetModules();
    const fresh = await import('@/app/api/lab/threats/route');
    const res = await fresh.GET();
    expect(await res.json()).toEqual({ state: 'offline' });
    expect(res.headers.get('cache-control')).toBe('public, max-age=30, s-maxage=30');
  });
});
