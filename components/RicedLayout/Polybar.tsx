'use client';

import React, { useState, useEffect } from 'react';
import { ContentType } from './LayoutManager';

interface PolybarProps {
  activeContent: ContentType;
  onNavigate: (section: string) => void;
}

const Polybar: React.FC<PolybarProps> = ({ activeContent, onNavigate }) => {
  const [time, setTime] = useState(new Date());

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
    // Check for projects section
    if (workspace === 'projects' && (activeContent.type === 'project' || activeContent.type === 'projects-overview')) return true;
    // Check for blog section
    if (workspace === 'blog' && (activeContent.type === 'blog' || activeContent.type === 'blog-overview')) return true;
    return false;
  };

  return (
    <>
      <div className="h-9 bg-[#24283b]/80 backdrop-blur-md border-b-2 border-[#414868]/50 flex items-center justify-between px-3 font-mono text-xs text-[#a9b1d6] relative z-50">
        {/* Left Section */}
        <div className="flex items-center gap-2">
          <span className="text-[#7aa2f7] font-bold">[DLEER]</span>
          <span className="text-[#565f89] hidden sm:inline">portfolio</span>
        </div>

        {/* Center Section - Workspaces */}
        <div className="flex items-center gap-2 sm:gap-4">
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

        {/* Right Section */}
        <div className="flex items-center gap-3">
          <span className="text-[#a9b1d6]">
            {time.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            })}
          </span>
        </div>
      </div>
    </>
  );
};

export default Polybar;