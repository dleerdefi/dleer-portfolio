import React from 'react';
import { SkillGrid } from '../components/SkillGrid';

interface PersonalInfo {
  title: string;
  bio: {
    short: string;
    long: string;
  };
}

interface Skill {
  category: string;
  skills: string[];
}

interface ParallaxAboutSectionProps {
  personal: PersonalInfo;
  skills: Skill[];
}

/**
 * About section component for parallax layout
 * Displays personal information and technical skills
 */
export const ParallaxAboutSection: React.FC<ParallaxAboutSectionProps> = ({
  personal,
  skills
}) => {
  return (
    <div>
      {/* Combined intro and about - Most Important Content First */}
      <div className="mb-4">
        <h2 className="text-3xl font-bold mb-3" style={{ color: 'var(--accent-color)' }}>
          {personal.title}
        </h2>
        <p className="text-lg mb-4" style={{ color: 'var(--theme-text)', opacity: 0.95 }}>
          {personal.bio.short}
        </p>
        <p style={{ color: 'var(--theme-text)', opacity: 0.9, lineHeight: '1.6' }}>
          {personal.bio.long}
        </p>
      </div>

      {/* Compact Skills Display - Secondary Content */}
      <SkillGrid skills={skills} />
    </div>
  );
};