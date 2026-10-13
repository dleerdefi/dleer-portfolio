import { describe, expect, it } from 'vitest';
import { projectSchema } from '@/lib/content-schema';
import { extractCoverText } from '@/lib/cover-text';
import { stripMargin } from '@/lib/terminal-text';

const base = { title: 'T', slug: 't', summary: 's', date: '2026-10-01' };

describe('project frontmatter', () => {
  it('builds a file without any phase 3 field', () => {
    const p = projectSchema.parse(base);
    expect(p.status).toBe('production');
    expect(p.metrics).toEqual([]);
    expect(p.links).toEqual([]);
    expect(p.featured_rank).toBeUndefined();
  });

  it('requires release_date while coming-soon', () => {
    const missing = projectSchema.safeParse({ ...base, status: 'coming-soon' });
    expect(missing.success).toBe(false);
    expect(missing.error?.issues[0].path).toEqual(['release_date']);
    expect(projectSchema.safeParse({ ...base, status: 'coming-soon', release_date: '2026-10-16' }).success).toBe(true);
  });

  it('wants release_date as YYYY-MM-DD', () => {
    expect(projectSchema.safeParse({ ...base, status: 'coming-soon', release_date: 'Oct 16' }).success).toBe(false);
  });

  it('keeps metric values as strings and allows at most three', () => {
    const p = projectSchema.parse({ ...base, metrics: [{ label: 'skills', value: 14 }, { label: 'stars', value: 'github' }] });
    expect(p.metrics).toEqual([{ label: 'skills', value: '14' }, { label: 'stars', value: 'github' }]);
    const four = Array.from({ length: 4 }, (_, i) => ({ label: `m${i}`, value: '1' }));
    expect(projectSchema.safeParse({ ...base, metrics: four }).success).toBe(false);
  });

  it('takes links as URLs or site paths, and rejects a rank below 1', () => {
    expect(projectSchema.safeParse({ ...base, links: [{ label: 'GitHub', url: 'github' }] }).success).toBe(false);
    expect(projectSchema.safeParse({ ...base, links: [{ label: 'Live', url: '/lab' }, { label: 'Repo', url: 'https://github.com/a/b' }] }).success).toBe(true);
    expect(projectSchema.safeParse({ ...base, featured_rank: 0 }).success).toBe(false);
  });
});

describe('cover text', () => {
  it('takes the first Terminal diagram, trimmed', () => {
    const mdx = 'Intro\n\n<Terminal cmd="system architecture">\n\n┌──┐\n│ a│   \n└──┘\n\n</Terminal>\n\n```python\nx = 1\n```';
    expect(extractCoverText(mdx)).toEqual({ title: 'system architecture', lines: ['┌──┐', '│ a│', '└──┘'] });
  });

  it('reads a Terminal diagram written with a | margin, its indentation kept', () => {
    const mdx = 'Intro\n\n<Terminal cmd="the data path">{`\n|home    bucket\n|   ── PUT ──►\n|\n|        ▼\n`}</Terminal>\n';
    expect(extractCoverText(mdx)).toEqual({ title: 'the data path', lines: ['home    bucket', '   ── PUT ──►', '', '        ▼'] });
  });

  it('falls back to the first code block, and caps the lines', () => {
    const body = Array.from({ length: 20 }, (_, i) => `line ${i}`).join('\n');
    const cover = extractCoverText(`Text\n\n\`\`\`python\n${body}\n\`\`\`\n`);
    expect(cover?.title).toBe('python');
    expect(cover?.lines).toHaveLength(12);
  });

  it('is undefined without either', () => {
    expect(extractCoverText('Just prose.')).toBeUndefined();
  });
});

describe('terminal margin', () => {
  it('drops the | margin and keeps everything after it', () => {
    expect(stripMargin('\n|a    b\n|   c\n|\n|  d\n')).toBe('a    b\n   c\n\n  d');
  });

  it('leaves text without a margin alone', () => {
    expect(stripMargin('plain\noutput')).toBeNull();
    expect(stripMargin('|a\nb')).toBeNull();
  });
});
