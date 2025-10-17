import React from 'react';
import { useRouter } from 'next/navigation';

interface Project {
  id: string;
  slug: string;
  name: string;
  description: string;
}

interface ParallaxProjectsSectionProps {
  projects: Project[];
}

/**
 * Projects section component for parallax layout
 * Displays project list and navigates to fullscreen detail pages
 */
export const ParallaxProjectsSection: React.FC<ParallaxProjectsSectionProps> = ({
  projects
}) => {
  const router = useRouter();

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
                onClick={() => router.push(`/projects/${project.slug}`)}
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
