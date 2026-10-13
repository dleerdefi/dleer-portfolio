import type { ProjectSummary } from './content-types';

const newestFirst = (a: ProjectSummary, b: ProjectSummary) => new Date(b.date).getTime() - new Date(a.date).getTime();

/**
 * The projects the home page features: those marked `featured`, newest first, topped up with the
 * newest others to `count`. Phase 3 (docs/PORTFOLIO_V2_SPEC.md §4.4) adds `featured_rank`.
 */
export function featuredProjects(projects: ProjectSummary[], count = 3): ProjectSummary[] {
  const featured = projects.filter((p) => p.featured).sort(newestFirst);
  const rest = projects.filter((p) => !p.featured).sort(newestFirst);
  return [...featured, ...rest].slice(0, count);
}

/** Every project not in `featured`, newest first. */
export function otherProjects(projects: ProjectSummary[], featured: ProjectSummary[]): ProjectSummary[] {
  const shown = new Set(featured.map((p) => p.slug));
  return projects.filter((p) => !shown.has(p.slug)).sort(newestFirst);
}
