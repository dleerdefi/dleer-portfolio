import 'server-only';
import { labEnabled } from './flag';

// Shared by the /api/lab/* route handlers: the flag gate and the JSON response with the
// cache headers of LAB_UI_SPEC.md §5. Handlers read nothing from the request.

export const CACHE = {
  status: {
    ok: 'public, max-age=15, s-maxage=15, stale-while-revalidate=30',
    offline: 'public, max-age=15, s-maxage=15',
  },
  history: {
    ok: 'public, max-age=60, s-maxage=120, stale-while-revalidate=300',
    offline: 'public, max-age=30, s-maxage=30',
  },
  threats: {
    ok: 'public, max-age=60, s-maxage=120, stale-while-revalidate=300',
    offline: 'public, max-age=30, s-maxage=30',
  },
  live: {
    ok: 'public, max-age=0, s-maxage=30, stale-while-revalidate=30',
    offline: 'public, max-age=30, s-maxage=30',
  },
  summary: {
    ok: 'public, max-age=30, s-maxage=30, stale-while-revalidate=60',
    offline: 'public, max-age=30, s-maxage=30, stale-while-revalidate=60',
  },
} as const;

export function notFound(): Response {
  return new Response(null, { status: 404 });
}

export async function labResponse(
  load: () => Promise<object>,
  cache: { ok: string; offline: string },
): Promise<Response> {
  if (!labEnabled()) return notFound();
  const payload = await load();
  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'state' in payload && payload.state === 'offline' ? cache.offline : cache.ok,
    },
  });
}
