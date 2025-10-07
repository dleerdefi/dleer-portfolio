'use client';

import React, { useEffect, useState } from 'react';
import { useTheme, AccentColor, ThemePreset, themeBackgrounds } from '@/contexts/ThemeContext';
import { SolarizedIcon, NordIcon, TokyoNightIcon } from '@/components/icons/ThemeIcons';

interface ThemeTileProps {
  isBlurred?: boolean;
}

const ThemeTile: React.FC<ThemeTileProps> = ({ isBlurred = false }) => {
  const { theme, setThemePreset, setAccentColor, setBackgroundImage, getAccentHex } = useTheme();

  // Get current backgrounds for the active theme
  const currentBackgrounds = themeBackgrounds[theme.preset];
  const currentIndex = theme.backgroundImage === null
    ? -1 // "NONE" option
    : currentBackgrounds.indexOf(theme.backgroundImage);

  const handlePrevBackground = () => {
    if (currentIndex <= -1) {
      // From NONE to last image
      setBackgroundImage(currentBackgrounds[currentBackgrounds.length - 1]);
    } else if (currentIndex === 0) {
      // From first image to NONE
      setBackgroundImage(null);
    } else {
      // Navigate backwards
      setBackgroundImage(currentBackgrounds[currentIndex - 1]);
    }
  };

  const handleNextBackground = () => {
    if (currentIndex === -1) {
      // From NONE to first image
      setBackgroundImage(currentBackgrounds[0]);
    } else if (currentIndex === currentBackgrounds.length - 1) {
      // From last image to NONE
      setBackgroundImage(null);
    } else {
      // Navigate forwards
      setBackgroundImage(currentBackgrounds[currentIndex + 1]);
    }
  };

  return (
    <div className={`h-full flex flex-col font-mono text-sm transition-all duration-300 ${
      isBlurred ? 'text-[#a9b1d6]/70' : 'text-[#a9b1d6]'
    }`}>
      {/* Theme Presets - Icon-only Buttons (TOP) */}
      <div className="flex items-center justify-center gap-6 pt-2">
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

      {/* Color Palette (MIDDLE) */}
      <div className="flex-1 flex items-center justify-center">
        <div className="grid grid-cols-5 gap-1">
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

      {/* Background Image Carousel (BOTTOM) */}
      <div className="space-y-1 pb-2">
        <div className="flex items-center gap-2">
          {/* Previous Button */}
          <button
            onClick={handlePrevBackground}
            className="px-2 py-1 rounded transition-all hover:scale-110"
            style={{
              backgroundColor: 'rgba(var(--theme-surface-rgb), 0.5)',
              color: 'var(--theme-text)'
            }}
            aria-label="Previous background"
          >
            ‹
          </button>

          {/* Preview */}
          <div
            className="flex-1 h-12 rounded border-2 flex items-center justify-center text-[10px] overflow-hidden"
            style={{
              borderColor: 'rgba(var(--accent-color-rgb), 0.5)',
              backgroundColor: 'rgba(var(--theme-surface-rgb), 0.3)'
            }}
          >
            {theme.backgroundImage === null ? (
              <span style={{ color: 'var(--theme-text-dimmed)' }}>NONE</span>
            ) : (
              <img
                src={theme.backgroundImage}
                alt="Background preview"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Next Button */}
          <button
            onClick={handleNextBackground}
            className="px-2 py-1 rounded transition-all hover:scale-110"
            style={{
              backgroundColor: 'rgba(var(--theme-surface-rgb), 0.5)',
              color: 'var(--theme-text)'
            }}
            aria-label="Next background"
          >
            ›
          </button>
        </div>

        {/* Position indicator */}
        <div className="text-center text-[9px]" style={{ color: 'var(--theme-text-dimmed)' }}>
          {currentIndex === -1 ? 'None' : `${currentIndex + 1} / ${currentBackgrounds.length}`}
        </div>
      </div>
    </div>
  );
};

export default ThemeTile;