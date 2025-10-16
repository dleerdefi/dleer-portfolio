import { defineCollection, defineConfig } from '@content-collections/core';
import { compileMarkdown } from '@content-collections/markdown';
import readingTime from 'reading-time';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeHighlight from 'rehype-highlight';
import { z } from 'zod';

/**
 * Blog post schema using Zod (StandardSchema compliant)
 */
const blogSchema = z.object({
  title: z.string(),
  slug: z.string(),
  summary: z.string(),
  date: z.string(), // YYYY-MM-DD format
  updated: z.string().optional(), // YYYY-MM-DD format
  tags: z.array(z.string()).default([]),
  cover: z.string().optional(), // CDN URL or relative path
  status: z.enum(['draft', 'published']).default('published'),
  series: z.string().optional(), // Series name for related posts
});

/**
 * Blog post collection schema
 * MDX files located in /content/blog/**\/index.mdx
 */
const blog = defineCollection({
  name: 'blog',
  directory: 'content/blog',
  include: '**/*.mdx',
  schema: blogSchema,
  transform: async (document, context) => {
    const html = await compileMarkdown(context, document, {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: 'wrap',
            properties: {
              className: ['heading-anchor'],
            },
          },
        ],
        rehypeHighlight, // Syntax highlighting for code blocks
      ],
    });

    // Calculate reading time
    const readingTimeResult = readingTime(document.content);

    return {
      ...document,
      html,
      url: `/blog/${document.slug}`,
      readingTime: readingTimeResult.text,
      readingMinutes: Math.ceil(readingTimeResult.minutes),
      // Generate OG title (max 60 chars for social media)
      ogTitle: document.title.length > 60
        ? `${document.title.substring(0, 57)}...`
        : document.title,
    };
  },
});

/**
 * Project schema using Zod (StandardSchema compliant)
 */
const projectSchema = z.object({
  title: z.string(),
  slug: z.string(),
  summary: z.string(),
  date: z.string(), // YYYY-MM-DD format
  updated: z.string().optional(),
  tags: z.array(z.string()).default([]),
  tech: z.array(z.string()).default([]), // Technology stack
  cover: z.string().optional(),
  status: z.enum(['concept', 'development', 'beta', 'production']).default('production'),
  github: z.string().url().optional(),
  demo: z.string().url().optional(),
  featured: z.boolean().default(false), // Highlight on homepage
});

/**
 * Project collection schema
 * MDX files located in /content/projects/**\/index.mdx
 */
const projects = defineCollection({
  name: 'projects',
  directory: 'content/projects',
  include: '**/*.mdx',
  schema: projectSchema,
  transform: async (document, context) => {
    const html = await compileMarkdown(context, document, {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: 'wrap',
            properties: {
              className: ['heading-anchor'],
            },
          },
        ],
        rehypeHighlight, // Syntax highlighting for code blocks
      ],
    });

    const readingTimeResult = readingTime(document.content);

    return {
      ...document,
      html,
      url: `/projects/${document.slug}`,
      readingTime: readingTimeResult.text,
      readingMinutes: Math.ceil(readingTimeResult.minutes),
      ogTitle: document.title.length > 60
        ? `${document.title.substring(0, 57)}...`
        : document.title,
    };
  },
});

export default defineConfig({
  collections: [blog, projects],
});
