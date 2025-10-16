import React from 'react';
import Link from 'next/link';
import { allBlogs } from 'content-collections';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ReadingProgress } from '@/components/blog/ReadingProgress';
import { CodeCopyButton } from '@/components/blog/CodeCopyButton';
import { ScrollReveal } from '@/components/blog/ScrollReveal';

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
  const ogImage = blog.cover || `${siteUrl}/og-image.png`;

  return {
    title: blog.title,
    description: blog.summary,
    keywords: blog.tags,
    authors: [{ name: 'Your Name' }],
    openGraph: {
      title: blog.title,
      description: blog.summary,
      type: 'article',
      url: `${siteUrl}${blog.url}`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
      publishedTime: blog.date,
      modifiedTime: blog.updated || blog.date,
      tags: blog.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.summary,
      images: [ogImage],
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
      <ScrollReveal />

      <div
        className="min-h-screen"
        style={{
          backgroundColor: 'var(--theme-bg)',
          color: 'var(--theme-text)',
        }}
      >
        {/* Header with back button */}
      <div
        className="border-b-2 py-4 px-6"
        style={{
          borderColor: 'var(--theme-border)',
          backgroundColor: 'var(--theme-surface)',
        }}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/blog-zen"
            className="flex items-center gap-2 px-3 py-1 border-2 hover:bg-opacity-10 transition-colors"
            style={{
              borderColor: 'var(--theme-border)',
              color: 'var(--theme-text)',
            }}
          >
            ← Back
          </Link>

          <span
            className="text-xs"
            style={{ color: 'var(--theme-text-dimmed)' }}
          >
            {blog.readingTime}
          </span>
        </div>
      </div>

      {/* Article content */}
      <article className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Title and metadata */}
          <header className="mb-8 pb-8 border-b-2" style={{ borderColor: 'var(--theme-border)' }}>
            <h1
              className="text-3xl font-bold mb-4"
              style={{ color: 'var(--accent-color)' }}
            >
              {blog.title}
            </h1>

            <p
              className="text-lg mb-4"
              style={{ color: 'var(--theme-text-dimmed)' }}
            >
              {blog.summary}
            </p>

            <div className="flex items-center gap-4 text-sm flex-wrap">
              <time style={{ color: 'var(--theme-text-dimmed)' }}>
                {formatDate(blog.date)}
              </time>

              {blog.updated && blog.updated !== blog.date && (
                <>
                  <span style={{ color: 'var(--theme-text-dimmed)' }}>•</span>
                  <span style={{ color: 'var(--theme-text-dimmed)' }}>
                    Updated {formatDate(blog.updated)}
                  </span>
                </>
              )}

              {blog.series && (
                <>
                  <span style={{ color: 'var(--theme-text-dimmed)' }}>•</span>
                  <span
                    className="px-2 py-0.5 border"
                    style={{
                      borderColor: 'var(--accent-color)',
                      color: 'var(--accent-color)',
                    }}
                  >
                    Series: {blog.series}
                  </span>
                </>
              )}
            </div>

            {/* Tags */}
            {blog.tags.length > 0 && (
              <div className="flex items-center gap-2 mt-4 flex-wrap">
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 border"
                    style={{
                      borderColor: 'var(--theme-border)',
                      color: 'var(--theme-text-dimmed)',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* MDX Content */}
          <div
            className="blog-prose"
            dangerouslySetInnerHTML={{ __html: blog.html }}
          />

          {/* Footer navigation */}
          <footer className="mt-12 pt-8 border-t-2" style={{ borderColor: 'var(--theme-border)' }}>
            <Link
              href="/blog-zen"
              className="flex items-center gap-2 px-4 py-2 border-2 hover:bg-opacity-10 transition-colors"
              style={{
                borderColor: 'var(--accent-color)',
                color: 'var(--accent-color)',
              }}
            >
              ← Back to Blog List
            </Link>
          </footer>
        </div>
      </article>
      </div>
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
