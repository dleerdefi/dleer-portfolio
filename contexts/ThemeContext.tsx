'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getImageUrl } from '@/lib/image-paths';

// Theme preset types - Final three-tier system
export type ThemePreset = 'solarized-light' | 'nord' | 'tokyo-night';

// Default accent colors for each theme preset (per spec)
const themeDefaultAccents: Record<ThemePreset, AccentColor> = {
  'solarized-light': 'pink',    // #d33682 maps closest to pink/magenta
  'nord': 'blue',                // #81A1C1 maps to blue
  'tokyo-night': 'purple'        // #bb9af7 maps to purple
};

// Background images for each theme preset
export const themeBackgrounds: Record<ThemePreset, string[]> = {
  'tokyo-night': [
    getImageUrl('purple-girl.webp'),
    getImageUrl('cat_anime-girl.webp'),
    getImageUrl('shiny_purple.webp'),
    getImageUrl('pixel_big_city.webp')
  ],
  'nord': [
    getImageUrl('cool_rocks.webp'),
    getImageUrl('lets_go_home.webp'),
    getImageUrl('gradient-pb.webp')
  ],
  'solarized-light': [
    getImageUrl('pastel-window.webp'),
    getImageUrl('yellow_kyoto.webp'),
    getImageUrl('ign_colorful.webp')
  ]
};

// Accent color types
export type AccentColor =
  | 'rose' | 'pink' | 'fuchsia' | 'purple' | 'violet'
  | 'indigo' | 'blue' | 'sky' | 'cyan' | 'teal'
  | 'emerald' | 'green' | 'lime' | 'amber' | 'orange';

// Map accent colors to hex values
export const accentColorMap: Record<AccentColor, string> = {
  rose: '#f43f5e',
  pink: '#ec4899',
  fuchsia: '#d946ef',
  purple: '#a855f7',
  violet: '#8b5cf6',
  indigo: '#6366f1',
  blue: '#3b82f6',
  sky: '#0ea5e9',
  cyan: '#06b6d4',
  teal: '#14b8a6',
  emerald: '#10b981',
  green: '#22c55e',
  lime: '#84cc16',
  amber: '#f59e0b',
  orange: '#f97316'
};

// Theme state interface
interface ThemeState {
  preset: ThemePreset;
  accentColor: AccentColor;
  backgroundEffect: boolean;
  backgroundImage: string | null;  // null = no background, string = image path
}

// Theme context value interface
interface ThemeContextValue {
  theme: ThemeState;
  setThemePreset: (preset: ThemePreset) => void;
  setAccentColor: (color: AccentColor) => void;
  toggleBackgroundEffect: () => void;
  setBackgroundImage: (image: string | null) => void;
  getAccentHex: () => string;
}

