import React from 'react';
import { motion } from 'framer-motion';

interface PersonalInfo {
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
    <div className="h-full flex flex-col justify-center py-12">
      <div className="max-w-3xl mx-auto w-full">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-bold mb-8"
          style={{ color: 'var(--accent-color)' }}
        >
          {personal.title}
        </motion.h2>

        {/* Bio Content */}
        <div className="space-y-6">
          {/* Introduction */}
          {intro && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-base sm:text-lg leading-relaxed"
              style={{
                color: 'var(--theme-text)',
                lineHeight: '1.7'
              }}
            >
              {intro}
            </motion.p>
          )}

          {/* Experience */}
          {experience && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm sm:text-base leading-relaxed"
              style={{
                color: 'var(--theme-text)',
                opacity: 0.95,
                lineHeight: '1.7'
              }}
            >
              {experience}
            </motion.p>
          )}

          {/* Leadership */}
          {leadership && experience && ( // Only show if we have experience (to avoid duplication with fallback)
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-sm sm:text-base leading-relaxed"
              style={{
                color: 'var(--theme-text)',
                opacity: 0.9,
                lineHeight: '1.7'
              }}
            >
              {leadership}
            </motion.p>
          )}

          {/* Tagline */}
          {tagline && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-sm italic pt-4 border-t"
              style={{
                color: 'var(--theme-text-dimmed)',
                borderColor: 'rgba(var(--accent-color-rgb), 0.2)',
                opacity: 0.8
              }}
            >
              {tagline}
            </motion.p>
          )}
        </div>

        {/* Visual accent element */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-8 h-1 origin-left"
          style={{
            background: 'linear-gradient(90deg, var(--accent-color), transparent)',
            opacity: 0.4
          }}
        />
      </div>
    </div>
  );
};