'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useFocusState, ContentType } from '@/contexts/FocusContext';
import { AboutContent } from './content/AboutContent';
import { BlogDetailContent } from './content/BlogDetailContent';
import { ContactContent } from './content/ContactContent';
import { ProjectsOverviewContent } from './content/ProjectsOverviewContent';
import { BlogOverviewContent } from './content/BlogOverviewContent';

// Lab views load on demand, so no lab code is in the home bundle (docs/lab/LAB_UI_SPEC.md §3)
const LabTelemetryTile = dynamic(() => import('@/components/lab/telemetry/TelemetryTile'), { ssr: false });
const LabThreatsTile = dynamic(() => import('@/components/lab/threats/ThreatsTile'), { ssr: false });

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

      case 'lab-telemetry':
        return <LabTelemetryTile onNavigate={onNavigate} />;

      case 'lab-threats':
        return <LabThreatsTile onNavigate={onNavigate} />;

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