'use client';

import React, { useState, useEffect } from 'react';
import { useFocusState } from '@/contexts/FocusContext';
import { useWindowManager } from '@/contexts/WindowManagerContext';

interface PolybarProps {
  onNavigate: (section: string) => void;
}

const Polybar: React.FC<PolybarProps> = ({ onNavigate }) => {
  const [time, setTime] = useState<Date | null>(null);
  const { activeContent } = useFocusState();
  const { state: wmState, setLayoutMode } = useWindowManager();

  useEffect(() => {
    // Set initial time after mount to avoid hydration mismatch
    setTime(new Date());
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
      <div className="h-9 backdrop-blur-md border-b-2 flex items-center justify-between px-3 font-mono text-xs relative z-50"
        style={{
          backgroundColor: 'rgba(var(--color-surface-rgb), 0.8)',
          borderColor: 'rgba(var(--accent-color-rgb), 0.3)',
          color: 'var(--color-text-body)'
        }}>
        {/* Left Section */}
        <div className="flex items-center gap-2">
          <span className="font-bold" style={{ color: 'var(--accent-color)' }}>[DLEER]</span>
          <span className="hidden sm:inline" style={{ color: 'var(--color-text-dimmed)' }}>portfolio</span>
        </div>

        {/* Center Section - Workspaces */}
        <div className="flex items-center gap-2 sm:gap-4">
          {workspaces.map((ws) => (
            <button
              key={ws.id}
              onClick={() => onNavigate(ws.id)}
              className="flex items-center gap-1 transition-colors hover:opacity-80"
              style={{
                color: isActive(ws.id) ? 'var(--accent-color)' : 'var(--color-text-dimmed)'
              }}
            >
              <span style={{
                color: isActive(ws.id) ? 'var(--accent-color)' : 'var(--color-text-muted)'
              }}>
                {ws.icon}
              </span>
              <span className="hidden lg:inline">{ws.label}</span>
            </button>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Layout Mode Indicator */}
          <div className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setLayoutMode('tiled')}
              className="px-2 py-0.5 text-xs transition-all"
              style={{
                backgroundColor: wmState.layoutMode === 'tiled' ? 'rgba(var(--accent-color-rgb), 0.2)' : 'transparent',
                color: wmState.layoutMode === 'tiled' ? 'var(--accent-color)' : 'var(--color-text-dimmed)',
                border: '1px solid',
                borderColor: wmState.layoutMode === 'tiled' ? 'var(--accent-color)' : 'rgba(var(--accent-color-rgb), 0.3)'
              }}
              title="Tiled Layout (Ctrl+1)"
            >
              ◫◫
            </button>
            <button
              onClick={() => setLayoutMode('monocle')}
              className="px-2 py-0.5 text-xs transition-all"
              style={{
                backgroundColor: wmState.layoutMode === 'monocle' ? 'rgba(var(--accent-color-rgb), 0.2)' : 'transparent',
                color: wmState.layoutMode === 'monocle' ? 'var(--accent-color)' : 'var(--color-text-dimmed)',
                border: '1px solid',
                borderColor: wmState.layoutMode === 'monocle' ? 'var(--accent-color)' : 'rgba(var(--accent-color-rgb), 0.3)'
              }}
              title="Monocle Layout (Ctrl+2)"
            >
              ◻
            </button>
            <button
              onClick={() => setLayoutMode('focus')}
              className="px-2 py-0.5 text-xs transition-all"
              style={{
                backgroundColor: wmState.layoutMode === 'focus' ? 'rgba(var(--accent-color-rgb), 0.2)' : 'transparent',
                color: wmState.layoutMode === 'focus' ? 'var(--accent-color)' : 'var(--color-text-dimmed)',
                border: '1px solid',
                borderColor: wmState.layoutMode === 'focus' ? 'var(--accent-color)' : 'rgba(var(--accent-color-rgb), 0.3)'
              }}
              title="Focus Layout (Ctrl+3)"
            >
              ◉
            </button>
            <button
              onClick={() => setLayoutMode('zen')}
              className="px-2 py-0.5 text-xs transition-all"
              style={{
                backgroundColor: wmState.layoutMode === 'zen' ? 'rgba(var(--accent-color-rgb), 0.2)' : 'transparent',
                color: wmState.layoutMode === 'zen' ? 'var(--accent-color)' : 'var(--color-text-dimmed)',
                border: '1px solid',
                borderColor: wmState.layoutMode === 'zen' ? 'var(--accent-color)' : 'rgba(var(--accent-color-rgb), 0.3)'
              }}
              title="Zen Mode (Ctrl+4)"
            >
              ☰
            </button>
          </div>
          <span className="hidden md:inline" style={{ color: 'var(--color-text-dimmed)' }}>|</span>
          <span style={{ color: 'var(--color-text-body)' }}>
            {time ? time.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            }) : '--:--'}
          </span>
        </div>
      </div>
    </>
  );
};

export default Polybar;