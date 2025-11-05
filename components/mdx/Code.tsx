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
  const codeText = props.__rawString__ ?? (typeof codeContent === 'string' ? codeContent : '');

  return (
    <div
      className="group relative my-8 rounded-xl overflow-hidden"
      style={{
        border: '1px solid rgba(var(--accent-color-rgb), 0.2)',
      }}
    >
      {/* Header bar with language label and copy button */}
      {lang !== 'text' && (
        <div
          className="flex items-center justify-between px-4 py-2"
          style={{
            backgroundColor: 'rgba(var(--accent-color-rgb), 0.08)',
            borderBottom: '1px solid rgba(var(--accent-color-rgb), 0.2)',
          }}
        >
          <span
            className="text-xs font-mono font-medium uppercase tracking-wide"
            style={{ color: 'var(--theme-text-dimmed)' }}
          >
            {lang}
          </span>
          <CopyButton text={codeText} inline />
        </div>
      )}

      {/* Code content */}
      <pre
        {...props}
        className={`theme-scrollbar overflow-x-auto px-6 pb-3 font-mono text-[15px] leading-7 ${lang !== 'text' ? 'rounded-t-none' : 'rounded-xl py-3'}`}
        style={{
          backgroundColor: 'rgba(var(--theme-surface-rgb), 0.5)',
          color: 'var(--theme-text)',
          tabSize: 2,
          maxWidth: '100%',
          paddingTop: lang !== 'text' ? 0 : undefined, // Override global pre padding
          marginTop: lang !== 'text' ? 0 : undefined, // Override global pre margin
          marginBottom: lang !== 'text' ? 0 : undefined, // Override global pre margin
        }}
      />

      {/* Copy button for code blocks without language */}
      {lang === 'text' && <CopyButton text={codeText} />}
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
        boxDecorationBreak: 'clone',
        WebkitBoxDecorationBreak: 'clone',
      }}
    />
  );
}

/**
 * CopyButton Component
 * Simple text link for copying code - supports both inline (flex) and absolute positioning
 */
function CopyButton({ text, inline = false }: { text: string; inline?: boolean }) {
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
      className={`text-xs font-mono transition-opacity hover:opacity-70 ${inline ? '' : 'absolute right-3 top-3'}`}
      style={{
        color: 'var(--accent-color)',
      }}
      aria-label={copied ? 'Copied!' : 'Copy code'}
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  );
}
