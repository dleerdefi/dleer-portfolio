import Link from 'next/link';
import type { Metadata } from 'next';
import { FramedPageLayout } from '@/components/layout/FramedPageLayout';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { ProjectsKeys } from '@/components/projects/ProjectsKeys';
import { projectSummaries } from '@/lib/content-index';
import { withGitHubStats } from '@/lib/github';
import { orderedProjects } from '@/lib/projects';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'What I build, and who it is for.',
};

// Rebuilt daily so the GitHub numbers stay fresh (lib/github.ts)
export const revalidate = 86400;

const CARD_SIZES = '(min-width: 1200px) 380px, (min-width: 720px) 50vw, 100vw';

/**
 * /projects: every project as a card (docs/PORTFOLIO_V2_SPEC.md §4.4), the featured three first,
 * then the rest newest first. Server-rendered; only the keys are a client island.
 */
export default async function ProjectsPage() {
  const projects = orderedProjects(await withGitHubStats(projectSummaries()));
  return (
    <FramedPageLayout autoFocus={false}>
      <ProjectsKeys />
      <div className="projects-page">
        <header className="projects-head">
          <div>
            <h1>Projects</h1>
            <p>What I build, and who it is for.</p>
          </div>
          <div className="projects-head-side">
            <span className="key-hints">j/k move · Enter open · Esc back</span>
            <Link href="/" className="projects-close" aria-label="Close and return home">
              ✕
            </Link>
          </div>
        </header>
        <div className="projects-grid">
          {projects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} sizes={CARD_SIZES} priority={i === 0} />
          ))}
        </div>
        <p className="projects-foot">
          {projects.length} project{projects.length === 1 ? '' : 's'}
        </p>
      </div>
    </FramedPageLayout>
  );
}
