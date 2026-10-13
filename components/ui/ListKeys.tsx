'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Keys for a list page (/projects, /blog): j/k (or the arrows) move focus through the cards in
 * `.card-grid`, Enter opens one (it is a link), Esc goes home. Ignored while typing or with a
 * modifier held.
 */
export function ListKeys() {
  const router = useRouter();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
      if ((e.target as HTMLElement).closest('input, textarea, select, [contenteditable="true"]')) return;
      if (e.key === 'Escape') {
        router.push('/');
        return;
      }
      const step = e.key === 'j' || e.key === 'ArrowDown' ? 1 : e.key === 'k' || e.key === 'ArrowUp' ? -1 : 0;
      if (!step) return;
      const cards = Array.from(document.querySelectorAll<HTMLElement>('.card-grid .project-card'));
      if (cards.length === 0) return;
      e.preventDefault();
      const at = cards.indexOf(document.activeElement as HTMLElement);
      const next = at < 0 ? (step > 0 ? 0 : cards.length - 1) : Math.min(cards.length - 1, Math.max(0, at + step));
      cards[next].focus();
      cards[next].scrollIntoView({ block: 'nearest', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [router]);
  return null;
}
