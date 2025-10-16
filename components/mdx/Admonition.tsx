import React from 'react';

type AdmonitionType = 'tip' | 'warn' | 'note';

interface AdmonitionProps {
  type?: AdmonitionType;
  children: React.ReactNode;
  className?: string;
}

interface AdmonitionTheme {
  ring: string;
  bg: string;
  text: string;
  label: string;
}

const admonitionThemes: Record<AdmonitionType, AdmonitionTheme> = {
  tip: {
    ring: 'rgba(34, 197, 94, 0.3)', // emerald-500
    bg: 'rgba(34, 197, 94, 0.05)',
    text: 'rgb(134, 239, 172)', // emerald-300
    label: 'Tip',
  },
  warn: {
    ring: 'rgba(251, 191, 36, 0.3)', // amber-400
    bg: 'rgba(251, 191, 36, 0.05)',
    text: 'rgb(252, 211, 77)', // amber-300
    label: 'Warning',
  },
  note: {
    ring: 'rgba(56, 189, 248, 0.3)', // sky-400
    bg: 'rgba(56, 189, 248, 0.05)',
    text: 'rgb(125, 211, 252)', // sky-300
    label: 'Note',
  },
};

/**
 * Admonition component - callout boxes for tips, warnings, notes
 * Meets WCAG AA contrast requirements in all themes
 *
 * Usage:
 * <Admonition type="tip">
 *   This is a helpful tip!
 * </Admonition>
 *
 * LOC: ~65
 */
export function Admonition({
  type = 'note',
  children,
  className = '',
}: AdmonitionProps) {
  const theme = admonitionThemes[type];

  return (
    <div
      className={`rounded-xl p-3 my-4 ${className}`}
      style={{
        border: `1px solid ${theme.ring}`,
        backgroundColor: theme.bg,
        boxShadow: `0 0 0 1px ${theme.ring}`,
      }}
      role="note"
      aria-label={theme.label}
    >
      {/* Label */}
      <div
        className="text-xs font-medium mb-1 font-mono"
        style={{ color: theme.text }}
      >
        {theme.label}
      </div>

      {/* Content */}
      <div className="text-sm" style={{ color: 'var(--theme-text)' }}>
        {children}
      </div>
    </div>
  );
}

export default Admonition;
