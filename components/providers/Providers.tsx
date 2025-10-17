'use client';

import React, { ReactNode } from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Providers Wrapper
 * Client component that wraps children with ThemeProvider
 * Used in root layout to make theme context available to all pages
 *
 * This allows Server Components (like blog/project pages) to render
 * Client Components that use useTheme() hook without errors
 */
export function Providers({ children }: ProvidersProps) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
