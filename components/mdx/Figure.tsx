import React from 'react';
import Image from 'next/image';

interface FigureProps {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  size?: 'small' | 'medium' | 'large' | 'full';
}

const sizeStyles = {
  small: 'max-w-[60%]',
  medium: 'max-w-[75%]',
  large: 'max-w-[90%]',
  full: 'max-w-full',
};

export function Figure({ src, alt, caption, width = 1200, height = 630, size = 'full' }: FigureProps) {
  return (
    <figure className={`mt-8 mb-12 mx-auto ${sizeStyles[size]}`}>
      <div className="rounded-lg overflow-hidden">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-auto"
          style={{ display: 'block' }}
        />
      </div>
      {caption && (
        <figcaption
          className="mt-1 text-sm text-center italic"
          style={{ color: 'var(--theme-text-dimmed)' }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
