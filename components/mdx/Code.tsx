'use client';

import React from 'react';

type PreProps = React.HTMLAttributes<HTMLPreElement> & {
  __rawString__?: string; // Optional raw string for copy functionality
};

/**
 * CodeBlock Component
 * Canonical code block renderer for fenced code blocks in MDX
 * Maps to `pre` element via mdx-components.tsx
 *
 * Features:
 * - Copy button (appears on hover)
 * - Language badge
 * - Theme-aware styling
 * - No nested wrappers
 */
export function CodeBlock(props: PreProps) {
  // MDX yields: <pre><code class="language-ts">...</code></pre>
  // We extract the language from the child <code> element
  const child = React.Children.only(props.children) as React.ReactElement<{ className?: string; children?: React.ReactNode }>;
  const className = child?.props?.className || '';
  const lang = (className.match(/language-([^\s]+)/)?.[1] ?? 'text').toLowerCase();
  const codeContent = child?.props?.children ?? '';

  return (
    <div className="group relative my-8 -mx-4 sm:mx-0">
      <pre
        {...props}
        className="overflow-x-auto rounded-xl border-2 px-6 py-5 font-mono text-[15px] leading-7 shadow-lg"
        style={{
          backgroundColor: 'rgba(var(--theme-surface-rgb), 0.8)',
          borderColor: 'var(--theme-border)',
          color: 'var(--theme-text)',
          tabSize: 2,
          maxWidth: '100%',
        }}
      />
      <CopyButton text={props.__rawString__ ?? (typeof codeContent === 'string' ? codeContent : '')} />
      {lang !== 'text' && (
        <span
          className="pointer-events-none absolute right-16 top-4 select-none text-[11px] font-mono font-medium uppercase tracking-wide"
          style={{ color: 'var(--theme-text-dimmed)' }}
        >
          {lang}
        </span>
      )}
    </div>
  );
}

/**
 * InlineCode Component
 * Renders inline backtick code: `code`
 * Maps to `code` element via mdx-components.tsx
 */
export function InlineCode(props: React.HTMLAttributes<HTMLElement>) {
  return (
    <code
      {...props}
      className="rounded border px-1.5 py-0.5 font-mono text-[0.9em]"
      style={{
        backgroundColor: 'rgba(var(--accent-color-rgb), 0.1)',
        borderColor: 'rgba(var(--accent-color-rgb), 0.3)',
        color: 'var(--accent-color)',
      }}
    />
  );
}

/**
 * CopyButton Component
 * Appears on hover over code blocks
 */
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="absolute right-3 top-3 rounded border px-3 py-1.5 text-[11px] font-medium opacity-0 transition-all group-hover:opacity-100 hover:scale-105 active:translate-y-[0.5px]"
      style={{
        backgroundColor: 'rgba(var(--accent-color-rgb), 0.15)',
        borderColor: 'rgba(var(--accent-color-rgb), 0.3)',
        color: 'var(--accent-color)',
      }}
      aria-label={copied ? 'Copied!' : 'Copy code'}
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  );
}
