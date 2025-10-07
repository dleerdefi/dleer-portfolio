'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useView } from '@/contexts/ViewContext';
import ContentViewer from '@/components/tiles/ContentViewer';
import { ContentType, useFocus } from '@/contexts/FocusContext';
import Background from '@/components/layout/Background';

// Animation presets from spec §16
const fxExpand = {
  initial: { scale: 0.98, opacity: 0.96 },
  animate: { scale: 1, opacity: 1 },
  transition: { type: 'spring', stiffness: 420, damping: 32, mass: 0.7 }
};

const fxChromeOff = {
  animate: { opacity: 0, y: -6 },
  transition: { duration: 0.16, ease: [0.25, 0.46, 0.45, 0.94] }
};

const fxChromeOn = {
  initial: { opacity: 0, y: -6 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.16, ease: [0.25, 0.46, 0.45, 0.94] }
};

interface FocusedViewProps {
  className?: string;
}

const FocusedView: React.FC<FocusedViewProps> = ({ className = '' }) => {
  const { mode, section, contentData, exitToTiled, enterZen } = useView();
  const { setActiveContent } = useFocus();
  const [showHUD, setShowHUD] = useState(false);

  // Detect prefers-reduced-motion (spec §9)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Handle navigation from ContentViewer when in zen
  const handleContentNavigation = (content: ContentType) => {
    // Update FocusContext
    setActiveContent(content);

    // If clicking on individual project/blog, update ViewContext with data
    if (content.type === 'project') {
      enterZen('projects', content.data);
    } else if (content.type === 'blog') {
      enterZen('blog', content.data);
    }
  };

  // Map section to ContentType
  const getContentType = (): ContentType => {
    // If we have specific content data (individual project/blog), use it
    if (contentData) {
      if (section === 'projects') {
        return { type: 'project', data: contentData };
      } else if (section === 'blog') {
        return { type: 'blog', data: contentData };
      }
    }

    // Otherwise, show the overview
    switch (section) {
      case 'about':
        return { type: 'about' };
      case 'projects':
        return { type: 'projects-overview' };
      case 'blog':
        return { type: 'blog-overview' };
      default:
        return { type: 'home' };
    }
  };

  // Sync FocusContext with ViewContext when in zen
  useEffect(() => {
    if (mode === 'zen') {
      const contentType = getContentType();
      setActiveContent(contentType);
    }
  }, [mode, section, contentData]);

  // Show HUD briefly when entering zen mode
  useEffect(() => {
    if (mode === 'zen') {
      setShowHUD(true);
      const timer = setTimeout(() => setShowHUD(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [mode]);

  // Don't render if not in zen mode
  if (mode === 'tiled') {
    return null;
  }

  // Zen mode always uses rounded corners
  const borderRadius = 'var(--r-zen)';

  // Animation config - respect prefers-reduced-motion (spec §9)
  const fadeTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.22 };

  const expandTransition = prefersReducedMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 420, damping: 32, mass: 0.7 };

  return (
    <AnimatePresence>
      {mode === 'zen' && (
        <motion.div
          className={`fixed inset-0 z-50 ${className}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={fadeTransition}
        >
          {/* Background component - full viewport (animated wallpaper) */}
          <div className="absolute inset-0" style={{ zIndex: -10 }}>
            <Background />
          </div>

          {/* Vignette gradient for Zen mode */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }}
            style={{
              background: 'radial-gradient(circle at center, transparent 0%, rgba(var(--theme-bg-rgb), 0.1) 100%)',
              zIndex: 1
            }}
          />

          {/* Zen content wrapper - centered container */}
          <div
            className="fixed flex items-center justify-center"
            style={{
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1
            }}
          >
            {/* Zen container - full width */}
            <div
              className="relative"
              style={{
                width: '100%',
                height: '100%'
              }}
            >

              {/* Zen content container */}
              <motion.div
                className="relative h-full overflow-hidden"
                initial={prefersReducedMotion ? {} : fxExpand.initial}
                animate={prefersReducedMotion ? {} : fxExpand.animate}
                transition={expandTransition}
                style={{
                  margin: '0',
                  borderRadius: borderRadius,
                  border: 'none',
                  backgroundColor: 'var(--theme-surface)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
                  zIndex: 2
                }}
          >
            {/* Floating Exit Button - Top Left */}
            <motion.button
              className="absolute z-50 shadow-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{
                top: '16px',
                left: '16px',
                width: '48px',
                height: '48px',
                backgroundColor: 'rgba(var(--theme-surface-rgb), 0.95)',
                border: '1px solid rgba(var(--accent-color-rgb), 0.3)',
                borderRadius: '0px',
                backdropFilter: 'blur(10px)',
                color: 'var(--theme-text)'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={exitToTiled}
              title="Exit zen mode (Esc)"
            >
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor">
                <path d="M2 2L14 14M14 2L2 14" strokeWidth="1.5" />
              </svg>
            </motion.button>

            {/* Content area */}
            <div
              className="h-full overflow-auto"
              data-scroll-container
              style={{
                paddingTop: '60px',
                paddingRight: '80px',
                paddingBottom: '80px',
                paddingLeft: '80px'
              }}
            >
              {/* Zen mode typography adjustments (spec §3) */}
              <div
                style={{
                  maxWidth: '70ch', // 68-72ch range
                  margin: '0 auto',
                  fontSize: '1.05em', // +5% increase
                  lineHeight: '1.7' // 1.65-1.75 range
                }}
              >
                <ContentViewer onNavigate={handleContentNavigation} />
              </div>
            </div>

            {/* Zen mode HUD */}
            <AnimatePresence>
              {showHUD && (
                <motion.div
                  className="absolute bottom-8 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded text-xs"
                  initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
                  animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
                  transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }}
                  style={{
                    backgroundColor: 'rgba(var(--theme-surface-rgb), 0.95)',
                    border: '1px solid rgba(var(--accent-color-rgb), 0.2)',
                    color: 'var(--theme-text-dimmed)'
                  }}
                >
                  Zen Mode — Esc to exit
                </motion.div>
              )}
            </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FocusedView;