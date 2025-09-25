'use client';

import React, { useState, useEffect } from 'react';
import { ContentType } from './LayoutManager';

interface PolybarProps {
  activeContent: ContentType;
  onNavigate: (section: string) => void;
  tileCount: number;
  isMobile: boolean;
}

const Polybar: React.FC<PolybarProps> = ({ activeContent, onNavigate, tileCount, isMobile }) => {
  const [time, setTime] = useState(new Date());
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const workspaces = [
    { id: 'home', label: 'home', icon: '●' },
    { id: 'about', label: 'about', icon: '●' },
    { id: 'projects', label: 'projects', icon: '●' },
    { id: 'blog', label: 'blog', icon: '●' },
    { id: 'contact', label: 'contact', icon: '●' },
  ];

  const isActive = (workspace: string) => {
    if (workspace === 'home' && activeContent.type === 'home') return true;
    if (workspace === activeContent.type) return true;
    if (workspace === 'projects' && activeContent.type === 'project-detail') return true;
    return false;
  };

  return (
    <>
      <div className="h-9 bg-[#24283b]/80 backdrop-blur-md border-b-2 border-[#414868]/50 flex items-center justify-between px-3 font-mono text-xs text-[#a9b1d6] relative z-50">
        {/* Left Section */}
        <div className="flex items-center gap-2">
          {isMobile && (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex flex-col justify-center items-center w-5 h-5"
            >
              <span className={`block h-0.5 w-5 bg-[#a9b1d6] transition-all ${menuOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
              <span className={`block h-0.5 w-5 bg-[#a9b1d6] transition-all ${menuOpen ? 'opacity-0' : 'my-0.5'}`}></span>
              <span className={`block h-0.5 w-5 bg-[#a9b1d6] transition-all ${menuOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
            </button>
          )}
          <span className="text-[#7aa2f7] font-bold">[DLEER]</span>
          <span className="text-[#565f89] hidden sm:inline">portfolio</span>
        </div>

        {/* Center Section - Workspaces */}
        {!isMobile && (
          <div className="flex items-center gap-4">
            {workspaces.map((ws) => (
              <button
                key={ws.id}
                onClick={() => onNavigate(ws.id)}
                className={`flex items-center gap-1 transition-colors ${
                  isActive(ws.id) ? 'text-[#7aa2f7]' : 'text-[#565f89] hover:text-[#a9b1d6]'
                }`}
              >
                <span className={isActive(ws.id) ? 'text-[#7aa2f7]' : 'text-[#414868]'}>
                  {ws.icon}
                </span>
                <span className="hidden lg:inline">{ws.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Mobile - Current Section */}
        {isMobile && (
          <div className="text-[#7aa2f7] text-center flex-1">
            {activeContent.type === 'project-detail' ? 'projects' : activeContent.type}
          </div>
        )}

        {/* Right Section */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-[#565f89]">
            Tiles: <span className="text-[#7aa2f7]">{tileCount}</span>
          </span>
          <span className="text-[#414868] hidden sm:inline">│</span>
          <span className="text-[#a9b1d6]">
            {time.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            })}
          </span>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobile && menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="absolute left-0 top-9 w-64 bg-[#24283b]/95 backdrop-blur-md border-r-2 border-b-2 border-[#414868]/50 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="space-y-2">
              {workspaces.map((ws) => (
                <button
                  key={ws.id}
                  onClick={() => {
                    onNavigate(ws.id);
                    setMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded transition-colors ${
                    isActive(ws.id)
                      ? 'bg-[#7aa2f7]/20 text-[#7aa2f7]'
                      : 'text-[#a9b1d6] hover:bg-[#414868]/30'
                  }`}
                >
                  <span className="text-[#565f89] mr-2">$</span>
                  {ws.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Polybar;