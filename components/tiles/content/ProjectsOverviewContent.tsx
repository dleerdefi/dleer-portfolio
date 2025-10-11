'use client';

import React from 'react';
import { ContentType } from '@/contexts/FocusContext';
import { useProjects } from '@/lib/config';

interface ProjectsOverviewContentProps {
  onNavigate?: (content: ContentType) => void;
}

/**
 * Projects overview content component
 * Displays list of all projects with interactive cards
 */
export const ProjectsOverviewContent: React.FC<ProjectsOverviewContentProps> = ({ onNavigate }) => {
  const projectsConfig = useProjects();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold" style={{ color: 'var(--accent-color)' }}>Projects</h1>
      <p className="text-sm" style={{ color: 'var(--theme-text)' }}>
        A collection of my recent work and open-source contributions.
      </p>
      <div className="space-y-4">
        {projectsConfig.map((project) => {
          // Transform project to match navigation format
          const projectData = {
            id: project.id,
            name: project.name.replace(/\.(tsx?|jsx?|py|rs|go)$/i, ''),
            displayName: project.name.split('.')[0].split('-').map(word =>
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' '),
            description: project.description,
            overview: project.overview,
            features: project.features,
            techStack: project.techStack,
            sections: [
              'Overview',
              ...(project.features ? ['Features'] : []),
              'Tech Stack'
            ]
          };
          return (
            <div
              key={project.id}
              className="border-b pb-4 transition-colors cursor-pointer"
              style={{ borderColor: 'rgba(var(--accent-color-rgb), 0.2)' }}
              onMouseEnter={(e) => {
                // Title changes to accent color
                const title = e.currentTarget.querySelector('h3');
                if (title) (title as HTMLElement).style.color = 'var(--accent-color)';

                // Description becomes fully opaque
                const desc = e.currentTarget.querySelector('p');
                if (desc) (desc as HTMLElement).style.opacity = '1';

                // Border becomes more prominent (no glow)
                e.currentTarget.style.borderColor = 'rgba(var(--accent-color-rgb), 0.5)';
              }}
              onMouseLeave={(e) => {
                // Title back to theme text
                const title = e.currentTarget.querySelector('h3');
                if (title) (title as HTMLElement).style.color = 'var(--theme-text)';

                // Description back to 80%
                const desc = e.currentTarget.querySelector('p');
                if (desc) (desc as HTMLElement).style.opacity = '0.8';

                // Border back to subtle
                e.currentTarget.style.borderColor = 'rgba(var(--accent-color-rgb), 0.2)';
              }}
              onClick={(e) => {
                e.stopPropagation();
                onNavigate?.({ type: 'project', data: projectData });
              }}
            >
              <h3 className="font-bold text-base mb-2 transition-colors" style={{ color: 'var(--theme-text)' }}>{project.name}</h3>
              <p className="text-sm mb-3 transition-opacity" style={{ color: 'var(--theme-text)', opacity: 0.8 }}>{project.description}</p>
              <div className="flex gap-2 flex-wrap">
                {project.techStack.slice(0, 3).map((tech, idx) => (
                  <span
                    key={idx}
                    className="text-xs"
                    style={{
                      color: 'var(--theme-text-dimmed)'
                    }}
                  >
                    {tech}{idx < Math.min(2, project.techStack.length - 1) ? ' •' : ''}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};