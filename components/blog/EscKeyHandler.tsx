'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface EscKeyHandlerProps {
  returnPath: string;
}

/**
 * Esc Key Handler Component
 * Listens for Escape key and navigates to specified path
 * Used in detail pages to return to list views
 */
export function EscKeyHandler({ returnPath }: EscKeyHandlerProps) {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        router.push(returnPath);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router, returnPath]);

  return null;
}
