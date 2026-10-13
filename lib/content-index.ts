import 'server-only';
import { allBlogs, allProjects } from 'content-collections';
import type { PostSummary, ProjectSummary } from './content-types';
import { effectiveStatus } from './projects';

/**
 * Every project, in content-collections order, without its MDX or HTML. Metrics are as written:
 * pages that show them pass the list through `withGitHubStats` (lib/github.ts), which fills the
 * "github" values or drops them.
 */
export function projectSummaries(today?: string): ProjectSummary[] {
  return allProjects.map((p) => ({
    slug: p.slug,
    url: p.url,
    title: p.title,
    summary: p.summary,
    date: p.date,
    status: effectiveStatus(p.status, p.release_date, today),
    ...(p.release_date ? { releaseDate: p.release_date } : {}),
    featured: p.featured,
    ...(p.featured_rank ? { featuredRank: p.featured_rank } : {}),
    tags: p.tags,
    tech: p.tech,
    ...(p.github ? { github: p.github } : {}),
    ...(p.demo ? { demo: p.demo } : {}),
    ...(p.hero ? { hero: p.hero } : {}),
    ...(p.coverText ? { coverText: p.coverText } : {}),
    ...(p.audience ? { audience: p.audience } : {}),
    metrics: p.metrics,
    links: p.links,
  }));
}

/** Published posts, in content-collections order, without their MDX or HTML. */
export function postSummaries(): PostSummary[] {
  return allBlogs
    .filter((b) => b.status === 'published')
    .map((b) => ({
      slug: b.slug,
      url: b.url,
      title: b.title,
      summary: b.summary,
      date: b.date,
      tags: b.tags,
      readingTime: b.readingTime,
    }));
}
