'use client';

import React from 'react';
import { useKeyboardNav } from '@/hooks/useKeyboardNav';

interface ZenListProps<T> {
  /** List items to display */
  items: T[];

  /** Currently selected index */
  selectedIndex?: number;

  /** Callback when item is selected (Enter key or click) */
  onSelect: (item: T, index: number) => void;

  /** Callback when escape is pressed */
  onExit: () => void;

  /** Render function for each item */
  renderItem: (item: T, index: number, isSelected: boolean) => React.ReactNode;

  /** Title for the zen view */
  title: string;

  /** Subtitle/description */
  subtitle?: string;

  /** Message to show when list is empty */
  emptyMessage?: string;

  /** Additional className for container */
  className?: string;
}

/**
 * Zen List Component - Fullscreen list view with keyboard navigation
 * Matches existing tile aesthetic (square corners, terminal style)
 *
 * Features:
 * - j/k or arrow keys to navigate
 * - g/G to jump to top/bottom
 * - Enter to select
 * - Esc to exit
 * - Center column (65-72ch)
 * - Selection ring with accent color
 *
 * @example
 * <ZenList
 *   items={blogs}
 *   onSelect={(blog) => router.push(`/blog/${blog.slug}`)}
 *   onExit={() => router.back()}
 *   renderItem={(blog, i, selected) => (
 *     <BlogCard blog={blog} isSelected={selected} />
 *   )}
 *   title="~/blog"
 * />
 */
export function ZenList<T>({
  items,
  selectedIndex: controlledIndex,
  onSelect,
  onExit,
  renderItem,
  title,
  subtitle,
  emptyMessage = 'No items found.',
  className = '',
}: ZenListProps<T>) {
  const { selectedIndex, handleKeyDown, getItemRef } = useKeyboardNav(
    items.length,
    {
      onSelect: (index) => onSelect(items[index], index),
      onEscape: onExit,
      scrollBehavior: 'smooth',
    }
  );

  const activeIndex = controlledIndex !== undefined ? controlledIndex : selectedIndex;

  return (
    <div
      className={`min-h-screen ${className}`}
      style={{
        backgroundColor: 'var(--theme-bg)',
        color: 'var(--theme-text)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Header - zen flat style, no background/border */}
      <div className="py-4 px-6">
        <div className="max-w-5xl" style={{ margin: '0 auto' }}>
          <div className="flex items-center justify-between">
            <div>
              <h1
                className="text-3xl font-bold"
                style={{
                  color: 'var(--accent-color)',
                  letterSpacing: '-0.02em',
                }}
              >
                {title}
              </h1>
              {subtitle && (
                <p
                  className="text-sm mt-1"
                  style={{ color: 'var(--theme-text-dimmed)' }}
                >
                  {subtitle}
                </p>
              )}
            </div>

            {/* Keyboard hints */}
            <div
              className="hidden sm:flex items-center gap-4 text-xs"
              style={{ color: 'var(--theme-text-dimmed)' }}
            >
              <span>j/k move</span>
              <span>·</span>
              <span>Enter open</span>
              <span>·</span>
              <span>Esc back</span>
            </div>
          </div>
        </div>
      </div>

      {/* List Content */}
      <div className="py-12 px-6">
        <div className="max-w-5xl" style={{ margin: '0 auto' }}>
          {items.length === 0 ? (
            <div
              className="text-center py-12"
              style={{ color: 'var(--theme-text-dimmed)' }}
            >
              <p>{emptyMessage}</p>
            </div>
          ) : (
            <div>
              {items.map((item, index) => {
                const isSelected = index === activeIndex;

                return (
                  <div
                    key={index}
                    ref={getItemRef(index)}
                    className="py-16 cursor-pointer transition-all"
                    style={{
                      borderBottom: '1px solid var(--theme-border)',
                      opacity: isSelected ? 1 : 0.85,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '1';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.opacity = '0.85';
                      }
                    }}
                    onClick={() => onSelect(item, index)}
                    role="button"
                    tabIndex={-1}
                    aria-label={`Item ${index + 1}`}
                  >
                    {renderItem(item, index, isSelected)}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Footer - item count, zen flat style */}
      <div
        className="fixed bottom-0 left-0 right-0 py-2 px-6 text-xs"
        style={{
          color: 'var(--theme-text-dimmed)',
        }}
      >
        <div className="max-w-5xl flex justify-between" style={{ margin: '0 auto' }}>
          <span>
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </span>
          {items.length > 0 && (
            <span>
              {activeIndex + 1} / {items.length}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ZenList;
