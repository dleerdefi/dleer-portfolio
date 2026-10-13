import type { ProjectStatus, ProjectSummary } from './content-types';

const newestFirst = (a: ProjectSummary, b: ProjectSummary) => new Date(b.date).getTime() - new Date(a.date).getTime();

/** Today as YYYY-MM-DD (UTC): release dates compare as strings. */
export const todayIso = () => new Date().toISOString().slice(0, 10);

/**
 * A project's status as of `today`: `coming-soon` becomes `production` on its release date. Pages
 * compute it when they are built (the home page at deploy, project pages daily), so release day
 * needs no deploy beyond the content edit that adds the public links.
 */
export function effectiveStatus(status: ProjectStatus, releaseDate: string | undefined, today = todayIso()): ProjectStatus {
  return status === 'coming-soon' && releaseDate && releaseDate <= today ? 'production' : status;
}

/**
 * The home page's featured projects (docs/PORTFOLIO_V2_SPEC.md §4.4): by `featured_rank`, then the
 * older `featured` flag, newest first, topped up with the newest others to `count`.
 */
export function featuredProjects(projects: ProjectSummary[], count = 3): ProjectSummary[] {
  const ranked = projects.filter((p) => p.featuredRank).sort((a, b) => a.featuredRank! - b.featuredRank!);
  const flagged = projects.filter((p) => !p.featuredRank && p.featured).sort(newestFirst);
  const rest = projects.filter((p) => !p.featuredRank && !p.featured).sort(newestFirst);
  return [...ranked, ...flagged, ...rest].slice(0, count);
}

/** Every project not in `featured`, newest first. */
export function otherProjects(projects: ProjectSummary[], featured: ProjectSummary[]): ProjectSummary[] {
  const shown = new Set(featured.map((p) => p.slug));
  return projects.filter((p) => !shown.has(p.slug)).sort(newestFirst);
}

/** The /projects order: the featured three, then the rest newest first. */
export function orderedProjects(projects: ProjectSummary[]): ProjectSummary[] {
  const featured = featuredProjects(projects);
  return [...featured, ...otherProjects(projects, featured)];
}

/** The project after `slug` in the /projects order, wrapping to the first. */
export function nextProject(projects: ProjectSummary[], slug: string): ProjectSummary | undefined {
  const order = orderedProjects(projects);
  const at = order.findIndex((p) => p.slug === slug);
  return at < 0 || order.length < 2 ? undefined : order[(at + 1) % order.length];
}

/** "Oct 16" (UTC), for a release date. */
export function shortDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
}

/** "today", "3 days ago", "2 months ago", "1 year ago". */
export function relativeTime(iso: string, now = Date.now()): string {
  const days = Math.max(0, Math.floor((now - new Date(iso).getTime()) / 86_400_000));
  if (days === 0) return 'today';
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`;
  const years = Math.floor(days / 365);
  return `${years} year${years === 1 ? '' : 's'} ago`;
}
