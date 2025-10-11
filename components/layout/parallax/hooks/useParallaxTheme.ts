'use client';

import { useEffect } from 'react';

/**
 * useParallaxTheme Hook
 * Enforces Tokyo Night theme with cyan accent for mobile parallax mode
 * Handles cleanup when transitioning back to desktop
 */
export const useParallaxTheme = () => {
  useEffect(() => {
    const enforceParallaxTheme = () => {
      // Only enforce theme when actually in mobile view
      if (window.innerWidth < 1024) {
        document.documentElement.className = 'tokyo-night';
        document.documentElement.style.setProperty('--accent-color', '#7dcfff');
        document.documentElement.style.setProperty('--accent-color-rgb', '125, 207, 255');
      }
    };

    // Enforce on mount
    enforceParallaxTheme();

    // Re-enforce on resize (handles rotation, window resize, etc.)
    window.addEventListener('resize', enforceParallaxTheme);

    return () => {
      window.removeEventListener('resize', enforceParallaxTheme);

      // CRITICAL: Restore proper theme classes for ThemeContext when unmounting (transitioning to desktop)
      // This ensures desktop tile layout can properly update theme/accent colors
      if (window.innerWidth >= 1024) {
        // Remove the className override and restore ThemeContext control
        document.documentElement.className = '';

        // CRITICAL: Remove inline styles that override class-based theme (CSS specificity issue)
        // Without this, accent color stays stuck at #7dcfff even when theme/accent changes
        document.documentElement.style.removeProperty('--accent-color');
        document.documentElement.style.removeProperty('--accent-color-rgb');
        // ThemeContext will re-apply proper classes on next render
      }
    };
  }, []);
};