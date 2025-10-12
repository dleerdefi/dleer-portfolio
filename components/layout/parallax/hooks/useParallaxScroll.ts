import { useEffect, useState, RefObject } from 'react';
import { useScroll, useTransform, MotionValue } from 'framer-motion';

interface Section {
  id: string;
  title: string;
}

interface UseParallaxScrollReturn {
  activeSection: string;
  scrollPercent: number;
  scrollYProgress: MotionValue<number>;
  backgroundOpacity: MotionValue<number>;
}

/**
 * Custom hook for managing parallax scroll behavior
 * Handles scroll tracking, active section detection, and scroll-based animations
 */
export function useParallaxScroll(
  scrollRef: RefObject<HTMLDivElement>,
  sections: Section[]
): UseParallaxScrollReturn {
  const [activeSection, setActiveSection] = useState('about');
  const [scrollPercent, setScrollPercent] = useState(0);

  // Framer Motion scroll tracking
  const { scrollYProgress } = useScroll({
    container: scrollRef
  });

  // Transform scroll progress to background opacity
  const backgroundOpacity = useTransform(
    scrollYProgress,
    [0, 0.2],
    [0.7, 0.3]
  );

  // Track active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const container = scrollRef.current;
      if (!container) return;

      const scrollPosition = container.scrollTop;
      const scrollHeight = container.scrollHeight - container.clientHeight;
      const windowHeight = window.innerHeight;

      // Calculate scroll percentage for smooth tracking
      const percent = Math.round((scrollPosition / scrollHeight) * 100);
      setScrollPercent(percent);

      // Check if we're at the top (Neofetch section)
      if (scrollPosition < windowHeight * 0.4) {  // Less than 40% of viewport height
        setActiveSection('neofetch');  // Special case for top
        return;
      }

      // Determine which section is most visible (center of viewport)
      sections.forEach((section) => {
        const sectionElement = document.getElementById(`section-${section.id}`);
        if (sectionElement) {
          const rect = sectionElement.getBoundingClientRect();
          // Check if section center is in viewport center
          if (rect.top < windowHeight / 2 && rect.bottom > windowHeight / 2) {
            setActiveSection(section.id);
          }
        }
      });
    };

    const container = scrollRef.current;
    container?.addEventListener('scroll', handleScroll, { passive: true });

    // Initial call to set state
    handleScroll();

    return () => {
      container?.removeEventListener('scroll', handleScroll);
    };
  }, [scrollRef, sections]);

  return {
    activeSection,
    scrollPercent,
    scrollYProgress,
    backgroundOpacity
  };
}