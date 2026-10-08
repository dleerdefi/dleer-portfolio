import { loadNow } from '@/lib/lab/loaders';
import { CACHE, labResponse } from '@/lib/lab/route';

// v1/now.json, validated (the memory cache in the loader does the work).
export const dynamic = 'force-dynamic';

export function GET() {
  return labResponse(loadNow, CACHE.status);
}
