import Link from 'next/link';
import type { ProjectSummary } from '@/lib/content-types';
import { relativeTime } from '@/lib/projects';
import { ProjectCover } from './ProjectCover';
import { StatusChip } from './StatusChip';

export { StatusChip };

/**
 * A project as a whole-card link (docs/PORTFOLIO_V2_SPEC.md §4.4): cover, path and status, title,
 * audience, one line, and its first number (or its stack). The accessible name is its text, title
 * first: the cover and the path row come after the title in the DOM and are drawn above it (CSS
 * order). /projects shows the covers; the home page's cards leave them out (`cover={false}`), so
 * the featured three and the rest fit the first screen.
 */
export function ProjectCard({
  project,
  sizes = '100vw',
  priority = false,
  cover = true,
}: {
  project: ProjectSummary;
  sizes?: string;
  priority?: boolean;
  cover?: boolean;
}) {
  const metric = project.metrics[0];
  const meta = [
    metric ? `${metric.value} ${metric.label}` : project.tech.slice(0, 3).join(' · '),
    project.pushedAt ? `updated ${relativeTime(project.pushedAt)}` : '',
  ].filter(Boolean);

  return (
    <Link href={project.url} className="project-card">
      <span className="project-card-title">{project.title}</span>
      <span className="project-card-top">
        <span className="project-card-path" aria-hidden="true">
          ~/projects/{project.slug}
        </span>
        <StatusChip status={project.status} releaseDate={project.releaseDate} />
      </span>
      {cover && <ProjectCover project={project} sizes={sizes} priority={priority} />}
      {project.audience && <span className="project-card-audience">for {project.audience}</span>}
      <span className="project-card-summary">{project.summary}</span>
      {meta.length > 0 && <span className="project-card-meta">{meta.join(' · ')}</span>}
    </Link>
  );
}

/** The fourth card on the home stage: how many more projects there are, the next few as a tree. */
export function MoreProjectsCard({ projects }: { projects: ProjectSummary[] }) {
  const shown = projects.slice(0, 4);
  return (
    <Link href="/projects" className="project-card project-card-more">
      <span className="project-card-title">
        {projects.length} more project{projects.length === 1 ? '' : 's'}
      </span>
      <span className="project-card-top" aria-hidden="true">
        <span className="project-card-path">~/projects</span>
      </span>
      <span className="project-card-tree" aria-hidden="true">
        {shown.map((p, i) => (
          <span key={p.slug}>
            <span className="tree-branch">{i === shown.length - 1 ? '└──' : '├──'}</span> {p.title}
          </span>
        ))}
      </span>
      <span className="project-card-cta">all projects →</span>
    </Link>
  );
}
