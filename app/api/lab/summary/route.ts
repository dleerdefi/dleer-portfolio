import { loadSummary } from '@/lib/lab/loaders';
import { CACHE, labResponse } from '@/lib/lab/route';

// A few numbers for the home page, built from the cached now, history and digest.
export const dynamic = 'force-dynamic';

export function GET() {
  return labResponse(loadSummary, CACHE.summary);
}
