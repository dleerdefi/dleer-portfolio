'use client';

import React, { useState } from 'react';
import type { StaticImageData } from 'next/image';
import { HERO_PHOTO } from '@/lib/hero-photo.generated';

const srcSet = (list: StaticImageData[]) => list.map((img) => `${img.src} ${img.width}w`).join(', ');
// The photo's largest CSS width (.hero-photo in app/styles/15-home-layout.css)
const SIZES = '260px';
// Phones never show the photo: the <img> falls back to this 1 px GIF, so they download nothing
const BLANK = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

/**
 * The profile photo in the desktop neofetch tile, where real neofetch draws an image in place of
 * the ASCII logo. A button: pressing it switches to the same photo with RF-DETR's object
 * detections. The detection version loads on the first hover or focus, so the first load pays only
 * for the plain one, and shows once it has loaded. Desktop only (the <source> media query and CSS);
 * phones keep the logo. Crops and sizes come from scripts/build-hero-photo.mjs.
 */
export function HeroPhoto({ alt }: { alt: string }) {
  const [detect, setDetect] = useState(false);
  const [warm, setWarm] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <button
      type="button"
      className="hero-photo"
      aria-pressed={detect}
      title="Toggle RF-DETR object detection"
      onPointerEnter={() => setWarm(true)}
      onFocus={() => setWarm(true)}
      onClick={() => {
        setWarm(true);
        setDetect((d) => !d);
      }}
    >
      {/* Plain <img>s in a <picture>: next/image cannot give phones nothing at all */}
      <picture>
        <source media="(min-width: 1024px)" srcSet={srcSet(HERO_PHOTO.plain)} sizes={SIZES} />
        <img src={BLANK} alt={alt} width={3} height={4} fetchPriority="high" decoding="async" />
      </picture>
      {warm && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="hero-photo-detection"
          src={HERO_PHOTO.detection[0].src}
          srcSet={srcSet(HERO_PHOTO.detection)}
          sizes={SIZES}
          alt=""
          decoding="async"
          onLoad={() => setLoaded(true)}
          data-shown={(detect && loaded) || undefined}
        />
      )}
      <span className="hero-photo-tag">RF-DETR</span>
    </button>
  );
}
