'use client';

import React from 'react';
import { FONT_SIZES } from '@/lib/constants/typography';
import { LabHeader, LabStateLine } from '@/components/lab/shared/LabHeader';
import type { ContentType } from '@/contexts/FocusContext';

/** Placeholder until the threats view lands (docs/lab/LAB_UI_SPEC.md §13 phase 3). */
export default function ThreatsTile(_props: { onNavigate?: (content: ContentType) => void }) {
  return (
    <section className="lab-root" aria-label="Lab threat map" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <LabHeader title="~/lab/threats" state={null} titleSize={FONT_SIZES.xl} badgeSize={FONT_SIZES.xs} />
      <LabStateLine>the threat map is not built yet</LabStateLine>
    </section>
  );
}
