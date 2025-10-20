'use client';

import React, { useState, useEffect } from 'react';
import { archLogoASCII, archLogoCompact, minimalLogo, dleerBlockLetters, dlBlockLetters } from '@/components/assets/archAscii';
import { usePersonalInfo, useSystemInfo } from '@/lib/config';
import { FONT_SIZES } from '@/lib/constants/typography';

interface NeofetchTileProps {
  isBlurred?: boolean;
  layout?: 'tile' | 'parallax';
}

const NeofetchTile: React.FC<NeofetchTileProps> = ({ isBlurred = false, layout = 'tile' }) => {
  const [windowWidth, setWindowWidth] = useState(1024);
  const personal = usePersonalInfo();
  const system = useSystemInfo();

  useEffect(() => {
    // Set initial width
    setWindowWidth(window.innerWidth);

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get ASCII logo preference from environment or default to dleer
  const logoType = process.env.NEXT_PUBLIC_ASCII_LOGO || 'dleer';

  // Switch ASCII art based on screen size and preference
  let asciiArt;
  if (logoType === 'dleer') {
    asciiArt = windowWidth < 400 ? dlBlockLetters : dleerBlockLetters;
  } else if (logoType === 'arch') {
    asciiArt = windowWidth < 400 ? archLogoCompact : archLogoASCII;
  } else {
    asciiArt = minimalLogo;
  }

  // Determine gap and font sizes based on layout
  // Tile layout uses container queries (cqw) for responsive sizing relative to tile size
  // Parallax layout uses viewport queries (vw) for responsive sizing relative to viewport
  // ASCII art max capped lower to prevent overflow in fixed-height tile
  const gapClass = layout === 'parallax' ? 'gap-6 sm:gap-8 md:gap-10' : 'gap-4 sm:gap-6 md:gap-8';
  const asciiFontSize = layout === 'parallax' ?
    (logoType === 'dleer' ? 'clamp(0.55rem, 1vw, 0.75rem)' : 'clamp(0.5rem, 1.4vw, 0.7rem)') :
    (logoType === 'dleer' ? 'clamp(0.3rem, 1.5cqw, 0.75rem)' : 'clamp(0.28rem, 1.8cqw, 0.8rem)');
  const infoFontSize = layout === 'parallax' ? 'clamp(0.75rem, 1.2vw, 0.875rem)' : 'clamp(0.6rem, 2cqw, 1.1rem)';

  return (
    <div
      className={`flex ${gapClass} font-mono transition-all duration-300 w-full`}
      style={{
        color: isBlurred ? 'rgba(var(--theme-text-rgb), 0.7)' : 'var(--theme-text)',
        fontSize: layout === 'tile' ? FONT_SIZES.sm : undefined
      }}>
      {/* ASCII Art Column */}
      <div className="flex-shrink-0"
        style={{
          width: logoType === 'dleer' ? 'auto' : (layout === 'parallax' ? '40%' : '35%'),
          minWidth: logoType === 'dleer' ? 'auto' : '120px',
          maxWidth: logoType === 'dleer' ? 'auto' : '200px'
        }}>
        <pre
          className={`leading-tight transition-all duration-300`}
          style={{
            color: isBlurred ? 'rgba(var(--accent-color-rgb), 0.6)' : 'var(--accent-color)',
            background: 'transparent',
            padding: 0,
            border: 'none',
            margin: 0,
            fontSize: asciiFontSize,
            whiteSpace: 'pre',
            overflow: 'hidden'
          }}
        >
{asciiArt}
        </pre>
      </div>

      {/* Info Column */}
      <div className="flex-1 flex flex-col justify-center">
        <div
          className={`font-bold mb-1 transition-all duration-300`}
          style={{
            color: isBlurred ? 'rgba(var(--accent-color-rgb), 0.6)' : 'var(--accent-color)'
          }}
        >
          <span style={{ color: 'var(--theme-success)' }}>{personal.username}</span>@<span style={{ color: 'var(--theme-info)' }}>portfolio</span>
          <div style={{
            color: isBlurred ? 'rgba(var(--theme-text-dimmed), 0.4)' : 'rgba(var(--theme-text-dimmed), 0.6)'
          }}>---------------</div>
        </div>

        <div className="space-y-1" style={{ fontSize: infoFontSize }}>
          {/* GitHub */}
          {system.github && (
            <div>
              <span className={`font-bold transition-all duration-300`} style={{ color: isBlurred ? 'rgba(var(--theme-primary-rgb), 0.6)' : 'var(--theme-primary)' }}>{system.github.platform}</span>:{' '}
              <a
                href={system.github.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline transition-colors duration-200 cursor-pointer"
                style={{ color: 'var(--accent-color)', pointerEvents: 'auto' }}
              >
                {system.github.username}
              </a>
            </div>
          )}

          {/* Twitter/X */}
          {system.twitter && (
            <div>
              <span className={`font-bold transition-all duration-300`} style={{ color: isBlurred ? 'rgba(var(--theme-primary-rgb), 0.6)' : 'var(--theme-primary)' }}>{system.twitter.platform}</span>:{' '}
              <a
                href={system.twitter.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline transition-colors duration-200 cursor-pointer"
                style={{ color: 'var(--accent-color)', pointerEvents: 'auto' }}
              >
                {system.twitter.username}
              </a>
              {system.twitter.followers && <span style={{ color: 'rgba(var(--theme-text-dimmed), 0.8)' }}> ({system.twitter.followers})</span>}
            </div>
          )}

          {/* LinkedIn */}
          {system.linkedin && (
            <div>
              <span className={`font-bold transition-all duration-300`} style={{ color: isBlurred ? 'rgba(var(--theme-primary-rgb), 0.6)' : 'var(--theme-primary)' }}>{system.linkedin.platform}</span>:{' '}
              <a
                href={system.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline transition-colors duration-200 cursor-pointer"
                style={{ color: 'var(--accent-color)', pointerEvents: 'auto' }}
              >
                {system.linkedin.username}
              </a>
            </div>
          )}

          {/* YouTube */}
          {system.youtube && (
            <div>
              <span className={`font-bold transition-all duration-300`} style={{ color: 'var(--accent-color)' }}>{system.youtube.platform}</span>:{' '}
              <a
                href={system.youtube.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline transition-colors duration-200 cursor-pointer"
                style={{ color: 'var(--accent-color)', pointerEvents: 'auto' }}
              >
                {system.youtube.username}
              </a>
            </div>
          )}

          {/* Instagram */}
          {system.instagram && (
            <div>
              <span className={`font-bold transition-all duration-300`} style={{ color: isBlurred ? 'rgba(var(--theme-primary-rgb), 0.6)' : 'var(--theme-primary)' }}>{system.instagram.platform}</span>:{' '}
              <a
                href={system.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline transition-colors duration-200 cursor-pointer"
                style={{ color: 'var(--accent-color)', pointerEvents: 'auto' }}
              >
                {system.instagram.username}
              </a>
              {system.instagram.followers && <span style={{ color: 'rgba(var(--theme-text-dimmed), 0.8)' }}> ({system.instagram.followers})</span>}
            </div>
          )}

          {/* TikTok */}
          {system.tiktok && (
            <div>
              <span className={`font-bold transition-all duration-300`} style={{ color: isBlurred ? 'rgba(var(--theme-primary-rgb), 0.6)' : 'var(--theme-primary)' }}>{system.tiktok.platform}</span>:{' '}
              <a
                href={system.tiktok.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline transition-colors duration-200 cursor-pointer"
                style={{ color: 'var(--accent-color)', pointerEvents: 'auto' }}
              >
                {system.tiktok.username}
              </a>
              {system.tiktok.followers && <span style={{ color: 'rgba(var(--theme-text-dimmed), 0.8)' }}> ({system.tiktok.followers})</span>}
            </div>
          )}

          <div className="pt-1 flex gap-1">
            <span className={`w-3 h-3 inline-block rounded-sm transition-all duration-300 ${isBlurred ? 'opacity-50' : 'opacity-100'}`} style={{backgroundColor: 'var(--theme-bg)'}}></span>
            <span className={`w-3 h-3 inline-block rounded-sm transition-all duration-300 ${isBlurred ? 'opacity-50' : 'opacity-100'}`} style={{backgroundColor: 'var(--theme-error)'}}></span>
            <span className={`w-3 h-3 inline-block rounded-sm transition-all duration-300 ${isBlurred ? 'opacity-50' : 'opacity-100'}`} style={{backgroundColor: 'var(--theme-success)'}}></span>
            <span className={`w-3 h-3 inline-block rounded-sm transition-all duration-300 ${isBlurred ? 'opacity-50' : 'opacity-100'}`} style={{backgroundColor: 'var(--theme-warning)'}}></span>
            <span className={`w-3 h-3 inline-block rounded-sm transition-all duration-300 ${isBlurred ? 'opacity-50' : 'opacity-100'}`} style={{backgroundColor: 'var(--accent-color)'}}></span>
            <span className={`w-3 h-3 inline-block rounded-sm transition-all duration-300 ${isBlurred ? 'opacity-50' : 'opacity-100'}`} style={{backgroundColor: 'var(--theme-info)'}}></span>
            <span className={`w-3 h-3 inline-block rounded-sm transition-all duration-300 ${isBlurred ? 'opacity-50' : 'opacity-100'}`} style={{backgroundColor: 'var(--theme-primary)'}}></span>
            <span className={`w-3 h-3 inline-block rounded-sm transition-all duration-300 ${isBlurred ? 'opacity-50' : 'opacity-100'}`} style={{backgroundColor: 'var(--theme-text)'}}></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeofetchTile;