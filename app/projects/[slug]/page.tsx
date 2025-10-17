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
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
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
        <div className="max-w-full sm:max-w-3xl md:max-w-4xl lg:max-w-5xl" style={{ margin: '0 auto' }}>
          {/* Title and metadata */}
          <header className="mb-8 pb-8 border-b-2" style={{ borderColor: 'var(--theme-border)' }}>
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1
                className="text-3xl font-bold flex-1"
                style={{ color: 'var(--accent-color)' }}
              >
                {project.title}
                {project.featured && (
                  <span
                    className="ml-3 text-sm px-2 py-1 border"
                    style={{
                      borderColor: 'var(--accent-color)',
                      color: 'var(--accent-color)',
                    }}
                  >
                    Featured
                  </span>
                )}
              </h1>
            </div>

            <p
              className="text-lg mb-4"
              style={{ color: 'var(--theme-text-dimmed)' }}
            >
              {project.summary}
            </p>

            {/* Date */}
            <div className="flex items-center gap-4 text-sm mb-4 flex-wrap">
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

            {/* Tech Stack */}
            {project.tech.length > 0 && (
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span
                  className="text-sm font-bold"
                  style={{ color: 'var(--theme-text)' }}
                >
                  Tech Stack:
                </span>
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
            )}

            {/* External Links */}
            {(project.github || project.demo) && (
              <div className="flex items-center gap-4 mb-4">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-1 border-2 hover:bg-opacity-10 transition-colors"
                    style={{
                      borderColor: 'var(--accent-color)',
                      color: 'var(--accent-color)',
                    }}
                  >
                    GitHub →
                  </a>
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-1 border-2 hover:bg-opacity-10 transition-colors"
                    style={{
                      borderColor: 'var(--accent-color)',
                      color: 'var(--accent-color)',
                    }}
                  >
                    Live Demo →
                  </a>
                )}
              </div>
            )}

            {/* Tags */}
            {project.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 border"
                    style={{
                      borderColor: 'var(--theme-border)',
                      color: 'var(--theme-text-dimmed)',
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* MDX Content */}
          <div
            className="prose prose-invert max-w-none"
            style={{
              color: 'var(--theme-text)',
            }}
          >
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
              className="flex items-center gap-2 px-4 py-2 border-2 hover:bg-opacity-10 transition-colors"
              style={{
                borderColor: 'var(--accent-color)',
                color: 'var(--accent-color)',
              }}
            >
              ← Back to Projects List
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
