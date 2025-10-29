'use client';

import React from 'react';
import { useFocusState, ContentType } from '@/contexts/FocusContext';
import { AboutContent } from './content/AboutContent';
import { BlogDetailContent } from './content/BlogDetailContent';
import { ContactContent } from './content/ContactContent';
import { ProjectsOverviewContent } from './content/ProjectsOverviewContent';
import { BlogOverviewContent } from './content/BlogOverviewContent';

interface ContentViewerProps {
  onNavigate?: (content: ContentType) => void;
}

/**
 * Main content viewer component
 * Routes content types to appropriate specialized components
 * Note: Projects navigate to MDX pages (/projects/[slug]), not rendered here
 */
const ContentViewer: React.FC<ContentViewerProps> = ({ onNavigate }) => {
  const { activeContent } = useFocusState();
  const content = activeContent;

  const renderContent = () => {
    switch (content.type) {
      case 'about':
        return <AboutContent />;

      case 'project':
        // Projects route to MDX pages, should never reach here
        return null;

      case 'blog':
        const blog = content.data;
        return <BlogDetailContent blog={blog} onNavigate={onNavigate} />;

      case 'contact':
        return <ContactContent />;

      case 'projects-overview':
        return <ProjectsOverviewContent onNavigate={onNavigate} />;

      case 'blog-overview':
        return <BlogOverviewContent onNavigate={onNavigate} />;

      default:
        return null;
    }
  };

  return (
    <div className="font-mono">
      {renderContent()}
    </div>
  );
};

// Memoize to prevent unnecessary re-renders
export default React.memo(ContentViewer);