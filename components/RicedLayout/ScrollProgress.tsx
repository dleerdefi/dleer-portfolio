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

  return (
    <div
      className="fixed top-0 bottom-0 pointer-events-none z-40"
      style={{
        [position]: '20px',
        width: '4px',
        paddingTop: '20px',
        paddingBottom: '20px'
      }}
    >
      {/* Background track */}
      <div
        className="absolute inset-0 opacity-20"
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
          height: '60px',
          top: `${20 + (scrollPercent * 0.01 * (windowHeight - 100))}px`,
          filter: 'blur(0.5px)',
          opacity: 0.8
        }}
        animate={{
          top: `${20 + (scrollPercent * 0.01 * (windowHeight - 100))}px`
        }}
        transition={{
          type: 'spring',
          damping: 30,
          stiffness: 200
        }}
      />

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
              opacity: scrollPercent > i * 5 && scrollPercent < (i + 1) * 5 ? 0.6 : 0.1,
              transition: 'opacity 0.3s ease'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ScrollProgress;