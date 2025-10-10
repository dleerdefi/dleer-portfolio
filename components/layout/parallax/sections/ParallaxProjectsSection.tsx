import React from 'react';
import { BackButton } from '../components/BackButton';

interface Project {
  id: string;
  name: string;
  description: string;
  techStackDisplay: string;
  status?: string;
  github?: string;
  demo?: string;
}

interface ParallaxProjectsSectionProps {
  projects: Project[];
  selectedProject: string | null;
  setSelectedProject: (id: string | null) => void;
}

/**
 * Projects section component for parallax layout
 * Handles both list view and detail view for projects
 */
export const ParallaxProjectsSection: React.FC<ParallaxProjectsSectionProps> = ({
  projects,
  selectedProject,
  setSelectedProject
}) => {
  // If a project is selected, show its details
  if (selectedProject) {
    const project = projects.find(p => p.id === selectedProject);
    if (!project) {
      setSelectedProject(null);
      return null;
    }

    return (
      <div className="space-y-4">
        <div>
          <BackButton
            onClick={() => setSelectedProject(null)}
            text="Back to projects"
          />
        </div>

        {/* Plain project details wrapper - no glass morphism */}
        <div className="p-8 space-y-4">
          {/* Project details */}
          <h2
            className="text-3xl font-bold"
            style={{ color: 'var(--accent-color)' }}
          >
            {project.name}
          </h2>

          <p style={{ color: 'var(--theme-text)', opacity: 0.9 }}>
            {project.description}
          </p>

          <div className="space-y-2">
            <p>
              <span style={{ color: 'var(--theme-info)' }}>Tech Stack:</span>{' '}
              <span style={{ color: 'var(--theme-text)', opacity: 0.8 }}>
                {project.techStackDisplay}
              </span>
            </p>
            {project.status && (
              <p>
                <span style={{ color: 'var(--theme-info)' }}>Status:</span>{' '}
                <span
                  className="px-2 py-1 rounded text-xs uppercase"
                  style={{
                    backgroundColor: project.status === 'production'
                      ? 'rgba(var(--theme-success-rgb), 0.1)'
                      : 'rgba(var(--theme-warning-rgb), 0.1)',
                    color: project.status === 'production'
                      ? 'var(--theme-success)'
                      : 'var(--theme-warning)'
                  }}
                >
                  {project.status}
                </span>
              </p>
            )}
          </div>

          {/* Links */}
          <div className="flex gap-3 pt-2">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded transition-all hover:brightness-110"
                style={{
                  backgroundColor: 'rgba(var(--accent-color-rgb), 0.1)',
                  color: 'var(--accent-color)',
                  border: '1px solid rgba(var(--accent-color-rgb), 0.3)'
                }}
              >
                View on GitHub →
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded transition-all hover:brightness-110"
                style={{
                  backgroundColor: 'rgba(var(--accent-color-rgb), 0.1)',
                  color: 'var(--accent-color)',
                  border: '1px solid rgba(var(--accent-color-rgb), 0.3)'
                }}
              >
                Live Demo →
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Otherwise show the project list
  return (
    <div>
      {/* Plain content wrapper - no glass morphism */}
      <div className="p-6 space-y-6">
        <h2
          className="text-3xl font-bold"
          style={{ color: 'var(--accent-color)' }}
        >
          Projects
        </h2>

        <div className="space-y-4">
          {projects.map((project, index) => (
            <div key={project.id}>
              <div
                className="group cursor-pointer"
                onClick={() => setSelectedProject(project.id)}
              >
                <h3
                  className="text-lg font-semibold mb-1 transition-colors group-hover:brightness-110"
                  style={{ color: 'var(--theme-text)' }}
                >
                  {project.name}
                </h3>
                <p
                  className="text-sm transition-opacity group-hover:opacity-100"
                  style={{ color: 'var(--theme-text)', opacity: 0.8 }}
                >
                  {project.description}
                </p>
              </div>
              {index < projects.length - 1 && (
                <div
                  className="mt-4 h-px"
                  style={{
                    background: 'linear-gradient(90deg, rgba(var(--accent-color-rgb), 0.1) 0%, rgba(var(--accent-color-rgb), 0.05) 100%)'
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};