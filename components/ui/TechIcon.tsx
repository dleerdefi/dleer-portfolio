import React from 'react';
import { IconType } from 'react-icons';
import {
  SiPython,
  SiTypescript,
  SiReact,
  SiTailwindcss,
  SiPostgresql,
  SiNeo4J,
  SiRedis,
  SiApachekafka,
  SiDocker
} from 'react-icons/si';

interface TechIconProps {
  iconName: string;
  name: string;
  size?: number;
}

// Icon map for tree-shaking - only imports icons actually used
const ICON_MAP: Record<string, IconType> = {
  SiPython,
  SiTypescript,
  SiReact,
  SiTailwindcss,
  SiPostgresql,
  SiNeo4J,
  SiRedis,
  SiApachekafka,
  SiDocker
};

/**
 * Reusable technology icon component
 * Renders technology logos from react-icons with uniform sizing and theme integration
 * Optimized: Only bundles 9 icons instead of 600+ (~4.5MB savings)
 */
export const TechIcon: React.FC<TechIconProps> = ({
  iconName,
  name,
  size = 48
}) => {
  // Get icon from explicit map (tree-shakeable)
  const IconComponent = ICON_MAP[iconName];

  // Fallback if icon not found
  if (!IconComponent) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-3"
        style={{
          width: `${size + 48}px`,
          height: `${size + 48}px`
        }}
      >
        <div
          className="flex items-center justify-center rounded-lg font-bold text-xs"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: 'rgba(var(--theme-text-rgb), 0.1)',
            color: 'var(--theme-text-dimmed)'
          }}
        >
          ?
        </div>
        <span
          className="text-xs text-center"
          style={{
            color: 'var(--theme-text-dimmed)',
            maxWidth: `${size + 32}px`
          }}
        >
          {name}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 group cursor-pointer tech-icon-wrapper">
      {/* Icon with white color and accent glow on hover */}
      <IconComponent
        size={size}
        style={{
          color: 'var(--theme-text)',
          opacity: 0.9,
          filter: 'drop-shadow(0 0 0px rgba(var(--accent-color-rgb), 0))',
          transition: 'all 0.3s ease'
        }}
        className="tech-icon group-hover:opacity-100"
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.filter = 'drop-shadow(0 0 12px rgba(var(--accent-color-rgb), 0.6))';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = '';
          e.currentTarget.style.filter = 'drop-shadow(0 0 0px rgba(var(--accent-color-rgb), 0))';
        }}
      />

      {/* Technology Name */}
      <span
        className="text-xs font-medium text-center transition-colors duration-300"
        style={{
          color: 'var(--theme-text-dimmed)',
          maxWidth: `${size + 32}px`,
          fontFamily: 'var(--font-jetbrains-mono), monospace'
        }}
      >
        {name}
      </span>
    </div>
  );
};