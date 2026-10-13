import { describe, expect, it } from 'vitest';
import type { ProjectSummary } from '@/lib/content-types';
import { effectiveStatus, featuredProjects, nextProject, orderedProjects, relativeTime, shortDate } from '@/lib/projects';

const p = (slug: string, date: string, extra: Partial<ProjectSummary> = {}): ProjectSummary => ({
  slug, url: `/projects/${slug}`, title: slug, summary: '', date, status: 'production', featured: false,
  tags: [], tech: [], metrics: [], links: [], ...extra,
});

describe('effectiveStatus', () => {
  it('turns coming-soon into production on the release date', () => {
    expect(effectiveStatus('coming-soon', '2026-10-16', '2026-10-15')).toBe('coming-soon');
    expect(effectiveStatus('coming-soon', '2026-10-16', '2026-10-16')).toBe('production');
    expect(effectiveStatus('development', '2026-10-16', '2026-12-01')).toBe('development');
  });
});

describe('featured order', () => {
  const projects = [
    p('old-flagged', '2024-01-01', { featured: true }),
    p('rank-2', '2025-01-01', { featuredRank: 2 }),
    p('newest', '2026-09-01'),
    p('rank-4', '2025-02-01', { featuredRank: 4 }),
    p('rank-1', '2023-01-01', { featuredRank: 1 }),
  ];

  it('ranks first, then the old flag, then the newest', () => {
    expect(featuredProjects(projects).map((x) => x.slug)).toEqual(['rank-1', 'rank-2', 'rank-4']);
    expect(featuredProjects(projects, 5).map((x) => x.slug)).toEqual(['rank-1', 'rank-2', 'rank-4', 'old-flagged', 'newest']);
  });

  it('lists the featured three, then the rest newest first, and wraps next', () => {
    expect(orderedProjects(projects).map((x) => x.slug)).toEqual(['rank-1', 'rank-2', 'rank-4', 'newest', 'old-flagged']);
    expect(nextProject(projects, 'rank-4')?.slug).toBe('newest');
    expect(nextProject(projects, 'old-flagged')?.slug).toBe('rank-1');
    expect(nextProject(projects, 'missing')).toBeUndefined();
  });
});

describe('dates', () => {
  it('formats a release date and a relative time', () => {
    expect(shortDate('2026-10-16')).toBe('Oct 16');
    const now = Date.parse('2026-10-13T12:00:00Z');
    expect(relativeTime('2026-10-13T08:00:00Z', now)).toBe('today');
    expect(relativeTime('2026-10-12T08:00:00Z', now)).toBe('1 day ago');
    expect(relativeTime('2026-08-01T00:00:00Z', now)).toBe('2 months ago');
    expect(relativeTime('2024-09-01T00:00:00Z', now)).toBe('2 years ago');
  });
});
