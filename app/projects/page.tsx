import Section from '@/components/section';
import ProjectCard from '@/components/project-card-clean';
import Badge from '@/components/badge';
import type { ProjectsData } from '@/lib/types';

const projectsData: ProjectsData = require('@/content/projects.json');

export default function Projects() {
  const techCount = projectsData.projects.reduce((acc, project) => {
    project.tech.forEach(tech => {
      acc[tech] = (acc[tech] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const topTech = Object.entries(techCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8);

  return (
    <>
      {/* Hero Section */}
      <Section className="py-16 bg-bg-secondary">
        <h1 className="text-4xl font-bold text-text-primary mb-4">
          Projects Portfolio
        </h1>
        <p className="text-lg text-text-secondary max-w-3xl">
          A collection of DeFi protocols, smart contracts, and knowledge graph applications
          I've built over the years. Each project showcases different aspects of blockchain
          development and token economics design.
        </p>
      </Section>

      {/* Projects Grid */}
      <Section>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projectsData.projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </Section>

      {/* Tech Distribution */}
      <Section className="bg-bg-secondary">
        <h2 className="text-2xl font-bold text-text-primary mb-6">
          Technology Distribution
        </h2>
        <div className="flex flex-wrap gap-3">
          {topTech.map(([tech, count]) => (
            <div key={tech} className="flex items-center gap-2">
              <Badge variant="default">{tech}</Badge>
              <span className="text-text-muted text-sm">×{count}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Summary Stats */}
      <Section>
        <div className="grid md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-accent-primary">
              {projectsData.projects.length}
            </div>
            <div className="text-text-muted">Total Projects</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-semantic-success">
              {projectsData.projects.filter(p => p.status === 'production').length}
            </div>
            <div className="text-text-muted">In Production</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-mauve">
              $50M+
            </div>
            <div className="text-text-muted">Total TVL</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-accent-secondary">
              10K+
            </div>
            <div className="text-text-muted">Active Users</div>
          </div>
        </div>
      </Section>
    </>
  );
}