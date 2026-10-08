import React from 'react';
import { categoryVar } from '@/lib/lab/names';
import type { Category } from '@/lib/lab/types';

/** A 10 px square in a category's color. Always placed next to the category's name. */
export function Swatch({ category, size = 10 }: { category: Category; size?: number }) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        flexShrink: 0,
        background: categoryVar(category),
      }}
    />
  );
}
