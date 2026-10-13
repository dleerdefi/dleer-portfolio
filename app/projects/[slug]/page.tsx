import Link from 'next/link';
import { allProjects } from 'content-collections';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPortfolioConfig } from '@/config/portfolio.config';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { LinkRow } from '@/components/projects/LinkRow';
import { MetricsRow } from '@/components/projects/MetricsRow';
import { ProjectCover } from '@/components/projects/ProjectCover';
import { StatusChip } from '@/components/projects/StatusChip';
import { projectSummaries } from '@/lib/content-index';
import { withGitHubStats } from '@/lib/github';
import { nextProject } from '@/lib/projects';
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

  return {
    title: project.title,
    description: project.summary,
    keywords: project.tags,
    authors: [{ name: getPortfolioConfig().seo.author }],
    openGraph: {
      title: project.title,
      description: project.summary,
      type: 'website',
      url: `${siteUrl}${project.url}`,
      // The image comes from ./opengraph-image.tsx, or the project's own cover when it has one
      ...(project.cover ? { images: [{ url: project.cover, alt: project.title }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.summary,
      ...(project.cover ? { images: [project.cover] } : {}),
    },
  };
}

// The hero image's width: the case study's column
const HERO_SIZES = '(min-width: 800px) 760px, 100vw';

/**
 * A project as a case study (docs/PORTFOLIO_V2_SPEC.md §4.4): the hero image when it has one, the
 * title and who it is for, the summary, the numbers, the links, the stack, the story (its MDX),
 * then the next project. Rebuilt daily (ISR), which keeps the GitHub numbers fresh and turns a
 * coming-soon project to production on its release date.
 *
 * Route: /projects/[slug]
 */
export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const doc = allProjects.find((p) => p.slug === slug);
  if (!doc) notFound();

  const projects = await withGitHubStats(projectSummaries());
  const project = projects.find((p) => p.slug === slug)!;
  const next = nextProject(projects, slug);

  return (
    <>
      <EscKeyHandler returnPath="/projects" />
      <FramedPageLayout>
        <article className="case">
          <div className="case-bar">
            <Link href="/projects">← all projects</Link>
            <StatusChip status={project.status} releaseDate={project.releaseDate} />
          </div>

          {project.hero && (
            <div className="case-hero">
              <ProjectCover project={project} sizes={HERO_SIZES} priority />
            </div>
          )}

          <header>
            <h1 className="case-title">{project.title}</h1>
            {project.audience && <p className="case-audience">For {project.audience}</p>}
            <p className="case-summary">{project.summary}</p>
            <MetricsRow metrics={project.metrics} pushedAt={project.pushedAt} />
            <LinkRow project={project} />
            {project.tech.length > 0 && (
              <ul className="case-tech" aria-label="Stack">
                {project.tech.map((tech) => (
                  <li key={tech} className="chip">
                    {tech}
                  </li>
                ))}
              </ul>
            )}
          </header>

          <div className="case-body blog-prose">
            <MDXRemote
              source={doc.content}
              components={{ Admonition, Terminal, Window, Key, Figure }}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [rehypeSlug, rehypeHighlight],
                },
              }}
            />
          </div>

          <footer className="case-foot">
            <Link href="/projects">← all projects</Link>
            {next && (
              <Link href={next.url} className="case-next">
                <span>next project</span>
                {next.title} →
              </Link>
            )}
          </footer>
        </article>
      </FramedPageLayout>
    </>
  );
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
