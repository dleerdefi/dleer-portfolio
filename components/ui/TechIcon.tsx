import React from 'react';
import { IconType } from 'react-icons';
import * as SiIcons from 'react-icons/si';

interface TechIconProps {
  iconName: string;
  name: string;
  size?: number;
}

/**
 * Reusable technology icon component
 * Renders technology logos from react-icons with uniform sizing and theme integration
 */
export const TechIcon: React.FC<TechIconProps> = ({
  iconName,
  name,
  size = 48
}) => {
  // Dynamically get icon component from react-icons
  const IconComponent = (SiIcons as any)[iconName] as IconType;

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
    <div className="flex flex-col items-center justify-center gap-3 group">
      {/* Icon Container */}
      <div
        className="relative flex items-center justify-center transition-all duration-300 ease-out"
        style={{
          width: `${size + 48}px`,
          height: `${size + 48}px`,
          padding: '24px',
          border: '1px solid rgba(var(--theme-text-rgb), 0.1)',
          borderRadius: '12px',
          backgroundColor: 'rgba(var(--theme-surface-rgb), 0.3)',
          backdropFilter: 'blur(8px)'
        }}
      >
        {/* Icon */}
        <IconComponent
          size={size}
          style={{
            color: 'var(--theme-text)',
            opacity: 0.9,
            transition: 'all 0.3s ease'
          }}
          className="group-hover:scale-110 group-hover:opacity-100"
        />

        {/* Hover Effect Border */}
        <div
          className="absolute inset-0 rounded-[12px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            border: '2px solid var(--accent-color)',
            pointerEvents: 'none'
          }}
        />

        {/* Hover Glow Effect */}
        <div
          className="absolute inset-0 rounded-[12px] opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-md"
          style={{
            backgroundColor: 'var(--accent-color)',
            pointerEvents: 'none',
            zIndex: -1
          }}
        />
      </div>

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