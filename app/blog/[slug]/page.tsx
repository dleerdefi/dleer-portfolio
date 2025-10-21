import React from 'react';
import Link from 'next/link';
import { allBlogs } from 'content-collections';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { ReadingProgress } from '@/components/blog/ReadingProgress';
import { CodeCopyButton } from '@/components/blog/CodeCopyButton';
import { EscKeyHandler } from '@/components/blog/EscKeyHandler';
import { FramedPageLayout } from '@/components/layout/FramedPageLayout';
import { Admonition, Terminal, Window, Key, Figure } from '@/components/mdx';
import { CodeBlock, InlineCode } from '@/components/mdx/Code';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

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
      <article className="py-8 sm:py-12 px-4 sm:px-6 md:px-8">
        <div
          className="max-w-[720px]"
          style={{ margin: '0 auto' }}
        >
          {/* Title and metadata */}
          <header className="mb-12 pb-8 border-b-2" style={{ borderColor: 'var(--theme-border)' }}>
            <h1
              className="text-3xl font-bold mb-8"
              style={{ color: 'var(--accent-color)' }}
            >
              {blog.title}
            </h1>

            <p
              className="text-lg mb-12"
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

              <span style={{ color: 'var(--theme-text-dimmed)' }}>•</span>
              <span style={{ color: 'var(--theme-text-dimmed)' }}>
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
                Admonition,
                Terminal,
                Window,
                Key,
                Figure,
              }}
              options={{
                mdxOptions: {
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
                  ],
                },
              }}
            />
          </div>

          {/* Footer navigation */}
          <footer className="mt-12 pt-8 border-t-2" style={{ borderColor: 'var(--theme-border)' }}>
            <Link
              href="/blog"
              className="hover:underline"
              style={{ color: 'var(--accent-color)' }}
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
