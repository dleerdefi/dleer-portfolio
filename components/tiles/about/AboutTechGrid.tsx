import React from 'react';
import { useTechnologies } from '@/lib/config';
import { TechIcon } from '@/components/ui/TechIcon';

/**
 * Technology grid component for About section in tile layout
 * Displays first 8 technologies in a 4x2 grid (excludes Docker due to space constraints)
 * Increased icon size to 40px for better visibility on large displays
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
      {/* 4 columns, 2 rows grid with responsive gap */}
      <div className="grid grid-cols-4 gap-3">
        {displayTechs.map((tech, idx) => (
          <TechIcon
            key={idx}
            iconName={tech.icon}
            name={tech.name}
            size={40}  // Increased from 32px for better scaling on large displays
          />
        ))}
      </div>
    </div>
  );
};
