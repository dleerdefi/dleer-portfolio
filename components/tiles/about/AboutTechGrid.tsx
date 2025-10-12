import React from 'react';
import { useTechnologies } from '@/lib/config';
import { TechIcon } from '@/components/ui/TechIcon';

/**
 * Technology grid component for About section in tile layout
 * Displays first 8 technologies in a 4x2 grid (excludes Docker due to space constraints)
 * Uses smaller icons (32px) compared to parallax tech section (48px)
 */
export const AboutTechGrid: React.FC = () => {
  const technologies = useTechnologies();

  // Take first 8 technologies (excludes Docker which is 9th)
  const displayTechs = technologies?.items?.slice(0, 8) || [];

  return (
    <div
      style={{
        marginTop: '0',
        paddingTop: '0',
        opacity: 1
      }}
    >
      {/* 4 columns, 2 rows grid */}
      <div className="grid grid-cols-4 gap-2">
        {displayTechs.map((tech, idx) => (
          <TechIcon
            key={idx}
            iconName={tech.icon}
            name={tech.name}
            size={32}  // Smaller icons for tile constraints
          />
        ))}
      </div>
    </div>
  );
};
