'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { useTheme, themeBackgrounds } from '@/contexts/ThemeContext';
import { getThumbnailUrl } from '@/lib/image-paths';

interface BackgroundTileProps {
  isBlurred?: boolean;
}

const BackgroundTile: React.FC<BackgroundTileProps> = ({ isBlurred = false }) => {
  const { theme, setBackgroundImage } = useTheme();

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

  // Preload adjacent images for instant carousel navigation
  useEffect(() => {
    if (currentIndex === -1) return; // Don't preload when NONE is selected

    const preloadImage = (src: string) => {
      const img = new window.Image();
      img.src = src;
    };

    // Preload previous image
    if (currentIndex > 0) {
      preloadImage(currentBackgrounds[currentIndex - 1]);
    }

    // Preload next image
    if (currentIndex < currentBackgrounds.length - 1) {
      preloadImage(currentBackgrounds[currentIndex + 1]);
    }
  }, [currentIndex, currentBackgrounds]);

  return (
    <div className={`h-full flex flex-col items-center justify-center font-mono text-sm transition-all duration-300 px-3 ${
      isBlurred ? 'text-[#a9b1d6]/70' : 'text-[#a9b1d6]'
    }`}>
      {/* Background Image Carousel - Compact Centered Layout */}
      <div className="w-full flex flex-col items-center gap-1">
        {/* Preview Image - Scales with tile size (Layer 2 compliant) */}
        <div
          className="w-[85%] aspect-[4/3] rounded border-2 overflow-hidden relative"
          style={{
            borderColor: 'rgba(var(--accent-color-rgb), 0.5)',
            backgroundColor: 'rgba(var(--theme-surface-rgb), 0.3)'
          }}
        >
          {theme.backgroundImage === null ? (
            <span
              className="absolute inset-0 flex items-center justify-center text-xs"
              style={{ color: 'var(--theme-text-dimmed)' }}
            >
              NONE
            </span>
          ) : (
            <Image
              src={getThumbnailUrl(theme.backgroundImage)}
              alt="Background preview"
              fill
              quality={70}
              sizes="(max-width: 1920px) 180px, 240px"
              style={{ objectFit: 'cover' }}
            />
          )}
        </div>

        {/* Navigation arrows - Below preview */}
        <div className="flex gap-2">
          <button
            onClick={handlePrevBackground}
            className="w-5 h-5 flex items-center justify-center rounded transition-all hover:scale-125 text-xs"
            style={{
              backgroundColor: 'rgba(var(--theme-surface-rgb), 0.5)',
              color: 'var(--theme-text)'
            }}
            aria-label="Previous background"
          >
            ‹
          </button>
          <button
            onClick={handleNextBackground}
            className="w-5 h-5 flex items-center justify-center rounded transition-all hover:scale-125 text-xs"
            style={{
              backgroundColor: 'rgba(var(--theme-surface-rgb), 0.5)',
              color: 'var(--theme-text)'
            }}
            aria-label="Next background"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
};

// Memoize to prevent unnecessary re-renders
export default React.memo(BackgroundTile);
