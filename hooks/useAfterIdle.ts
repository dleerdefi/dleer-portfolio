'use client';

import { useEffect, useState } from 'react';

/** True once the browser is idle after first paint (requestIdleCallback, else 1 s). */
export function useAfterIdle(): boolean {
  const [idle, setIdle] = useState(false);
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(() => setIdle(true), { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(() => setIdle(true), 1000);
    return () => clearTimeout(id);
  }, []);
  return idle;
}
