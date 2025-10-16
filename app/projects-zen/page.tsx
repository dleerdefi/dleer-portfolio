'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ZenList } from '@/components/zen/ZenList';
import { allProjects } from 'content-collections';

/**
 * Projects Zen View - Fullscreen list of projects
 * Features j/k/Enter/Esc keyboard navigation
 * Displays projects from content-collections
 *
 * Route: /projects-zen
 */
export default function ProjectsZenPage() {
  const router = useRouter();

  // Sort projects by date (newest first), featured first
  const sortedProjects = [...allProjects].sort((a, b) => {
    // Featured projects first
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;

    // Then by date
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const handleSelect = (project: typeof allProjects[0]) => {
    router.push(project.url);
  };

  const handleExit = () => {
    router.back();
  };

  return (
    <ZenList
      items={sortedProjects}
      onSelect={handleSelect}
      onExit={handleExit}
      title="~/projects"
      subtitle="Portfolio of technical work and experiments"
      emptyMessage="No projects found."
      renderItem={(project, _index, isSelected) => (
        <div className="space-y-3">
          {/* Header: Title and Status Badge */}
          <div className="flex items-start justify-between gap-4">
            <h2
              className="text-xl font-bold flex-1"
              style={{
                color: isSelected
                  ? 'var(--accent-color)'
                  : 'var(--theme-text)',
                lineHeight: '1.4',
                letterSpacing: '-0.01em',
              }}
            >
              {project.title}
              {project.featured && (
                <span
                  className="ml-2 text-xs px-2 py-0.5 border"
                  style={{
                    borderColor: 'var(--accent-color)',
                    color: 'var(--accent-color)',
                  }}
                >
                  Featured
                </span>
              )}
            </h2>

            {/* Status Badge */}
            <span
              className="text-xs px-2 py-1 border shrink-0"
              style={{
                borderColor: getStatusColor(project.status),
                color: getStatusColor(project.status),
              }}
            >
              {project.status.toUpperCase()}
            </span>
          </div>

          {/* Summary */}
          <p
            className="text-base"
            style={{
              color: 'var(--theme-text-dimmed)',
              lineHeight: '1.6',
            }}
          >
            {project.summary}
          </p>

          {/* Tech Stack */}
          {project.tech.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="text-xs"
                style={{ color: 'var(--theme-text-dimmed)' }}
              >
                Stack:
              </span>
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="text-xs px-2 py-0.5 border"
                  style={{
                    borderColor: 'var(--theme-border)',
                    color: 'var(--theme-text)',
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          {/* Links and Tags */}
          <div className="flex items-center gap-4 text-xs flex-wrap">
            {/* External Links */}
            {(project.github || project.demo) && (
              <div className="flex items-center gap-3">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                    style={{ color: 'var(--accent-color)' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    GitHub →
                  </a>
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                    style={{ color: 'var(--accent-color)' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    Live Demo →
                  </a>
                )}
              </div>
            )}

            {/* Tags */}
            {project.tags.length > 0 && (
              <div className="flex items-center gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{ color: 'var(--theme-text-dimmed)' }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    />
  );
}

/**
 * Get status-appropriate color
 */
function getStatusColor(status: string): string {
  switch (status) {
    case 'production':
      return 'var(--theme-success)';
    case 'beta':
      return 'var(--theme-info)';
    case 'development':
      return 'var(--theme-warning)';
    case 'concept':
      return 'var(--theme-text-dimmed)';
    default:
      return 'var(--theme-text)';
  }
}
