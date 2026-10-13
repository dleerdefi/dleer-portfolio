import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ProjectSummary } from '@/lib/content-types';
import { clearGitHubCache, fmtCount, repoFromUrl, withGitHubStats } from '@/lib/github';

const project = (extra: Partial<ProjectSummary> = {}): ProjectSummary => ({
  slug: 'ccc', url: '/projects/ccc', title: 'C', summary: '', date: '2026-01-01', status: 'production', featured: false,
  tags: [], tech: [], links: [], github: 'https://github.com/dleerdefi/claude-code-construction',
  metrics: [{ label: 'skills', value: '14' }, { label: 'stars', value: 'github' }, { label: 'forks', value: 'github' }],
  ...extra,
});

const ok = (body: object) => new Response(JSON.stringify(body), { status: 200, headers: { 'content-type': 'application/json' } });

beforeEach(() => clearGitHubCache());
afterEach(() => vi.unstubAllGlobals());

describe('withGitHubStats', () => {
  it('fills stars and forks and sets the last push', async () => {
    const fetch = vi.fn().mockResolvedValue(ok({ stargazers_count: 1234, forks_count: 56, pushed_at: '2026-10-10T00:00:00Z' }));
    vi.stubGlobal('fetch', fetch);
    const [p] = await withGitHubStats([project()]);
    expect(p.metrics).toEqual([{ label: 'skills', value: '14' }, { label: 'stars', value: '1.2k' }, { label: 'forks', value: '56' }]);
    expect(p.pushedAt).toBe('2026-10-10T00:00:00Z');
    expect(fetch.mock.calls[0][0]).toBe('https://api.github.com/repos/dleerdefi/claude-code-construction');
  });

  it('drops the GitHub metrics on a 403 (rate limit), never a 0', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{"message":"API rate limit exceeded"}', { status: 403 })));
    const [p] = await withGitHubStats([project()]);
    expect(p.metrics).toEqual([{ label: 'skills', value: '14' }]);
    expect(p.pushedAt).toBeUndefined();
  });

  it('drops them on a network failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('fetch failed')));
    const [p] = await withGitHubStats([project()]);
    expect(p.metrics).toEqual([{ label: 'skills', value: '14' }]);
  });

  it('drops them without a repository, and fetches each repository once', async () => {
    const fetch = vi.fn().mockResolvedValue(ok({ stargazers_count: 3, forks_count: 0, pushed_at: '2026-10-10T00:00:00Z' }));
    vi.stubGlobal('fetch', fetch);
    const [a, b, c] = await withGitHubStats([project(), project({ slug: 'again' }), project({ github: undefined })]);
    expect(a.metrics.map((m) => m.value)).toEqual(['14', '3', '0']);
    expect(b.metrics.map((m) => m.value)).toEqual(['14', '3', '0']);
    expect(c.metrics).toEqual([{ label: 'skills', value: '14' }]);
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});

describe('helpers', () => {
  it('reads owner/repo from a URL and formats counts', () => {
    expect(repoFromUrl('https://github.com/dleerdefi/AgentCM')).toBe('dleerdefi/AgentCM');
    expect(repoFromUrl('https://github.com/a/b/tree/main/docs')).toBe('a/b');
    expect(repoFromUrl('https://gitlab.com/a/b')).toBeNull();
    expect([fmtCount(7), fmtCount(1000), fmtCount(1234), fmtCount(15400)]).toEqual(['7', '1k', '1.2k', '15k']);
  });
});
