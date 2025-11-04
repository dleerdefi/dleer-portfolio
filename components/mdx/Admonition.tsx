import React from 'react';

export type AdmonitionType = 'note' | 'tip' | 'warn' | 'error' | 'info';

interface AdmonitionProps {
  type?: AdmonitionType;
  title?: string;
  children: React.ReactNode;
}

const admonitionConfig: Record<AdmonitionType, {
  borderColor: string;
  bgColor: string;
  textColor: string;
  defaultTitle: string;
}> = {
  note: {
    borderColor: 'var(--theme-info)',
    bgColor: 'rgba(var(--theme-info-rgb), 0.1)',
    textColor: 'var(--theme-info)',
    defaultTitle: 'Note',
  },
  tip: {
    borderColor: 'var(--theme-success)',
    bgColor: 'rgba(var(--theme-success-rgb), 0.1)',
    textColor: 'var(--theme-success)',
    defaultTitle: 'Tip',
  },
  warn: {
    borderColor: 'var(--theme-warning)',
    bgColor: 'rgba(var(--theme-warning-rgb), 0.1)',
    textColor: 'var(--theme-warning)',
    defaultTitle: 'Warning',
  },
  error: {
    borderColor: 'var(--theme-error)',
    bgColor: 'rgba(var(--theme-error-rgb), 0.1)',
    textColor: 'var(--theme-error)',
    defaultTitle: 'Error',
  },
  info: {
    borderColor: 'var(--theme-info)',
    bgColor: 'rgba(var(--theme-info-rgb), 0.1)',
    textColor: 'var(--theme-info)',
    defaultTitle: 'Info',
  },
};

export function Admonition({ type = 'note', title, children }: AdmonitionProps) {
  // Ensure we have a valid type, fallback to 'note' if not found
  const safeType = admonitionConfig[type] ? type : 'note';
  const config = admonitionConfig[safeType];

  return (
    <div
      className={`my-6 rounded border-l-4 admonition-${safeType}`}
      style={{
        borderLeftColor: config.borderColor,
        paddingLeft: '20px',
        paddingRight: '20px',
        paddingTop: '16px',
        paddingBottom: '12px',
      }}
    >
      {(title || config.defaultTitle) && (
        <div
          className="font-bold mb-2 text-sm uppercase tracking-wide"
          style={{ color: config.textColor }}
        >
          {title || config.defaultTitle}
        </div>
      )}
      <div
        className="text-sm leading-relaxed [&>p:last-child]:mb-0"
        style={{ color: 'var(--theme-text)' }}
      >
        {children}
      </div>
    </div>
  );
}
