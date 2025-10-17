'use client';

import React, { useRef, useState, useCallback } from 'react';
import { usePersonalInfo, useSocialLinks } from '@/lib/config';
import { allProjects, allBlogs } from 'content-collections';
import Background from '@/components/layout/Background';
import ScrollProgress from '@/components/ui/ScrollProgress';

// Import custom hooks
import { useParallaxScroll } from './parallax/hooks/useParallaxScroll';
import { useSectionNavigation } from './parallax/hooks/useSectionNavigation';
import { useParallaxKeyboard } from './parallax/hooks/useParallaxKeyboard';
import { useParallaxTheme } from './parallax/hooks/useParallaxTheme';

// Import components
import { ParallaxBorderFrame } from './parallax/components/ParallaxBorderFrame';
import { ParallaxScrollContainer } from './parallax/components/ParallaxScrollContainer';

// Import section components
import { ParallaxBioSection } from './parallax/sections/ParallaxBioSection';
import { ParallaxTechSection } from './parallax/sections/ParallaxTechSection';
import { ParallaxProjectsSection } from './parallax/sections/ParallaxProjectsSection';
import { ParallaxBlogSection } from './parallax/sections/ParallaxBlogSection';
import { ParallaxContactSection } from './parallax/sections/ParallaxContactSection';

/**
 * MobileParallaxLayout Component
 * Main orchestrator for the mobile parallax scrolling experience
 * Coordinates theme, scrolling, navigation and content sections
 *
 * Design inspired by Kyrre Gjerstad's portfolio (https://www.kyrre.dev/)
 */
const MobileParallaxLayout: React.FC = () => {
  const personal = usePersonalInfo();
  const projects = allProjects;
  const blogPosts = allBlogs.filter(blog => blog.status === 'published');
  const socialLinks = useSocialLinks();

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const scrollRef = useRef<HTMLDivElement>(null!);

  // Border padding for glass elevator effect (constant 16px for mobile-only parallax)
  // Future: When desktop parallax is added, use responsive logic (32px for ≥1024px)
  const borderPadding = 16;

  // Sections for scrolling - split About into Bio and Technologies
  const sections = [
    { id: 'bio', title: 'Bio' },
    { id: 'technologies', title: 'Technologies' },
    { id: 'projects', title: 'Projects' },
    { id: 'blog', title: 'Blog' },
    { id: 'contact', title: 'Contact' }
  ];

  // Use custom hooks for theme enforcement
  useParallaxTheme();

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

  // Wrap navigation functions
  const navigateToSection = useCallback((sectionId: string) => {
    baseNavigateToSection(sectionId);
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
      onEscape: () => {},
      onPanelToggle: () => {}
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
            projects={projects.map(p => ({
              id: p.slug,
              slug: p.slug,
              name: p.title,
              description: p.summary
            }))}
          />
        );

      case 'blog':
        return (
          <ParallaxBlogSection
            blogPosts={blogPosts.map(b => ({
              id: b.slug,
              slug: b.slug,
              title: b.title,
              date: b.date,
              excerpt: b.summary,
              category: b.tags[0]
            }))}
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
      <ScrollProgress scrollPercent={scrollPercent} />

      {/* Border frame with glass effects */}
      <ParallaxBorderFrame borderPadding={borderPadding} />

      {/* Scrollable content container */}
      <ParallaxScrollContainer
        scrollRef={scrollRef}
        borderPadding={borderPadding}
        backgroundOpacity={backgroundOpacity}
        sections={sections}
        renderSection={renderSection}
      />
    </>
  );
};

export default MobileParallaxLayout;