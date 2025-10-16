'use client';

import { useEffect } from 'react';

/**
 * Scroll Reveal Animation
 * Fades in elements as they enter viewport
 */
export function ScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    // Observe all major blog elements
    const elements = document.querySelectorAll('.blog-prose > *');
    elements.forEach((el) => {
      el.classList.add('reveal-target');
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
