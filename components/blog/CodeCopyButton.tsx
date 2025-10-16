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
        button.textContent = 'Copy';
        button.setAttribute('aria-label', 'Copy code to clipboard');

        button.addEventListener('click', async () => {
          const code = block.querySelector('code');
          if (!code) return;

          try {
            await navigator.clipboard.writeText(code.textContent || '');
            button.textContent = 'Copied!';
            button.style.background = 'rgba(158, 206, 106, 0.2)'; // Success green
            setTimeout(() => {
              button.textContent = 'Copy';
              button.style.background = '';
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
