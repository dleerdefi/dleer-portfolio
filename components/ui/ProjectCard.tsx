import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import type { Project } from '@/lib/types';

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="h-full flex flex-col">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold text-text-primary">
          {project.title}
        </h3>
        <Badge variant={project.status === 'production' ? 'success' : 'warning'}>
          {project.status}
        </Badge>
      </div>

      <p className="text-text-secondary mb-4 flex-grow">
        {project.description}
      </p>

      <div className="space-y-4">
        {/* Tech Stack */}
        <div>
          <div className="text-sm text-text-muted mb-2">Technologies</div>
          <div className="flex flex-wrap gap-2">
            {project.tech.slice(0, 4).map((tech) => (
              <Badge key={tech} variant="default">
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
          {Object.entries(project.metrics).slice(0, 2).map(([key, value]) => (
            <div key={key}>
              <div className="text-xs text-text-muted">{key}</div>
              <div className="text-sm font-semibold text-accent-primary">{value}</div>
            </div>
          ))}
        </div>

        {/* Links */}
        {(project.github || project.demo) && (
          <div className="flex gap-3 pt-3">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-text-secondary hover:text-accent-primary transition-colors"
              >
                View Code →
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-text-secondary hover:text-accent-primary transition-colors"
              >
                Live Demo →
              </a>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}