'use client';

import React from 'react';

interface WindowProps {
  title?: string;
  children: React.ReactNode;
  scrollable?: boolean;
  maxHeight?: string;
}

export function Window({ title, children, scrollable = false, maxHeight = '500px' }: WindowProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    // Extract text content from children (handles nested code blocks)
    const extractText = (node: React.ReactNode): string => {
      if (typeof node === 'string') return node;
      if (typeof node === 'number') return String(node);
      if (Array.isArray(node)) return node.map(extractText).join('');
      if (React.isValidElement(node)) {
        const props = node.props as { children?: React.ReactNode };
        if (props.children) {
          return extractText(props.children);
        }
      }
      return '';
    };

    try {
      const text = extractText(children);
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div
      className="mdx-code-wrapper group relative my-6 rounded-lg overflow-hidden"
      style={{
        backgroundColor: 'rgba(var(--theme-surface-rgb), 0.5)',
        border: '1px solid rgba(var(--accent-color-rgb), 0.2)',
      }}
    >
      {title && (
        <div
          className="flex items-center justify-between px-4 py-2 text-sm font-mono"
          style={{
            color: 'var(--theme-text-dimmed)',
            backgroundColor: 'rgba(var(--accent-color-rgb), 0.08)',
            borderBottom: '1px solid rgba(var(--accent-color-rgb), 0.2)',
          }}
        >
          <span>{title}</span>
          <button
            type="button"
            onClick={handleCopy}
            className="text-xs font-mono transition-opacity hover:opacity-70"
            style={{
              color: 'var(--accent-color)',
            }}
            aria-label={copied ? 'Copied!' : 'Copy code'}
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      )}
      <div
        className="theme-scrollbar px-4 py-3 font-mono text-sm overflow-x-auto whitespace-pre"
        style={{
          color: 'var(--theme-text)',
          maxHeight: scrollable ? maxHeight : undefined,
          overflowY: scrollable ? 'auto' : undefined,
        }}
      >
        {children}
      </div>
    </div>
  );
}
