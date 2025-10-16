import React from 'react';

interface WindowProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Window component - macOS-style window with title bar
 * Integrates with theme system (Tokyo Night, Nord, Solarized Light)
 *
 * Usage:
 * <Window title="src/app.tsx">
 *   Your content here
 * </Window>
 *
 * LOC: ~60
 */
export function Window({ title, children, className = '' }: WindowProps) {
  return (
    <div
      className={`rounded-2xl overflow-hidden my-6 ${className}`}
      style={{
        border: '1px solid rgba(var(--accent-color-rgb), 0.2)',
        backgroundColor: 'var(--theme-surface)',
        boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.02) inset'
      }}
    >
      {/* Title bar with traffic lights */}
      <div
        className="flex items-center gap-2 px-3 py-2"
        style={{
          borderBottom: '1px solid rgba(var(--accent-color-rgb), 0.15)',
          backgroundColor: 'rgba(var(--accent-color-rgb), 0.05)'
        }}
      >
        {/* macOS traffic lights */}
        <div className="flex gap-1.5">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: 'rgba(239, 68, 68, 0.8)' }}
            aria-hidden="true"
          />
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: 'rgba(234, 179, 8, 0.8)' }}
            aria-hidden="true"
          />
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: 'rgba(34, 197, 94, 0.8)' }}
            aria-hidden="true"
          />
        </div>

        {/* Title */}
        {title && (
          <div
            className="ml-3 text-xs truncate font-mono"
            style={{ color: 'var(--theme-text-dimmed)' }}
          >
            {title}
          </div>
        )}
      </div>

      {/* Content area */}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}

export default Window;
