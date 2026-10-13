import ProjectsZenPage from '@/components/zen/ProjectsZenPage';
import { projectSummaries } from '@/lib/content-index';

/** /projects: featured first, then newest first. Only summaries reach the client. */
export default function ProjectsPage() {
  const projects = projectSummaries().sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  return <ProjectsZenPage projects={projects} />;
}
