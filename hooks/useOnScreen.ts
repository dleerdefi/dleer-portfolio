'use client';

import { useEffect, useState, type RefObject } from 'react';

type Observer = Pick<IntersectionObserver, 'observe' | 'disconnect'>;
type ObserverCtor = new (cb: IntersectionObserverCallback, init?: IntersectionObserverInit) => Observer;

/**
 * Calls `onChange` with whether `el` is in (or within 200 px of) the viewport, and returns the
 * cleanup. Without IntersectionObserver it reports on screen once, so nothing stays blank.
 */
export function observeOnScreen(
  el: Element,
  onChange: (onScreen: boolean) => void,
  Ctor: ObserverCtor | undefined = typeof IntersectionObserver === 'undefined' ? undefined : IntersectionObserver,
): () => void {
  if (!Ctor) {
    onChange(true);
    return () => {};
  }
  const io = new Ctor(([entry]) => onChange(entry.isIntersecting), {
    rootMargin: '200px 0px',
  });
  io.observe(el);
  return () => io.disconnect();
}

/** Whether the element is near the viewport; false until the first observation. */
export function useOnScreen(ref: RefObject<Element | null>): boolean {
  const [onScreen, setOnScreen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return observeOnScreen(el, setOnScreen);
  }, [ref]);
  return onScreen;
}
