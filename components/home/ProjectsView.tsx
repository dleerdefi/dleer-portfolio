import Link from 'next/link';
import type { ProjectSummary } from '@/lib/content-types';
import { ProjectCard } from '@/components/projects/ProjectCard';

/**
 * The stage's projects view (desktop, server-rendered): every project as a card, featured first,
 * as on /projects. The contents tree's projects/ and the polybar's projects workspace open it;
 * a card opens its case study. The covers load only once the view is shown.
 */
export function ProjectsView({ projects }: { projects: ProjectSummary[] }) {
  return (
    <div className="stage-projects">
      <header className="stage-projects-head">
        <h2>Projects</h2>
        <Link href="/projects">full page →</Link>
      </header>
      <div className="card-grid">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} sizes="(min-width: 1600px) 30vw, 45vw" />
        ))}
      </div>
    </div>
  );
}
