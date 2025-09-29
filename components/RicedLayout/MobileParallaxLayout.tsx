'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import NeofetchTile from './NeofetchTile';
import { useFocus } from '@/contexts/FocusContext';
import { useTheme } from '@/contexts/ThemeContext';
import { usePersonalInfo, useProjects, useBlogPosts, useSkills, useSocialLinks } from '@/lib/config';
import Background from './Background';
import ThemeTile from './ThemeTile';

const MobileParallaxLayout: React.FC = () => {
  const { theme, setThemePreset, setAccentColor } = useTheme();
  const { activeContent, setActiveContent } = useFocus();
  const personal = usePersonalInfo();
  const projects = useProjects();
  const blogPosts = useBlogPosts();
  const skills = useSkills();
  const socialLinks = useSocialLinks();

  const [activeSection, setActiveSection] = useState('about');
  const [showThemePanel, setShowThemePanel] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const scrollRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    container: scrollRef
  });

  // Transform scroll progress to background opacity
  const backgroundOpacity = useTransform(
    scrollYProgress,
    [0, 0.2],
    [0.7, 0.3]
  );

  // Sections for scrolling (removed home, about is first)
  const sections = [
    { id: 'about', title: 'About' },
    { id: 'projects', title: 'Projects' },
    { id: 'blog', title: 'Blog' },
    { id: 'contact', title: 'Contact' }
  ];

  // Track active section based on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = scrollRef.current?.scrollTop || 0;
      const windowHeight = window.innerHeight;

      // Determine which section is most visible
      sections.forEach((section, index) => {
        const sectionElement = document.getElementById(`section-${section.id}`);
        if (sectionElement) {
          const rect = sectionElement.getBoundingClientRect();
          if (rect.top < windowHeight / 2 && rect.bottom > windowHeight / 2) {
            setActiveSection(section.id);
          }
        }
      });
    };

    const container = scrollRef.current;
    container?.addEventListener('scroll', handleScroll, { passive: true });
    return () => container?.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard navigation handlers
  const navigateToSection = useCallback((sectionId: string) => {
    console.log('navigateToSection called for:', sectionId);
    const element = document.getElementById(`section-${sectionId}`);
    const container = scrollRef.current;

    console.log('Element found:', !!element);
    console.log('Container found:', !!container);

    if (element && container) {
      // Get the section index to calculate position
      const sectionIndex = sections.findIndex(s => s.id === sectionId);

      // Calculate scroll position based on section structure
      // Each section is min-h-screen, plus we have a 60vh spacer at the top
      const viewportHeight = window.innerHeight;
      const spacerHeight = viewportHeight * 0.6; // 60vh spacer

      // For first section, scroll to just after the spacer
      // For other sections, calculate based on index
      let targetScroll = spacerHeight;

      if (sectionIndex > 0) {
        // Add the height of all previous sections
        targetScroll = spacerHeight + (viewportHeight * sectionIndex);
      }

      console.log('Target scroll position:', targetScroll);
      console.log('Current scroll:', container.scrollTop);

      // Special case for About section - scroll to very top to show Neofetch
      if (sectionId === 'about') {
        container.scrollTo({
          top: 0, // Scroll to absolute top to reveal Neofetch
          behavior: 'smooth'
        });
      } else {
        // Normal section navigation
        container.scrollTo({
          top: targetScroll,
          behavior: 'smooth'
        });
      }

      // Update active section state
      setActiveSection(sectionId);
    } else {
      console.error('Failed to find element or container');
    }
  }, [sections]);

  const navigateToNextSection = useCallback((reverse = false) => {
    const currentIndex = sections.findIndex(s => s.id === activeSection);
    const direction = reverse ? -1 : 1;
    let nextIndex = currentIndex + direction;

    // Wrap around navigation
    if (nextIndex >= sections.length) {
      nextIndex = 0; // Wrap to first section (About)
    } else if (nextIndex < 0) {
      nextIndex = sections.length - 1; // Wrap to last section (Contact)
    }

    navigateToSection(sections[nextIndex].id);
  }, [activeSection, navigateToSection]);

  // Keyboard event handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't interfere with form inputs
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      switch(e.key) {
        case 'Tab':
          // Smart Tab handling: navigate sections unless we're actively in a form
          const isInContactForm = activeSection === 'contact' &&
            (target.tagName === 'INPUT' ||
             target.tagName === 'TEXTAREA' ||
             target.tagName === 'BUTTON' ||
             target.tagName === 'A');

          // Also check if any form element currently has focus
          const activeElement = document.activeElement;
          const isFormFocused = activeElement &&
            (activeElement.tagName === 'INPUT' ||
             activeElement.tagName === 'TEXTAREA' ||
             activeElement.tagName === 'BUTTON');

          // Only navigate sections if not interacting with form elements
          if (!isInContactForm && !isFormFocused) {
            e.preventDefault();
            navigateToNextSection(e.shiftKey);
          }
          break;

        case 'ArrowDown':
        case 'PageDown':
          e.preventDefault();
          navigateToNextSection();
          break;

        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault();
          navigateToNextSection(true);
          break;

        case 'Home':
          e.preventDefault();
          navigateToSection(sections[0].id);
          break;

        case 'End':
          e.preventDefault();
          navigateToSection(sections[sections.length - 1].id);
          break;

        case 'Escape':
          if (showThemePanel) {
            setShowThemePanel(false);
          }
          break;

        // Number keys for quick section jump
        case '1':
        case '2':
        case '3':
        case '4':
          if (!e.ctrlKey && !e.altKey && !e.metaKey) {
            const index = parseInt(e.key) - 1;
            if (index < sections.length) {
              e.preventDefault();
              navigateToSection(sections[index].id);
            }
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSection, showThemePanel, navigateToNextSection, navigateToSection]);

  // Render content sections
  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'about':
        return (
          <div className="space-y-8">
            {/* Intro section that was previously "home" */}
            <div className="space-y-4">
              <h2 className="text-4xl font-bold" style={{ color: 'var(--accent-color)' }}>
                {personal.title}
              </h2>
              <p className="text-xl" style={{ color: 'var(--theme-text)', opacity: 0.95 }}>
                {personal.bio.short}
              </p>
            </div>

            {/* Full about section */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold" style={{ color: 'var(--accent-color)' }}>
                About Me
              </h3>
              <p style={{ color: 'var(--theme-text)', opacity: 0.9 }}>
                {personal.bio.full}
              </p>
            </div>
            {skills && skills.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold" style={{ color: 'var(--theme-info)' }}>
                  Skills
                </h3>
                {skills.map((category, idx) => (
                  <div key={idx} className="space-y-2">
                    <h4 className="text-sm font-medium" style={{ color: 'var(--theme-text)', opacity: 0.7 }}>
                      {category.category}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {category.skills.map(skill => (
                        <span
                          key={skill}
                          className="px-3 py-1 rounded-lg text-sm"
                          style={{
                            backgroundColor: 'rgba(var(--accent-color-rgb), 0.1)',
                            color: 'var(--accent-color)',
                            border: '1px solid rgba(var(--accent-color-rgb), 0.3)'
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'projects':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold" style={{ color: 'var(--accent-color)' }}>
              Projects
            </h2>
            <div className="grid gap-4">
              {projects.map(project => (
                <div
                  key={project.id}
                  className="p-4 rounded-lg"
                  style={{
                    backgroundColor: 'rgba(var(--theme-surface-rgb), 0.5)',
                    border: '1px solid rgba(var(--accent-color-rgb), 0.2)'
                  }}
                >
                  <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--theme-primary)' }}>
                    {project.name}
                  </h3>
                  <p style={{ color: 'var(--theme-text)', opacity: 0.8 }}>
                    {project.description}
                  </p>
                  {project.techStack && project.techStack.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {project.techStack.slice(0, 3).map(tech => (
                        <span
                          key={tech}
                          className="text-xs px-2 py-1 rounded"
                          style={{
                            backgroundColor: 'rgba(var(--accent-color-rgb), 0.1)',
                            color: 'var(--accent-color)'
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'blog':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold" style={{ color: 'var(--accent-color)' }}>
              Blog
            </h2>
            <div className="space-y-4">
              {blogPosts.map(post => (
                <article
                  key={post.id}
                  className="p-4 rounded-lg"
                  style={{
                    backgroundColor: 'rgba(var(--theme-surface-rgb), 0.5)',
                    border: '1px solid rgba(var(--accent-color-rgb), 0.2)'
                  }}
                >
                  <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--theme-primary)' }}>
                    {post.title}
                  </h3>
                  <p className="text-sm mb-2" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>
                    {post.date} • {post.readTime}
                  </p>
                  <p style={{ color: 'var(--theme-text)', opacity: 0.8 }}>
                    {post.excerpt}
                  </p>
                </article>
              ))}
            </div>
          </div>
        );

      case 'contact':
        const githubLink = socialLinks.find(link => link.platform === 'GitHub');
        const linkedinLink = socialLinks.find(link => link.platform === 'LinkedIn');

        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold" style={{ color: 'var(--accent-color)' }}>
              Contact
            </h2>

            {/* Contact Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                console.log('Form submitted:', formData);
                // Handle form submission here
                alert('Message sent! (This is a demo)');
                setFormData({ name: '', email: '', message: '' });
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--theme-text-dimmed)' }}>
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded px-3 py-2 text-sm transition-colors"
                  style={{
                    backgroundColor: 'rgba(var(--theme-surface-rgb), 0.5)',
                    color: 'var(--theme-text)',
                    border: '1px solid rgba(var(--accent-color-rgb), 0.3)'
                  }}
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--theme-text-dimmed)' }}>
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded px-3 py-2 text-sm transition-colors"
                  style={{
                    backgroundColor: 'rgba(var(--theme-surface-rgb), 0.5)',
                    color: 'var(--theme-text)',
                    border: '1px solid rgba(var(--accent-color-rgb), 0.3)'
                  }}
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--theme-text-dimmed)' }}>
                  Message
                </label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  className="w-full rounded px-3 py-2 text-sm resize-none transition-colors"
                  style={{
                    backgroundColor: 'rgba(var(--theme-surface-rgb), 0.5)',
                    color: 'var(--theme-text)',
                    border: '1px solid rgba(var(--accent-color-rgb), 0.3)'
                  }}
                  placeholder="Your message..."
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2 rounded font-medium transition-all"
                style={{
                  backgroundColor: 'var(--accent-color)',
                  color: 'var(--theme-bg)'
                }}
              >
                Send Message
              </button>
            </form>

            {/* Social Links */}
            <div className="pt-4 border-t" style={{ borderColor: 'rgba(var(--accent-color-rgb), 0.2)' }}>
              <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--theme-info)' }}>
                Connect
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span style={{ color: 'var(--theme-info)' }}>📧</span>
                  <a
                    href={`mailto:${personal.email}`}
                    style={{ color: 'var(--accent-color)' }}
                    className="hover:underline"
                  >
                    {personal.email}
                  </a>
                </div>
                {githubLink && (
                  <div className="flex items-center gap-3">
                    <span style={{ color: 'var(--theme-info)' }}>🔗</span>
                    <a
                      href={githubLink.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'var(--accent-color)' }}
                      className="hover:underline"
                    >
                      GitHub
                    </a>
                  </div>
                )}
                {linkedinLink && (
                  <div className="flex items-center gap-3">
                    <span style={{ color: 'var(--theme-info)' }}>💼</span>
                    <a
                      href={linkedinLink.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'var(--accent-color)' }}
                      className="hover:underline"
                    >
                      LinkedIn
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Background />

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
        className="fixed overflow-y-auto"
        style={{
          top: '28px',
          left: '28px',
          right: '28px',
          bottom: '28px'
        }}
        role="main"
        aria-label="Main content"
      >
        {/* Spacer for fixed background */}
        <div style={{ height: '60vh' }} />

        {/* Content Sections */}
        {sections.map((section, index) => (
          <section
            key={section.id}
            id={`section-${section.id}`}
            className="relative min-h-screen px-6 sm:px-8 md:px-12"
            style={{
              paddingTop: index === 0 ? '48px' : '48px',
              paddingBottom: '48px',
              backgroundColor: 'var(--theme-bg)',
              zIndex: 10
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
              className="max-w-4xl mx-auto"
            >
              {renderSection(section.id)}
            </motion.div>

            {/* Section divider */}
            {index < sections.length - 1 && (
              <div
                className="absolute bottom-0 left-12 right-12"
                style={{
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, rgba(var(--accent-color-rgb), 0.3), transparent)'
                }}
              />
            )}
          </section>
        ))}

        {/* Extra padding at bottom */}
        <div style={{ height: '10vh' }} />
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
              '--tw-ring-color': 'var(--accent-color)',
              '--tw-ring-offset-color': 'var(--theme-bg)'
            }}
            aria-label={`Go to ${section.title} section`}
            aria-current={activeSection === section.id ? 'true' : undefined}
            tabIndex={0}
          />
        ))}
      </nav>

      {/* Floating Theme Toggle - Inside window */}
      <div className="fixed bottom-10 right-10 z-30">
        {showThemePanel && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-16 right-0 w-72 p-4 shadow-xl"
            style={{
              backgroundColor: 'rgba(var(--theme-surface-rgb), 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(var(--accent-color-rgb), 0.3)',
              borderRadius: '0px' // Sharp corners to match window theme
            }}
          >
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
            '--tw-ring-color': 'var(--accent-color)',
            '--tw-ring-offset-color': 'var(--theme-bg)'
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
          '--tw-ring-color': 'var(--accent-color)',
          '--tw-ring-offset-color': 'var(--theme-bg)'
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