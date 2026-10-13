import 'server-only';
import type { ProjectMetric, ProjectSummary } from './content-types';

/**
 * GitHub numbers for project cards and pages (docs/PORTFOLIO_V2_SPEC.md §4.5): stars, forks and
 * the last push of each project's repository, fetched on the server when a page is built or
 * revalidated (daily), never from the browser. GITHUB_TOKEN is optional: without it GitHub allows
 * 60 requests an hour, plenty for ten repositories a day. A failed fetch leaves the numbers out;
 * nothing ever shows a 0 it did not read.
 */
export interface RepoStats {
  stars: number;
  forks: number;
  pushedAt: string;
}

const DAY_MS = 86_400_000;
// A failure is retried after ten minutes, not a day
const FAILURE_MS = 600_000;
const TIMEOUT_MS = 5_000;

const cache = new Map<string, { at: number; ttl: number; result: Promise<RepoStats | null> }>();

/** 'dleerdefi/claude-code-construction' from its github.com URL, or null. */
export function repoFromUrl(url: string): string | null {
  const match = url.match(/^https:\/\/github\.com\/([\w.-]+)\/([\w.-]+?)(?:\.git)?(?:[/?#].*)?$/);
  return match ? `${match[1]}/${match[2]}` : null;
}

async function fetchStats(repo: string): Promise<RepoStats | null> {
  try {
    const headers: Record<string, string> = { Accept: 'application/vnd.github+json', 'User-Agent': 'dleer-portfolio' };
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      headers,
      signal: AbortSignal.timeout(TIMEOUT_MS),
      next: { revalidate: DAY_MS / 1000, tags: ['github'] },
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { stargazers_count?: unknown; forks_count?: unknown; pushed_at?: unknown };
    if (typeof body.stargazers_count !== 'number' || typeof body.forks_count !== 'number' || typeof body.pushed_at !== 'string') {
      return null;
    }
    return { stars: body.stargazers_count, forks: body.forks_count, pushedAt: body.pushed_at };
  } catch {
    return null;
  }
}

/** One request per repository a day, shared by every page built in the same process. */
export function repoStats(url: string): Promise<RepoStats | null> {
  const repo = repoFromUrl(url);
  if (!repo) return Promise.resolve(null);
  const now = Date.now();
  const hit = cache.get(repo);
  if (hit && now - hit.at < hit.ttl) return hit.result;
  const entry = { at: now, ttl: DAY_MS, result: fetchStats(repo) };
  entry.result.then((stats) => {
    if (!stats) entry.ttl = FAILURE_MS;
  });
  cache.set(repo, entry);
  return entry.result;
}

/** 7, 43, 1.2k, 15k */
export function fmtCount(n: number): string {
  if (n < 1000) return String(n);
  const k = n / 1000;
  return `${k < 10 ? k.toFixed(1).replace(/\.0$/, '') : Math.round(k)}k`;
}

const FROM_GITHUB: Record<string, (s: RepoStats) => string> = {
  stars: (s) => fmtCount(s.stars),
  forks: (s) => fmtCount(s.forks),
};

function resolveMetrics(metrics: ProjectMetric[], stats: RepoStats | null): ProjectMetric[] {
  return metrics.flatMap((m) => {
    if (m.value !== 'github') return [m];
    const read = stats && FROM_GITHUB[m.label];
    return read ? [{ label: m.label, value: read(stats) }] : [];
  });
}

/** The projects with their "github" metrics filled (or dropped) and `pushedAt` set where known. */
export async function withGitHubStats(projects: ProjectSummary[]): Promise<ProjectSummary[]> {
  return Promise.all(
    projects.map(async (p) => {
      const stats = p.github ? await repoStats(p.github) : null;
      return { ...p, metrics: resolveMetrics(p.metrics, stats), ...(stats ? { pushedAt: stats.pushedAt } : {}) };
    })
  );
}

/** For tests: forget every cached result. */
export function clearGitHubCache() {
  cache.clear();
}
