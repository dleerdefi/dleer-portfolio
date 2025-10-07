'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { useTheme, themeBackgrounds } from '@/contexts/ThemeContext';

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

  // Helper function to convert full image path to thumbnail path
  const getThumbnailPath = (imagePath: string): string => {
    return imagePath.replace('/images/', '/images/thumbs/').replace('.webp', '_thumb.webp');
  };

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
      {/* Background Image Carousel */}
      <div className="w-full space-y-2">
        <div className="flex items-center gap-3">
          {/* Previous Button */}
          <button
            onClick={handlePrevBackground}
            className="px-2 py-1 rounded transition-all hover:scale-110 flex-shrink-0 w-8"
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
            className="h-16 rounded border-2 flex items-center justify-center text-xs overflow-hidden relative"
            style={{
              borderColor: 'rgba(var(--accent-color-rgb), 0.5)',
              backgroundColor: 'rgba(var(--theme-surface-rgb), 0.3)',
              flexGrow: 1,
              flexShrink: 1,
              flexBasis: '0%',
              minWidth: 0
            }}
          >
            {theme.backgroundImage === null ? (
              <span style={{ color: 'var(--theme-text-dimmed)' }}>NONE</span>
            ) : (
              <Image
                src={getThumbnailPath(theme.backgroundImage)}
                alt="Background preview"
                fill
                quality={70}
                sizes="150px"
                style={{ objectFit: 'cover' }}
              />
            )}
          </div>

          {/* Next Button */}
          <button
            onClick={handleNextBackground}
            className="px-2 py-1 rounded transition-all hover:scale-110 flex-shrink-0 w-8"
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
        <div className="text-center text-xs" style={{ color: 'var(--theme-text-dimmed)' }}>
          {currentIndex === -1 ? 'None' : `${currentIndex + 1} / ${currentBackgrounds.length}`}
        </div>
      </div>
    </div>
  );
};

export default BackgroundTile;
