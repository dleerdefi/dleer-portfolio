'use client';

import React, { ReactNode } from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { useEnforceMobileTheme } from '@/hooks/useEnforceMobileTheme';

interface ProvidersProps {
  children: ReactNode;
}

/**
 * MobileThemeEnforcer
 * Wrapper component that enforces mobile theme globally
 */
function MobileThemeEnforcer({ children }: { children: ReactNode }) {
  useEnforceMobileTheme();
  return <>{children}</>;
}

/**
 * Providers Wrapper
 * Client component that wraps children with ThemeProvider
 * Used in root layout to make theme context available to all pages
 *
 * This allows Server Components (like blog/project pages) to render
 * Client Components that use useTheme() hook without errors
 *
 * Also enforces consistent mobile theme across all pages
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <MobileThemeEnforcer>
        {children}
      </MobileThemeEnforcer>
    </ThemeProvider>
  );
}
