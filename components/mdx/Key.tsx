import React from 'react';

interface KeyProps {
  children: React.ReactNode;
}

export function Key({ children }: KeyProps) {
  return (
    <kbd
      className="inline-flex items-center justify-center px-2 py-1 text-xs font-mono font-semibold rounded border-2 shadow-sm"
      style={{
        borderColor: 'var(--theme-border)',
        backgroundColor: 'var(--theme-surface)',
        color: 'var(--accent-color)',
        minWidth: '2rem',
      }}
    >
      {children}
    </kbd>
  );
}
