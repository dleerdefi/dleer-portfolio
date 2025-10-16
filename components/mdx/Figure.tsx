import React from 'react';
import Image from 'next/image';

interface FigureProps {
  src: string;
  alt: string; // Required for accessibility
  caption?: string;
  width?: number;
  height?: number;
  className?: string;
}

/**
 * Figure component - wraps next/image with caption support
 * Enforces alt text requirement for accessibility (TypeScript will error if missing)
 * Supports both local and remote images (CDN URLs)
 *
 * Usage:
 * <Figure
 *   src="https://cdn.example.com/image.jpg"
 *   alt="Description of image"
 *   caption="Optional caption text"
 *   width={1200}
 *   height={800}
 * />
 *
 * LOC: ~60
 */
export function Figure({
  src,
  alt,
  caption,
  width = 1200,
  height = 800,
  className = '',
}: FigureProps) {
  return (
    <figure className={`my-6 ${className}`}>
      <div
        className="rounded-lg overflow-hidden"
        style={{
          border: '1px solid rgba(var(--accent-color-rgb), 0.2)',
        }}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-auto"
          style={{
            objectFit: 'cover',
            maxWidth: '100%',
            height: 'auto',
          }}
        />
      </div>

      {caption && (
        <figcaption
          className="mt-2 text-xs text-center font-mono"
          style={{
            color: 'var(--theme-text-dimmed)',
          }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export default Figure;
