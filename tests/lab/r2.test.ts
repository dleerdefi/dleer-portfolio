import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getObject } from '@/lib/lab/r2';

const ENV = {
  R2_ACCOUNT_ID: 'test-account',
  R2_LAB_BUCKET: 'test-bucket',
  R2_LAB_READ_KEY_ID: 'test-key',
  R2_LAB_READ_SECRET: 'test-secret',
};

describe('getObject', () => {
  beforeEach(() => {
    for (const [k, v] of Object.entries(ENV)) vi.stubEnv(k, v);
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('is unconfigured when any R2 variable is missing', async () => {
    vi.stubEnv('R2_LAB_READ_SECRET', '');
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);
    expect(await getObject('v1/now.json', 1024)).toEqual({ ok: false, reason: 'unconfigured' });
    expect(fetch).not.toHaveBeenCalled();
  });

  it('signs a GET for one of the fixed keys', async () => {
    const fetch = vi.fn(async (_req: Request) => new Response('{"a":1}', { status: 200 }));
    vi.stubGlobal('fetch', fetch);
    expect(await getObject('v1/now.json', 1024)).toEqual({ ok: true, body: '{"a":1}' });
    const req = fetch.mock.calls[0][0] as Request;
    expect(req.method).toBe('GET');
    expect(req.url).toBe('https://test-account.r2.cloudflarestorage.com/test-bucket/v1/now.json');
    expect(req.headers.get('authorization')).toMatch(/^AWS4-HMAC-SHA256 /);
  });

  it('fails on a non-200 status', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('missing', { status: 404 })));
    expect(await getObject('v1/now.json', 1024)).toEqual({ ok: false, reason: 'status', status: 404 });
  });

  it('fails when Content-Length is over the cap', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('x'.repeat(10), { status: 200, headers: { 'content-length': '2048' } })),
    );
    expect(await getObject('v1/now.json', 1024)).toEqual({ ok: false, reason: 'oversize' });
  });

  it('stops reading a body that grows past the cap', async () => {
    const stream = new ReadableStream<Uint8Array>({
      pull(controller) {
        controller.enqueue(new Uint8Array(600));
      },
    });
    vi.stubGlobal('fetch', vi.fn(async () => new Response(stream, { status: 200 })));
    expect(await getObject('v1/now.json', 1024)).toEqual({ ok: false, reason: 'oversize' });
  });

  it('times out', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new DOMException('The operation was aborted due to timeout', 'TimeoutError');
      }),
    );
    expect(await getObject('v1/now.json', 1024)).toEqual({ ok: false, reason: 'timeout' });
  });

  it('reports a network failure', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new TypeError('fetch failed');
      }),
    );
    expect(await getObject('v1/now.json', 1024)).toEqual({ ok: false, reason: 'network' });
  });
});
