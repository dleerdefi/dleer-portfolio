import React from 'react';

export type AdmonitionType = 'note' | 'tip' | 'warn' | 'error' | 'info';

interface AdmonitionProps {
  type?: AdmonitionType;
  title?: string;
  children: React.ReactNode;
}

const admonitionConfig: Record<AdmonitionType, {
  icon: string;
  borderColor: string;
  bgColor: string;
  textColor: string;
  defaultTitle: string;
}> = {
  note: {
    icon: '📝',
    borderColor: 'var(--theme-info)',
    bgColor: 'rgba(var(--theme-info-rgb), 0.1)',
    textColor: 'var(--theme-info)',
    defaultTitle: 'Note',
  },
  tip: {
    icon: '💡',
    borderColor: 'var(--theme-success)',
    bgColor: 'rgba(var(--theme-success-rgb), 0.1)',
    textColor: 'var(--theme-success)',
    defaultTitle: 'Tip',
  },
  warn: {
    icon: '⚠️',
    borderColor: 'var(--theme-warning)',
    bgColor: 'rgba(var(--theme-warning-rgb), 0.1)',
    textColor: 'var(--theme-warning)',
    defaultTitle: 'Warning',
  },
  error: {
    icon: '❌',
    borderColor: 'var(--theme-error)',
    bgColor: 'rgba(var(--theme-error-rgb), 0.1)',
    textColor: 'var(--theme-error)',
    defaultTitle: 'Error',
  },
  info: {
    icon: 'ℹ️',
    borderColor: 'var(--accent-color)',
    bgColor: 'rgba(var(--accent-color-rgb), 0.1)',
    textColor: 'var(--accent-color)',
    defaultTitle: 'Info',
  },
};

export function Admonition({ type = 'note', title, children }: AdmonitionProps) {
  const config = admonitionConfig[type];

  return (
    <div
      className="my-6 rounded border-l-4 p-5"
      style={{
        borderLeftColor: config.borderColor,
        backgroundColor: config.bgColor,
      }}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0 mt-0.5" role="img" aria-label={config.defaultTitle}>
          {config.icon}
        </span>
        <div className="flex-1 min-w-0">
          <div
            className="font-bold mb-2 text-sm uppercase tracking-wide"
            style={{ color: config.textColor }}
          >
            {title || config.defaultTitle}
          </div>
          <div
            className="text-sm leading-relaxed"
            style={{ color: 'var(--theme-text)' }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
