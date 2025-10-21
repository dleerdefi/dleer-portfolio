import React from 'react';

interface TerminalProps {
  cmd?: string;
  children: React.ReactNode;
}

export function Terminal({ cmd, children }: TerminalProps) {
  return (
    <div className="my-6 rounded-lg overflow-hidden border-2" style={{ borderColor: 'var(--theme-border)' }}>
      {cmd && (
        <div
          className="px-4 py-2 font-mono text-sm flex items-center gap-2 border-b-2"
          style={{
            backgroundColor: 'var(--theme-surface)',
            borderBottomColor: 'var(--theme-border)',
            color: 'var(--theme-text-dimmed)',
          }}
        >
          <span style={{ color: 'var(--accent-color)' }}>$</span>
          <span>{cmd}</span>
        </div>
      )}
      <div
        className="px-4 py-3 font-mono text-sm overflow-x-auto whitespace-pre"
        style={{
          backgroundColor: 'rgba(var(--theme-surface-rgb), 0.5)',
          color: 'var(--theme-text)',
        }}
      >
        {children}
      </div>
    </div>
  );
}
