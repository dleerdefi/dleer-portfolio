'use client';

import React from 'react';
import { usePersonalInfo } from '@/lib/config';
import { AboutTechGrid } from '../about/AboutTechGrid';

/**
 * About content component
 * Displays personal bio information and technology grid
 */
export const AboutContent: React.FC = () => {
  const personal = usePersonalInfo();

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold" style={{ color: 'var(--accent-color)' }}>
        {personal.greeting || `Hi, I'm ${personal.name}`}
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--theme-text)' }}>
        {/* Introduction */}
        {personal.bio.intro && (
          <p className="leading-relaxed">
            {personal.bio.intro}
          </p>
        )}

        {/* Experience */}
        {personal.bio.experience && (
          <p className="leading-relaxed" style={{ opacity: 0.95 }}>
            {personal.bio.experience}
          </p>
        )}

        {/* Leadership */}
        {personal.bio.leadership && (
          <p className="leading-relaxed" style={{ opacity: 0.9 }}>
            {personal.bio.leadership}
          </p>
        )}

        {/* Tagline */}
        {personal.bio.tagline && (
          <p
            className="text-sm italic pt-1 border-t"
            style={{
              color: 'var(--theme-text-dimmed)',
              borderColor: 'rgba(var(--accent-color-rgb), 0.2)',
              opacity: 0.8
            }}
          >
            {personal.bio.tagline}
          </p>
        )}

        {/* Technology Icons Grid */}
        <AboutTechGrid />
      </div>
    </div>
  );
};