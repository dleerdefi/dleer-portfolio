'use client';

import { useEffect } from 'react';

/**
 * useEnforceMobileTheme Hook
 * Enforces Tokyo Night theme with cyan accent for all mobile views
 * Ensures consistent theme across navigation and prevents theme switching on mobile
 *
 * Mobile is defined as viewport width < 1024px
 */
export const useEnforceMobileTheme = () => {
  useEffect(() => {
    const enforceMobileTheme = () => {
      // Check if we're on mobile (viewport width < 1024px)
      const isMobile = window.innerWidth < 1024;

      if (isMobile) {
        const root = document.documentElement;

        // Remove all existing theme and accent classes
        const classesToRemove: string[] = [];
        root.classList.forEach((cls) => {
          if (cls.startsWith('theme-') || cls.startsWith('accent-')) {
            classesToRemove.push(cls);
          }
        });
        classesToRemove.forEach((cls) => root.classList.remove(cls));

        // Apply Tokyo Night theme
        root.classList.add('theme-tokyo-night');

        // Set cyan accent color via inline styles (higher specificity than classes)
        // This ensures the mobile theme always wins over any cached preferences
        root.style.setProperty('--accent-color', '#7dcfff');
        root.style.setProperty('--accent-color-rgb', '125, 207, 255');
      } else {
        // On desktop, remove inline style overrides to allow ThemeContext control
        const root = document.documentElement;
        root.style.removeProperty('--accent-color');
        root.style.removeProperty('--accent-color-rgb');
      }
    };

    // Enforce on mount
    enforceMobileTheme();

    // Re-enforce on resize (handles orientation changes)
    window.addEventListener('resize', enforceMobileTheme);

    // Also enforce on focus (handles tab switching back to the app)
    window.addEventListener('focus', enforceMobileTheme);

    return () => {
      window.removeEventListener('resize', enforceMobileTheme);
      window.removeEventListener('focus', enforceMobileTheme);
    };
  }, []);
};