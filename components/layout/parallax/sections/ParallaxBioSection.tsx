import React from 'react';

interface PersonalInfo {
  name: string;
  greeting?: string;
  title: string;
  bio: {
    intro?: string;
    experience?: string;
    leadership?: string;
    tagline?: string;
    // Fallback fields
    short?: string;
    long?: string;
  };
}

interface ParallaxBioSectionProps {
  personal: PersonalInfo;
}

/**
 * Bio section component for parallax layout
 * Displays extended professional narrative with proper viewport fitting
 */
export const ParallaxBioSection: React.FC<ParallaxBioSectionProps> = ({
  personal
}) => {
  // Use structured bio fields with fallbacks to legacy fields
  const intro = personal.bio.intro || personal.bio.short || '';
  const experience = personal.bio.experience || '';
  const leadership = personal.bio.leadership || personal.bio.long || '';
  const tagline = personal.bio.tagline || '';

  return (
    <div className="flex flex-col justify-start">
      {/* Plain content wrapper - no glass morphism */}
      <div className="max-w-3xl mx-auto w-full p-6 sm:p-8">
        {/* Greeting Header */}
        <h2
          className="text-3xl sm:text-4xl font-bold mb-10"
          style={{ color: 'var(--accent-color)' }}
        >
          {personal.greeting || `Hi, I'm ${personal.name}`}
        </h2>

        {/* Bio Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Introduction */}
          {intro && (
            <p
              className="text-base sm:text-lg leading-relaxed"
              style={{
                color: 'var(--theme-text)',
                lineHeight: '1.7'
              }}
            >
              {intro}
            </p>
          )}

          {/* Experience */}
          {experience && (
            <p
              className="text-sm sm:text-base leading-relaxed"
              style={{
                color: 'var(--theme-text)',
                opacity: 0.95,
                lineHeight: '1.7'
              }}
            >
              {experience}
            </p>
          )}

          {/* Leadership */}
          {leadership && experience && ( // Only show if we have experience (to avoid duplication with fallback)
            <p
              className="text-sm sm:text-base leading-relaxed"
              style={{
                color: 'var(--theme-text)',
                opacity: 0.9,
                lineHeight: '1.7'
              }}
            >
              {leadership}
            </p>
          )}

          {/* Tagline */}
          {tagline && (
            <p
              className="text-sm italic pt-4"
              style={{
                color: 'var(--theme-text-dimmed)',
                opacity: 0.8
              }}
            >
              {tagline}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};