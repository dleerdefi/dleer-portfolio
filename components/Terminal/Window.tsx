'use client';

import React, { ReactNode } from 'react';

interface TerminalWindowProps {
  title?: string;
  children: ReactNode;
  className?: string;
  showControls?: boolean;
}

export default function TerminalWindow({
  title = 'user@archlinux:~$ portfolio',
  children,
  className = '',
  showControls = true,
}: TerminalWindowProps) {
  return (
    <div className={`terminal-window ${className}`}>
      {showControls && (
        <div className="terminal-header">
          <div className="terminal-controls">
            <span className="terminal-control close"></span>
            <span className="terminal-control minimize"></span>
            <span className="terminal-control maximize"></span>
          </div>
          <div className="terminal-title">{title}</div>
          <div className="terminal-controls opacity-0">
            <span className="terminal-control"></span>
            <span className="terminal-control"></span>
            <span className="terminal-control"></span>
          </div>
        </div>
      )}
      <div className="terminal-content">
        {children}
      </div>
    </div>
  );
}