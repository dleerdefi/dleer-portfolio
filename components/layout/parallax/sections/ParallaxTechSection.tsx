import React from 'react';
import { useTechnologies } from '@/lib/config';
import { TechIcon } from '@/components/ui/TechIcon';

/**
 * Technologies section component for parallax layout
 * Displays technology logos in a clean, uniform grid
 */
export const ParallaxTechSection: React.FC = () => {
  const technologies = useTechnologies();

  // Fallback if no technologies configured
  if (!technologies || !technologies.items || technologies.items.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <p style={{ color: 'var(--theme-text-dimmed)' }}>
          Technologies section not configured
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col justify-center py-8">
      <div className="max-w-6xl mx-auto w-full">
        {/* Plain text header - no container */}
        <h2
          className="text-3xl sm:text-4xl font-bold mb-12"
          style={{ color: 'var(--accent-color)' }}
        >
          Technologies
        </h2>

        {/* Technology Grid - Icons have their own glass morphism containers */}
        <div className="grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8 justify-items-center">
          {technologies.items.map((tech, idx) => (
            <div key={idx}>
              <TechIcon
                iconName={tech.icon}
                name={tech.name}
                size={48}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};