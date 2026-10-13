import { loadTelemetryLive } from '@/lib/lab/loaders';
import { CACHE, labResponse } from '@/lib/lab/route';

// v1/live.json, validated: the last 10 minutes at 10 s steps (the memory cache in the loader
// does the work).
export const dynamic = 'force-dynamic';

export function GET() {
  return labResponse(loadTelemetryLive, CACHE.statusLive);
}
