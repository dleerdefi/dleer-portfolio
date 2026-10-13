import Link from 'next/link';
import { getPortfolioConfig } from '@/config/portfolio.config';
import type { ProjectSummary } from '@/lib/content-types';
import { featuredProjects, otherProjects } from '@/lib/projects';
import { MoreProjectsCard, ProjectCard } from '@/components/projects/ProjectCard';

/**
 * The stage's home view (server-rendered): greeting, pitch, the short bio, the featured projects
 * and a card for the rest. It is also the site's about: there is no separate about view. On desktop it is the content tile's default view; on phones it is the section after
 * the hero. docs/PORTFOLIO_V2_SPEC.md §4.1, §4.2.
 */
export function HomeView({ projects }: { projects: ProjectSummary[] }) {
  const { personal } = getPortfolioConfig();
  const featured = featuredProjects(projects);
  const others = otherProjects(projects, featured);
  const meta = [personal.title, personal.location].filter(Boolean).join(' · ');

  return (
    <div className="home-view">
      <header className="home-view-header">
        <h1 className="home-greeting">{personal.greeting || `Hi, I'm ${personal.name}`}</h1>
        {personal.bio.intro && <p className="home-pitch">{personal.bio.intro}</p>}
        {personal.bio.summary && <p className="home-bio">{personal.bio.summary}</p>}
        {meta && <p className="home-meta">{meta}</p>}
      </header>

      <h2 className="sr-only">Featured projects</h2>
      <div className="home-cards">
        {featured.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
        {others.length > 0 && <MoreProjectsCard projects={others} />}
      </div>

      <nav className="home-links" aria-label="More">
        <Link href="/projects">all projects →</Link>
        <Link href="/blog">writing →</Link>
      </nav>
    </div>
  );
}
