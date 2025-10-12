import React from 'react';
import { BackButton } from '../components/BackButton';

interface Project {
  id: string;
  name: string;
  description: string;
  overview?: string;
  features?: string[];
  metrics?: string[];
  techStack?: string[];
  techStackDisplay: string;
  category?: string;
  role?: string;
  visibility?: string;
  status?: string;
  outcome?: string;
  github?: string;
  demo?: string;
  videoUrl?: string;
  blogUrl?: string;
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
        <div className="p-8 space-y-6">
          {/* Project header */}
          <div>
            <h2
              className="text-3xl font-bold mb-2"
              style={{ color: 'var(--accent-color)' }}
            >
              {project.name}
            </h2>
            <p className="text-sm" style={{ color: 'var(--theme-text-dimmed)' }}>
              {project.description}
            </p>

            {/* Category and Role badges */}
            <div className="flex gap-2 mt-3">
              {project.category && (
                <span className="text-xs px-2 py-1 rounded" style={{
                  backgroundColor: 'rgba(var(--accent-color-rgb), 0.1)',
                  color: 'var(--theme-text-dimmed)'
                }}>
                  {project.category === 'systems' && '🔧 Systems'}
                  {project.category === 'product' && '🧭 Product'}
                  {project.category === 'experimental' && '🛠 Experimental'}
                </span>
              )}
              {project.role && (
                <span className="text-xs px-2 py-1 rounded" style={{
                  backgroundColor: 'rgba(var(--theme-info-rgb), 0.1)',
                  color: 'var(--theme-text-dimmed)'
                }}>
                  {project.role === 'built' && '🔨 Built'}
                  {project.role === 'architected' && '🏗️ Architected'}
                  {project.role === 'led' && '🧭 Led'}
                </span>
              )}
              {project.status && (
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
              )}
            </div>
          </div>

          {/* Outcome Section */}
          {project.outcome && (
            <div className="p-3 rounded-lg" style={{
              backgroundColor: 'rgba(var(--accent-color-rgb), 0.05)',
              borderLeft: '3px solid var(--accent-color)'
            }}>
              <p className="text-sm italic" style={{ color: 'var(--accent-color)' }}>
                💡 {project.outcome}
              </p>
            </div>
          )}

          {/* Overview Section */}
          {project.overview && (
            <div>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--accent-color)', opacity: 0.9 }}>
                Overview
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--theme-text)', opacity: 0.9 }}>
                {project.overview}
              </p>
            </div>
          )}

          {/* Metrics Section */}
          {project.metrics && project.metrics.length > 0 && (
            <div>
              <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--accent-color)', opacity: 0.9 }}>
                Key Metrics & Impact
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {project.metrics.map((metric, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg border"
                    style={{
                      borderColor: 'rgba(var(--accent-color-rgb), 0.3)',
                      backgroundColor: 'rgba(var(--theme-surface-rgb), 0.2)'
                    }}
                  >
                    <span className="text-sm" style={{ color: 'var(--theme-info)' }}>
                      📊 {metric}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Features Section */}
          {project.features && project.features.length > 0 && (
            <div>
              <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--accent-color)', opacity: 0.9 }}>
                Key Features
              </h3>
              <ul className="space-y-1 text-sm" style={{ color: 'var(--theme-text)', opacity: 0.9 }}>
                {project.features.map((feature, index) => (
                  <li key={index}>• {feature}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Tech Stack Section */}
          <div>
            <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--accent-color)', opacity: 0.9 }}>
              Tech Stack
            </h3>
            <code className="text-xs font-mono p-3 rounded-lg border block" style={{
              color: 'var(--theme-info)',
              backgroundColor: 'var(--theme-bg)',
              borderColor: 'rgba(var(--accent-color-rgb), 0.2)'
            }}>
              {project.techStackDisplay}
            </code>
          </div>

          {/* Links */}
          <div className="flex gap-3 pt-2 flex-wrap">
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
            {project.videoUrl && (
              <a
                href={project.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded transition-all hover:brightness-110"
                style={{
                  backgroundColor: 'rgba(var(--theme-warning-rgb), 0.1)',
                  color: 'var(--theme-warning)',
                  border: '1px solid rgba(var(--theme-warning-rgb), 0.3)'
                }}
              >
                🎥 Video Demo
              </a>
            )}
            {project.blogUrl && (
              <a
                href={project.blogUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded transition-all hover:brightness-110"
                style={{
                  backgroundColor: 'rgba(var(--theme-info-rgb), 0.1)',
                  color: 'var(--theme-info)',
                  border: '1px solid rgba(var(--theme-info-rgb), 0.3)'
                }}
              >
                📝 Blog Post
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