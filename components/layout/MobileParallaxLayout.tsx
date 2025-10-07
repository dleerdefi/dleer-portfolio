'use client';

import React, { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import NeofetchTile from '@/components/tiles/NeofetchTile';
import { usePersonalInfo, useProjects, useBlogPosts, useSocialLinks } from '@/lib/config';
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
  const personal = usePersonalInfo();
  const projects = useProjects();
  const blogPosts = useBlogPosts();
  const socialLinks = useSocialLinks();

  const [showThemePanel, setShowThemePanel] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null!);

  // Border padding for glass elevator effect (constant 16px for mobile-only parallax)
  // Future: When desktop parallax is added, use responsive logic (32px for ≥1024px)
  const [borderPadding] = useState(16);

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
        return <ParallaxTechSection />;

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
      />

      {/* Border Frame - Solid outline with accent color */}
      <div
        className="fixed pointer-events-none"
        style={{
          top: `${borderPadding}px`,
          left: `${borderPadding}px`,
          right: `${borderPadding}px`,
          bottom: `${borderPadding}px`,
          border: '2px solid var(--accent-color)',
          borderRadius: '0px',
          zIndex: 40
        }}
      />

      {/* Top Border Glass Effect - Single Layer (kyrre.dev style) */}
      <div
        className="fixed gradient-dots pointer-events-none"
        style={{
          top: '0',
          left: '0',
          right: '0',
          height: `${borderPadding}px`,
          zIndex: 40
        }}
      />

      {/* Bottom Border Glass Effect - Single Layer (kyrre.dev style) */}
      <div
        className="fixed gradient-dots pointer-events-none"
        style={{
          bottom: '0',
          left: '0',
          right: '0',
          height: `${borderPadding}px`,
          transform: 'rotate(180deg)',
          zIndex: 40
        }}
      />

      {/* Solid background layer - matches interior to hide wallpaper behind dots */}
      <div
        className="fixed"
        style={{
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          backgroundColor: 'var(--theme-bg)',
          zIndex: -5
        }}
      />

      {/* Interior Window Background - Provides solid backdrop */}
      <div
        className="fixed"
        style={{
          top: `${borderPadding}px`,
          left: `${borderPadding}px`,
          right: `${borderPadding}px`,
          bottom: `${borderPadding}px`,
          backgroundColor: 'var(--theme-bg)',
          zIndex: -1
        }}
      />

      {/* Fixed Neofetch Background - Extends to border edge */}
      <motion.div
        className="fixed flex items-center justify-center pointer-events-none"
        style={{
          top: `${borderPadding}px`,
          left: `${borderPadding}px`,
          right: `${borderPadding}px`,
          height: '60vh',
          opacity: backgroundOpacity,
          backgroundColor: 'rgba(var(--theme-surface-rgb), 0.5)',
          backdropFilter: 'blur(10px)',
          zIndex: 2
        }}
      >
        <div className="w-full max-w-4xl mx-auto" style={{
          marginTop: `${borderPadding}px`,
          paddingLeft: '48px',
          paddingRight: '48px'
        }}>
          <NeofetchTile isBlurred={false} layout="parallax" />
        </div>
        <div
          className="absolute inset-x-0 bottom-0 h-32"
          style={{
            background: 'linear-gradient(to bottom, transparent, var(--theme-bg))'
          }}
        />
      </motion.div>

      {/* Scrollable Content - Container extends to viewport, padding creates border zone */}
      <div
        ref={scrollRef}
        className="fixed overflow-y-auto hide-scrollbar"
        style={{
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          padding: `${borderPadding}px`,
          zIndex: 2,
          scrollBehavior: 'smooth',
          overscrollBehavior: 'contain',
          WebkitOverflowScrolling: 'touch' as any
        }}
        role="main"
        aria-label="Main content"
      >
        {/* Spacer for fixed background */}
        <div
          style={{
            height: `calc(60vh + ${borderPadding}px)`
          }}
        />

        {/* Content Sections */}
        {sections.map((section, index) => (
          <section
            key={section.id}
            id={`section-${section.id}`}
            className={`relative min-h-screen flex flex-col`}
            style={{
              paddingTop: '48px',
              paddingBottom: '48px',
              paddingLeft: '16px',
              paddingRight: '16px',
              backgroundColor: 'var(--theme-bg)',
              zIndex: 2,
              scrollMarginTop: '0px'
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
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent 5%, rgba(var(--accent-color-rgb), 0.6) 50%, transparent 95%)',
                    boxShadow: `
                      0 0 20px rgba(var(--accent-color-rgb), 0.4),
                      0 0 40px rgba(var(--accent-color-rgb), 0.2)
                    `,
                    zIndex: 1
                  }}
                />
                {/* Dot gradient transition from Neofetch to content */}
                <div
                  className="absolute left-0 right-0"
                  style={{
                    top: '-75px',
                    height: '75px',
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(var(--accent-color-rgb), 0.3) 0.8px, transparent 0.8px)`,
                    backgroundSize: '3px 3px',
                    backgroundPosition: '0 0',
                    backdropFilter: 'blur(4px)',
                    WebkitBackdropFilter: 'blur(4px)',
                    maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
                    zIndex: 2,
                    pointerEvents: 'none'
                  }}
                />
              </>
            )}

            <div
              className="flex-1 flex flex-col justify-start max-w-4xl mx-auto w-full"
              style={{
                paddingLeft: `${borderPadding}px`,
                paddingRight: `${borderPadding}px`
              }}
            >
              {renderSection(section.id)}
            </div>

            {/* Section divider */}
            {index < sections.length - 1 && (
              <div
                className="absolute bottom-0 left-0 right-0"
                style={{
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent 10%, rgba(var(--accent-color-rgb), 0.3) 50%, transparent 90%)',
                  boxShadow: `
                    0 0 10px rgba(var(--accent-color-rgb), 0.2),
                    0 0 20px rgba(var(--accent-color-rgb), 0.1)
                  `
                }}
              />
            )}
          </section>
        ))}
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
    </>
  );
};

export default MobileParallaxLayout;