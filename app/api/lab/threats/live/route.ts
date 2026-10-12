import { loadLive } from '@/lib/lab/loaders';
import { labThreatsEnabled } from '@/lib/lab/flag';
import { CACHE, labResponse } from '@/lib/lab/route';

// v1/threats-live.json, validated (the memory cache in the loader does the work).
export const dynamic = 'force-dynamic';

export function GET() {
  return labResponse(loadLive, CACHE.live, labThreatsEnabled);
}