// Create context
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// Local storage keys
const STORAGE_KEYS = {
  preset: 'theme-preset',
  accent: 'theme-accent',
  backgroundEffect: 'theme-background-effect',
  backgroundImagePrefix: 'theme-background-image-'  // Per-theme storage
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state with defaults - start with dark theme
  const [theme, setTheme] = useState<ThemeState>({
    preset: 'tokyo-night',
    accentColor: themeDefaultAccents['tokyo-night'],  // Use theme default
    backgroundEffect: true,
    backgroundImage: themeBackgrounds['tokyo-night'][0]  // Default to first bg of theme
  });

  // Load saved preferences on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadedPreset = (localStorage.getItem(STORAGE_KEYS.preset) as ThemePreset) || 'tokyo-night';
    const loadedBgEffect = localStorage.getItem(STORAGE_KEYS.backgroundEffect);
    const loadedBgImage = localStorage.getItem(`${STORAGE_KEYS.backgroundImagePrefix}${loadedPreset}`);

    // Don't load accent from storage - always use theme default
    const defaultAccent = themeDefaultAccents[loadedPreset];

    // Load background image for this theme, or use first in array
    const defaultBgImage = loadedBgImage || themeBackgrounds[loadedPreset][0];

    setTheme(prev => ({
      ...prev,
      preset: loadedPreset,
      accentColor: defaultAccent,  // Always use theme default
      backgroundEffect: loadedBgEffect === null ? prev.backgroundEffect : loadedBgEffect === 'true',
      backgroundImage: defaultBgImage
    }));
  }, []);

  // Apply theme classes to root element
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;

    // Remove old theme and accent classes using classList API
    const classesToRemove: string[] = [];
    root.classList.forEach((cls) => {
      if (cls.startsWith('theme-') || cls.startsWith('accent-')) {
        classesToRemove.push(cls);
      }
    });
    classesToRemove.forEach((cls) => root.classList.remove(cls));

    // Add new theme classes
    root.classList.add(`theme-${theme.preset}`);
    root.classList.add(`accent-${theme.accentColor}`);

    // Handle background effect
    if (theme.backgroundEffect) {
      root.classList.add('bg-effect-enabled');
    } else {
      root.classList.remove('bg-effect-enabled');
    }

  }, [theme]);

  // Force theme class re-application when transitioning from mobile to desktop
  // This recovers from MobileParallaxLayout's className override
  useEffect(() => {
    const handleResize = () => {
      if (typeof window === 'undefined') return;

      // Only act when in desktop view (where ThemeContext should be in control)
      if (window.innerWidth >= 1024) {
        const root = document.documentElement;

        // CRITICAL: Remove inline styles set by MobileParallaxLayout
        // Inline styles have higher CSS specificity than classes, so they override all theme changes
        // Without this, accent color stays stuck at #7dcfff even when user changes theme/accent
        root.style.removeProperty('--accent-color');
        root.style.removeProperty('--accent-color-rgb');

        const hasThemeClass = Array.from(root.classList).some(cls => cls.startsWith('theme-'));

        // If theme classes are missing, mobile parallax left DOM in broken state
        // Re-apply classes from current theme state
        if (!hasThemeClass) {
          root.classList.add(`theme-${theme.preset}`);
          root.classList.add(`accent-${theme.accentColor}`);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [theme.preset, theme.accentColor]);

  // Set theme preset - resets accent to theme default per spec
  const setThemePreset = useCallback((preset: ThemePreset) => {
    const defaultAccent = themeDefaultAccents[preset];

    // Load saved background for this theme, or use first as default
    const savedBgImage = localStorage.getItem(`${STORAGE_KEYS.backgroundImagePrefix}${preset}`);
    const defaultBgImage = savedBgImage || themeBackgrounds[preset][0];

    setTheme(prev => ({
      ...prev,
      preset,
      accentColor: defaultAccent,  // Reset to theme's default accent
      backgroundImage: defaultBgImage  // Load theme-specific background
    }));
    localStorage.setItem(STORAGE_KEYS.preset, preset);
    // Remove saved accent color to prevent persistence across themes
    localStorage.removeItem(STORAGE_KEYS.accent);
  }, []);

  // Set accent color
  const setAccentColor = useCallback((color: AccentColor) => {
    setTheme(prev => ({ ...prev, accentColor: color }));
    localStorage.setItem(STORAGE_KEYS.accent, color);
  }, []);

  // Toggle background effect
  const toggleBackgroundEffect = useCallback(() => {
    setTheme(prev => {
      const newValue = !prev.backgroundEffect;
      localStorage.setItem(STORAGE_KEYS.backgroundEffect, String(newValue));
      return { ...prev, backgroundEffect: newValue };
    });
  }, []);

  // Set background image - saves per-theme
  const setBackgroundImage = useCallback((image: string | null) => {
    setTheme(prev => ({ ...prev, backgroundImage: image }));
    const key = `${STORAGE_KEYS.backgroundImagePrefix}${theme.preset}`;
    if (image === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, image);
    }
  }, [theme.preset]);

  // Get current accent color hex value
  const getAccentHex = useCallback(() => {
    return accentColorMap[theme.accentColor];
  }, [theme.accentColor]);

  const value: ThemeContextValue = {
    theme,
    setThemePreset,
    setAccentColor,
    toggleBackgroundEffect,
    setBackgroundImage,
    getAccentHex
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};

// Optional: Export specific theme hooks
export const useThemePreset = () => {
  const { theme, setThemePreset } = useTheme();
  return { preset: theme.preset, setThemePreset };
};

export const useAccentColor = () => {
  const { theme, setAccentColor, getAccentHex } = useTheme();
  return {
    accentColor: theme.accentColor,
    setAccentColor,
    accentHex: getAccentHex()
  };
};

export const useBackgroundEffect = () => {
  const { theme, toggleBackgroundEffect } = useTheme();
  return {
    backgroundEffect: theme.backgroundEffect,
    toggleBackgroundEffect
  };
};