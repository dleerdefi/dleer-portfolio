import 'server-only';
import { allBlogs, allProjects } from 'content-collections';
import type { ContentIndex, PostSummary, ProjectSummary } from './content-types';

/** Every project, in content-collections order, without its MDX or HTML. */
export function projectSummaries(): ProjectSummary[] {
  return allProjects.map((p) => ({
    slug: p.slug,
    url: p.url,
    title: p.title,
    summary: p.summary,
    date: p.date,
    status: p.status,
    featured: p.featured,
    tags: p.tags,
    tech: p.tech,
    ...(p.github ? { github: p.github } : {}),
    ...(p.demo ? { demo: p.demo } : {}),
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

export function contentIndex(): ContentIndex {
  return { projects: projectSummaries(), posts: postSummaries() };
}
