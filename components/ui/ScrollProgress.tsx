'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ScrollProgressProps {
  scrollPercent: number;
  position?: 'left' | 'right';
}

const ScrollProgress: React.FC<ScrollProgressProps> = ({
  scrollPercent,
  position = 'right'
}) => {
  const [windowHeight, setWindowHeight] = React.useState(800);

  React.useEffect(() => {
    // Set initial height
    setWindowHeight(window.innerHeight);

    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate the center position of the active indicator
  const indicatorPosition = 20 + (scrollPercent * 0.01 * (windowHeight - 40));

  return (
    <div
      className="fixed top-0 bottom-0 pointer-events-none z-50"
      style={{
        [position]: '0px',
        width: '4px',  // Slightly narrower for subtlety
      }}
    >
      {/* Full-height dotted pattern track */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(
            circle at center,
            rgba(var(--accent-color-rgb), 0.05) 0.5px,
            transparent 0.5px
          )`,
          backgroundSize: '2px 4px',  // Vertical dots spacing
          backgroundPosition: 'center',
          opacity: 1
        }}
      />

      {/* Active area highlight - gradient mask that moves with scroll */}
      <motion.div
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          background: `linear-gradient(
            to bottom,
            transparent,
            rgba(var(--accent-color-rgb), 0.15) 20%,
            rgba(var(--accent-color-rgb), 0.25) 50%,
            rgba(var(--accent-color-rgb), 0.15) 80%,
            transparent
          )`,
          mixBlendMode: 'screen',  // Brightens the dots in active area
          filter: 'blur(2px)'  // Soft edges
        }}
        animate={{
          top: indicatorPosition - 40,
          height: 80
        }}
        transition={{
          type: 'spring',
          damping: 35,  // Very smooth movement
          stiffness: 180,
          mass: 0.4
        }}
      />

      {/* Secondary dot pattern for more density in active area */}
      <motion.div
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(
            circle at center,
            rgba(var(--accent-color-rgb), 0.2) 0.5px,
            transparent 0.5px
          )`,
          backgroundSize: '2px 4px',
          backgroundPosition: 'center'
        }}
        animate={{
          top: indicatorPosition - 30,
          height: 60,
          opacity: 0.6
        }}
        transition={{
          type: 'spring',
          damping: 35,
          stiffness: 180,
          mass: 0.4
        }}
      />
    </div>
  );
};

export default ScrollProgress;