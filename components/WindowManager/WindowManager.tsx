'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TilingEngine } from '@/lib/tiling/TilingEngine';
import { Tile as TileType, TileLayout } from '@/lib/tiling/types';
import StatusBar from './StatusBar';

interface WindowManagerProps {
  TileContent: React.FC<{
    tile: TileType;
    rect: any;
    onClose: (id: string) => void;
    onFocus: (id: string) => void;
    spawnTile: (type: TileType['type'], data?: any) => void;
  }>;
}

const WindowManager: React.FC<WindowManagerProps> = ({ TileContent }) => {
  const [tiles, setTiles] = useState<TileType[]>([]);
  const [layouts, setLayouts] = useState<TileLayout[]>([]);
  const [focusedTileId, setFocusedTileId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef(new TilingEngine());

  const updateLayouts = useCallback(() => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const containerRect = {
      x: 0,
      y: 40, // Account for status bar
      width: rect.width,
      height: rect.height - 40,
    };

    const newLayouts = engineRef.current.calculateLayouts(containerRect);
    setLayouts(newLayouts);
    setTiles(engineRef.current.getTiles());
  }, []);

  const spawnTile = useCallback((type: TileType['type'], data?: any) => {
    const id = `tile-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newTile: TileType = {
      id,
      type,
      title: type,
      focused: true,
      data,
    };

    engineRef.current.addTile(newTile);
    engineRef.current.focusTile(id);
    setFocusedTileId(id);
    updateLayouts();
  }, [updateLayouts]);

  const closeTile = useCallback((tileId: string) => {
    engineRef.current.removeTile(tileId);
    updateLayouts();

    const remainingTiles = engineRef.current.getTiles();
    if (remainingTiles.length > 0 && focusedTileId === tileId) {
      const newFocus = remainingTiles[remainingTiles.length - 1];
      engineRef.current.focusTile(newFocus.id);
      setFocusedTileId(newFocus.id);
    }
  }, [updateLayouts, focusedTileId]);

  const focusTile = useCallback((tileId: string) => {
    engineRef.current.focusTile(tileId);
    setFocusedTileId(tileId);
    updateLayouts();
  }, [updateLayouts]);

  // Initialize with default tiles
  useEffect(() => {
    spawnTile('home');
    spawnTile('projects');
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => updateLayouts();
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [updateLayouts]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMod = e.ctrlKey || e.metaKey;

      if (isMod && e.key === 'q' && focusedTileId) {
        e.preventDefault();
        closeTile(focusedTileId);
      }

      if (isMod && e.key === 'Enter') {
        e.preventDefault();
        spawnTile('home');
      }

      if (isMod && ['1', '2', '3', '4', '5'].includes(e.key)) {
        e.preventDefault();
        const index = parseInt(e.key) - 1;
        const allTiles = engineRef.current.getTiles();
        if (allTiles[index]) {
          focusTile(allTiles[index].id);
        }
      }

      if (isMod && e.key === 'ArrowLeft') {
        e.preventDefault();
        const allTiles = engineRef.current.getTiles();
        const currentIndex = allTiles.findIndex((t) => t.id === focusedTileId);
        if (currentIndex > 0) {
          focusTile(allTiles[currentIndex - 1].id);
        }
      }

      if (isMod && e.key === 'ArrowRight') {
        e.preventDefault();
        const allTiles = engineRef.current.getTiles();
        const currentIndex = allTiles.findIndex((t) => t.id === focusedTileId);
        if (currentIndex < allTiles.length - 1) {
          focusTile(allTiles[currentIndex + 1].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedTileId, closeTile, spawnTile, focusTile]);

  return (
    <div className="h-screen bg-term-bg overflow-hidden">
      <StatusBar tileCount={tiles.length} />

      <div ref={containerRef} className="relative h-full">
        {layouts.map((layout) => (
          <TileContent
            key={layout.tileId}
            tile={layout.tile}
            rect={layout.rect}
            onClose={closeTile}
            onFocus={focusTile}
            spawnTile={spawnTile}
          />
        ))}
      </div>
    </div>
  );
};

export default WindowManager;