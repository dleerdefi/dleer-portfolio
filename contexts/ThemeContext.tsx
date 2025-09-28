'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Theme preset types - Final three-tier system
export type ThemePreset = 'solarized-light' | 'nord' | 'tokyo-night';

// Default accent colors for each theme preset (per spec)
const themeDefaultAccents: Record<ThemePreset, AccentColor> = {
  'solarized-light': 'pink',    // #d33682 maps closest to pink/magenta
  'nord': 'blue',                // #81A1C1 maps to blue
  'tokyo-night': 'purple'        // #bb9af7 maps to purple
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
  isTransitioning: boolean;
}

// Theme context value interface
interface ThemeContextValue {
  theme: ThemeState;
  setThemePreset: (preset: ThemePreset) => void;
  setAccentColor: (color: AccentColor) => void;
  toggleBackgroundEffect: () => void;
  getAccentHex: () => string;
}

// Create context
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// Local storage keys
const STORAGE_KEYS = {
  preset: 'theme-preset',
  accent: 'theme-accent',
  backgroundEffect: 'theme-background-effect'
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state with defaults - start with dark theme
  const [theme, setTheme] = useState<ThemeState>({
    preset: 'tokyo-night',
    accentColor: themeDefaultAccents['tokyo-night'],  // Use theme default
    backgroundEffect: true,
    isTransitioning: false
  });

  // Load saved preferences on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadedPreset = (localStorage.getItem(STORAGE_KEYS.preset) as ThemePreset) || 'tokyo-night';
    const loadedBgEffect = localStorage.getItem(STORAGE_KEYS.backgroundEffect);

    // Don't load accent from storage - always use theme default
    const defaultAccent = themeDefaultAccents[loadedPreset];

    setTheme(prev => ({
      ...prev,
      preset: loadedPreset,
      accentColor: defaultAccent,  // Always use theme default
      backgroundEffect: loadedBgEffect === null ? prev.backgroundEffect : loadedBgEffect === 'true'
    }));
  }, []);

  // Apply theme classes to root element
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;

    // Remove old theme classes
    root.className = root.className.replace(/theme-[\w-]+/g, '').replace(/accent-[\w-]+/g, '').trim();

    // Add new theme classes
    root.classList.add(`theme-${theme.preset}`);
    root.classList.add(`accent-${theme.accentColor}`);

    // Handle background effect
    if (theme.backgroundEffect) {
      root.classList.add('bg-effect-enabled');
    } else {
      root.classList.remove('bg-effect-enabled');
    }

    // Add transitioning class
    if (theme.isTransitioning) {
      root.classList.add('theme-transitioning');
      setTimeout(() => {
        setTheme(prev => ({ ...prev, isTransitioning: false }));
        root.classList.remove('theme-transitioning');
      }, 600);
    }
  }, [theme]);

  // Set theme preset - resets accent to theme default per spec
  const setThemePreset = useCallback((preset: ThemePreset) => {
    const defaultAccent = themeDefaultAccents[preset];
    setTheme(prev => ({
      ...prev,
      preset,
      accentColor: defaultAccent,  // Reset to theme's default accent
      isTransitioning: true
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

  // Get current accent color hex value
  const getAccentHex = useCallback(() => {
    return accentColorMap[theme.accentColor];
  }, [theme.accentColor]);

  const value: ThemeContextValue = {
    theme,
    setThemePreset,
    setAccentColor,
    toggleBackgroundEffect,
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