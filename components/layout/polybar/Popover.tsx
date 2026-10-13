'use client';

import React, { useCallback, useEffect, useId, useRef, useState } from 'react';

const FOCUSABLE = 'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * A small dialog under a tray button. Opening moves focus into it, Tab and Shift+Tab stay inside,
 * Esc closes it and returns focus to the button, and so does a click outside (without moving
 * focus). `children` gets `close` so a choice can close it.
 */
export function Popover({
  label,
  triggerLabel,
  trigger,
  children,
}: {
  label: string;
  triggerLabel: string;
  trigger: React.ReactNode;
  children: (close: () => void) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const id = useId();

  const close = useCallback((returnFocus = true) => {
    setOpen(false);
    if (returnFocus) button.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    // The first control, or the panel itself when it only shows text (the keys help)
    (panel.current?.querySelector<HTMLElement>(FOCUSABLE) ?? panel.current)?.focus();
    const onPointer = (e: PointerEvent) => {
      const target = e.target as Node;
      if (!panel.current?.contains(target) && !button.current?.contains(target)) close(false);
    };
    document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [open, close]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      close();
      return;
    }
    if (e.key !== 'Tab' || !panel.current) return;
    const items = Array.from(panel.current.querySelectorAll<HTMLElement>(FOCUSABLE));
    e.preventDefault();
    if (items.length === 0) return;
    const at = items.indexOf(document.activeElement as HTMLElement);
    const next = e.shiftKey ? (at <= 0 ? items.length - 1 : at - 1) : at === items.length - 1 ? 0 : at + 1;
    items[next].focus();
  };

  return (
    <div className="popover-anchor">
      <button
        ref={button}
        type="button"
        className="tray-button"
        aria-label={triggerLabel}
        title={triggerLabel}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={() => setOpen((o) => !o)}
      >
        {trigger}
      </button>
      {open && (
        <div ref={panel} id={id} role="dialog" aria-label={label} className="popover" tabIndex={-1} onKeyDown={onKeyDown}>
          {children(() => close())}
        </div>
      )}
    </div>
  );
}
