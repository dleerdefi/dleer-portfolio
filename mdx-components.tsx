import type { MDXComponents } from 'mdx/types';
import { Admonition, Terminal, Window, Key, Figure } from '@/components/mdx';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Custom components
    Admonition,
    Terminal,
    Window,
    Key,
    Figure,
    // Override default HTML elements for better styling
    ...components,
  };
}
