import { useState, useEffect, useCallback, useRef } from 'react';

interface UseKeyboardNavOptions {
  /**
   * Enable keyboard navigation
   * @default true
   */
  enabled?: boolean;

  /**
   * Callback when Enter is pressed on selected item
   */
  onSelect?: (index: number) => void;

  /**
   * Callback when Escape is pressed
   */
  onEscape?: () => void;

  /**
   * Scroll behavior when selection changes
   * @default 'smooth'
   */
  scrollBehavior?: ScrollBehavior;

  /**
   * Whether to loop around at list boundaries
   * @default false
   */
  loop?: boolean;
}

interface UseKeyboardNavReturn {
  /** Currently selected index */
  selectedIndex: number;

  /** Set selected index programmatically */
  setSelectedIndex: (index: number) => void;

  /** Key event handler (attach to container) */
  handleKeyDown: (event: React.KeyboardEvent) => void;

  /** Ref to attach to selected item for auto-scroll */
  getItemRef: (index: number) => React.RefCallback<HTMLElement>;
}

/**
 * Keyboard navigation hook for list-based UIs
 * Supports j/k/g/G/Enter/Esc vim-style navigation
 *
 * @param itemCount - Total number of items in the list
 * @param options - Configuration options
 *
 * @example
 * const { selectedIndex, handleKeyDown, getItemRef } = useKeyboardNav(items.length, {
 *   onSelect: (index) => openItem(items[index]),
 *   onEscape: () => exitView(),
 * });
 *
 * return (
 *   <div onKeyDown={handleKeyDown} tabIndex={0}>
 *     {items.map((item, i) => (
 *       <div key={i} ref={getItemRef(i)}>
 *         {item.name}
 *       </div>
 *     ))}
 *   </div>
 * );
 */
export function useKeyboardNav(
  itemCount: number,
  options: UseKeyboardNavOptions = {}
): UseKeyboardNavReturn {
  const {
    enabled = true,
    onSelect,
    onEscape,
    scrollBehavior = 'smooth',
    loop = false,
  } = options;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const itemRefs = useRef<Map<number, HTMLElement>>(new Map());

  // Clamp index to valid range
  const clampIndex = useCallback(
    (index: number): number => {
      if (itemCount === 0) return 0;
      if (loop) {
        return ((index % itemCount) + itemCount) % itemCount;
      }
      return Math.max(0, Math.min(index, itemCount - 1));
    },
    [itemCount, loop]
  );

  // Update selection and scroll into view
  const updateSelection = useCallback(
    (newIndex: number) => {
      const clampedIndex = clampIndex(newIndex);
      setSelectedIndex(clampedIndex);

      // Scroll selected item into view
      const element = itemRefs.current.get(clampedIndex);
      if (element) {
        // Check if user prefers reduced motion
        const prefersReducedMotion = window.matchMedia(
          '(prefers-reduced-motion: reduce)'
        ).matches;

        element.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : scrollBehavior,
          block: 'nearest',
          inline: 'nearest',
        });
      }
    },
    [clampIndex, scrollBehavior]
  );

  // Handle keyboard events
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (!enabled) return;

      switch (event.key) {
        case 'j': // Move down
        case 'ArrowDown':
          event.preventDefault();
          updateSelection(selectedIndex + 1);
          break;

        case 'k': // Move up
        case 'ArrowUp':
          event.preventDefault();
          updateSelection(selectedIndex - 1);
          break;

        case 'g': // Jump to top
          event.preventDefault();
          updateSelection(0);
          break;

        case 'G': // Jump to bottom
          event.preventDefault();
          updateSelection(itemCount - 1);
          break;

        case 'Enter': // Select current item
          event.preventDefault();
          if (onSelect) {
            onSelect(selectedIndex);
          }
          break;

        case 'Escape': // Exit/cancel
          event.preventDefault();
          if (onEscape) {
            onEscape();
          }
          break;
      }
    },
    [enabled, selectedIndex, itemCount, updateSelection, onSelect, onEscape]
  );

  // Ref callback for list items
  const getItemRef = useCallback(
    (index: number): React.RefCallback<HTMLElement> => {
      return (element: HTMLElement | null) => {
        if (element) {
          itemRefs.current.set(index, element);
        } else {
          itemRefs.current.delete(index);
        }
      };
    },
    []
  );

  // Reset selection if item count changes
  useEffect(() => {
    setSelectedIndex((prev) => clampIndex(prev));
  }, [itemCount, clampIndex]);

  // Cleanup refs on unmount
  useEffect(() => {
    return () => {
      itemRefs.current.clear();
    };
  }, []);

  return {
    selectedIndex,
    setSelectedIndex: updateSelection,
    handleKeyDown,
    getItemRef,
  };
}
