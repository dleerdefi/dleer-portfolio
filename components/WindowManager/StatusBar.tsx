'use client';

import React, { useState, useEffect } from 'react';

interface StatusBarProps {
  tileCount: number;
}

const StatusBar: React.FC<StatusBarProps> = ({ tileCount }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-10 bg-term-surface-alt border-b border-term-border flex items-center justify-between px-4 text-sm font-mono text-term-text-dim">
      <div className="flex items-center gap-4">
        <span className="text-tokyo-blue font-bold">DLEER.DEV</span>
        <span className="text-term-text-dim">│</span>
        <span>Tiles: {tileCount}</span>
      </div>

      <div className="flex items-center gap-4">
        <span className="hidden sm:block">Arch Linux</span>
        <span className="text-term-text-dim">│</span>
        <span className="hidden sm:block">Hyprland</span>
        <span className="text-term-text-dim">│</span>
        <span>{time.toLocaleTimeString()}</span>
      </div>
    </div>
  );
};

export default StatusBar;