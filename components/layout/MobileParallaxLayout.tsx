'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import NeofetchTile from '@/components/tiles/NeofetchTile';
import { useFocus } from '@/contexts/FocusContext';
import { useTheme } from '@/contexts/ThemeContext';
import { usePersonalInfo, useProjects, useBlogPosts, useSkills, useSocialLinks } from '@/lib/config';
import Background from '@/components/layout/Background';
import ThemeTile from '@/components/tiles/ThemeTile';
import ScrollProgress from '@/components/ui/ScrollProgress';

// Import custom hooks
import { useParallaxScroll } from './parallax/hooks/useParallaxScroll';
import { useSectionNavigation } from './parallax/hooks/useSectionNavigation';
import { useParallaxKeyboard } from './parallax/hooks/useParallaxKeyboard';

// Import section components
import { ParallaxBioSection } from './parallax/sections/ParallaxBioSection';
import { ParallaxTechSection } from './parallax/sections/ParallaxTechSection';
import { ParallaxProjectsSection } from './parallax/sections/ParallaxProjectsSection';
import { ParallaxBlogSection } from './parallax/sections/ParallaxBlogSection';
import { ParallaxContactSection } from './parallax/sections/ParallaxContactSection';

const MobileParallaxLayout: React.FC = () => {
  const { theme, setThemePreset, setAccentColor } = useTheme();
  const { activeContent, setActiveContent } = useFocus();
  const personal = usePersonalInfo();
  const projects = useProjects();
  const blogPosts = useBlogPosts();
  const skills = useSkills();
  const socialLinks = useSocialLinks();

  const [showThemePanel, setShowThemePanel] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Sections for scrolling - split About into Bio and Technologies
  const sections = [
    { id: 'bio', title: 'Bio' },
    { id: 'technologies', title: 'Technologies' },
    { id: 'projects', title: 'Projects' },
    { id: 'blog', title: 'Blog' },
    { id: 'contact', title: 'Contact' }
  ];

  // Use custom hooks for scroll management
  const {
    activeSection,
    scrollPercent,
    scrollYProgress,
    backgroundOpacity
  } = useParallaxScroll(scrollRef, sections);

  // Use custom hooks for navigation
  const {
    navigateToSection: baseNavigateToSection,
    navigateToNextSection: baseNavigateToNextSection
  } = useSectionNavigation(scrollRef, sections);

  // Wrap navigation functions to handle local state updates
  const navigateToSection = useCallback((sectionId: string) => {
    // Reset selections when navigating away from their sections
    if (sectionId !== 'projects') setSelectedProject(null);
    if (sectionId !== 'blog') setSelectedBlog(null);

    // Call the base navigation function
    baseNavigateToSection(sectionId, {
      onProjectsLeave: () => setSelectedProject(null),
      onBlogLeave: () => setSelectedBlog(null)
    });
  }, [baseNavigateToSection]);

  const navigateToNextSection = useCallback((reverse = false) => {
    baseNavigateToNextSection(activeSection, reverse);
  }, [activeSection, baseNavigateToNextSection]);

  // Use keyboard navigation hook
  useParallaxKeyboard(
    sections,
    activeSection,
    navigateToSection,
    navigateToNextSection,
    {
      onEscape: () => setShowThemePanel(false),
      onPanelToggle: () => setShowThemePanel(prev => !prev)
    }
  );

  // Render content sections using extracted components
  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'bio':
        return <ParallaxBioSection personal={personal} />;

      case 'technologies':
        return <ParallaxTechSection skills={skills} />;

      case 'projects':
        return (
          <ParallaxProjectsSection
            projects={projects}
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
          />
        );

      case 'blog':
        return (
          <ParallaxBlogSection
            blogPosts={blogPosts}
            selectedBlog={selectedBlog}
            setSelectedBlog={setSelectedBlog}
          />
        );

      case 'contact':
        return (
          <ParallaxContactSection
            formData={formData}
            setFormData={setFormData}
            socialLinks={socialLinks}
            personal={personal}
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Background />

      {/* Custom scrollbar positioned outside window frame */}
      <ScrollProgress
        scrollPercent={scrollPercent}
        sectionCount={6}  // Neofetch spacer + 5 content sections
        currentSection={activeSection === 'neofetch' ? 0 :
                       activeSection === 'bio' ? 1 :
                       activeSection === 'technologies' ? 2 :
                       activeSection === 'projects' ? 3 :
                       activeSection === 'blog' ? 4 :
                       activeSection === 'contact' ? 5 : 0}
      />

      {/* Window Border Frame - Sharp 90-degree corners */}
      <div
        className="fixed pointer-events-none z-50"
        style={{
          top: '12px',
          left: '12px',
          right: '12px',
          bottom: '12px',
          border: '2px solid rgba(var(--accent-color-rgb), 0.6)',
          borderRadius: '0px', // Sharp 90-degree corners
          boxShadow: '0 0 20px rgba(var(--accent-color-rgb), 0.2)'
        }}
      />

      {/* Fixed Neofetch Background - Centered within window */}
      <motion.div
        className="fixed flex items-center justify-center pointer-events-none"
        style={{
          top: '28px',
          left: '28px',
          right: '28px',
          height: '60vh',
          opacity: backgroundOpacity,
          backgroundColor: 'rgba(var(--theme-bg-rgb), 0.9)',
          backdropFilter: 'blur(10px)',
          zIndex: 0
        }}
      >
        <div className="w-full max-w-4xl mx-auto px-6 sm:px-8 md:px-12">
          <NeofetchTile isBlurred={false} />
        </div>
        <div
          className="absolute inset-x-0 bottom-0 h-32"
          style={{
            background: 'linear-gradient(to bottom, transparent, var(--theme-bg))'
          }}
        />
      </motion.div>

      {/* Scrollable Content - Constrained within window */}
      <div
        ref={scrollRef}
        className="fixed overflow-y-auto hide-scrollbar"
        style={{
          top: '28px',
          left: '28px',
          right: '28px',
          bottom: '28px',
          scrollSnapType: 'y mandatory',
          scrollBehavior: 'smooth',
          overscrollBehavior: 'contain',
          WebkitOverflowScrolling: 'touch' as any
        }}
        role="main"
        aria-label="Main content"
      >
        {/* Spacer for fixed background - also acts as snap point for Neofetch */}
        <div
          style={{
            height: '60vh',
            scrollSnapAlign: 'start',
            scrollSnapStop: 'always'
          }}
        />

        {/* Content Sections */}
        {sections.map((section, index) => (
          <section
            key={section.id}
            id={`section-${section.id}`}
            className={`relative px-6 sm:px-8 md:px-12 min-h-screen flex flex-col`}
            style={{
              paddingTop: '48px',
              paddingBottom: '48px',
              backgroundColor: 'var(--theme-bg)',
              zIndex: 10,
              scrollSnapAlign: 'start',
              scrollSnapStop: 'always',
              scrollMarginTop: '0px' // Remove negative margin for proper snap alignment
            }}
            role="region"
            aria-label={`${section.title} section`}
          >
            {/* Separator line and dot gradient at top of first section */}
            {index === 0 && (
              <>
                <div
                  className="absolute top-0 left-0 right-0"
                  style={{
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent 5%, rgba(var(--accent-color-rgb), 0.4) 50%, transparent 95%)',
                    zIndex: 1
                  }}
                />
                {/* Dot gradient transition from Neofetch to content */}
                <div
                  className="absolute left-0 right-0"
                  style={{
                    top: '-75px',
                    height: '75px',
                    background: `
                      radial-gradient(circle at 1px 1px, rgba(var(--theme-bg-rgb), 0.5) 0.8px, transparent 0.8px)
                    `,
                    backgroundSize: '3px 3px',
                    backgroundPosition: '0 0',
                    maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
                    zIndex: 2,
                    pointerEvents: 'none'
                  }}
                />
              </>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              viewport={{ once: false, amount: 0.3 }}
              className="flex-1 flex flex-col justify-center max-w-4xl mx-auto w-full"
            >
              {renderSection(section.id)}
            </motion.div>

            {/* Section divider */}
            {index < sections.length - 1 && (
              <div
                className="absolute bottom-0 left-0 right-0"
                style={{
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent 10%, rgba(var(--accent-color-rgb), 0.5) 50%, transparent 90%)',
                  boxShadow: '0 0 10px rgba(var(--accent-color-rgb), 0.2)'
                }}
              />
            )}
          </section>
        ))}

        {/* Extra padding at bottom - prevent snap */}
        <div
          style={{
            height: '10vh',
            scrollSnapAlign: 'none'  // Prevent this element from being a snap point
          }}
        />
      </div>

      {/* Scroll Progress Dots - Inside window */}
      <nav
        className="fixed right-8 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3"
        role="navigation"
        aria-label="Section navigation"
      >
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => navigateToSection(section.id)}
            className="w-3 h-3 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{
              backgroundColor: activeSection === section.id
                ? 'var(--accent-color)'
                : 'rgba(var(--accent-color-rgb), 0.3)',
              transform: activeSection === section.id ? 'scale(1.5)' : 'scale(1)',
              ['--tw-ring-color' as any]: 'var(--accent-color)',
              ['--tw-ring-offset-color' as any]: 'var(--theme-bg)'
            }}
            aria-label={`Go to ${section.title} section`}
            aria-current={activeSection === section.id ? 'true' : undefined}
            tabIndex={0}
          />
        ))}
      </nav>

      {/* Floating Theme Toggle - Upper right corner */}
      <div className="fixed top-16 right-10 z-30">
        {showThemePanel && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-16 right-0 w-72 p-4 shadow-xl"
            style={{
              backgroundColor: 'rgba(var(--theme-surface-rgb), 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(var(--accent-color-rgb), 0.3)',
              borderRadius: '0px' // Sharp corners to match window theme
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span style={{ color: 'var(--theme-text)', fontSize: '14px', fontWeight: '500' }}>Switch to:</span>
            </div>
            <ThemeTile isBlurred={false} />
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowThemePanel(!showThemePanel)}
          className="w-14 h-14 shadow-lg flex items-center justify-center text-2xl focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{
            backgroundColor: 'var(--accent-color)',
            color: 'var(--theme-bg)',
            borderRadius: '0px', // Sharp corners to match window theme
            ['--tw-ring-color' as any]: 'var(--accent-color)',
            ['--tw-ring-offset-color' as any]: 'var(--theme-bg)'
          }}
          aria-label="Toggle theme selector"
          aria-expanded={showThemePanel}
          tabIndex={0}
        >
          🎨
        </motion.button>
      </div>

      {/* Mode Toggle Button - Inside window */}
      <motion.button
        className="fixed bottom-10 left-10 z-30 px-4 py-2 shadow-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2"
        style={{
          backgroundColor: 'rgba(var(--theme-surface-rgb), 0.95)',
          color: 'var(--theme-text)',
          border: '1px solid rgba(var(--accent-color-rgb), 0.3)',
          borderRadius: '0px', // Sharp corners to match window theme
          ['--tw-ring-color' as any]: 'var(--accent-color)',
          ['--tw-ring-offset-color' as any]: 'var(--theme-bg)'
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          localStorage.setItem('mobile-mode', 'stacked');
          window.location.reload();
        }}
        aria-label="Switch to tiled view mode"
        tabIndex={0}
      >
        Switch to Tiles
      </motion.button>
    </>
  );
};

export default MobileParallaxLayout;