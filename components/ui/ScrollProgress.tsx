'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ScrollProgressProps {
  scrollPercent: number;
  position?: 'left' | 'right';
  sectionCount?: number;  // Total number of snap sections
  currentSection?: number; // Current section index (0-based)
}

const ScrollProgress: React.FC<ScrollProgressProps> = ({
  scrollPercent,
  position = 'right',
  sectionCount,
  currentSection
}) => {
  const [windowHeight, setWindowHeight] = React.useState(800);

  React.useEffect(() => {
    // Set initial height
    setWindowHeight(window.innerHeight);

    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className="fixed top-0 bottom-0 pointer-events-none z-50"
      style={{
        [position]: '0px',
        width: '6px',
        paddingTop: '20px',
        paddingBottom: '20px'
      }}
    >
      {/* Background track */}
      <div
        className="absolute inset-0 opacity-10"  // Reduced from opacity-20
        style={{
          background: `linear-gradient(
            to bottom,
            transparent,
            var(--accent-color) 10%,
            var(--accent-color) 90%,
            transparent
          )`,
          margin: '20px 0'
        }}
      />

      {/* Progress indicator */}
      {(() => {
        // Calculate position and size based on whether we have section info
        let indicatorTop: number;
        let indicatorHeight: number;

        if (sectionCount && currentSection !== undefined) {
          // Section-based positioning for snap scrolling
          const availableHeight = windowHeight - 60; // Account for padding
          const sectionHeight = availableHeight / sectionCount;
          indicatorTop = 20 + (currentSection * sectionHeight);
          indicatorHeight = sectionHeight;
        } else {
          // Continuous positioning for regular scrolling
          indicatorTop = 20 + (scrollPercent * 0.01 * (windowHeight - 100));
          indicatorHeight = 60;
        }

        return (
          <motion.div
            className="absolute left-0 right-0"
            style={{
              background: `linear-gradient(
                to bottom,
                transparent,
                var(--accent-color),
                var(--accent-color),
                transparent
              )`,
              filter: 'blur(0.5px)',
              opacity: 0.4  // Reduced from 0.8 for less prominence
            }}
            animate={{
              top: indicatorTop,
              height: indicatorHeight
            }}
            transition={{
              type: 'spring',
              damping: 25,  // Smoother movement
              stiffness: 150,
              mass: 0.5
            }}
          />
        );
      })()}

      {/* Pixelated effect dots */}
      <div className="absolute inset-0" style={{ margin: '20px 0' }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute left-1/2 transform -translate-x-1/2"
            style={{
              top: `${i * 5}%`,
              width: '2px',
              height: '2px',
              backgroundColor: 'var(--accent-color)',
              opacity: scrollPercent > i * 5 && scrollPercent < (i + 1) * 5 ? 0.3 : 0.05,  // Reduced opacity
              transition: 'opacity 0.3s ease'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ScrollProgress;