'use client';

import React from 'react';
import { ContentType } from '@/contexts/FocusContext';
import { useProjects } from '@/lib/config';

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

  // Get full project data if we only have partial data
  const fullProject = projectsConfig.find(p => p.id === project.id) || project;

  const roleLabels = {
    built: '🔨 Built',
    architected: '🏗️ Architected',
    led: '🧭 Led'
  };

  const categoryLabels = {
    systems: '🔧 Systems & Infrastructure',
    product: '🧭 Product & Leadership',
    experimental: '🛠 Experimental & Home Lab'
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2" style={{ color: 'var(--theme-text-dimmed)', fontSize: 'clamp(1rem, 1rem + 1.5cqi, 1.125rem)' }}>
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
        <span style={{ color: 'var(--theme-text)' }}>{fullProject.displayName || fullProject.name}</span>
      </div>

      <div className="border-b pb-4" style={{ borderColor: 'var(--theme-border)', opacity: 0.3 }}>
        <h1 className="font-bold" style={{ color: 'var(--accent-color)', fontSize: 'clamp(1.75rem, 1.75rem + 4cqi, 2.25rem)' }}>{fullProject.name}</h1>
        <p className="mt-1" style={{ color: 'var(--theme-text-dimmed)' }}>{fullProject.description}</p>

        {/* Category and Role badges */}
        <div className="flex items-center gap-2 mt-2">
          {fullProject.category && (
            <span className="px-2 py-1 rounded" style={{
              backgroundColor: 'rgba(var(--accent-color-rgb), 0.1)',
              color: 'var(--theme-text-dimmed)',
              fontSize: 'clamp(0.875rem, 0.875rem + 1cqi, 1rem)'
            }}>
              {categoryLabels[fullProject.category as keyof typeof categoryLabels]}
            </span>
          )}
          {fullProject.role && (
            <span className="px-2 py-1 rounded" style={{
              backgroundColor: 'rgba(var(--theme-info-rgb), 0.1)',
              color: 'var(--theme-text-dimmed)',
              fontSize: 'clamp(0.875rem, 0.875rem + 1cqi, 1rem)'
            }}>
              {roleLabels[fullProject.role as keyof typeof roleLabels]}
            </span>
          )}
          {fullProject.status && (
            <span className="px-2 py-1 rounded" style={{
              backgroundColor: fullProject.status === 'production' ? 'rgba(var(--theme-success-rgb), 0.2)' : 'rgba(var(--theme-warning-rgb), 0.2)',
              color: fullProject.status === 'production' ? 'var(--theme-success)' : 'var(--theme-warning)',
              fontSize: 'clamp(0.875rem, 0.875rem + 1cqi, 1rem)'
            }}>
              {fullProject.status}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-4" style={{ color: 'var(--theme-text)' }}>
        {/* Outcome Section */}
        {fullProject.outcome && (
          <div className="p-3 rounded-lg" style={{
            backgroundColor: 'rgba(var(--accent-color-rgb), 0.05)',
            borderLeft: '3px solid var(--accent-color)'
          }}>
            <p className="italic" style={{ color: 'var(--accent-color)', fontSize: 'clamp(1rem, 1rem + 1.5cqi, 1.125rem)' }}>
              💡 {fullProject.outcome}
            </p>
          </div>
        )}

        <div>
          <h2 className="font-bold mb-3" style={{ color: 'var(--accent-color)', opacity: 0.9, fontSize: 'clamp(1.25rem, 1.25rem + 2.5cqi, 1.5rem)' }}>Overview</h2>
          <p className="leading-relaxed" style={{ color: 'var(--theme-text)', opacity: 0.9, fontSize: 'clamp(1.125rem, 1.125rem + 2cqi, 1.25rem)' }}>
            {fullProject.overview || "This project demonstrates advanced development practices with focus on security, efficiency, and scalability. Implemented using modern development tools and following industry best practices."}
          </p>
        </div>

        {/* Metrics Section */}
        {fullProject.metrics && fullProject.metrics.length > 0 && (
          <div>
            <h2 className="font-bold mb-3" style={{ color: 'var(--accent-color)', opacity: 0.9, fontSize: 'clamp(1.25rem, 1.25rem + 2.5cqi, 1.5rem)' }}>Key Metrics & Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {fullProject.metrics.map((metric: string, index: number) => (
                <div
                  key={index}
                  className="p-3 rounded-lg border"
                  style={{
                    borderColor: 'rgba(var(--accent-color-rgb), 0.3)',
                    backgroundColor: 'rgba(var(--theme-surface-rgb), 0.2)'
                  }}
                >
                  <span style={{ color: 'var(--theme-info)', fontSize: 'clamp(1rem, 1rem + 1.5cqi, 1.125rem)' }}>
                    📊 {metric}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="font-bold mb-3" style={{ color: 'var(--accent-color)', opacity: 0.9, fontSize: 'clamp(1.25rem, 1.25rem + 2.5cqi, 1.5rem)' }}>Key Features</h2>
          <ul className="space-y-1" style={{ color: 'var(--theme-text)', opacity: 0.9, fontSize: 'clamp(1.125rem, 1.125rem + 2cqi, 1.25rem)' }}>
            {(fullProject.features || [
              "Fully tested and documented codebase",
              "Optimized implementations",
              "Comprehensive documentation",
              "Production-ready deployment"
            ]).map((feature: string, index: number) => (
              <li key={index}>• {feature}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-bold mb-3" style={{ color: 'var(--accent-color)', opacity: 0.9, fontSize: 'clamp(1.25rem, 1.25rem + 2.5cqi, 1.5rem)' }}>Technical Stack</h2>
          <code className="font-mono p-3 rounded-lg mt-2 border block" style={{ color: 'var(--theme-info)', backgroundColor: 'var(--theme-bg)', borderColor: 'var(--theme-border)', opacity: 0.5, fontSize: 'clamp(10px, 1.5cqw, 16px)' }}>
            {fullProject.techStack?.join(', ') || fullProject.techStackDisplay || 'Technologies not specified'}
          </code>
        </div>

        {/* Video Embed Section */}
        {fullProject.videoUrl && (
          <div>
            <h2 className="font-bold mb-3" style={{ color: 'var(--accent-color)', opacity: 0.9, fontSize: 'clamp(1.25rem, 1.25rem + 2.5cqi, 1.5rem)' }}>Video Demo</h2>
            <div className="p-3 rounded-lg border" style={{
              borderColor: 'rgba(var(--accent-color-rgb), 0.3)',
              backgroundColor: 'rgba(var(--theme-surface-rgb), 0.2)'
            }}>
              <p className="mb-2" style={{ color: 'var(--theme-text-dimmed)', fontSize: 'clamp(1rem, 1rem + 1.5cqi, 1.125rem)' }}>
                🎥 Video demonstration available
              </p>
              <a
                href={fullProject.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
                style={{ color: 'var(--theme-info)', fontSize: 'clamp(1rem, 1rem + 1.5cqi, 1.125rem)' }}
              >
                Watch on YouTube →
              </a>
            </div>
          </div>
        )}

        <div className="flex gap-3" style={{ paddingTop: '32px' }}>
          {fullProject.github && (
            <a
              href={fullProject.github}
              target="_blank"
              rel="noopener noreferrer"
              className="touch-target touch-feedback px-4 py-2 rounded hover:opacity-90 transition-all duration-200 inline-block"
              style={{ backgroundColor: 'var(--accent-color)', color: 'var(--theme-bg)', textDecoration: 'none', fontSize: 'clamp(1rem, 1rem + 1.5cqi, 1.125rem)' }}
            >
              View on GitHub
            </a>
          )}
          {fullProject.demo && (
            <a
              href={fullProject.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="touch-target touch-feedback px-4 py-2 border rounded transition-all duration-200 inline-block"
              style={{
                borderColor: 'var(--accent-color)',
                color: 'var(--accent-color)',
                backgroundColor: 'transparent',
                textDecoration: 'none',
                fontSize: 'clamp(1rem, 1rem + 1.5cqi, 1.125rem)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(var(--accent-color-rgb), 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Live Demo
            </a>
          )}
          {fullProject.blogUrl && (
            <a
              href={fullProject.blogUrl}
              className="touch-target touch-feedback px-4 py-2 border rounded transition-all duration-200 inline-block"
              style={{
                borderColor: 'var(--theme-warning)',
                color: 'var(--theme-warning)',
                backgroundColor: 'transparent',
                textDecoration: 'none',
                fontSize: 'clamp(1rem, 1rem + 1.5cqi, 1.125rem)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(var(--theme-warning-rgb), 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              📝 Read Blog Post
            </a>
          )}
        </div>
      </div>
    </div>
  );
};