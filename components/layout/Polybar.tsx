'use client';

import React, { useState, useEffect } from 'react';
import { useFocusState } from '@/contexts/FocusContext';
import { useFeatureFlags } from '@/lib/config';
import { ThemeTray } from './polybar/ThemeTray';

interface PolybarProps {
  onNavigate: (section: string) => void;
}

/**
 * The desktop's top bar: workspaces on the left of center, the theme tray and the clock on the
 * right (docs/PORTFOLIO_V2_SPEC.md §4.1). Phones have the section rail instead, so it is hidden
 * below 1024 px.
 */
const Polybar: React.FC<PolybarProps> = ({ onNavigate }) => {
  const [time, setTime] = useState<Date | null>(null);
  const { activeContent } = useFocusState();
  const features = useFeatureFlags();

  useEffect(() => {
    // Set after mount (no hydration mismatch), then once a minute on the minute: the clock shows
    // HH:MM, so a per-second tick re-rendered the bar 59 times a minute for nothing
    setTime(new Date());
    let interval: ReturnType<typeof setInterval> | undefined;
    const toNextMinute = 60_000 - (Date.now() % 60_000);
    const timeout = setTimeout(() => {
      setTime(new Date());
      interval = setInterval(() => setTime(new Date()), 60_000);
    }, toNextMinute);
    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, []);

  const workspaces = [
    { id: 'home', label: 'home' },
    { id: 'projects', label: 'projects' },
    ...(features.lab ? [{ id: 'lab', label: 'lab' }] : []),
    ...(features.blog ? [{ id: 'blog', label: 'blog' }] : []),
    { id: 'contact', label: 'contact' },
  ];

  const isActive = (workspace: string) =>
    workspace === activeContent.type ||
    (workspace === 'projects' && activeContent.type === 'projects-overview') ||
    (workspace === 'lab' && activeContent.type.startsWith('lab-'));

  return (
    <header
      className="polybar hidden lg:flex h-9 backdrop-blur-md border-b-2 items-center justify-between px-3 font-mono text-xs relative z-50"
      style={{
        backgroundColor: 'rgba(var(--color-surface-rgb), 0.92)',
        borderColor: 'rgba(var(--accent-color-rgb), 0.3)',
        color: 'var(--color-text-body)',
      }}
    >
      <div className="flex items-center gap-2">
        <span className="font-bold" style={{ color: 'var(--accent-text)' }}>
          [DLEER]
        </span>
        <span style={{ color: 'rgba(var(--theme-text-rgb), 0.72)' }}>portfolio</span>
      </div>

      <nav aria-label="Workspaces" className="flex items-center gap-4">
        {workspaces.map((ws) => {
          const active = isActive(ws.id);
          return (
            <button
              key={ws.id}
              type="button"
              onClick={() => onNavigate(ws.id)}
              aria-current={active ? 'page' : undefined}
              className="workspace flex items-center gap-1 transition-colors hover:underline focus-visible:underline underline-offset-4"
              style={{ color: active ? 'var(--accent-text)' : 'rgba(var(--theme-text-rgb), 0.72)' }}
            >
              <span aria-hidden="true" style={{ color: active ? 'var(--accent-color)' : 'var(--color-text-muted)' }}>
                ●
              </span>
              <span>{ws.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="flex items-center gap-3">
        <ThemeTray />
        <span style={{ color: 'var(--color-text-body)' }} aria-label="Local time">
          {time ? time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : '--:--'}
        </span>
      </div>
    </header>
  );
};

export default Polybar;
