'use client';

import { useEffect, useState } from 'react';
import { CATEGORIES, type Category } from '@/lib/lab/types';

export interface LabColors {
  accent: string;
  accentRgb: string;
  text: string;
  textRgb: string;
  textDimmed: string;
  border: string;
  surface: string;
  bg: string;
  bin: string;
  cat: Record<Category, string>;
}

/**
 * Concrete lab colors for canvases and the globe, read from the CSS variables on <html>.
 * Re-read when the root's `class` or `style` changes (preset, accent, the mobile overrides),
 * not from useTheme(): ThemeProvider applies its classes in an effect that runs after its
 * children's effects.
 */
export function useLabColors(): LabColors | null {
  const [colors, setColors] = useState<LabColors | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    let last = '';
    const read = () => {
      const next = readLabColors(root);
      const key = JSON.stringify(next);
      if (key !== last) {
        last = key;
        setColors(next);
      }
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ['class', 'style'] });
    return () => observer.disconnect();
  }, []);

  return colors;
}

export function readLabColors(el: Element): LabColors {
  const css = getComputedStyle(el);
  const v = (name: string) => css.getPropertyValue(name).trim();
  return {
    accent: v('--accent-color'),
    accentRgb: v('--accent-color-rgb'),
    text: v('--theme-text'),
    textRgb: v('--theme-text-rgb'),
    textDimmed: v('--theme-text-dimmed'),
    border: v('--theme-border'),
    surface: v('--theme-surface'),
    bg: v('--theme-bg'),
    bin: v('--lab-bin'),
    cat: Object.fromEntries(CATEGORIES.map((c) => [c, v(`--lab-${c.replace(/_/g, '-')}`)])) as Record<
      Category,
      string
    >,
  };
}
