import { loadHistory } from '@/lib/lab/loaders';
import { CACHE, labResponse } from '@/lib/lab/route';

// v1/history.json, validated (the memory cache in the loader does the work).
export const dynamic = 'force-dynamic';

export function GET() {
  return labResponse(loadHistory, CACHE.history);
}
