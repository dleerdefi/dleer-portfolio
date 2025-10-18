'use client';

import React from 'react';
import { ContentType } from '@/contexts/FocusContext';
import { useProjects } from '@/lib/config';

interface ProjectsOverviewContentProps {
  onNavigate?: (content: ContentType) => void;
}

/**
 * Projects overview content component
 * Displays list of all projects with minimal, clean layout
 */
export const ProjectsOverviewContent: React.FC<ProjectsOverviewContentProps> = ({ onNavigate }) => {
  const projectsConfig = useProjects();

  // Group projects by category
  const projectsByCategory = {
    systems: projectsConfig.filter(p => p.category === 'systems'),
    product: projectsConfig.filter(p => p.category === 'product'),
    experimental: projectsConfig.filter(p => p.category === 'experimental')
  };

  const categoryLabels = {
    systems: 'Systems & Infrastructure',
    product: 'Product & Leadership',
    experimental: 'Experimental & Home Lab'
  };

  const renderProject = (project: any) => {
    const projectData = {
      id: project.id,
      name: project.name,
      displayName: project.name,
      description: project.description,
      overview: project.overview,
      features: project.features,
      techStack: project.techStack,
      category: project.category,
      role: project.role,
      metrics: project.metrics,
      outcome: project.outcome
    };

    return (
      <div
        key={project.id}
        className="py-4 cursor-pointer transition-all"
        onClick={(e) => {
          e.stopPropagation();
          onNavigate?.({ type: 'project', data: projectData });
        }}
      >
        {/* Project Title - Larger on mobile to match header */}
        <h3
          className="font-bold mb-1 transition-colors hover:opacity-80"
          style={{ color: 'var(--accent-color)', fontSize: 'clamp(1.25rem, 1.25rem + 2.5cqi, 1.5rem)' }}
        >
          {project.name}
        </h3>

        {/* Description - Hidden on mobile, shown on desktop */}
        <p className="desktop-only mb-2" style={{ color: 'var(--theme-text)', opacity: 0.9, fontSize: 'clamp(1rem, 1rem + 1.5cqi, 1.125rem)' }}>
          {project.description}
        </p>

        {/* Bottom row: Tech Stack and Links */}
        <div className="flex items-center justify-between">
          {/* Tech Stack - Subtle with dots */}
          <div style={{ color: 'var(--theme-text-dimmed)', fontSize: 'clamp(1rem, 1rem + 1.5cqi, 1.125rem)' }}>
            {project.techStack.slice(0, 4).map((tech: string, idx: number) => (
              <span key={idx}>
                {tech}
                {idx < Math.min(3, project.techStack.length - 1) && ' · '}
              </span>
            ))}
          </div>

          {/* Links - Simple text */}
          <div className="flex gap-3" style={{ fontSize: 'clamp(1rem, 1rem + 1.5cqi, 1.125rem)' }}>
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
                style={{ color: 'var(--theme-text-dimmed)' }}
                onClick={(e) => e.stopPropagation()}
              >
                GitHub
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
                style={{ color: 'var(--theme-text-dimmed)' }}
                onClick={(e) => e.stopPropagation()}
              >
                Demo
              </a>
            )}
            {project.videoUrl && (
              <a
                href={project.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
                style={{ color: 'var(--theme-text-dimmed)' }}
                onClick={(e) => e.stopPropagation()}
              >
                Video
              </a>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-bold" style={{ color: 'var(--accent-color)', fontSize: 'clamp(1.5rem, 1.5rem + 3cqi, 1.75rem)' }}>Projects</h1>
        <p className="mt-2" style={{ color: 'var(--theme-text)', fontSize: 'clamp(1rem, 1rem + 1.5cqi, 1.125rem)' }}>
          Systems I&apos;ve built, products I&apos;ve led, and experimental work.
        </p>
      </div>

      {/* Projects List - Desktop shows categories, Mobile doesn't */}
      <div>
        {/* Desktop: Show with category sections */}
        <div className="hidden md:block space-y-8">
          {/* Systems & Infrastructure */}
          {projectsByCategory.systems.length > 0 && (
            <div>
              <h2
                className="font-semibold mb-4 pb-2 border-b"
                style={{
                  color: 'var(--theme-text-dimmed)',
                  borderColor: 'rgba(var(--theme-text-rgb), 0.1)',
                  fontSize: 'clamp(1rem, 1rem + 1.5cqi, 1.125rem)'
                }}
              >
                {categoryLabels.systems}
              </h2>
              <div className="space-y-2">
                {projectsByCategory.systems.map(renderProject)}
              </div>
            </div>
          )}

          {/* Product & Leadership */}
          {projectsByCategory.product.length > 0 && (
            <div>
              <h2
                className="font-semibold mb-4 pb-2 border-b"
                style={{
                  color: 'var(--theme-text-dimmed)',
                  borderColor: 'rgba(var(--theme-text-rgb), 0.1)',
                  fontSize: 'clamp(1rem, 1rem + 1.5cqi, 1.125rem)'
                }}
              >
                {categoryLabels.product}
              </h2>
              <div className="space-y-2">
                {projectsByCategory.product.map(renderProject)}
              </div>
            </div>
          )}

          {/* Experimental & Home Lab */}
          {projectsByCategory.experimental.length > 0 && (
            <div>
              <h2
                className="font-semibold mb-4 pb-2 border-b"
                style={{
                  color: 'var(--theme-text-dimmed)',
                  borderColor: 'rgba(var(--theme-text-rgb), 0.1)',
                  fontSize: 'clamp(1rem, 1rem + 1.5cqi, 1.125rem)'
                }}
              >
                {categoryLabels.experimental}
              </h2>
              <div className="space-y-2">
                {projectsByCategory.experimental.map(renderProject)}
              </div>
            </div>
          )}
        </div>

        {/* Mobile: Show all projects without category headers */}
        <div className="md:hidden space-y-2">
          {projectsConfig.map(renderProject)}
        </div>
      </div>
    </div>
  );
};