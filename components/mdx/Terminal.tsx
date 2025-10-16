import React from 'react';

interface TerminalProps {
  cmd?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Terminal component - terminal output styling with command prompt
 * Uses terminal theme color system from 04-terminal-theme.css
 *
 * Usage:
 * <Terminal cmd="npm run build">
 *   Build output here
 * </Terminal>
 *
 * LOC: ~55
 */
export function Terminal({ cmd, children, className = '' }: TerminalProps) {
  return (
    <div
      className={`rounded-xl overflow-hidden my-6 font-mono ${className}`}
      style={{
        border: '1px solid rgba(var(--accent-color-rgb), 0.2)',
        backgroundColor: 'rgba(11, 13, 16, 0.8)', // Dark terminal background
      }}
    >
      {/* Command prompt header */}
      {cmd && (
        <div
          className="px-3 py-2 text-xs border-b"
          style={{
            borderColor: 'rgba(var(--accent-color-rgb), 0.2)',
            color: 'var(--theme-text-dimmed)'
          }}
        >
          <span style={{ color: 'var(--theme-success)' }}>$</span> {cmd}
        </div>
      )}

      {/* Terminal output */}
      <pre
        className="p-3 text-xs leading-relaxed whitespace-pre-wrap overflow-x-auto"
        style={{
          color: 'var(--theme-text)',
          margin: 0
        }}
      >
        {children}
      </pre>
    </div>
  );
}

export default Terminal;
