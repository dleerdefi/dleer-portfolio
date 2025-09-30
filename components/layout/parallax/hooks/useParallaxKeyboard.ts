import { useEffect } from 'react';

interface Section {
  id: string;
  title: string;
}

interface UseParallaxKeyboardOptions {
  onEscape?: () => void;
  onPanelToggle?: () => void;
}

/**
 * Custom hook for keyboard navigation in parallax layout
 * Handles Tab navigation, arrow keys, number shortcuts, and special keys
 */
export function useParallaxKeyboard(
  sections: Section[],
  activeSection: string,
  navigateToSection: (sectionId: string) => void,
  navigateToNextSection: (reverse?: boolean) => void,
  options?: UseParallaxKeyboardOptions
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't interfere with form inputs
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      switch(e.key) {
        case 'Tab':
          // Smart Tab handling: navigate sections unless we're actively in a form
          const isInContactForm = activeSection === 'contact' &&
            (target.tagName === 'INPUT' ||
             target.tagName === 'TEXTAREA' ||
             target.tagName === 'BUTTON' ||
             target.tagName === 'A');

          // Also check if any form element currently has focus
          const activeElement = document.activeElement;
          const isFormFocused = activeElement &&
            (activeElement.tagName === 'INPUT' ||
             activeElement.tagName === 'TEXTAREA' ||
             activeElement.tagName === 'BUTTON');

          // Only navigate sections if not interacting with form elements
          if (!isInContactForm && !isFormFocused) {
            e.preventDefault();
            navigateToNextSection(e.shiftKey);
          }
          break;

        case 'ArrowDown':
        case 'PageDown':
          e.preventDefault();
          navigateToNextSection();
          break;

        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault();
          navigateToNextSection(true);
          break;

        case 'Home':
          e.preventDefault();
          navigateToSection(sections[0].id);
          break;

        case 'End':
          e.preventDefault();
          navigateToSection(sections[sections.length - 1].id);
          break;

        case 'Escape':
          if (options?.onEscape) {
            options.onEscape();
          }
          break;

        // Number keys for quick section jump
        case '1':
        case '2':
        case '3':
        case '4':
          if (!e.ctrlKey && !e.altKey && !e.metaKey) {
            const index = parseInt(e.key) - 1;
            if (index < sections.length) {
              e.preventDefault();
              navigateToSection(sections[index].id);
            }
          }
          break;

        // Optional: Toggle panel with keyboard shortcut
        case 't':
        case 'T':
          if (e.ctrlKey && options?.onPanelToggle) {
            e.preventDefault();
            options.onPanelToggle();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSection, sections, navigateToSection, navigateToNextSection, options]);
}