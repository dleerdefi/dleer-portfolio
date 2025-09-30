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

  // Sections for scrolling (removed home, about is first)
  const sections = [
    { id: 'about', title: 'About' },
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

  // Render content sections
  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'about':
        return (
          <div className="space-y-6">
            {/* Combined intro and about - Most Important Content First */}
            <div>
              <h2 className="text-3xl font-bold mb-3" style={{ color: 'var(--accent-color)' }}>
                {personal.title}
              </h2>
              <p className="text-lg mb-4" style={{ color: 'var(--theme-text)', opacity: 0.95 }}>
                {personal.bio.short}
              </p>
              <p style={{ color: 'var(--theme-text)', opacity: 0.9, lineHeight: '1.6' }}>
                {personal.bio.long}
              </p>
            </div>

            {/* Compact Skills Display - Secondary Content */}
            {skills && skills.length > 0 && (
              <div
                className="pt-4 border-t"
                style={{ borderColor: 'rgba(var(--accent-color-rgb), 0.1)' }}
              >
                <h4 className="text-sm font-medium mb-3" style={{ color: 'var(--theme-info)' }}>
                  Technical Stack
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  {skills.map((category, idx) => (
                    <div key={idx} className="flex flex-wrap items-baseline gap-1">
                      <span
                        className="font-medium"
                        style={{ color: 'var(--theme-text-dimmed)', fontSize: '11px' }}
                      >
                        {category.category}:
                      </span>
                      <span style={{ color: 'var(--theme-text)', opacity: 0.75, fontSize: '11px' }}>
                        {category.skills.length > 4
                          ? `${category.skills.slice(0, 4).join(', ')} +${category.skills.length - 4}`
                          : category.skills.join(', ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'projects':
        // If a project is selected, show its details
        if (selectedProject) {
          const project = projects.find(p => p.id === selectedProject);
          if (!project) {
            setSelectedProject(null);
            return null;
          }

          return (
            <div className="space-y-4">
              {/* Back button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="flex items-center gap-2 text-sm transition-colors hover:brightness-110"
                style={{ color: 'var(--accent-color)' }}
              >
                ← Back to projects
              </button>

              {/* Project details */}
              <h2 className="text-3xl font-bold" style={{ color: 'var(--accent-color)' }}>
                {project.name}
              </h2>

              <p style={{ color: 'var(--theme-text)', opacity: 0.9 }}>
                {project.description}
              </p>

              <div className="space-y-2">
                <p>
                  <span style={{ color: 'var(--theme-info)' }}>Tech Stack:</span>{' '}
                  <span style={{ color: 'var(--theme-text)', opacity: 0.8 }}>
                    {project.techStackDisplay}
                  </span>
                </p>
                <p>
                  <span style={{ color: 'var(--theme-info)' }}>Status:</span>{' '}
                  <span
                    className="px-2 py-1 rounded text-xs uppercase"
                    style={{
                      backgroundColor: project.status === 'production'
                        ? 'rgba(var(--theme-success-rgb), 0.1)'
                        : 'rgba(var(--theme-warning-rgb), 0.1)',
                      color: project.status === 'production'
                        ? 'var(--theme-success)'
                        : 'var(--theme-warning)'
                    }}
                  >
                    {project.status}
                  </span>
                </p>
              </div>

              {/* Links */}
              <div className="flex gap-3 pt-2">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded transition-all hover:brightness-110"
                    style={{
                      backgroundColor: 'rgba(var(--accent-color-rgb), 0.1)',
                      color: 'var(--accent-color)',
                      border: '1px solid rgba(var(--accent-color-rgb), 0.3)'
                    }}
                  >
                    View on GitHub →
                  </a>
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded transition-all hover:brightness-110"
                    style={{
                      backgroundColor: 'rgba(var(--accent-color-rgb), 0.1)',
                      color: 'var(--accent-color)',
                      border: '1px solid rgba(var(--accent-color-rgb), 0.3)'
                    }}
                  >
                    Live Demo →
                  </a>
                )}
              </div>
            </div>
          );
        }

        // Otherwise show the project list
        return (
          <div className="space-y-4">
            <h2 className="text-3xl font-bold" style={{ color: 'var(--accent-color)' }}>
              Projects
            </h2>
            <div className="space-y-3">
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  className="group cursor-pointer"
                  onClick={() => setSelectedProject(project.id)}
                >
                  <h3
                    className="text-lg font-semibold mb-1 transition-colors group-hover:brightness-110"
                    style={{ color: 'var(--theme-primary)' }}
                  >
                    {project.name}
                  </h3>
                  <p
                    className="text-sm transition-opacity group-hover:opacity-100"
                    style={{ color: 'var(--theme-text)', opacity: 0.8 }}
                  >
                    {project.description}
                  </p>
                  {index < projects.length - 1 && (
                    <div
                      className="mt-3 h-px"
                      style={{
                        background: 'linear-gradient(90deg, rgba(var(--accent-color-rgb), 0.1) 0%, rgba(var(--accent-color-rgb), 0.05) 100%)'
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'blog':
        // If a blog post is selected, show its details
        if (selectedBlog) {
          const post = blogPosts.find(p => p.id === selectedBlog);
          if (!post) {
            setSelectedBlog(null);
            return null;
          }

          return (
            <div className="space-y-4">
              {/* Back button */}
              <button
                onClick={() => setSelectedBlog(null)}
                className="flex items-center gap-2 text-sm transition-colors hover:brightness-110"
                style={{ color: 'var(--accent-color)' }}
              >
                ← Back to blog
              </button>

              {/* Blog post details */}
              <h2 className="text-3xl font-bold" style={{ color: 'var(--accent-color)' }}>
                {post.title}
              </h2>

              <div className="flex items-center gap-3 text-sm">
                <span style={{ color: 'var(--theme-text-dimmed)' }}>
                  {post.date}
                </span>
                {post.category && (
                  <>
                    <span style={{ color: 'var(--theme-text-dimmed)' }}>•</span>
                    <span
                      className="px-2 py-1 rounded text-xs"
                      style={{
                        backgroundColor: 'rgba(var(--theme-info-rgb), 0.1)',
                        color: 'var(--theme-info)'
                      }}
                    >
                      {post.category}
                    </span>
                  </>
                )}
              </div>

              <div className="space-y-4" style={{ color: 'var(--theme-text)', opacity: 0.9 }}>
                <p>{post.excerpt}</p>

                {/* Placeholder for full content */}
                <div
                  className="p-4 rounded"
                  style={{
                    backgroundColor: 'rgba(var(--theme-surface-rgb), 0.3)',
                    border: '1px solid rgba(var(--accent-color-rgb), 0.1)'
                  }}
                >
                  <p className="text-sm italic" style={{ opacity: 0.7 }}>
                    [Full blog content would appear here. This could be markdown content
                    rendered with proper styling, code blocks, and other rich content.]
                  </p>
                </div>

              </div>
            </div>
          );
        }

        // Otherwise show the blog list
        return (
          <div className="space-y-4">
            <h2 className="text-3xl font-bold" style={{ color: 'var(--accent-color)' }}>
              Blog
            </h2>
            <div className="space-y-2">
              {blogPosts.map((post, index) => (
                <article
                  key={post.id}
                  className="group cursor-pointer py-2"
                  onClick={() => setSelectedBlog(post.id)}
                >
                  <h3
                    className="text-lg font-semibold mb-1 transition-colors group-hover:brightness-110"
                    style={{ color: 'var(--theme-primary)' }}
                  >
                    {post.title}
                  </h3>
                  <p
                    className="text-sm transition-opacity group-hover:opacity-100"
                    style={{ color: 'var(--theme-text)', opacity: 0.8 }}
                  >
                    {post.excerpt}
                  </p>
                  {index < blogPosts.length - 1 && (
                    <div
                      className="mt-2 h-px"
                      style={{
                        background: 'linear-gradient(90deg, rgba(var(--accent-color-rgb), 0.1) 0%, rgba(var(--accent-color-rgb), 0.05) 100%)'
                      }}
                    />
                  )}
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

      {/* Custom scrollbar positioned outside window frame */}
      <ScrollProgress
        scrollPercent={scrollPercent}
        sectionCount={5}  // Neofetch spacer + 4 content sections
        currentSection={activeSection === 'neofetch' ? 0 :
                       activeSection === 'about' ? 1 :
                       activeSection === 'projects' ? 2 :
                       activeSection === 'blog' ? 3 :
                       activeSection === 'contact' ? 4 : 0}
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
            className={`relative px-6 sm:px-8 md:px-12 ${
              section.id === 'about' ? 'min-h-screen' : 'min-h-[70vh]'
            }`}
            style={{
              paddingTop: index === 0 ? '48px' : '48px',
              paddingBottom: '48px',
              backgroundColor: 'var(--theme-bg)',
              zIndex: 10,
              scrollSnapAlign: 'start',
              scrollSnapStop: 'always',
              scrollMarginTop: index === 0 ? '-60vh' : '0px' // Compensate for spacer on first section
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