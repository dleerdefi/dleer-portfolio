import React from 'react';
import Link from 'next/link';
import { allProjects } from 'content-collections';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { EscKeyHandler } from '@/components/blog/EscKeyHandler';
import { FramedPageLayout } from '@/components/layout/FramedPageLayout';
import { Admonition, Terminal, Window, Key, Figure } from '@/components/mdx';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';

interface ProjectDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Generate metadata for project pages
 * Provides SEO-optimized title, description, and Open Graph tags
 */
export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = allProjects.find((p) => p.slug === slug);

  if (!project) {
    return {
      title: 'Project Not Found',
      description: 'The requested project could not be found.',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const ogImage = project.cover || `${siteUrl}/og-image.png`;

  return {
    title: project.title,
    description: project.summary,
    keywords: project.tags,
    authors: [{ name: 'Your Name' }],
    openGraph: {
      title: project.title,
      description: project.summary,
      type: 'website',
      url: `${siteUrl}${project.url}`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.summary,
      images: [ogImage],
    },
  };
}

/**
 * Project Detail Page
 * Renders individual projects from content-collections
 * Displays compiled MDX with theme-aware styling
 *
 * Route: /projects/[slug]
 */
export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = allProjects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <>
      <EscKeyHandler returnPath="/projects" />
      <FramedPageLayout>
        {/* Header with back button */}
        <div
          className="border-b-2 py-4 px-4 sm:px-6 font-mono"
          style={{
            borderColor: 'var(--theme-border)',
            backgroundColor: 'var(--theme-surface)',
            color: 'var(--theme-text)',
          }}
        >
        <div className="max-w-full sm:max-w-3xl md:max-w-4xl lg:max-w-5xl flex items-center justify-between" style={{ margin: '0 auto' }}>
          <Link
            href="/projects"
            className="flex items-center gap-2 px-3 py-1 border-2 hover:bg-opacity-10 transition-colors"
            style={{
              borderColor: 'var(--theme-border)',
              color: 'var(--theme-text)',
            }}
          >
            ← Back
          </Link>

          {/* Status Badge */}
          <span
            className="text-xs px-2 py-1 border"
            style={{
              borderColor: getStatusColor(project.status),
              color: getStatusColor(project.status),
            }}
          >
            {project.status.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Project content */}
      <article className="py-8 sm:py-12 px-4 sm:px-6 md:px-8">
        <div className="max-w-[720px]" style={{ margin: '0 auto' }}>
          {/* Title and metadata */}
          <header className="mt-8 pb-8 border-b-2" style={{ borderColor: 'var(--theme-border)' }}>
            <h1
              className="text-3xl font-bold mb-8"
              style={{ color: 'var(--accent-color)' }}
            >
              {project.title}
            </h1>

            <p
              className="text-lg mb-6"
              style={{ color: 'var(--theme-text-dimmed)' }}
            >
              {project.summary}
            </p>

            {/* Date */}
            <div className="flex items-center gap-4 text-sm mb-6 flex-wrap">
              <time style={{ color: 'var(--theme-text-dimmed)' }}>
                {formatDate(project.date)}
              </time>

              {project.updated && project.updated !== project.date && (
                <>
                  <span style={{ color: 'var(--theme-text-dimmed)' }}>•</span>
                  <span style={{ color: 'var(--theme-text-dimmed)' }}>
                    Updated {formatDate(project.updated)}
                  </span>
                </>
              )}

              <span style={{ color: 'var(--theme-text-dimmed)' }}>•</span>
              <span style={{ color: 'var(--theme-text-dimmed)' }}>
                {project.readingTime}
              </span>
            </div>

            {/* Tech Stack with inline GitHub icon */}
            {(project.tech.length > 0 || project.github) && (
              <div className="mb-6 flex items-start justify-between gap-4">
                {/* Left: Tech Stack */}
                {project.tech.length > 0 && (
                  <div className="flex-1">
                    <span
                      className="text-sm font-bold block mb-3"
                      style={{ color: 'var(--theme-text)' }}
                    >
                      Tech Stack:
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="text-sm px-2 py-1 border"
                          style={{
                            borderColor: 'var(--theme-border)',
                            color: 'var(--theme-text)',
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Right: GitHub Icon */}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-70 transition-opacity flex-shrink-0"
                    aria-label="View on GitHub"
                    style={{ marginTop: '2px' }}
                  >
                    <svg width="24" height="24" fill="var(--theme-text)" viewBox="0 0 16 16">
                      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                    </svg>
                  </a>
                )}
              </div>
            )}
          </header>

          {/* MDX Content */}
          <div className="blog-prose">
            <MDXRemote
              source={project.content}
              components={{
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
                    rehypeSlug, // Keep for heading IDs (allows direct linking)
                    rehypeHighlight,
                  ],
                },
              }}
            />
          </div>

          {/* Footer navigation */}
          <footer className="mt-12 pt-8 border-t-2" style={{ borderColor: 'var(--theme-border)' }}>
            <Link
              href="/projects"
              className="hover:underline"
              style={{ color: 'var(--accent-color)' }}
            >
              ← Back to Projects
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
 * Get status-appropriate color
 */
function getStatusColor(status: string): string {
  switch (status) {
    case 'production':
      return 'var(--theme-success)';
    case 'beta':
      return 'var(--theme-info)';
    case 'development':
      return 'var(--theme-warning)';
    case 'concept':
      return 'var(--theme-text-dimmed)';
    default:
      return 'var(--theme-text)';
  }
}

/**
 * ISR Configuration
 * Revalidate projects once per day (86400 seconds)
 */
export const revalidate = 86400;

/**
 * Generate static params for all projects
 * Enables static generation at build time
 */
export function generateStaticParams() {
  return allProjects.map((project) => ({
    slug: project.slug,
  }));
}
