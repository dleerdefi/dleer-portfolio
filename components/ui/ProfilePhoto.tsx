'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface ProfilePhotoProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  exif?: {
    location?: string;
    aperture?: string;
    shutter?: string;
    iso?: string;
    model?: string;
    task?: string;
  };
  detectionVariant?: {
    src: string;
    exif?: {
      location?: string;
      model?: string;
      task?: string;
    };
  };
  className?: string;
}

/**
 * ProfilePhoto Component
 * Displays a profile photo styled as a tiling window manager window
 * Features: Clean title bar with centered filename, EXIF metadata status bar
 * Easter egg: Click to toggle between standard and RF-DETR detection view
 * Adapts to active theme colors
 */
const ProfilePhotoComponent: React.FC<ProfilePhotoProps> = ({
  src,
  alt,
  width = 400,
  height = 600,
  exif,
  detectionVariant,
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetection, setShowDetection] = useState(false);

  // Determine current image and EXIF data
  const currentSrc = showDetection && detectionVariant ? detectionVariant.src : src;
  const currentExif = showDetection && detectionVariant?.exif ? detectionVariant.exif : exif;

  // Build EXIF string from metadata
  const exifString = currentExif
    ? [
        currentExif.location,
        currentExif.aperture,
        currentExif.shutter,
        currentExif.iso,
        currentExif.model,
        currentExif.task
      ]
        .filter(Boolean)
        .join(' | ')
    : null;

  // Toggle handler
  const handleClick = () => {
    if (detectionVariant) {
      setShowDetection(!showDetection);
    }
  };

  // Keyboard support for accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (detectionVariant && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      setShowDetection(!showDetection);
    }
  };

  return (
    <div
      className={`relative ${className}`}
      style={{
        width: '100%',
        maxWidth: `${width}px`
      }}
    >
      {/* Window Frame */}
      <motion.div
        className="rounded-none border-2 transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role={detectionVariant ? "button" : undefined}
        tabIndex={detectionVariant ? 0 : undefined}
        aria-label={detectionVariant ? "Toggle AI detection view" : undefined}
        whileTap={detectionVariant ? { scale: 0.98 } : undefined}
        style={{
          borderColor: isHovered
            ? 'rgba(var(--accent-color-rgb), 0.5)'
            : 'rgba(var(--accent-color-rgb), 0.3)',
          boxShadow: isHovered
            ? '0 8px 24px rgba(0, 0, 0, 0.2)'
            : '0 4px 12px rgba(0, 0, 0, 0.15)',
          cursor: detectionVariant ? 'pointer' : 'default',
          userSelect: 'none'
        }}
      >
        {/* Title Bar */}
        <div
          className="flex items-center justify-center px-3 font-mono text-xs transition-colors duration-300"
          style={{
            height: '28px',
            backgroundColor: 'rgba(var(--theme-surface-rgb), 0.9)',
            color: 'var(--theme-text)',
            borderBottom: '1px solid rgba(var(--accent-color-rgb), 0.2)',
            overflow: 'hidden'
          }}
        >
          {/* Filename - Centered, fixed size for single-line guarantee */}
          <span
            style={{
              fontSize: '11px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '100%'
            }}
          >
            {alt.toLowerCase().replace(/\s+/g, '_')}.jpg
          </span>
        </div>

        {/* Photo Container */}
        <div
          className="relative overflow-hidden"
          style={{
            width: '100%',
            paddingBottom: `${(height / width) * 100}%`
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSrc}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.2,
                ease: [0.4, 0, 0.2, 1]
              }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%'
              }}
            >
              <Image
                src={currentSrc}
                alt={alt}
                fill
                className="object-cover"
                sizes={`(max-width: 768px) 100vw, (max-width: 1024px) 350px, ${width}px`}
                priority={false}
                quality={85}
                style={{ pointerEvents: 'none' }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* EXIF Status Bar (always visible) */}
        {exifString && (
          <div
            style={{
              height: '24px',
              backgroundColor: 'rgba(var(--theme-bg-rgb), 0.95)',
              borderTop: '1px solid rgba(var(--accent-color-rgb), 0.2)',
              overflow: 'hidden'
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={exifString}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{
                  duration: 0.15,
                  ease: [0.4, 0, 0.2, 1]
                }}
                className="flex items-center justify-center h-full px-3 font-mono text-xs"
                style={{
                  color: 'var(--theme-text-dimmed)',
                  fontSize: '10px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {exifString}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
};

// Memoize to prevent unnecessary re-renders when props haven't changed
export const ProfilePhoto = React.memo(ProfilePhotoComponent);
