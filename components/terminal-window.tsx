import React from 'react';

interface TerminalWindowProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  showStatusBar?: boolean;
}

export default function TerminalWindow({
  title = "terminal",
  children,
  className = "",
  showStatusBar = false
}: TerminalWindowProps) {
  return (
    <div className={`border border-terminal-gray bg-terminal-bg ${className}`}>
      {/* Terminal header */}
      <div className="border-b border-terminal-gray bg-terminal-gray px-2ch py-ch flex items-center justify-between">
        <div className="flex items-center gap-2ch">
          <span className="text-terminal-dim">●</span>
          <span className="text-terminal-dim">●</span>
          <span className="text-terminal-dim">●</span>
        </div>
        <div className="text-terminal-bright-gray text-sm">
          {title}
        </div>
        <div className="w-10ch"></div>
      </div>

      {/* Terminal content */}
      <div className="p-2ch">
        {children}
      </div>

      {/* Optional status bar */}
      {showStatusBar && (
        <div className="border-t border-terminal-gray px-2ch py-ch text-terminal-dim text-sm">
          <span className="text-terminal-accent">●</span> Ready
        </div>
      )}
    </div>
  );
}