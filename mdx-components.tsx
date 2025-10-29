import type { MDXComponents } from 'mdx/types';
import { CodeBlock, InlineCode } from '@/components/mdx/Code';
import { Admonition, Terminal, Window, Key, Figure, Collapsible } from '@/components/mdx';

/**
 * MDX Components Mapping
 * Defines how MDX elements are rendered throughout the application
 *
 * Native Elements:
 * - pre: Fenced code blocks (```language) → CodeBlock
 * - code: Inline backticks (`code`) → InlineCode
 *
 * Custom Components:
 * - Admonition: Callout boxes (note, tip, warn, error, info)
 * - Terminal: Shell output with optional command prompt
 * - Window: macOS-style window for file contents
 * - Key: Keyboard key visualization
 * - Figure: Images with captions
 *
 * Usage in MDX:
 * - Use fenced code blocks for syntax-highlighted code
 * - Use <Terminal> for shell output
 * - Use <Window> for file/spec examples (non-code)
 * - Use <Admonition> for callouts
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Native code rendering - prevents triple nesting
    code: (props) => {
      // Check if this code is inside a pre (fenced block)
      // If so, it's handled by CodeBlock; just return children
      if ('className' in props && typeof props.className === 'string' && props.className.includes('language-')) {
        return <code {...props} />;
      }
      // Otherwise, it's inline code
      return <InlineCode {...props} />;
    },
    pre: (props) => <CodeBlock {...props} />,

    // Custom link handling - external links open in new tab
    a: (props) => {
      const href = props.href || '';
      const isExternal = href.startsWith('http://') || href.startsWith('https://');
      const isHash = href.startsWith('#');

      // External links open in new tab with security attributes
      if (isExternal) {
        return (
          <a
            {...props}
            target="_blank"
            rel="noopener noreferrer"
          />
        );
      }

      // Internal links and hash links stay in same window
      return <a {...props} />;
    },

    // Custom MDX components
    Admonition,
    Terminal,
    Window,
    Key,
    Figure,
    Collapsible,

    ...components,
  };
}
