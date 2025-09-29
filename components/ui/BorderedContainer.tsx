'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface BorderedContainerProps {
  children: React.ReactNode;
  onScroll?: (scrollPercent: number) => void;
}

const BorderedContainer: React.FC<BorderedContainerProps> = ({ children, onScroll }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight - container.clientHeight;
      const percent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

      setScrollPercent(percent);
      onScroll?.(percent);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [onScroll]);

  return (
    <>
      {/* Fixed border frame that doesn't scroll */}
      <div
        className="fixed pointer-events-none z-50"
        style={{
          top: '8px',
          left: '8px',
          right: '8px',
          bottom: '8px',
          border: '2px solid var(--accent-color)',
          borderRadius: '8px',
          opacity: 0.8
        }}
      />

      {/* Scrollable content container */}
      <div
        ref={scrollContainerRef}
        className="fixed inset-0 overflow-y-auto no-scrollbar"
        style={{
          top: '10px',
          left: '10px',
          right: '10px',
          bottom: '10px',
          scrollBehavior: 'smooth',
          // Ensure content can receive pointer events
          pointerEvents: 'auto'
        }}
      >
        {/* Content wrapper with proper padding to avoid border overlap */}
        <div className="min-h-full" style={{ padding: '8px' }}>
          {children}
        </div>
      </div>
    </>
  );
};

export default BorderedContainer;