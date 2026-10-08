'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useLabData } from '@/hooks/useLabData';
import { fmtCount, fmtInt, fmtKwh } from '@/lib/lab/format';
import { categoryVar } from '@/lib/lab/names';
import { CATEGORIES, type LabSummary } from '@/lib/lab/types';
import { LabStatusBadge } from '@/components/lab/shared/LabStatusBadge';
import { Sparkline } from '@/components/lab/shared/Sparkline';
import { Swatch } from '@/components/lab/shared/Swatch';
import { Value } from '@/components/lab/shared/Value';

/** True once the element has come within one screen of the viewport. */
function useNear(ref: React.RefObject<HTMLElement | null>): boolean {
  const [near, setNear] = useState(false);
  useEffect(() => {
    if (near || !ref.current) return;
    const io = new IntersectionObserver(([entry]) => entry.isIntersecting && setNear(true), { rootMargin: '100% 0px' });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [near, ref]);
  return near;
}

const card: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  padding: '1rem',
  border: '1px solid var(--theme-border)',
  background: 'rgba(var(--theme-surface-rgb), 0.5)',
  color: 'var(--theme-text)',
  textDecoration: 'none',
};

/**
 * The mobile home page's Lab section, between Blog and Contact (concept mobile-section): one
 * card links to /lab, one to /lab/threats. Data from /api/lab/summary only; no globe here.
 */
export const ParallaxLabSection: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const near = useNear(ref);
  const { payload, receivedAt } = useLabData<LabSummary>('/api/lab/summary', 300_000, { enabled: near });
  const tel = payload?.telemetry;
  const thr = payload?.threats;

  return (
    <div ref={ref} className="p-6 lab-root" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h2 className="text-3xl font-bold" style={{ color: 'var(--accent-color)', margin: 0 }}>
        Lab
      </h2>
      <p className="lab-text-2" style={{ margin: 0 }}>
        My homelab and the honeypot I run, live.
      </p>

      <Link href="/lab" style={card} className="lab-focus">
        <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
          <span className="font-bold">~/lab</span>
          {tel && <LabStatusBadge state={tel.state} compact receivedAt={receivedAt ?? undefined} style={{ fontSize: '0.8rem' }} />}
        </span>
        {tel?.state === 'offline' && <span>lab offline</span>}
        {tel && tel.state !== 'offline' && (
          <span className={tel.state === 'delayed' ? 'lab-dim' : undefined} style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '0.75rem' }}>
              <span style={{ fontSize: '2.125rem', lineHeight: 1 }}>
                <Value text={fmtInt(tel.power_w)} unit="W" unitScale={0.5} />
              </span>
              <span className="lab-text-2" style={{ textAlign: 'right', fontSize: '0.85rem' }}>
                {fmtKwh(tel.energy_kwh_24h)} / 24 h
                <br />
                {tel.hosts_up}/{tel.hosts_expected} hosts up
              </span>
            </span>
            {tel.power_24h && <Sparkline values={tel.power_24h} height={40} />}
          </span>
        )}
        <span style={{ color: 'var(--accent-color)' }}>open telemetry →</span>
      </Link>

      <Link href="/lab/threats" style={card} className="lab-focus">
        <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
          <span className="font-bold">~/lab/threats</span>
          {thr && <LabStatusBadge state={thr.state} compact style={{ fontSize: '0.8rem' }} />}
        </span>
        {thr?.state === 'offline' && <span>honeynet offline</span>}
        {thr && thr.state !== 'offline' && thr.by_category && (
          <span className={thr.state === 'delayed' ? 'lab-dim' : undefined} style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <span>
              <span style={{ fontSize: '1.5rem' }}>{fmtInt(thr.events)}</span>{' '}
              <span className="lab-text-2">
                events in 24 h from <b style={{ color: 'var(--theme-text)' }}>{fmtInt(thr.countries)}</b> countries
              </span>
            </span>
            <TopCategories counts={thr.by_category} />
          </span>
        )}
        <span style={{ color: 'var(--accent-color)' }}>open the threat map →</span>
      </Link>
    </div>
  );
};

/** The three largest categories: swatch, name, a bar in the category color, compact count. */
function TopCategories({ counts }: { counts: Record<(typeof CATEGORIES)[number], number> }) {
  const top = [...CATEGORIES].sort((a, b) => counts[b] - counts[a]).slice(0, 3);
  const max = counts[top[0]] || 1;
  return (
    <span style={{ display: 'grid', gridTemplateColumns: 'auto minmax(0, 1fr) auto', gap: '0.4rem 0.75rem', alignItems: 'center', fontSize: '0.85rem' }}>
      {top.map((c) => (
        <React.Fragment key={c}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5em' }}>
            <Swatch category={c} />
            {c}
          </span>
          <span aria-hidden="true" style={{ height: '0.5em', background: 'var(--lab-track)' }}>
            <span style={{ display: 'block', height: '100%', width: `${counts[c] > 0 ? Math.max(2, (counts[c] / max) * 100) : 0}%`, background: categoryVar(c) }} />
          </span>
          <span style={{ textAlign: 'right' }}>{fmtCount(counts[c])}</span>
        </React.Fragment>
      ))}
    </span>
  );
}
