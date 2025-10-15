'use client';

import React, { useState } from 'react';
import Image from 'next/image';

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
  };
  className?: string;
}

/**
 * ProfilePhoto Component
 * Displays a profile photo styled as a tiling window manager window
 * Features: macOS-style traffic lights, EXIF metadata status bar on hover
 * Adapts to active theme colors
 */
export const ProfilePhoto: React.FC<ProfilePhotoProps> = ({
  src,
  alt,
  width = 400,
  height = 600,
  exif,
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Build EXIF string from metadata
  const exifString = exif
    ? [exif.location, exif.aperture, exif.shutter, exif.iso]
        .filter(Boolean)
        .join(' | ')
    : null;

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: '100%',
        maxWidth: `${width}px`
      }}
    >
      {/* Window Frame */}
      <div
        className="rounded-none border-2 transition-all duration-300"
        style={{
          borderColor: isHovered
            ? 'rgba(var(--accent-color-rgb), 0.5)'
            : 'rgba(var(--accent-color-rgb), 0.3)',
          boxShadow: isHovered
            ? '0 8px 24px rgba(0, 0, 0, 0.2)'
            : '0 4px 12px rgba(0, 0, 0, 0.15)'
        }}
      >
        {/* Title Bar */}
        <div
          className="flex items-center px-3 font-mono text-xs transition-colors duration-300"
          style={{
            height: '28px',
            backgroundColor: 'rgba(var(--theme-surface-rgb), 0.9)',
            color: 'var(--theme-text)',
            borderBottom: '1px solid rgba(var(--accent-color-rgb), 0.2)'
          }}
        >
          {/* macOS Traffic Lights */}
          <div className="flex items-center gap-2 mr-3">
            <div
              className="rounded-full"
              style={{
                width: '12px',
                height: '12px',
                background: isHovered
                  ? 'linear-gradient(135deg, #ff5f56 0%, #e0443e 100%)'
                  : 'rgba(var(--theme-text-rgb), 0.3)'
              }}
            />
            <div
              className="rounded-full"
              style={{
                width: '12px',
                height: '12px',
                background: isHovered
                  ? 'linear-gradient(135deg, #ffbd2e 0%, #e2a512 100%)'
                  : 'rgba(var(--theme-text-rgb), 0.3)'
              }}
            />
            <div
              className="rounded-full"
              style={{
                width: '12px',
                height: '12px',
                background: isHovered
                  ? 'linear-gradient(135deg, #27c93f 0%, #1fa831 100%)'
                  : 'rgba(var(--theme-text-rgb), 0.3)'
              }}
            />
          </div>

          {/* Filename */}
          <span style={{ fontSize: 'clamp(11px, 0.75rem, 14px)' }}>
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
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            sizes={`(max-width: 768px) 100vw, (max-width: 1024px) 350px, ${width}px`}
            priority={false}
            quality={85}
          />
        </div>

        {/* EXIF Status Bar (always visible) */}
        {exifString && (
          <div
            style={{
              height: '24px',
              backgroundColor: 'rgba(var(--theme-bg-rgb), 0.95)',
              borderTop: '1px solid rgba(var(--accent-color-rgb), 0.2)'
            }}
          >
            <div
              className="flex items-center justify-center h-full px-3 font-mono text-xs"
              style={{
                color: 'var(--theme-text-dimmed)',
                fontSize: 'clamp(10px, 0.65rem, 12px)'
              }}
            >
              {exifString}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
