'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useFocus } from '@/contexts/FocusContext';
import { useIsDesktop } from '@/hooks/useMediaQuery';

// Views other than home load on first use; the lab's stay out of the bundle (LAB_UI_SPEC.md §3)
const ContactContent = dynamic(() => import('@/components/tiles/content/ContactContent').then((m) => m.ContactContent));
const LabTelemetryTile = dynamic(() => import('@/components/lab/telemetry/TelemetryTile'), { ssr: false });
const LabThreatsTile = dynamic(() => import('@/components/lab/threats/ThreatsTile'), { ssr: false });

/**
 * The content tile's body. `home` is the server-rendered home view; the other views replace it
 * on desktop. Phones always show home: there the stage is the section after the hero, and the
 * nav and polybar that switch views are hidden.
 */
export function Stage({ home }: { home: React.ReactNode }) {
  const { activeContent, handleContentNavigation } = useFocus();
  const isDesktop = useIsDesktop();

  switch (isDesktop ? activeContent.type : 'home') {
    case 'contact':
      return <ContactContent />;
    case 'lab-telemetry':
      return <LabTelemetryTile onNavigate={handleContentNavigation} />;
    case 'lab-threats':
      // read directly so the build folds it (see LabDirectory)
      return process.env.NEXT_PUBLIC_FEATURE_LAB_THREATS === 'true' ? <LabThreatsTile onNavigate={handleContentNavigation} /> : null;
    default:
      return <>{home}</>;
  }
}
