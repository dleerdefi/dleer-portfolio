'use client';

import { useEffect } from 'react';

/**
 * Code Copy Button
 * Adds copy-to-clipboard buttons to all code blocks
 */
export function CodeCopyButton() {
  useEffect(() => {
    const addCopyButtons = () => {
      const codeBlocks = document.querySelectorAll('.blog-prose pre');

      codeBlocks.forEach((block) => {
        // Skip if button already exists
        if (block.querySelector('.copy-button')) return;

        const button = document.createElement('button');
        button.className = 'copy-button';
        button.setAttribute('aria-label', 'Copy code to clipboard');

        // Copy icon SVG
        const copyIcon = `<svg viewBox="0 0 16 16"><path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"/><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"/></svg>`;

        // Check icon SVG
        const checkIcon = `<svg viewBox="0 0 16 16"><path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"/></svg>`;

        button.innerHTML = copyIcon;

        button.addEventListener('click', async () => {
          const code = block.querySelector('code');
          if (!code) return;

          try {
            await navigator.clipboard.writeText(code.textContent || '');
            button.innerHTML = checkIcon;
            button.style.borderColor = 'var(--theme-success)';
            button.style.color = 'var(--theme-success)';
            setTimeout(() => {
              button.innerHTML = copyIcon;
              button.style.borderColor = '';
              button.style.color = '';
            }, 2000);
          } catch (err) {
            console.error('Failed to copy:', err);
          }
        });

        (block as HTMLElement).style.position = 'relative';
        block.appendChild(button);
      });
    };

    // Run after content loads
    setTimeout(addCopyButtons, 100);
  }, []);

  return null;
}
