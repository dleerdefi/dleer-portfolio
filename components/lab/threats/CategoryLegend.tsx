'use client';

import React from 'react';
import { fmtInt } from '@/lib/lab/format';
import { CATEGORY_MEANING } from '@/lib/lab/names';
import { CATEGORIES, type Category } from '@/lib/lab/types';
import { Swatch } from '@/components/lab/shared/Swatch';

/**
 * One toggle per category in the fixed order: swatch, name, 24 h count, the meaning as `title`.
 * Counts never change with filters and colors never move; at least one category stays on.
 */
export function CategoryLegend({
  counts,
  hidden,
  onToggle,
  variant,
}: {
  counts: Record<Category, number>;
  hidden: ReadonlySet<Category>;
  onToggle: (c: Category) => void;
  /** column: the tile; chips: the page; grid: phones */
  variant: 'column' | 'chips' | 'grid';
}) {
  const layout: React.CSSProperties =
    variant === 'column'
      ? { display: 'flex', flexDirection: 'column', gap: '0.5rem' }
      : variant === 'grid'
        ? { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.5rem' }
        : { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem' };
  return (
    <div role="group" aria-label="Filter by attack type" style={layout}>
      {CATEGORIES.map((c) => {
        const on = !hidden.has(c);
        return (
          <button
            key={c}
            type="button"
            aria-pressed={on}
            title={CATEGORY_MEANING[c]}
            onClick={(e) => {
              e.stopPropagation();
              onToggle(c);
            }}
            className="lab-focus"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6em',
              justifyContent: variant === 'chips' ? 'flex-start' : 'space-between',
              minHeight: variant === 'grid' ? 44 : 36,
              padding: variant === 'grid' ? '0.35em 0.6em' : '0.35em 0.75em',
              border: '1px solid var(--theme-border)',
              background: on ? 'rgba(var(--theme-surface-rgb), 0.6)' : 'transparent',
              color: 'var(--theme-text)',
              font: 'inherit',
              // phones: a smaller size, and the count may drop to a second line on the narrowest
              fontSize: variant === 'grid' ? '0.8125rem' : undefined,
              flexWrap: variant === 'grid' ? 'wrap' : undefined,
              rowGap: 0,
              cursor: 'pointer',
              opacity: on ? 1 : 0.45,
              textDecoration: on ? 'none' : 'line-through',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: variant === 'grid' ? '0.45em' : '0.6em' }}>
              <Swatch category={c} />
              {c}
            </span>
            <span className={variant === 'chips' ? 'lab-text-2' : undefined}>{fmtInt(counts[c])}</span>
          </button>
        );
      })}
    </div>
  );
}

/** Toggle with the "at least one stays on" rule. */
export function toggleHidden(hidden: ReadonlySet<Category>, c: Category): Set<Category> {
  const next = new Set(hidden);
  if (next.has(c)) next.delete(c);
  else if (next.size < CATEGORIES.length - 1) next.add(c);
  return next;
}
