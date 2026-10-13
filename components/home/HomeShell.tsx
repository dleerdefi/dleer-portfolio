'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Background from '@/components/layout/Background';
import Polybar from '@/components/layout/Polybar';
import { ParallaxBorderFrame } from '@/components/layout/parallax/components/ParallaxBorderFrame';
import ScrollProgress from '@/components/ui/ScrollProgress';
import { useFocus, type TileType } from '@/contexts/FocusContext';
import { useIsDesktop } from '@/hooks/useMediaQuery';
import { usePhoneScroll } from '@/hooks/usePhoneScroll';
import { neighbor, type Direction } from '@/lib/tile-navigation';
import { SectionRail } from './SectionRail';

const KEYS: Record<string, Direction> = { h: 'left', j: 'down', k: 'up', l: 'right' };

/**
 * The home page's client shell around server-rendered sections (docs/PORTFOLIO_V2_SPEC.md §4.3).
 * The markup is the same at every width; CSS lays it out as the tiled grid or the phone column.
 * This only attaches behaviour: on desktop, h/j/k/l between tiles, Esc back to the home view, and
 * the focused tile following keyboard focus; on phones, the scroll indicator and the rail.
 */
export function HomeShell({ hasLab, sectionIds, children }: { hasLab: boolean; sectionIds: string[]; children: React.ReactNode }) {
  const isDesktop = useIsDesktop();
  const router = useRouter();
  const { focusedTile, activeContent, setFocusedTile, handleContentNavigation, handlePolybarNavigation } = useFocus();
  const phone = usePhoneScroll(sectionIds, !isDesktop);

  useEffect(() => {
    if (!isDesktop) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement;
      if (target.closest('input, textarea, select, [contenteditable="true"], [role="dialog"]')) return;
      if (e.key === 'Escape') {
        if (activeContent.type !== 'home') handleContentNavigation({ type: 'home' });
        return;
      }
      const direction = KEYS[e.key];
      if (!direction) return;
      const tiles = Array.from(document.querySelectorAll<HTMLElement>('[data-tile]'));
      const boxes = tiles.map((el) => {
        const r = el.getBoundingClientRect();
        return { id: el.dataset.tile!, left: r.left, top: r.top, right: r.right, bottom: r.bottom };
      });
      const from = boxes.find((b) => b.id === focusedTile) ?? boxes[0];
      const next = from && neighbor(from, boxes, direction);
      if (!next) return;
      e.preventDefault();
      setFocusedTile(next as TileType, 'navigation');
      tiles.find((el) => el.dataset.tile === next)?.focus({ preventScroll: true });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isDesktop, focusedTile, activeContent.type, setFocusedTile, handleContentNavigation]);

  const onPolybar = (section: string) => {
    if (section === 'projects') router.push('/projects');
    else handlePolybarNavigation(section);
  };

  return (
    <>
      <Background />
      {/* The phone's window frame; CSS hides it on desktop */}
      <div className="home-frame">
        <ParallaxBorderFrame borderPadding={16} />
      </div>
      <div className="home-root">
        <Polybar onNavigate={onPolybar} />
        <div
          className={`home${hasLab ? ' home--lab' : ''}`}
          onFocusCapture={(e) => {
            const tile = (e.target as HTMLElement).closest<HTMLElement>('[data-tile]');
            const id = tile?.dataset.tile as TileType | undefined;
            if (id && id !== focusedTile) setFocusedTile(id, 'tab');
          }}
        >
          {children}
        </div>
      </div>
      {!isDesktop && (
        <>
          <ScrollProgress progress={phone.progress} />
          <SectionRail ids={sectionIds} active={phone.active} settled={phone.settled} />
        </>
      )}
    </>
  );
}
