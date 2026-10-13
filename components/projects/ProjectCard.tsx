import Link from 'next/link';
import type { ProjectSummary } from '@/lib/content-types';

const STATUS_LABEL: Record<ProjectSummary['status'], string> = {
  production: 'production',
  beta: 'beta',
  development: 'in development',
  concept: 'concept',
};

/** A project's status as a small bordered chip, colored by app/styles/15-home-layout.css. */
export function StatusChip({ status }: { status: ProjectSummary['status'] }) {
  return <span className={`status-chip status-${status}`}>{STATUS_LABEL[status]}</span>;
}

/**
 * A project as a whole-card link. Its accessible name is its text, title first: the path and
 * status row comes after the title in the DOM and is drawn above it (CSS order). Used by the home
 * stage and the phone's featured block; phase 3 adds a cover, metrics and the audience line.
 */
export function ProjectCard({ project }: { project: ProjectSummary }) {
  return (
    <Link href={project.url} className="project-card">
      <span className="project-card-title">{project.title}</span>
      <span className="project-card-top">
        <span className="project-card-path" aria-hidden="true">
          ~/projects/{project.slug}
        </span>
        <StatusChip status={project.status} />
      </span>
      <span className="project-card-summary">{project.summary}</span>
      {project.tech.length > 0 && (
        <span className="project-card-tech" aria-hidden="true">
          {project.tech.slice(0, 3).map((t) => (
            <span key={t} className="chip">
              {t}
            </span>
          ))}
        </span>
      )}
    </Link>
  );
}

/** The fourth card: how many more projects there are, the next few as a tree, a link to all. */
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
