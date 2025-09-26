'use client';

import React, { useState, useEffect } from 'react';
import { archLogoASCII, archLogoCompact, dlLogoASCII, minimalLogo, dleerBlockLetters, dleerShadow, dleerCompact, dleerMini } from './archAscii';

interface NeofetchTileProps {
  isBlurred?: boolean;
}

const NeofetchTile: React.FC<NeofetchTileProps> = ({ isBlurred = false }) => {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Switch ASCII art based on screen size
  const asciiArt = windowWidth < 400 ? dleerCompact : dleerBlockLetters;

  return (
    <div className={`flex gap-2 sm:gap-4 md:gap-6 font-mono text-sm transition-all duration-300 ${
      isBlurred ? 'text-[#eff1f5]/70' : 'text-[#eff1f5]'
    }`}>
      {/* ASCII Art Column - Placeholder for future artwork */}
      <div className="w-1/2 sm:w-3/5 flex items-center justify-center overflow-hidden">
        <pre
          className={`${isBlurred ? 'text-[#89b4fa]/60' : 'text-[#89b4fa]'} leading-tight transition-all duration-300`}
          style={{
            background: 'transparent',
            padding: 0,
            border: 'none',
            margin: 0,
            fontSize: 'clamp(0.4rem, 1.8vw, 0.75rem)',
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
          <span className="text-[#a6e3a1]">dleer</span>@<span className="text-[#cba6f7]">portfolio</span>
          <div className={`${isBlurred ? 'text-[#565f89]/40' : 'text-[#565f89]/60'} transition-all duration-300`}>---------------</div>
        </div>

        <div className="space-y-0.5" style={{ fontSize: 'clamp(0.65rem, 1.5vw, 0.813rem)' }}>
          <div>
            <span className={`${isBlurred ? 'text-[#89b4fa]/60' : 'text-[#89b4fa]'} font-bold transition-all duration-300`}>OS</span>: Arch Linux x86_64
          </div>
          <div>
            <span className={`${isBlurred ? 'text-[#89b4fa]/60' : 'text-[#89b4fa]'} font-bold transition-all duration-300`}>Host</span>: Hyprland WM
          </div>
          <div>
            <span className={`${isBlurred ? 'text-[#89b4fa]/60' : 'text-[#89b4fa]'} font-bold transition-all duration-300`}>Kernel</span>: 6.6.10-arch1-1
          </div>
          <div>
            <span className={`${isBlurred ? 'text-[#89b4fa]/60' : 'text-[#89b4fa]'} font-bold transition-all duration-300`}>Shell</span>: zsh 5.9
          </div>
          <div>
            <span className={`${isBlurred ? 'text-[#89b4fa]/60' : 'text-[#89b4fa]'} font-bold transition-all duration-300`}>Packages</span>: 1337 (pacman)
          </div>
          <div>
            <span className={`${isBlurred ? 'text-[#89b4fa]/60' : 'text-[#89b4fa]'} font-bold transition-all duration-300`}>Memory</span>: 4.2GiB / 16GiB
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