'use client';

import React from 'react';
import { LabHeader, LabStateLine } from '@/components/lab/shared/LabHeader';

/** Placeholder until the threats view lands (docs/lab/LAB_UI_SPEC.md §13 phase 3). */
export default function ThreatsPage() {
  return (
    <section className="lab-root lab-page-width lab-page" aria-label="Lab threat map">
      <LabHeader title="~/lab/threats" state={null} titleSize="1.75rem" badgeSize="0.875rem" />
      <LabStateLine>the threat map is not built yet</LabStateLine>
    </section>
  );
}
