'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import NeofetchTile from './NeofetchTile';
import { useFocus } from '@/contexts/FocusContext';
import { useTheme } from '@/contexts/ThemeContext';
import { usePersonalInfo, useProjects, useBlogPosts, useSkills, useSocialLinks } from '@/lib/config';
import Background from './Background';
import Polybar from './PolybarWithFocus';
import ThemeTile from './ThemeTile';

const MobileParallaxLayout: React.FC = () => {
  const { theme, setThemePreset, setAccentColor } = useTheme();
  const { activeContent, setActiveContent } = useFocus();
  const personal = usePersonalInfo();
  const projects = useProjects();
  const blogPosts = useBlogPosts();
  const skills = useSkills();
  const socialLinks = useSocialLinks();

  const [activeSection, setActiveSection] = useState('home');
  const [showThemePanel, setShowThemePanel] = useState(false);
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

  // Sections for scrolling
  const sections = [
    { id: 'home', title: 'Welcome' },
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

  // Render content sections
  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'home':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold" style={{ color: 'var(--accent-color)' }}>
              {personal.title}
            </h2>
            <p className="text-lg" style={{ color: 'var(--theme-text)', opacity: 0.9 }}>
              {personal.bio.short}
            </p>
          </div>
        );

      case 'about':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold" style={{ color: 'var(--accent-color)' }}>
              About Me
            </h2>
            <p style={{ color: 'var(--theme-text)', opacity: 0.9 }}>
              {personal.bio.full}
            </p>
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
            <div className="space-y-4">
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
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Background />

      {/* Fixed Neofetch Background */}
      <motion.div
        className="fixed inset-x-0 top-0 z-0 pointer-events-none"
        style={{
          height: '40vh',
          opacity: backgroundOpacity,
          backgroundColor: 'rgba(var(--theme-bg-rgb), 0.8)',
          backdropFilter: 'blur(8px)'
        }}
      >
        <div className="h-full p-6 overflow-hidden">
          <NeofetchTile isBlurred={false} />
        </div>
        <div
          className="absolute inset-x-0 bottom-0 h-24"
          style={{
            background: 'linear-gradient(to bottom, transparent, var(--theme-bg))'
          }}
        />
      </motion.div>

      {/* Scrollable Content */}
      <div
        ref={scrollRef}
        className="fixed inset-0 overflow-y-auto"
        style={{ scrollBehavior: 'smooth' }}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 z-20" style={{ backgroundColor: 'var(--theme-bg)' }}>
          <Polybar onNavigate={(section) => {
            document.getElementById(`section-${section}`)?.scrollIntoView({ behavior: 'smooth' });
          }} />
        </div>

        {/* Spacer for fixed background */}
        <div style={{ height: '40vh' }} />

        {/* Content Sections */}
        {sections.map((section, index) => (
          <section
            key={section.id}
            id={`section-${section.id}`}
            className="relative min-h-screen px-6 py-12"
            style={{
              backgroundColor: index === 0
                ? 'transparent'
                : 'var(--theme-bg)',
              zIndex: 10
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              viewport={{ once: false, amount: 0.3 }}
            >
              {renderSection(section.id)}
            </motion.div>
          </section>
        ))}

        {/* Extra padding at bottom */}
        <div style={{ height: '10vh' }} />
      </div>

      {/* Scroll Progress Dots */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => {
              document.getElementById(`section-${section.id}`)?.scrollIntoView({
                behavior: 'smooth'
              });
            }}
            className="w-3 h-3 rounded-full transition-all"
            style={{
              backgroundColor: activeSection === section.id
                ? 'var(--accent-color)'
                : 'rgba(var(--accent-color-rgb), 0.3)',
              transform: activeSection === section.id ? 'scale(1.5)' : 'scale(1)'
            }}
            aria-label={`Go to ${section.title}`}
          />
        ))}
      </div>

      {/* Floating Theme Toggle */}
      <div className="fixed bottom-6 right-6 z-30">
        {showThemePanel && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-16 right-0 w-72 p-4 rounded-lg shadow-xl"
            style={{
              backgroundColor: 'rgba(var(--theme-surface-rgb), 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(var(--accent-color-rgb), 0.3)'
            }}
          >
            <ThemeTile isBlurred={false} />
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowThemePanel(!showThemePanel)}
          className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl"
          style={{
            backgroundColor: 'var(--accent-color)',
            color: 'var(--theme-bg)'
          }}
        >
          🎨
        </motion.button>
      </div>

      {/* Mode Toggle Button */}
      <motion.button
        className="fixed bottom-6 left-6 z-30 px-4 py-2 rounded-lg shadow-lg text-sm font-medium"
        style={{
          backgroundColor: 'rgba(var(--theme-surface-rgb), 0.95)',
          color: 'var(--theme-text)',
          border: '1px solid rgba(var(--accent-color-rgb), 0.3)'
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          localStorage.setItem('mobile-mode', 'stacked');
          window.location.reload();
        }}
      >
        Switch to Tiles
      </motion.button>
    </>
  );
};

export default MobileParallaxLayout;