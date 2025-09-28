'use client';

import React, { useEffect, useState } from 'react';
import { useTheme, AccentColor, ThemePreset } from '@/contexts/ThemeContext';

interface ThemeTileProps {
  isBlurred?: boolean;
}

const ThemeTile: React.FC<ThemeTileProps> = ({ isBlurred = false }) => {
  const { theme, setThemePreset, setAccentColor, toggleBackgroundEffect, getAccentHex } = useTheme();

  return (
    <div className={`h-full flex flex-col font-mono text-sm transition-all duration-300 ${
      isBlurred ? 'text-[#a9b1d6]/70' : 'text-[#a9b1d6]'
    }`}>
      {/* Header */}
      <div className="mb-1">
        <h2 className="text-[#7aa2f7] font-bold flex items-center gap-1">
          <span className="text-xs">🎨</span>
          <span className="text-xs">Theme</span>
        </h2>
      </div>

      {/* Color Palette */}
      <div className="space-y-1">
        <div className="text-[10px]" style={{ color: 'var(--theme-text-dimmed)' }}>Accent Color</div>
        <div className="grid grid-cols-5 gap-1">
          {/* All colors in optimized grid */}
          {([
            { name: 'rose' as AccentColor, hex: '#f43f5e' },
            { name: 'pink' as AccentColor, hex: '#ec4899' },
            { name: 'fuchsia' as AccentColor, hex: '#d946ef' },
            { name: 'purple' as AccentColor, hex: '#a855f7' },
            { name: 'violet' as AccentColor, hex: '#8b5cf6' },
            { name: 'indigo' as AccentColor, hex: '#6366f1' },
            { name: 'blue' as AccentColor, hex: '#3b82f6' },
            { name: 'sky' as AccentColor, hex: '#0ea5e9' },
            { name: 'cyan' as AccentColor, hex: '#06b6d4' },
            { name: 'teal' as AccentColor, hex: '#14b8a6' },
            { name: 'emerald' as AccentColor, hex: '#10b981' },
            { name: 'green' as AccentColor, hex: '#22c55e' },
            { name: 'lime' as AccentColor, hex: '#84cc16' },
            { name: 'amber' as AccentColor, hex: '#f59e0b' },
            { name: 'orange' as AccentColor, hex: '#f97316' }
          ]).map((color) => (
            <button
              key={color.name}
              onClick={() => setAccentColor(color.name)}
              className={`rounded cursor-pointer hover:scale-110 transition-transform border-2 ${
                theme.accentColor === color.name
                  ? 'border-white shadow-lg scale-110'
                  : 'border-[#414868]/30'
              } w-5 h-5 sm:w-6 sm:h-6 md:w-5 md:h-5 lg:w-6 lg:h-6`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
              aria-label={`Select ${color.name} accent color`}
            />
          ))}
        </div>
      </div>

      {/* Theme Presets */}
      <div className="mt-2 space-y-1">
        <div className="text-[10px]" style={{ color: 'var(--theme-text-dimmed)' }}>Theme</div>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => setThemePreset('solarized-light')}
            className="px-1.5 py-0.5 text-[10px] rounded transition-colors text-left"
            style={{
              backgroundColor: theme.preset === 'solarized-light' ? 'var(--theme-primary)' : 'rgba(var(--theme-surface-rgb), 0.5)',
              color: theme.preset === 'solarized-light' ? 'var(--theme-bg)' : 'var(--theme-text)',
              fontWeight: theme.preset === 'solarized-light' ? 'bold' : 'normal'
            }}
            aria-pressed={theme.preset === 'solarized-light'}
          >
            ☀️ Solarized
          </button>
          <button
            onClick={() => setThemePreset('nord')}
            className="px-1.5 py-0.5 text-[10px] rounded transition-colors text-left"
            style={{
              backgroundColor: theme.preset === 'nord' ? 'var(--theme-primary)' : 'rgba(var(--theme-surface-rgb), 0.5)',
              color: theme.preset === 'nord' ? 'var(--theme-bg)' : 'var(--theme-text)',
              fontWeight: theme.preset === 'nord' ? 'bold' : 'normal'
            }}
            aria-pressed={theme.preset === 'nord'}
          >
            ❄️ Nord
          </button>
          <button
            onClick={() => setThemePreset('tokyo-night')}
            className="px-1.5 py-0.5 text-[10px] rounded transition-colors text-left"
            style={{
              backgroundColor: theme.preset === 'tokyo-night' ? 'var(--theme-primary)' : 'rgba(var(--theme-surface-rgb), 0.5)',
              color: theme.preset === 'tokyo-night' ? 'var(--theme-bg)' : 'var(--theme-text)',
              fontWeight: theme.preset === 'tokyo-night' ? 'bold' : 'normal'
            }}
            aria-pressed={theme.preset === 'tokyo-night'}
          >
            🌃 Tokyo Night
          </button>
        </div>
      </div>

      {/* Background Effect Toggle */}
      <div className="mt-auto">
        <label className="flex items-center gap-1 cursor-pointer text-[10px]">
          <input
            type="checkbox"
            checked={theme.backgroundEffect}
            onChange={toggleBackgroundEffect}
            className="w-3 h-3 rounded border-[#414868] bg-transparent checked:bg-[#7aa2f7] focus:outline-none"
            aria-label="Toggle background effect"
          />
          <span style={{ color: 'var(--theme-text-dimmed)' }}>Background</span>
        </label>
      </div>
    </div>
  );
};

export default ThemeTile;