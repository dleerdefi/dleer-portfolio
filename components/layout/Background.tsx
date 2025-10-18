'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTheme } from '@/contexts/ThemeContext';

interface BackgroundProps {
  wallpaperUrl?: string;
}

// Theme-specific background configurations
const themeBackgrounds: Record<string, {
  url: string;
  overlay: string;
  blur: string;
  brightness: number;
  contrast: number;
  scale: number;
}> = {
  'theme-tokyo-night': {
    url: '/images/purple-girl.webp',
    overlay: 'rgba(26, 27, 38, 0.5)',
    blur: '8px',
    brightness: 0.6,
    contrast: 1.1,
    scale: 1.1
  },
  'theme-nord': {
    url: '/images/cool_rocks.webp',
    overlay: 'rgba(46, 52, 64, 0.5)',
    blur: '6px',
    brightness: 0.7,
    contrast: 1.05,
    scale: 1.1
  },
  'theme-solarized-light': {
    url: '/images/pastel-window.webp',
    overlay: 'rgba(253, 246, 227, 0.65)',
    blur: '4px',
    brightness: 0.95,
    contrast: 0.95,
    scale: 1.1
  }
};

const Background: React.FC<BackgroundProps> = ({ wallpaperUrl }) => {
  const { theme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState<string>('theme-tokyo-night');
  const [displayedWallpaper, setDisplayedWallpaper] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  useEffect(() => {
    // Detect current theme from document root class
    const detectTheme = () => {
      const root = document.documentElement;
      const themeClass = Array.from(root.classList).find(cls => cls.startsWith('theme-'));
      if (themeClass && themeBackgrounds[themeClass]) {
        setCurrentTheme(themeClass);
      }
    };

    detectTheme();

    // Watch for theme changes
    const observer = new MutationObserver(detectTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  const bgConfig = themeBackgrounds[currentTheme] || themeBackgrounds['theme-tokyo-night'];

  // Use backgroundImage from theme context, fallback to wallpaperUrl prop, then bgConfig.url
  const activeWallpaper = wallpaperUrl || theme.backgroundImage || bgConfig.url;
  const showWallpaper = theme.backgroundImage !== null || wallpaperUrl !== undefined;

  // FIX 1: Preload adjacent carousel images for instant switching
  useEffect(() => {
    if (typeof window === 'undefined' || !theme.backgroundImage) return;

    // Get current theme's background array from ThemeContext
    import('@/contexts/ThemeContext').then(({ themeBackgrounds }) => {
      const currentBgArray = theme.preset ? themeBackgrounds[theme.preset] : [];
      if (!currentBgArray || currentBgArray.length === 0) return;

      const currentIndex = currentBgArray.indexOf(theme.backgroundImage!);
      if (currentIndex === -1) return;

      // Preload next image
      if (currentIndex < currentBgArray.length - 1) {
        const nextImg = new window.Image();
        nextImg.src = currentBgArray[currentIndex + 1];
      }

      // Preload previous image
      if (currentIndex > 0) {
        const prevImg = new window.Image();
        prevImg.src = currentBgArray[currentIndex - 1];
      }
    });
  }, [theme.backgroundImage, theme.preset]);

  // FIX 2: Reset loading state when image changes
  useEffect(() => {
    setImageLoaded(false);
  }, [displayedWallpaper]);

  // Update displayed wallpaper when active wallpaper changes
  // Uses CSS transition for smooth crossfade (respects z-index stacking)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (displayedWallpaper !== activeWallpaper) {
      setDisplayedWallpaper(activeWallpaper);
    }
  }, [activeWallpaper, displayedWallpaper]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient background - uses theme colors */}
      <div
        className="absolute inset-0 bg-gradient-to-br"
        style={{
          backgroundImage: 'linear-gradient(to bottom right, var(--theme-bg), var(--theme-surface), var(--theme-bg))'
        }}>
        {/* Theme-aware wallpaper layer with enhancements - only shown if not NONE */}
        {showWallpaper && displayedWallpaper && (
          <div
            className="absolute inset-0"
            style={{
              opacity: imageLoaded ? 0.85 : 0,
              transition: 'opacity 300ms ease'
              // viewTransitionName removed - was creating stacking context above tiles
            } as React.CSSProperties}
          >
            <Image
              src={displayedWallpaper}
              alt="Background wallpaper"
              fill
              priority
              quality={85}
              sizes="100vw"
              onLoad={() => setImageLoaded(true)}
              style={{
                objectFit: 'cover',
                filter: `blur(${bgConfig.blur}) brightness(${bgConfig.brightness}) contrast(${bgConfig.contrast})`,
                transform: `scale(${bgConfig.scale})`,
                transformOrigin: 'center',
                willChange: 'opacity, filter, transform'
              }}
            />
          </div>
        )}

        {/* Theme-specific overlay for color integration - only shown with wallpaper */}
        {showWallpaper && (
          <div
            className="absolute inset-0 transition-colors duration-500"
            style={{
              backgroundColor: bgConfig.overlay,
              mixBlendMode: currentTheme === 'theme-solarized-light' ? 'multiply' : 'overlay'
            }}
          />
        )}

        {/* Vibrant animated gradient orbs - matching the mockup's pink/blue aesthetic */}
        <div className="background-orbs">
          <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-[#f38ba8] to-[#cba6f7] rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-r from-[#89b4fa] to-[#7dcfff] rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-r from-[#cba6f7] to-[#89dceb] rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-blob animation-delay-4000"></div>

          {/* Extra vibrant spots for depth */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-[#bb9af7]/20 via-[#7aa2f7]/20 to-[#7dcfff]/20 rounded-full filter blur-3xl"></div>
        </div>

        {/* Grid pattern overlay - subtle */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(137, 180, 250, 0.15) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(137, 180, 250, 0.15) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />

        {/* Noise texture for depth */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            mixBlendMode: 'overlay',
          }}
        />

        {/* Vignette effect */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-[#1a1b26]/50"></div>
      </div>

      {/* Stars/particles effect */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full opacity-50 animate-pulse"></div>
        <div className="absolute top-3/4 left-2/3 w-1 h-1 bg-white rounded-full opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 right-1/4 w-0.5 h-0.5 bg-white rounded-full opacity-40 animate-pulse animation-delay-4000"></div>
        <div className="absolute bottom-1/3 left-1/2 w-0.5 h-0.5 bg-white rounded-full opacity-20 animate-pulse"></div>
      </div>
    </div>
  );
};

export default Background;