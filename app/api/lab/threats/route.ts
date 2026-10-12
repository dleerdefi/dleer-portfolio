import { loadDigest } from '@/lib/lab/loaders';
import { labThreatsEnabled } from '@/lib/lab/flag';
import { CACHE, labResponse } from '@/lib/lab/route';

// v1/threats.json, validated (the memory cache in the loader does the work).
export const dynamic = 'force-dynamic';

export function GET() {
  return labResponse(loadDigest, CACHE.threats, labThreatsEnabled);
}
