import React from 'react';
import Link from 'next/link';

const TABS = [
  { id: 'telemetry', label: 'telemetry', href: '/lab' },
  { id: 'threats', label: 'threats', href: '/lab/threats' },
] as const;

/**
 * The framed lab pages' header: `← Back`, the telemetry | threats switcher (the current tab
 * marked with aria-current and the accent border) and the `esc closes` hint. Below 1024 px
 * the tabs and hint give way to `aside` (the badge); the teaser links across instead.
 */
export function LabFramedHeader({ current, aside }: { current: 'telemetry' | 'threats'; aside?: React.ReactNode }) {
  return (
    <div
      className="border-b-2 py-4 px-4 sm:px-6 font-mono"
      style={{ borderColor: 'var(--theme-border)', backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}
    >
      <div className="lab-page-width flex items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-1 border-2 lab-focus"
          style={{ borderColor: 'var(--theme-border)', color: 'var(--theme-text)', minHeight: 44 }}
        >
          ← Back
        </Link>
        <nav aria-label="Lab views" className="lab-desktop-only" style={{ display: 'flex', gap: '0.5rem' }}>
          {TABS.map((tab) => {
            const active = tab.id === current;
            return (
              <Link
                key={tab.id}
                href={tab.href}
                aria-current={active ? 'page' : undefined}
                className="px-3 py-1 border lab-focus"
                style={{
                  borderColor: active ? 'var(--accent-color)' : 'var(--theme-border)',
                  color: active ? 'var(--accent-color)' : 'var(--theme-text)',
                  background: active ? 'rgba(var(--accent-color-rgb), 0.12)' : 'transparent',
                }}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
        <span className="lab-desktop-only lab-text-2" style={{ fontSize: '0.875rem' }}>
          esc closes
        </span>
        {aside && <span className="lab-mobile-only">{aside}</span>}
      </div>
    </div>
  );
}
