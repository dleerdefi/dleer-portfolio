import React from 'react';
import Image from 'next/image';

interface FigureProps {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  size?: 'small' | 'medium' | 'large' | 'full';
  href?: string;
}

const sizeStyles = {
  small: 'max-w-[60%]',
  medium: 'max-w-[75%]',
  large: 'max-w-[90%]',
  full: 'max-w-full',
};

export function Figure({ src, alt, caption, width = 1200, height = 630, size = 'full', href }: FigureProps) {
  const imageElement = (
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
  );

  return (
    <figure className={`mx-auto ${sizeStyles[size]}`}>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="block hover:opacity-90 transition-opacity"
        >
          {imageElement}
        </a>
      ) : (
        imageElement
      )}
      {caption && (
        <figcaption
          className="mt-0.5 text-sm text-center italic"
          style={{ color: 'var(--theme-text-dimmed)' }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
