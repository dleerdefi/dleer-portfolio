import React from 'react';

interface KeyProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Key component - displays keyboard keys in Unix aesthetic
 * Styled as raised keys with subtle borders
 *
 * Usage:
 * <Key>Cmd</Key> + <Key>K</Key>
 * Press <Key>Enter</Key> to submit
 *
 * LOC: ~40
 */
export function Key({ children, className = '' }: KeyProps) {
  return (
    <kbd
      className={`inline-flex items-center px-1.5 py-0.5 rounded font-mono text-xs ${className}`}
      style={{
        border: '1px solid rgba(var(--accent-color-rgb), 0.3)',
        backgroundColor: 'rgba(var(--accent-color-rgb), 0.1)',
        color: 'var(--theme-text)',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
        fontWeight: 500,
        minWidth: '1.5rem',
        textAlign: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </kbd>
  );
}

export default Key;
