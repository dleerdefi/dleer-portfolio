import { useCallback, RefObject } from 'react';

interface Section {
  id: string;
  title: string;
}

interface UseSectionNavigationReturn {
  navigateToSection: (sectionId: string, callbacks?: NavigationCallbacks) => void;
  navigateToNextSection: (activeSection: string, reverse?: boolean) => void;
}

interface NavigationCallbacks {
  onNavigate?: (sectionId: string) => void;
  onProjectsLeave?: () => void;
  onBlogLeave?: () => void;
}

/**
 * Custom hook for managing section navigation in parallax layout
 * Handles programmatic scrolling to sections and wraparound navigation
 */
export function useSectionNavigation(
  scrollRef: RefObject<HTMLDivElement>,
  sections: Section[]
): UseSectionNavigationReturn {

  const navigateToSection = useCallback((
    sectionId: string,
    callbacks?: NavigationCallbacks
  ) => {
    // Call navigation callback if provided
    callbacks?.onNavigate?.(sectionId);

    // Reset selections when navigating away from their sections
    if (sectionId !== 'projects') callbacks?.onProjectsLeave?.();
    if (sectionId !== 'blog') callbacks?.onBlogLeave?.();

    const element = document.getElementById(`section-${sectionId}`);
    const container = scrollRef.current;

    if (element && container) {
      // Get the section index to calculate position
      const sectionIndex = sections.findIndex(s => s.id === sectionId);

      // Calculate scroll position based on section structure
      // Each section is min-h-screen, plus we have a 60vh spacer at the top
      const viewportHeight = window.innerHeight;
      const spacerHeight = viewportHeight * 0.6; // 60vh spacer

      // For first section, scroll to just after the spacer
      // For other sections, calculate based on index
      let targetScroll = spacerHeight;

      if (sectionIndex > 0) {
        // Add the height of all previous sections
        targetScroll = spacerHeight + (viewportHeight * sectionIndex);
      }

      // Scroll to the calculated position
      // For About section, this will scroll to where the content starts (after spacer)
      // For other sections, it calculates based on their position
      container.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
    } else {
      console.error('[useSectionNavigation] Failed to find element or container');
    }
  }, [scrollRef, sections]);

  const navigateToNextSection = useCallback((
    activeSection: string,
    reverse = false
  ) => {
    const currentIndex = sections.findIndex(s => s.id === activeSection);
    const direction = reverse ? -1 : 1;
    let nextIndex = currentIndex + direction;

    // Wrap around navigation
    if (nextIndex >= sections.length) {
      nextIndex = 0; // Wrap to first section (About)
    } else if (nextIndex < 0) {
      nextIndex = sections.length - 1; // Wrap to last section (Contact)
    }

    navigateToSection(sections[nextIndex].id);
  }, [sections, navigateToSection]);

  return {
    navigateToSection,
    navigateToNextSection
  };
}