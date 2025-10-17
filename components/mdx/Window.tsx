import React from 'react';

interface WindowProps {
  title?: string;
  children: React.ReactNode;
}

export function Window({ title, children }: WindowProps) {
  return (
    <div className="my-6 rounded-lg overflow-hidden border-2" style={{ borderColor: 'var(--theme-border)' }}>
      <div
        className="px-4 py-2 flex items-center gap-2 border-b-2"
        style={{
          backgroundColor: 'var(--theme-surface)',
          borderBottomColor: 'var(--theme-border)',
        }}
      >
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ff5f56' }} />
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ffbd2e' }} />
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#27c93f' }} />
        </div>
        {title && (
          <span className="ml-2 text-sm font-mono" style={{ color: 'var(--theme-text-dimmed)' }}>
            {title}
          </span>
        )}
      </div>
      <div
        className="px-4 py-3 font-mono text-sm overflow-x-auto"
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
