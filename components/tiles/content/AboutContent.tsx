'use client';

import React from 'react';
import { usePersonalInfo } from '@/lib/config';
import { AboutTechGrid } from '../about/AboutTechGrid';
import { ProfilePhoto } from '@/components/ui/ProfilePhoto';

/**
 * About content component
 * Displays personal bio information, profile photo, and technology grid
 */
export const AboutContent: React.FC = () => {
  const personal = usePersonalInfo();

  return (
    <div>
      <div style={{
        color: 'var(--theme-text)',
        fontSize: 'clamp(1.125rem, 1.125rem + 2cqi, 1.25rem)',
        paddingLeft: '40px',
        paddingRight: '40px'
      }}>
        {/* Profile Photo - Float right on desktop, full-width on mobile - MUST come first for header to wrap */}
        {personal.profilePhoto && (
          <div
            className="mb-4"
            style={{
              width: 'clamp(280px, 35%, 400px)',
              float: 'right',
              marginLeft: '64px',
              marginBottom: '12px'
            }}
          >
            <ProfilePhoto
              src={personal.profilePhoto.src}
              alt={personal.profilePhoto.alt}
              width={personal.profilePhoto.width}
              height={personal.profilePhoto.height}
              exif={personal.profilePhoto.exif}
            />
          </div>
        )}


        {/* Header - now wraps around floated image */}
        <h1 className="font-bold mb-3" style={{ color: 'var(--accent-color)', fontSize: 'clamp(1.5rem, 1.5rem + 3cqi, 1.75rem)' }}>
          {personal.greeting || `Hi, I'm ${personal.name}`}
        </h1>

        {/* Introduction */}
        {personal.bio.intro && (
          <p className="leading-relaxed mb-3">
            {personal.bio.intro}
          </p>
        )}

        {/* Experience */}
        {personal.bio.experience && (
          <p className="leading-relaxed mb-3" style={{ opacity: 0.95 }}>
            {personal.bio.experience}
          </p>
        )}

        {/* Leadership */}
        {personal.bio.leadership && (
          <p className="leading-relaxed mb-3" style={{ opacity: 0.9 }}>
            {personal.bio.leadership}
          </p>
        )}

        {/* Tagline - last element adjacent to image */}
        {personal.bio.tagline && (
          <p
            className="italic pt-1 mb-3"
            style={{
              color: 'var(--theme-text-dimmed)',
              opacity: 0.8,
              fontSize: 'clamp(1rem, 1rem + 1.5cqi, 1.125rem)'
            }}
          >
            {personal.bio.tagline}
          </p>
        )}

        {/* Clear float - forces tech grid below image */}
        <div style={{ clear: 'both' }} />

        {/* Technology Icons Grid - below image, full width */}
        <div style={{ marginTop: '4px' }}>
          <AboutTechGrid />
        </div>
      </div>
    </div>
  );
};