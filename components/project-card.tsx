import TerminalWindow from './terminal-window';
import type { Project } from '@/lib/types';

export default function ProjectCard({ project }: { project: Project }) {
  const statusColor = project.status === 'production'
    ? 'text-terminal-accent'
    : project.status === 'beta'
    ? 'text-terminal-amber'
    : 'text-terminal-dim';

  return (
    <TerminalWindow title={`/projects/${project.id}`}>
      <div className="space-y-2ch">
        {/* Title and Status */}
        <div className="flex items-start justify-between">
          <h3 className="text-terminal-fg font-bold text-lg">{project.title}</h3>
          <span className={`text-sm ${statusColor}`}>[{project.status}]</span>
        </div>

        {/* Description */}
        <p className="text-terminal-dim text-sm leading-relaxed">
          {project.description}
        </p>

        {/* Tech Stack */}
        <div className="pt-ch">
          <div className="text-terminal-accent text-xs mb-ch">$ cat tech_stack.txt</div>
          <div className="flex flex-wrap gap-ch">
            {project.tech.map(tech => (
              <span key={tech} className="text-terminal-dim text-sm">
                [{tech}]
              </span>
            ))}
          </div>
        </div>

        {/* Metrics */}
        <div className="pt-ch">
          <div className="text-terminal-accent text-xs mb-ch">$ cat metrics.log</div>
          <div className="grid grid-cols-2 gap-ch text-sm">
            {Object.entries(project.metrics).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-terminal-dim">{key}:</span>
                <span className="text-terminal-fg">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Links */}
        {(project.github || project.demo) && (
          <div className="pt-2ch flex gap-3ch text-sm">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-terminal-accent hover:text-terminal-fg transition-colors"
              >
                [GitHub →]
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="text-terminal-accent hover:text-terminal-fg transition-colors"
              >
                [Demo →]
              </a>
            )}
          </div>
        )}
      </div>
    </TerminalWindow>
  );
}