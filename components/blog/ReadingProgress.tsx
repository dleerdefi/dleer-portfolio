'use client';

import { useEffect, useState } from 'react';

/**
 * Reading Progress Bar
 * Shows horizontal progress bar at top of page as user scrolls
 */
export function ReadingProgress() {
  const [progress, set Progress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setProgress(Math.min(100, Math.max(0, scrollPercent)));
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();

    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 h-1 z-50"
      style={{
        background: 'rgba(var(--accent-color-rgb), 0.1)',
      }}
    >
      <div
        className="h-full transition-all duration-150"
        style={{
          width: `${progress}%`,
          background: 'var(--accent-color)',
          boxShadow: `0 0 20px rgba(var(--accent-color-rgb), 0.5)`,
        }}
      />
    </div>
  );
}
