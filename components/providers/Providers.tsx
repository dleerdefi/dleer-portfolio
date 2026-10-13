'use client';

import React, { ReactNode } from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';

/**
 * Client providers for the root layout, so server-rendered pages can contain client components
 * that call useTheme(). The phone theme (Tokyo Night, cyan accent) is ThemeContext's preset
 * choice plus one CSS rule (app/styles/01-theme-variables.css); nothing else touches <html>.
 */
export function Providers({ children }: { children: ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
