'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useFocusState, ContentType } from '@/contexts/FocusContext';
import { AboutContent } from './content/AboutContent';
import { ContactContent } from './content/ContactContent';

// Lab views load on demand, so no lab code is in the home bundle (docs/lab/LAB_UI_SPEC.md §3)
const LabTelemetryTile = dynamic(() => import('@/components/lab/telemetry/TelemetryTile'), { ssr: false });
const LabThreatsTile = dynamic(() => import('@/components/lab/threats/ThreatsTile'), { ssr: false });

interface ContentViewerProps {
  onNavigate?: (content: ContentType) => void;
}

/**
 * Main content viewer component
 * Routes content types to appropriate specialized components
 * Projects and posts are routes (/projects, /blog and their slugs), never rendered here
 */
const ContentViewer: React.FC<ContentViewerProps> = ({ onNavigate }) => {
  const { activeContent } = useFocusState();
  const content = activeContent;

  const renderContent = () => {
    switch (content.type) {
      case 'about':
        return <AboutContent />;

      case 'contact':
        return <ContactContent />;

      case 'lab-telemetry':
        return <LabTelemetryTile onNavigate={onNavigate} />;

      case 'lab-threats':
        // read directly so the build folds it (see LabDirectory); lab views render only with the lab on
        return process.env.NEXT_PUBLIC_FEATURE_LAB_THREATS === 'true' ? <LabThreatsTile onNavigate={onNavigate} /> : null;

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