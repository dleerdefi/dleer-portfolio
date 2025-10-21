import React from 'react';
import Image from 'next/image';

interface FigureProps {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

export function Figure({ src, alt, caption, width = 1200, height = 630 }: FigureProps) {
  return (
    <figure className="my-8">
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
          className="mt-3 text-sm text-center italic"
          style={{ color: 'var(--theme-text-dimmed)' }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
