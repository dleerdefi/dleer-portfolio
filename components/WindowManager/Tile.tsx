'use client';

import React from 'react';
import { Tile as TileType, Rectangle } from '@/lib/tiling/types';

interface TileProps {
  tile: TileType;
  rect: Rectangle;
  onClose: (id: string) => void;
  onFocus: (id: string) => void;
  children: React.ReactNode;
}

const Tile: React.FC<TileProps> = ({ tile, rect, onClose, onFocus, children }) => {
  const getFileName = () => {
    switch (tile.type) {
      case 'home': return 'home.md';
      case 'about': return 'about.md';
      case 'projects': return 'projects.sh';
      case 'project-detail': return `project-${tile.data?.name || 'detail'}.md`;
      case 'contact': return 'contact.sh';
      case 'blog': return 'blog.rss';
      default: return 'untitled.txt';
    }
  };

  return (
    <div
      className={`absolute overflow-hidden flex flex-col transition-all duration-300 ease-out ${
        tile.focused
          ? 'border-2 border-tokyo-blue shadow-lg z-10'
          : 'border border-term-border hover:border-term-text-dim'
      }`}
      style={{
        left: `${rect.x}px`,
        top: `${rect.y}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        backgroundColor: 'var(--term-surface)',
        borderRadius: '6px',
      }}
      onClick={() => onFocus(tile.id)}
    >
      {/* Title Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-term-surface-alt border-b border-term-border">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose(tile.id);
              }}
              className="w-3 h-3 rounded-full bg-tokyo-red hover:opacity-80 transition-opacity"
              aria-label="Close"
            />
            <div className="w-3 h-3 rounded-full bg-tokyo-yellow opacity-50" />
            <div className="w-3 h-3 rounded-full bg-tokyo-green opacity-50" />
          </div>
        </div>
        <span className="text-term-text-dim text-sm font-mono">{getFileName()}</span>
        <div className="w-16" />
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-4 font-mono text-sm">
        {children}
      </div>
    </div>
  );
};

export default Tile;