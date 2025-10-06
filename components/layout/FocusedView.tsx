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
  const { mode, section, contentData, exitToTiled, toggleZen, canZen, enterFullscreen } = useView();
  const { setActiveContent } = useFocus();
  const [showHUD, setShowHUD] = useState(false);
  const [hoveredEdge, setHoveredEdge] = useState(false);

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

  // Handle navigation from ContentViewer when in fullscreen/zen
  const handleContentNavigation = (content: ContentType) => {
    // Update FocusContext
    setActiveContent(content);

    // If clicking on individual project/blog, update ViewContext with data
    if (content.type === 'project') {
      enterFullscreen('projects', content.data);
    } else if (content.type === 'blog') {
      enterFullscreen('blog', content.data);
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

  // Sync FocusContext with ViewContext when in fullscreen/zen
  useEffect(() => {
    if (mode === 'fullscreen' || mode === 'zen') {
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

  // Don't render if not in fullscreen or zen mode
  if (mode === 'tiled') {
    return null;
  }

  // Border radius based on mode (using CSS variables from spec §5)
  const getBorderRadius = () => {
    switch (mode) {
      case 'fullscreen':
        return 'var(--r-fs)';
      case 'zen':
        return 'var(--r-zen)';
      default:
        return 'var(--r-tiled)';
    }
  };

  // Calculate perimeter padding (parallax-inspired border treatment)
  const perimeterPadding = mode === 'fullscreen' ? '2vw' : '0';

  // Animation config - respect prefers-reduced-motion (spec §9)
  const fadeTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.22 };

  const expandTransition = prefersReducedMotion
    ? { duration: 0 }
    : fxExpand.transition;

  return (
    <AnimatePresence>
      {(mode === 'fullscreen' || mode === 'zen') && (
        <motion.div
          className={`fixed inset-0 z-50 ${className}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={fadeTransition}
        >
          {/* Background component - full viewport (z-index: -10) */}
          <div className="absolute inset-0" style={{ zIndex: -10 }}>
            <Background />
          </div>

          {/* Full viewport background layer (z-index: -5) */}
          <motion.div
            className="fixed inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={fadeTransition}
            style={{
              backgroundColor: 'var(--theme-bg)',
              zIndex: -5
            }}
          />

          {/* Interior window background (z-index: -1) */}
          <div
            className="fixed"
            style={{
              top: mode === 'fullscreen' ? perimeterPadding : '0',
              left: mode === 'fullscreen' ? perimeterPadding : '0',
              right: mode === 'fullscreen' ? perimeterPadding : '0',
              bottom: mode === 'fullscreen' ? perimeterPadding : '0',
              backgroundColor: 'var(--theme-bg)',
              zIndex: -1
            }}
          />

          {/* Vignette gradient for Zen mode */}
          {mode === 'zen' && (
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
          )}

          {/* Accent border frame (parallax-style) */}
          {mode === 'fullscreen' && (
            <div
              className="fixed pointer-events-none"
              style={{
                top: perimeterPadding,
                left: perimeterPadding,
                right: perimeterPadding,
                bottom: perimeterPadding,
                border: '2px solid var(--accent-color)',
                borderRadius: getBorderRadius(),
                zIndex: 40
              }}
            />
          )}

          {/* Gradient dots glass effect - Top border */}
          {mode === 'fullscreen' && (
            <div
              className="fixed gradient-dots pointer-events-none"
              style={{
                top: '0',
                left: '0',
                right: '0',
                height: perimeterPadding,
                zIndex: 40
              }}
            />
          )}

          {/* Gradient dots glass effect - Bottom border */}
          {mode === 'fullscreen' && (
            <div
              className="fixed gradient-dots pointer-events-none"
              style={{
                bottom: '0',
                left: '0',
                right: '0',
                height: perimeterPadding,
                transform: 'rotate(180deg)',
                zIndex: 40
              }}
            />
          )}

          {/* Main content container */}
          <motion.div
            className="relative h-full overflow-hidden"
            initial={prefersReducedMotion ? {} : fxExpand.initial}
            animate={prefersReducedMotion ? {} : fxExpand.animate}
            transition={expandTransition}
            style={{
              margin: mode === 'fullscreen' ? perimeterPadding : '0',
              borderRadius: getBorderRadius(),
              border: mode === 'zen' ? 'none' : 'none',
              backgroundColor: 'var(--theme-surface)',
              boxShadow: mode === 'zen'
                ? '0 20px 40px rgba(0,0,0,0.25)'
                : 'none'
            }}
            onMouseMove={(e) => {
              // Detect edge hover for exit affordance
              const rect = e.currentTarget.getBoundingClientRect();
              const edgeThreshold = 40;
              const nearEdge =
                e.clientX - rect.left < edgeThreshold ||
                rect.right - e.clientX < edgeThreshold ||
                e.clientY - rect.top < edgeThreshold ||
                rect.bottom - e.clientY < edgeThreshold;
              setHoveredEdge(nearEdge);
            }}
            onMouseLeave={() => setHoveredEdge(false)}
          >
            {/* Floating Exit Button - Top Left */}
            <motion.button
              className="fixed z-50 shadow-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{
                top: mode === 'fullscreen' ? 'calc(2vw + 16px)' : '16px',
                left: mode === 'fullscreen' ? 'calc(2vw + 16px)' : '16px',
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
              title="Exit fullscreen (Esc)"
            >
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor">
                <path d="M2 2L14 14M14 2L2 14" strokeWidth="1.5" />
              </svg>
            </motion.button>

            {/* Floating Zen Toggle Button - Top Right */}
            {canZen && (
              <motion.button
                className="fixed z-50 shadow-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{
                  top: mode === 'fullscreen' ? 'calc(2vw + 16px)' : '16px',
                  right: mode === 'fullscreen' ? 'calc(2vw + 16px)' : '16px',
                  width: '56px',
                  height: '48px',
                  backgroundColor: mode === 'zen' ? 'var(--accent-color)' : 'rgba(var(--theme-surface-rgb), 0.95)',
                  border: '1px solid rgba(var(--accent-color-rgb), 0.3)',
                  borderRadius: '0px',
                  backdropFilter: 'blur(10px)',
                  color: mode === 'zen' ? 'var(--theme-bg)' : 'var(--accent-color)',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleZen}
                title="Toggle zen mode (Z)"
              >
                ZEN
              </motion.button>
            )}

            {/* Content area */}
            <div
              className="h-full overflow-auto"
              data-scroll-container
              style={{
                paddingTop: '60px',
                paddingRight: mode === 'zen' ? '80px' : '40px',
                paddingBottom: mode === 'zen' ? '80px' : '40px',
                paddingLeft: mode === 'zen' ? '80px' : '40px'
              }}
            >
              {/* Zen mode typography adjustments (spec §3) */}
              <div
                style={{
                  maxWidth: mode === 'zen' ? '70ch' : '100%', // 68-72ch range
                  margin: mode === 'zen' ? '0 auto' : '0',
                  fontSize: mode === 'zen' ? '1.05em' : '1em', // +5% increase
                  lineHeight: mode === 'zen' ? '1.7' : '1.6' // 1.65-1.75 range
                }}
              >
                <ContentViewer onNavigate={handleContentNavigation} />
              </div>
            </div>

            {/* Edge glow affordance (FS only) */}
            {mode === 'fullscreen' && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{
                  boxShadow: hoveredEdge
                    ? 'inset 0 0 20px rgba(var(--accent-color-rgb), 0.2)'
                    : 'inset 0 0 0px rgba(var(--accent-color-rgb), 0)'
                }}
                transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.12 }}
              />
            )}

            {/* Zen mode HUD */}
            <AnimatePresence>
              {mode === 'zen' && showHUD && (
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
                  Zen Mode — Esc to exit · Z to toggle
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FocusedView;