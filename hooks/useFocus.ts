import React, { useEffect, useRef, useCallback } from 'react';
import { TileType } from '@/contexts/FocusContext';

/**
 * Hook for managing scroll behavior with focus changes
 */
export const useScrollToFocus = <T extends HTMLElement = HTMLElement>(
  tileRef: React.RefObject<T | null>,
  tileType: TileType,
  focusedTile: TileType,
  isStacked: boolean
) => {
  const scrollAnimationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!isStacked || !tileRef.current) return;

    // Only scroll if this tile is focused
    if (focusedTile === tileType) {
      // Cancel any pending scroll animation
      if (scrollAnimationRef.current) {
        cancelAnimationFrame(scrollAnimationRef.current);
      }

      // Use requestAnimationFrame for better coordination with Framer Motion
      // Double RAF to ensure DOM updates are complete
      scrollAnimationRef.current = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          tileRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        });
      });
    }

    return () => {
      if (scrollAnimationRef.current) {
        cancelAnimationFrame(scrollAnimationRef.current);
      }
    };
  }, [focusedTile, tileType, isStacked, tileRef]);
};

/**
 * Hook for managing focus on mount
 */
export const useFocusOnMount = (
  elementRef: React.RefObject<HTMLElement>,
  shouldFocus: boolean = false
) => {
  useEffect(() => {
    if (shouldFocus && elementRef.current) {
      // Check if element is already focused (SSR case)
      const isAlreadyFocused = document.activeElement === elementRef.current;

      if (!isAlreadyFocused) {
        // Use requestAnimationFrame to ensure DOM is ready
        requestAnimationFrame(() => {
          elementRef.current?.focus();
        });
      }
    }
  }, [shouldFocus, elementRef]);
};

/**
 * Hook for managing focus trap
 */
export const useFocusTrap = (containerRef: React.RefObject<HTMLElement>, isActive: boolean) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isActive || !containerRef.current) return;

    const focusableElements = containerRef.current.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (event.key === 'Tab') {
      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    }
  }, [containerRef, isActive]);

  useEffect(() => {
    if (isActive) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isActive, handleKeyDown]);
};

/**
 * Hook for detecting click outside
 */
export const useClickOutside = (
  ref: React.RefObject<HTMLElement>,
  handler: (event: MouseEvent | TouchEvent) => void,
  isActive: boolean = true
) => {
  useEffect(() => {
    if (!isActive) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler, isActive]);
};

/**
 * Hook for managing focus restoration
 */
export const useFocusRestoration = () => {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const saveFocus = useCallback(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
  }, []);

  const restoreFocus = useCallback(() => {
    if (previousFocusRef.current && previousFocusRef.current.focus) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, []);

  return { saveFocus, restoreFocus };
};

/**
 * Hook for keyboard navigation within a list
 */
export const useArrowKeyNavigation = (
  itemsCount: number,
  onSelect: (index: number) => void,
  isActive: boolean = true
) => {
  const [selectedIndex, setSelectedIndex] = React.useState<number>(0);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isActive) return;

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex(prev => (prev - 1 + itemsCount) % itemsCount);
        break;
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex(prev => (prev + 1) % itemsCount);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        onSelect(selectedIndex);
        break;
      case 'Home':
        event.preventDefault();
        setSelectedIndex(0);
        break;
      case 'End':
        event.preventDefault();
        setSelectedIndex(itemsCount - 1);
        break;
    }
  }, [isActive, itemsCount, onSelect, selectedIndex]);

  useEffect(() => {
    if (isActive) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isActive, handleKeyDown]);

  return { selectedIndex, setSelectedIndex };
};