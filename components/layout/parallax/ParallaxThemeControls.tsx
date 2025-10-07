'use client';

import React from 'react';
import { useTheme, AccentColor, ThemePreset } from '@/contexts/ThemeContext';
import { SolarizedIcon, NordIcon, TokyoNightIcon } from '@/components/icons/ThemeIcons';

interface ParallaxThemeControlsProps {
  className?: string;
}

/**
 * Compact theme controls for parallax mobile layout
 * Integrates with Neofetch section - no background selector (not needed for parallax)
 */
const ParallaxThemeControls: React.FC<ParallaxThemeControlsProps> = ({ className = '' }) => {
  const { theme, setThemePreset, setAccentColor } = useTheme();

  const colors: Array<{ name: AccentColor; hex: string }> = [
    { name: 'rose', hex: '#f43f5e' },
    { name: 'pink', hex: '#ec4899' },
    { name: 'fuchsia', hex: '#d946ef' },
    { name: 'purple', hex: '#a855f7' },
    { name: 'violet', hex: '#8b5cf6' },
    { name: 'indigo', hex: '#6366f1' },
    { name: 'blue', hex: '#3b82f6' },
    { name: 'sky', hex: '#0ea5e9' },
    { name: 'cyan', hex: '#06b6d4' },
    { name: 'teal', hex: '#14b8a6' },
    { name: 'emerald', hex: '#10b981' },
    { name: 'green', hex: '#22c55e' },
    { name: 'lime', hex: '#84cc16' },
    { name: 'amber', hex: '#f59e0b' },
    { name: 'orange', hex: '#f97316' }
  ];

  return (
    <div className={`flex flex-col gap-4 font-mono ${className}`}>
      {/* Theme Preset Selector */}
      <div className="flex flex-col gap-2">
        <div
          className="text-xs uppercase tracking-wider"
          style={{ color: 'var(--theme-text-dimmed)' }}
        >
          Theme
        </div>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setThemePreset('solarized-light')}
            className="transition-all hover:scale-110"
            style={{
              color: theme.preset === 'solarized-light' ? 'var(--accent-color)' : 'var(--theme-text)',
              opacity: theme.preset === 'solarized-light' ? 1 : 0.5
            }}
            aria-pressed={theme.preset === 'solarized-light'}
            title="Solarized Light"
          >
            <SolarizedIcon size={28} />
          </button>
          <button
            onClick={() => setThemePreset('nord')}
            className="transition-all hover:scale-110"
            style={{
              color: theme.preset === 'nord' ? 'var(--accent-color)' : 'var(--theme-text)',
              opacity: theme.preset === 'nord' ? 1 : 0.5
            }}
            aria-pressed={theme.preset === 'nord'}
            title="Nord"
          >
            <NordIcon size={28} />
          </button>
          <button
            onClick={() => setThemePreset('tokyo-night')}
            className="transition-all hover:scale-110"
            style={{
              color: theme.preset === 'tokyo-night' ? 'var(--accent-color)' : 'var(--theme-text)',
              opacity: theme.preset === 'tokyo-night' ? 1 : 0.5
            }}
            aria-pressed={theme.preset === 'tokyo-night'}
            title="Tokyo Night"
          >
            <TokyoNightIcon size={28} />
          </button>
        </div>
      </div>

      {/* Accent Color Palette */}
      <div className="flex flex-col gap-2">
        <div
          className="text-xs uppercase tracking-wider"
          style={{ color: 'var(--theme-text-dimmed)' }}
        >
          Accent
        </div>
        <div className="grid grid-cols-5 gap-2 justify-items-center">
          {colors.map((color) => (
            <button
              key={color.name}
              onClick={() => setAccentColor(color.name)}
              className={`rounded cursor-pointer hover:scale-110 transition-transform border-2 ${
                theme.accentColor === color.name
                  ? 'border-white shadow-lg scale-110'
                  : 'border-[#414868]/30'
              } w-7 h-7`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
              aria-label={`Select ${color.name} accent color`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParallaxThemeControls;
