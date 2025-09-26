'use client';

import React, { useState, useEffect } from 'react';
import { archLogoASCII, archLogoCompact, dlLogoASCII, minimalLogo, dleerBlockLetters, dleerCompact } from './archAscii';
import { usePersonalInfo, useSystemInfo } from '@/lib/config';

interface NeofetchTileProps {
  isBlurred?: boolean;
}

const NeofetchTile: React.FC<NeofetchTileProps> = ({ isBlurred = false }) => {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const personal = usePersonalInfo();
  const system = useSystemInfo();

  useEffect(() => {
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
    <div className={`flex gap-2 sm:gap-4 md:gap-6 font-mono text-sm transition-all duration-300 ${
      isBlurred ? 'text-[#eff1f5]/70' : 'text-[#eff1f5]'
    }`}>
      {/* ASCII Art Column */}
      <div className="flex-shrink-0 flex items-start overflow-hidden" style={{ width: logoType === 'dleer' ? 'auto' : '40%' }}>
        <pre
          className={`${isBlurred ? 'text-[#89b4fa]/60' : 'text-[#89b4fa]'} leading-tight transition-all duration-300`}
          style={{
            background: 'transparent',
            padding: 0,
            border: 'none',
            margin: 0,
            fontSize: logoType === 'dleer' ? 'clamp(0.5rem, 1.2vw, 0.65rem)' : 'clamp(0.4rem, 1.8vw, 0.75rem)',
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
          className={`${isBlurred ? 'text-[#89b4fa]/60' : 'text-[#89b4fa]'} font-bold mb-2 transition-all duration-300`}
        >
          <span className="text-[#a6e3a1]">{personal.username}</span>@<span className="text-[#cba6f7]">portfolio</span>
          <div className={`${isBlurred ? 'text-[#565f89]/40' : 'text-[#565f89]/60'} transition-all duration-300`}>---------------</div>
        </div>

        <div className="space-y-0.5" style={{ fontSize: 'clamp(0.65rem, 1.5vw, 0.813rem)' }}>
          <div>
            <span className={`${isBlurred ? 'text-[#89b4fa]/60' : 'text-[#89b4fa]'} font-bold transition-all duration-300`}>OS</span>: {system.os}
          </div>
          <div>
            <span className={`${isBlurred ? 'text-[#89b4fa]/60' : 'text-[#89b4fa]'} font-bold transition-all duration-300`}>Terminal</span>: {system.terminal}
          </div>
          <div>
            <span className={`${isBlurred ? 'text-[#89b4fa]/60' : 'text-[#89b4fa]'} font-bold transition-all duration-300`}>Kernel</span>: {system.kernel}
          </div>
          <div>
            <span className={`${isBlurred ? 'text-[#89b4fa]/60' : 'text-[#89b4fa]'} font-bold transition-all duration-300`}>Shell</span>: {system.shell}
          </div>
          <div>
            <span className={`${isBlurred ? 'text-[#89b4fa]/60' : 'text-[#89b4fa]'} font-bold transition-all duration-300`}>CPU</span>: {system.cpu}
          </div>
          <div>
            <span className={`${isBlurred ? 'text-[#89b4fa]/60' : 'text-[#89b4fa]'} font-bold transition-all duration-300`}>Memory</span>: {system.memory}
          </div>

          <div className="pt-2 flex gap-1">
            <span className={`w-3 h-3 inline-block rounded-sm transition-all duration-300 ${isBlurred ? 'opacity-50' : 'opacity-100'}`} style={{backgroundColor: '#1a1b26'}}></span>
            <span className={`w-3 h-3 inline-block rounded-sm transition-all duration-300 ${isBlurred ? 'opacity-50' : 'opacity-100'}`} style={{backgroundColor: '#f38ba8'}}></span>
            <span className={`w-3 h-3 inline-block rounded-sm transition-all duration-300 ${isBlurred ? 'opacity-50' : 'opacity-100'}`} style={{backgroundColor: '#a6e3a1'}}></span>
            <span className={`w-3 h-3 inline-block rounded-sm transition-all duration-300 ${isBlurred ? 'opacity-50' : 'opacity-100'}`} style={{backgroundColor: '#e0af68'}}></span>
            <span className={`w-3 h-3 inline-block rounded-sm transition-all duration-300 ${isBlurred ? 'opacity-50' : 'opacity-100'}`} style={{backgroundColor: '#89b4fa'}}></span>
            <span className={`w-3 h-3 inline-block rounded-sm transition-all duration-300 ${isBlurred ? 'opacity-50' : 'opacity-100'}`} style={{backgroundColor: '#cba6f7'}}></span>
            <span className={`w-3 h-3 inline-block rounded-sm transition-all duration-300 ${isBlurred ? 'opacity-50' : 'opacity-100'}`} style={{backgroundColor: '#89dceb'}}></span>
            <span className={`w-3 h-3 inline-block rounded-sm transition-all duration-300 ${isBlurred ? 'opacity-50' : 'opacity-100'}`} style={{backgroundColor: '#eff1f5'}}></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeofetchTile;