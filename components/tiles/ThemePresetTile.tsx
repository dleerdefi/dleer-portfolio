'use client';

import React from 'react';
import { useTheme, ThemePreset } from '@/contexts/ThemeContext';
import { SolarizedIcon, NordIcon, TokyoNightIcon } from '@/components/icons/ThemeIcons';

interface ThemePresetTileProps {
  isBlurred?: boolean;
}

const ThemePresetTile: React.FC<ThemePresetTileProps> = ({ isBlurred = false }) => {
  const { theme, setThemePreset } = useTheme();

  return (
    <div className={`h-full flex items-center justify-center font-mono transition-all duration-300 ${
      isBlurred ? 'text-[#a9b1d6]/70' : 'text-[#a9b1d6]'
    }`}>
      {/* Theme Preset Icons */}
      <div className="flex items-center justify-center gap-6">
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
          <SolarizedIcon size={24} />
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
          <NordIcon size={24} />
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
          <TokyoNightIcon size={24} />
        </button>
      </div>
    </div>
  );
};

export default ThemePresetTile;
