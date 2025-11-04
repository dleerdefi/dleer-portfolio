'use client';

import React from 'react';

interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  maxHeight?: string;
}

export function Collapsible({
  title,
  children,
  defaultOpen = false,
  maxHeight = '500px',
}: CollapsibleProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div
      className="my-6 rounded-lg overflow-hidden"
      style={{
        border: '2px solid rgba(var(--accent-color-rgb), 0.3)',
        backgroundColor: 'rgba(var(--theme-surface-rgb), 0.3)',
      }}
    >
      {/* Header / Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 flex items-center justify-between transition-colors hover:bg-opacity-80"
        style={{
          backgroundColor: 'rgba(var(--accent-color-rgb), 0.1)',
          borderBottom: isOpen ? '1px solid rgba(var(--accent-color-rgb), 0.2)' : 'none',
        }}
      >
        <span
          className="font-semibold text-xs uppercase tracking-wider"
          style={{ color: 'var(--accent-color)' }}
        >
          {title}
        </span>
        <span
          className="text-lg transition-transform duration-300"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            color: 'var(--accent-color)',
          }}
        >
          ▼
        </span>
      </button>

      {/* Content */}
      {isOpen && (
        <div
          className="theme-scrollbar px-4 py-3 overflow-y-auto"
          style={{
            maxHeight,
            color: 'var(--theme-text)',
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
