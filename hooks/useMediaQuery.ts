'use client';

import { useSyncExternalStore } from 'react';

export const DESKTOP_QUERY = '(min-width: 1024px)';

/**
 * Whether a media query matches, kept in sync. During server rendering and hydration it returns
 * `serverValue`, then the real value; so markup never depends on it. CSS decides the layout
 * (app/styles/15-home-layout.css); this only decides which listeners to attach.
 */
export function useMediaQuery(query: string, serverValue: boolean): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverValue
  );
}

/** The tiled desktop layout (≥ 1024 px). The server renders as desktop. */
export const useIsDesktop = () => useMediaQuery(DESKTOP_QUERY, true);

/** For event handlers: is the tiled layout showing right now? */
export const isDesktopNow = () => typeof window !== 'undefined' && window.matchMedia(DESKTOP_QUERY).matches;
