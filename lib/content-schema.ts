import { z } from 'zod';

/**
 * The project frontmatter (docs/PORTFOLIO_V2_SPEC.md §4.4), used by content-collections.ts and
 * tested in tests/content/project-schema.test.ts. Every field phase 3 added is optional, so the
 * existing files keep building.
 */
export const PROJECT_STATUSES = ['concept', 'development', 'beta', 'coming-soon', 'production'] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'a date as YYYY-MM-DD');

export const projectSchema = z
  .object({
    title: z.string(),
    slug: z.string(),
    summary: z.string(),
    date: z.string(), // YYYY-MM-DD
    updated: z.string().optional(),
    tags: z.array(z.string()).default([]),
    tech: z.array(z.string()).default([]),
    /** The Open Graph image; without it the project gets a generated card */
    cover: z.string().optional(),
    status: z.enum(PROJECT_STATUSES).default('production'),
    /** Required while `coming-soon`: the chip reads "coming <date>", and from that day "production" */
    release_date: isoDate.optional(),
    github: z.string().url().optional(),
    demo: z.string().url().optional(),
    /** Older flag: featured after the ranked projects */
    featured: z.boolean().default(false),
    /** 1, 2, 3: the home page's featured cards, in this order; 4 and up stand in when one is missing */
    featured_rank: z.number().int().min(1).optional(),
    /** 16:9, at least 1600 px wide: the card's cover and the page's hero */
    hero: z.string().optional(),
    /** At most three; the card shows the first. A value of "github" is filled from the GitHub API */
    metrics: z
      .array(z.object({ label: z.string(), value: z.union([z.string(), z.number()]).transform(String) }))
      .max(3)
      .default([]),
    /** The project page's link row, in order: full URLs, or paths on this site such as /lab */
    links: z.array(z.object({ label: z.string(), url: z.string().regex(/^(\/[^/]|https?:\/\/)/, 'a URL or a path on this site') })).default([]),
    /** One phrase: who it is for */
    audience: z.string().optional(),
  })
  .superRefine((project, ctx) => {
    if (project.status === 'coming-soon' && !project.release_date) {
      ctx.addIssue({ code: 'custom', path: ['release_date'], message: 'release_date is required while status is coming-soon' });
    }
  });

export type ProjectFrontmatter = z.output<typeof projectSchema>;
