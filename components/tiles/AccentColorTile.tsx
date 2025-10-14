'use client';

import React from 'react';
import { useTheme, AccentColor } from '@/contexts/ThemeContext';
import { UI_SIZES } from '@/lib/constants/typography';

interface AccentColorTileProps {
  isBlurred?: boolean;
}

const AccentColorTile: React.FC<AccentColorTileProps> = ({ isBlurred = false }) => {
  const { theme, setAccentColor } = useTheme();

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
    <div className={`h-full flex items-center justify-center font-mono transition-all duration-300 ${
      isBlurred ? 'text-[#a9b1d6]/70' : 'text-[#a9b1d6]'
    }`}>
      {/* Color Palette Grid */}
      <div className="grid grid-cols-5 gap-2">
        {colors.map((color) => (
          <button
            key={color.name}
            onClick={() => setAccentColor(color.name)}
            className={`rounded cursor-pointer hover:scale-110 transition-transform border-2 ${
              theme.accentColor === color.name
                ? 'border-white shadow-lg scale-110'
                : 'border-[#414868]/30'
            }`}
            style={{
              backgroundColor: color.hex,
              width: UI_SIZES.colorTileSm,
              height: UI_SIZES.colorTileSm
            }}
            title={color.name}
            aria-label={`Select ${color.name} accent color`}
          />
        ))}
      </div>
    </div>
  );
};

export default AccentColorTile;
