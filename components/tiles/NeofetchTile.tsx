'use client';

import React, { useState, useEffect } from 'react';
import { archLogoASCII, archLogoCompact, dlLogoASCII, minimalLogo, dleerBlockLetters, dleerCompact } from '@/components/assets/archAscii';
import { usePersonalInfo, useSystemInfo } from '@/lib/config';

interface NeofetchTileProps {
  isBlurred?: boolean;
}

const NeofetchTile: React.FC<NeofetchTileProps> = ({ isBlurred = false }) => {
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
    asciiArt = windowWidth < 400 ? dleerCompact : dleerBlockLetters;
  } else if (logoType === 'arch') {
    asciiArt = windowWidth < 400 ? archLogoCompact : archLogoASCII;
  } else {
    asciiArt = minimalLogo;
  }

  return (
    <div className={`flex gap-2 sm:gap-3 md:gap-4 font-mono text-xs transition-all duration-300`}
      style={{
        color: isBlurred ? 'rgba(var(--theme-text-rgb), 0.7)' : 'var(--theme-text)'
      }}>
      {/* ASCII Art Column */}
      <div className="flex-shrink-0 flex items-start overflow-hidden" style={{ width: logoType === 'dleer' ? 'auto' : '40%' }}>
        <pre
          className={`leading-tight transition-all duration-300`}
          style={{
            color: isBlurred ? 'rgba(var(--accent-color-rgb), 0.6)' : 'var(--accent-color)',
            background: 'transparent',
            padding: 0,
            border: 'none',
            margin: 0,
            fontSize: logoType === 'dleer' ? 'clamp(0.45rem, 1vw, 0.6rem)' : 'clamp(0.35rem, 1.5vw, 0.65rem)',
            overflow: 'auto',
            whiteSpace: 'pre'
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

        <div className="space-y-0" style={{ fontSize: 'clamp(0.6rem, 1.3vw, 0.75rem)' }}>
          <div>
            <span className={`font-bold transition-all duration-300`} style={{ color: isBlurred ? 'rgba(var(--theme-primary-rgb), 0.6)' : 'var(--theme-primary)' }}>OS</span>: {system.os}
          </div>
          <div>
            <span className={`font-bold transition-all duration-300`} style={{ color: isBlurred ? 'rgba(var(--theme-primary-rgb), 0.6)' : 'var(--theme-primary)' }}>Terminal</span>: {system.terminal}
          </div>
          <div>
            <span className={`font-bold transition-all duration-300`} style={{ color: isBlurred ? 'rgba(var(--theme-primary-rgb), 0.6)' : 'var(--theme-primary)' }}>Kernel</span>: {system.kernel}
          </div>
          <div>
            <span className={`font-bold transition-all duration-300`} style={{ color: isBlurred ? 'rgba(var(--theme-primary-rgb), 0.6)' : 'var(--theme-primary)' }}>Shell</span>: {system.shell}
          </div>
          <div>
            <span className={`font-bold transition-all duration-300`} style={{ color: 'var(--accent-color)' }}>CPU</span>: {system.cpu}
          </div>
          <div>
            <span className={`font-bold transition-all duration-300`} style={{ color: isBlurred ? 'rgba(var(--theme-primary-rgb), 0.6)' : 'var(--theme-primary)' }}>Memory</span>: {system.memory}
          </div>

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