'use client';

import React from 'react';
import Image from 'next/image';
import { useTheme, type ThemePreset } from '@/contexts/ThemeContext';
import { BLURRED_WALLPAPERS } from '@/lib/wallpapers.generated';

// Per-preset treatment of the wallpaper. The blur is baked into the files
// (scripts/build-wallpapers.mjs), so only cheap color filters remain in CSS.
const WALLPAPER_FX: Record<ThemePreset, { overlay: string; brightness: number; contrast: number }> = {
  'tokyo-night': { overlay: 'rgba(26, 27, 38, 0.5)', brightness: 0.6, contrast: 1.1 },
  nord: { overlay: 'rgba(46, 52, 64, 0.5)', brightness: 0.7, contrast: 1.05 },
  'solarized-light': { overlay: 'rgba(253, 246, 227, 0.65)', brightness: 0.95, contrast: 0.95 },
};

/** 'https://cdn.dleer.ai/images/purple-girl.webp' or '/images/purple-girl.webp' -> 'purple-girl' */
function wallpaperName(url: string): string {
  return url.split('/').pop()?.replace(/\.[a-z0-9]+$/i, '') ?? '';
}

/**
 * The animated backdrop behind every layout: the preset's gradient, the chosen wallpaper
 * (pre-blurred, a few KB, from lib/wallpapers.generated.ts), its color overlay, orbs, grid,
 * noise, vignette and stars. The preset comes from ThemeContext; a stored wallpaper that has no
 * pre-blurred copy shows the gradient alone.
 */
const Background: React.FC = () => {
  const { theme } = useTheme();
  const fx = WALLPAPER_FX[theme.preset];
  const wallpaper = theme.backgroundImage ? BLURRED_WALLPAPERS[wallpaperName(theme.backgroundImage)] : undefined;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient background - uses theme colors */}
      <div
        className="absolute inset-0 bg-gradient-to-br"
        style={{
          backgroundImage: 'linear-gradient(to bottom right, var(--theme-bg), var(--theme-surface), var(--theme-bg))'
        }}>
        {/* Wallpaper: a pre-blurred static file of a few KB, so no placeholder: next/image's blur
            placeholder is an SVG Gaussian blur drawn at full screen, which cost 0.5 to 1 s of main
            thread per load (spec P13) */}
        {wallpaper && (
          <div className="absolute inset-0" style={{ opacity: 0.85 }}>
            <Image
              src={wallpaper}
              alt=""
              fill
              unoptimized
              sizes="100vw"
              style={{ objectFit: 'cover', filter: `brightness(${fx.brightness}) contrast(${fx.contrast})` }}
            />
          </div>
        )}

        {/* Theme-specific overlay for color integration - only shown with wallpaper */}
        {wallpaper && (
          <div
            className="absolute inset-0 transition-colors duration-500"
            style={{
              backgroundColor: fx.overlay,
              mixBlendMode: theme.preset === 'solarized-light' ? 'multiply' : 'overlay'
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