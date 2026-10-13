import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import Link from 'next/link';
import { allBlogs } from 'content-collections';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPortfolioConfig } from '@/config/portfolio.config';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { ReadingProgress } from '@/components/blog/ReadingProgress';
import { CodeCopyButton } from '@/components/blog/CodeCopyButton';
import { EscKeyHandler } from '@/components/blog/EscKeyHandler';
import { FramedPageLayout } from '@/components/layout/FramedPageLayout';
import { Admonition, Terminal, Window, Key, Figure, Collapsible, PostAudio } from '@/components/mdx';
import { CodeBlock, InlineCode } from '@/components/mdx/Code';
import { AutoPostAudio } from '@/components/blog/AutoPostAudio';
import { getBlogAudioPath } from '@/lib/audio-utils';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';

/**
 * A post's narration is public/audio/blog/<slug>.mp3 (a CDN serves a copy of that tree), so the
 * page renders the player itself: found in the browser after load, it pushed the article down
 * (CLS 0.22 on phones; docs/PORTFOLIO_V2_SPEC.md phase 6). A post without a local file keeps the
 * browser's check, for audio kept only on a CDN.
 */
function hasLocalAudio(slug: string): boolean {
  return fs.existsSync(path.join(process.cwd(), 'public', 'audio', 'blog', `${slug}.mp3`));
}

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Generate metadata for blog post pages
 * Provides SEO-optimized title, description, and Open Graph tags
 */
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = allBlogs.find((b) => b.slug === slug);

  if (!blog) {
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    title: blog.title,
    description: blog.summary,
    keywords: blog.tags,
    authors: [{ name: getPortfolioConfig().seo.author }],
    openGraph: {
      title: blog.title,
      description: blog.summary,
      type: 'article',
      url: `${siteUrl}${blog.url}`,
      // The image comes from ./opengraph-image.tsx, or the post's own cover when it has one
      ...(blog.cover ? { images: [{ url: blog.cover, alt: blog.title }] } : {}),
      publishedTime: blog.date,
      modifiedTime: blog.updated || blog.date,
      tags: blog.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.summary,
      ...(blog.cover ? { images: [blog.cover] } : {}),
    },
  };
}

/**
 * Blog Post Detail Page
 * Renders individual blog posts from content-collections
 * Displays compiled MDX with theme-aware styling
 *
 * Route: /blog/[slug]
 */
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const blog = allBlogs.find((b) => b.slug === slug);

  if (!blog) {
    notFound();
  }

  return (
    <>
      <ReadingProgress />
      <CodeCopyButton />
      <EscKeyHandler returnPath="/blog" />

      <FramedPageLayout>
        {/* Header with back button */}
        <div
          className="border-b-2 py-4 px-4 sm:px-6"
          style={{
            borderColor: 'var(--theme-border)',
            backgroundColor: 'var(--theme-surface)',
            color: 'var(--theme-text)',
          }}
        >
        <div className="max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/blog"
            className="flex items-center gap-2 px-3 py-1 border-2 hover:bg-opacity-10 focus-visible:bg-opacity-10 transition-colors"
            style={{
              borderColor: 'var(--theme-border)',
              color: 'var(--theme-text)',
            }}
          >
            ← Back
          </Link>

          <span
            className="text-sm lg:text-xs"
            style={{ color: 'rgba(var(--theme-text-rgb), 0.72)' }}
          >
            {blog.readingTime}
          </span>
        </div>
      </div>

      {/* Article content */}
      <article className="py-8 sm:py-12 px-4 sm:px-6 md:px-8">
        <div
          className="max-w-[720px]"
          style={{ margin: '0 auto' }}
        >
          {/* Audio Player */}
          {hasLocalAudio(blog.slug) ? (
            <PostAudio src={getBlogAudioPath(blog.slug)} title={`Listen to "${blog.title}"`} postSlug={blog.slug} className="mb-10" />
          ) : (
            <AutoPostAudio slug={blog.slug} title={blog.title} className="mb-10" />
          )}

          {/* Title and metadata */}
          <header className="mb-12 pb-8 border-b-2" style={{ borderColor: 'var(--theme-border)' }}>
            <h1
              className="text-3xl font-bold mb-8"
              style={{ color: 'var(--accent-text)' }}
            >
              {blog.title}
            </h1>

            <p
              className="text-lg mb-12"
              style={{ color: 'rgba(var(--theme-text-rgb), 0.72)' }}
            >
              {blog.summary}
            </p>

            <div className="flex items-center gap-4 text-sm flex-wrap">
              <time style={{ color: 'rgba(var(--theme-text-rgb), 0.72)' }}>
                {formatDate(blog.date)}
              </time>

              {blog.updated && blog.updated !== blog.date && (
                <>
                  <span style={{ color: 'rgba(var(--theme-text-rgb), 0.72)' }}>•</span>
                  <span style={{ color: 'rgba(var(--theme-text-rgb), 0.72)' }}>
                    Updated {formatDate(blog.updated)}
                  </span>
                </>
              )}

              <span style={{ color: 'rgba(var(--theme-text-rgb), 0.72)' }}>•</span>
              <span style={{ color: 'rgba(var(--theme-text-rgb), 0.72)' }}>
                {blog.readingTime}
              </span>
            </div>
          </header>

          {/* MDX Content */}
          <div className="blog-prose">
            <MDXRemote
              source={blog.content}
              components={{
                pre: CodeBlock,
                code: (props) => {
                  // Check if this code is inside a pre (fenced block)
                  // If so, return plain code without InlineCode styling
                  if ('className' in props && typeof props.className === 'string' && props.className.includes('language-')) {
                    return <code {...props} />;
                  }
                  // Otherwise, it's inline code - use InlineCode styling
                  return <InlineCode {...props} />;
                },
                a: (props) => {
                  const href = props.href || '';
                  const isExternal = href.startsWith('http://') || href.startsWith('https://');

                  if (isExternal) {
                    return <a {...props} target="_blank" rel="noopener noreferrer" />;
                  }
                  return <a {...props} />;
                },
                Admonition,
                Terminal,
                Window,
                Key,
                Figure,
                Collapsible,
                PostAudio,
              }}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [
                    rehypeSlug, // Keep for heading IDs (allows direct linking)
                  ],
                },
              }}
            />
          </div>

          {/* Footer navigation */}
          <footer className="mt-12 pt-8 border-t-2" style={{ borderColor: 'var(--theme-border)' }}>
            <Link
              href="/blog"
              className="inline-flex items-center min-h-11 hover:underline focus-visible:underline"
              style={{ color: 'var(--accent-text)' }}
            >
              ← Back to Blog
            </Link>
          </footer>
        </div>
      </article>
      </FramedPageLayout>
    </>
  );
}

/**
 * Format date to readable string
 */
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * ISR Configuration
 * Revalidate blog posts once per day (86400 seconds)
 */
export const revalidate = 86400;

/**
 * Generate static params for all blog posts
 * Enables static generation at build time
 */
export function generateStaticParams() {
  return allBlogs.map((blog) => ({
    slug: blog.slug,
  }));
}
