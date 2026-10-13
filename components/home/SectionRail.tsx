'use client';

import React, { useEffect, useState } from 'react';

const LABELS: Record<string, string> = {
  top: 'top',
  home: 'featured',
  lab: 'lab',
  writing: 'writing',
  contact: 'contact',
};

/**
 * The phone's polybar (docs/PORTFOLIO_V2_SPEC.md §4.2): a word per section, the current one in
 * the accent; tap to jump. It fades out while the page scrolls and back once it settles, and hides
 * while the on-screen keyboard is up (the visual viewport shrinks, or a text field has focus).
 * Every word is a 44 px target.
 */
export function SectionRail({ ids, active, settled }: { ids: string[]; active: string; settled: boolean }) {
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const onResize = () => setKeyboardOpen(vv.height < window.innerHeight * 0.75);
    vv.addEventListener('resize', onResize);
    return () => vv.removeEventListener('resize', onResize);
  }, []);

  // A text field with focus means a keyboard on a phone, even where the viewport does not shrink
  // (a browser that resizes the layout instead, a keyboard that floats)
  const [typing, setTyping] = useState(false);
  useEffect(() => {
    const isField = (t: EventTarget | null) =>
      t instanceof HTMLElement && (t.matches('input:not([type=checkbox]):not([type=radio]):not([type=button]):not([type=submit]), textarea, select') || t.isContentEditable);
    const onIn = (e: FocusEvent) => setTyping(isField(e.target));
    const onOut = (e: FocusEvent) => setTyping(isField(e.relatedTarget));
    document.addEventListener('focusin', onIn);
    document.addEventListener('focusout', onOut);
    return () => {
      document.removeEventListener('focusin', onIn);
      document.removeEventListener('focusout', onOut);
    };
  }, []);

  const jump = (id: string) => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <nav className="section-rail" aria-label="Sections" data-hidden={!settled || keyboardOpen || typing || undefined}>
      {ids.map((id) => (
        <button
          key={id}
          type="button"
          className="rail-dot"
          aria-current={active === id ? 'true' : undefined}
          onClick={() => jump(id)}
        >
          {LABELS[id] ?? id}
        </button>
      ))}
    </nav>
  );
}
