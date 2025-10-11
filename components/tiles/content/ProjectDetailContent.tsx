'use client';

import React from 'react';
import { ContentType } from '@/contexts/FocusContext';
import { useProjects, useUIStrings } from '@/lib/config';

interface ProjectDetailContentProps {
  project: any;
  onNavigate?: (content: ContentType) => void;
}

/**
 * Project detail content component
 * Displays individual project information with navigation
 */
export const ProjectDetailContent: React.FC<ProjectDetailContentProps> = ({ project, onNavigate }) => {
  const projectsConfig = useProjects();
  const uiStrings = useUIStrings();

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="text-sm flex items-center gap-2" style={{ color: 'var(--theme-text-dimmed)' }}>
        <span
          className="cursor-pointer transition-colors hover:opacity-80"
          style={{ color: 'var(--accent-color)' }}
          onClick={(e) => {
            e.stopPropagation();
            onNavigate?.({ type: 'projects-overview' });
          }}
        >
          Projects
        </span>
        <span style={{ color: 'var(--theme-text-dimmed)' }}>/</span>
        <span style={{ color: 'var(--theme-text)' }}>{project.displayName || project.name}</span>
      </div>

      <div className="border-b pb-4" style={{ borderColor: 'var(--theme-border)', opacity: 0.3 }}>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--accent-color)' }}>{project.name}</h1>
        <p className="mt-1" style={{ color: 'var(--theme-text-dimmed)' }}>{project.description}</p>
      </div>

      <div className="space-y-4" style={{ color: 'var(--theme-text)' }}>
        <div>
          <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--accent-color)', opacity: 0.9 }}>{uiStrings.headers.overview}</h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--theme-text)', opacity: 0.9 }}>
            {project.overview || "This project demonstrates advanced development practices with focus on security, efficiency, and scalability. Implemented using modern development tools and following industry best practices."}
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--accent-color)', opacity: 0.9 }}>{uiStrings.headers.techStack}</h2>
          <code className="text-xs font-mono p-3 rounded-lg mt-2 border block" style={{ color: 'var(--theme-info)', backgroundColor: 'var(--theme-bg)', borderColor: 'var(--theme-border)', opacity: 0.5 }}>
            {project.techStack?.join(', ') || projectsConfig.find(p => p.id === project.id)?.techStackDisplay || 'Technologies not specified'}
          </code>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--accent-color)', opacity: 0.9 }}>{uiStrings.headers.keyFeatures}</h2>
          <ul className="space-y-1 text-sm" style={{ color: 'var(--theme-text)', opacity: 0.9 }}>
            {(project.features || [
              "Fully tested and documented codebase",
              "Optimized implementations",
              "Comprehensive documentation",
              "Production-ready deployment"
            ]).map((feature: string, index: number) => (
              <li key={index}>• {feature}</li>
            ))}
          </ul>
        </div>

        <div className="flex gap-3" style={{ paddingTop: '32px' }}>
          <button className="touch-target touch-feedback px-4 py-2 text-sm rounded hover:opacity-90 transition-all duration-200 block w-auto" style={{ backgroundColor: 'var(--accent-color)', color: 'var(--theme-bg)' }}>
            {uiStrings.buttons.viewGithub}
          </button>
          <button className="touch-target touch-feedback px-4 py-2 border text-sm rounded transition-all duration-200 block w-auto" style={{ borderColor: 'var(--accent-color)', color: 'var(--accent-color)', backgroundColor: 'transparent' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(var(--accent-color-rgb), 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
            {uiStrings.buttons.liveDemo}
          </button>
        </div>
      </div>
    </div>
  );
};