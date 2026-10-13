'use client';

import React from 'react';
import { stripMargin } from '@/lib/terminal-text';

interface TerminalProps {
  cmd?: string;
  children: React.ReactNode;
}

/**
 * A terminal window in MDX: a `cmd` header and preformatted lines. A diagram is written as a
 * template literal with a `|` margin (lib/terminal-text.ts), which keeps its indentation.
 */
export function Terminal({ cmd, children: raw }: TerminalProps) {
  const [copied, setCopied] = React.useState(false);
  const children = typeof raw === 'string' ? (stripMargin(raw) ?? raw) : raw;

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
      {cmd && (
        <div
          className="flex items-center justify-between px-4 py-2 font-mono text-sm"
          style={{
            color: 'rgba(var(--theme-text-rgb), 0.72)',
            backgroundColor: 'rgba(var(--accent-color-rgb), 0.08)',
            borderBottom: '1px solid rgba(var(--accent-color-rgb), 0.2)',
          }}
        >
          <div className="flex items-center gap-2">
            <span style={{ color: 'var(--accent-text)' }}>$</span>
            <span>{cmd}</span>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center justify-center min-h-11 min-w-11 -my-2 text-sm lg:min-h-0 lg:min-w-0 lg:my-0 lg:text-xs font-mono transition-opacity hover:opacity-70 focus-visible:opacity-70"
            style={{
              color: 'var(--accent-text)',
            }}
            aria-label={copied ? 'Copied!' : 'Copy code'}
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      )}
      {/* Diagrams and command output keep their lines (wrapping scrambles a diagram's columns on a
          phone); a wide one scrolls sideways, like a code block */}
      <div
        className="theme-scrollbar px-3 sm:px-4 pt-2 pb-1.5 sm:pt-3 sm:pb-2 font-mono text-sm whitespace-pre"
        style={{
          color: 'var(--theme-text)',
          overflowX: 'auto',
        }}
      >
        {children}
      </div>
    </div>
  );
}
