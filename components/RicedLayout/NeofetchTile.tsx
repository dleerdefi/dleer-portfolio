'use client';

import React from 'react';

interface NeofetchTileProps {
  isBlurred?: boolean;
}

const NeofetchTile: React.FC<NeofetchTileProps> = ({ isBlurred = false }) => {
  return (
    <div className={`h-full flex font-mono text-sm transition-all duration-300 ${
      isBlurred ? 'text-[#eff1f5]/70' : 'text-[#eff1f5]'
    }`}>
      {/* ASCII Art Column */}
      <div className="w-1/3 pr-4">
        <pre className={`${isBlurred ? 'text-[#89b4fa]/60' : 'text-[#89b4fa]'} text-xs leading-tight transition-all duration-300`}>
{`
    ██████╗ ██╗
    ██╔══██╗██║
    ██║  ██║██║
    ██║  ██║██║
    ██████╔╝███████╗
    ╚═════╝ ╚══════╝
`}
        </pre>
      </div>

      {/* Info Column */}
      <div className="flex-1 space-y-1">
        <div className={`${isBlurred ? 'text-[#89b4fa]/60' : 'text-[#89b4fa]'} font-bold mb-2 transition-all duration-300`}>
          <span className="text-[#a6e3a1]">dleer</span>@<span className="text-[#cba6f7]">portfolio</span>
          <div className={`${isBlurred ? 'text-[#565f89]/40' : 'text-[#565f89]/60'} transition-all duration-300`}>---------------</div>
        </div>

        <div className="space-y-0.5">
          <div>
            <span className={`${isBlurred ? 'text-[#89b4fa]/60' : 'text-[#89b4fa]'} transition-all duration-300`}>OS</span>: Arch Linux x86_64
          </div>
          <div>
            <span className={`${isBlurred ? 'text-[#89b4fa]/60' : 'text-[#89b4fa]'} transition-all duration-300`}>WM</span>: Hyprland
          </div>
          <div>
            <span className={`${isBlurred ? 'text-[#89b4fa]/60' : 'text-[#89b4fa]'} transition-all duration-300`}>Terminal</span>: kitty
          </div>
          <div>
            <span className={`${isBlurred ? 'text-[#89b4fa]/60' : 'text-[#89b4fa]'} transition-all duration-300`}>Shell</span>: zsh 5.9
          </div>
          <div>
            <span className={`${isBlurred ? 'text-[#89b4fa]/60' : 'text-[#89b4fa]'} transition-all duration-300`}>Packages</span>: 1337 (pacman)
          </div>
          <div>
            <span className={`${isBlurred ? 'text-[#89b4fa]/60' : 'text-[#89b4fa]'} transition-all duration-300`}>Uptime</span>: 16h 20m
          </div>
          <div>
            <span className={`${isBlurred ? 'text-[#89b4fa]/60' : 'text-[#89b4fa]'} transition-all duration-300`}>Memory</span>: 2048MiB / 16384MiB
          </div>
          <div>
            <span className={`${isBlurred ? 'text-[#89b4fa]/60' : 'text-[#89b4fa]'} transition-all duration-300`}>CPU</span>: AMD Ryzen 9 @ 16x 3.8GHz
          </div>
          <div>
            <span className={`${isBlurred ? 'text-[#89b4fa]/60' : 'text-[#89b4fa]'} transition-all duration-300`}>GPU</span>: NVIDIA RTX 4090
          </div>
          <div>
            <span className={`${isBlurred ? 'text-[#89b4fa]/60' : 'text-[#89b4fa]'} transition-all duration-300`}>Resolution</span>: 3440x1440
          </div>

          <div className="pt-3 flex gap-1">
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