'use client';

import React from 'react';
import Link from 'next/link';
import { useFocusNavigation } from '@/contexts/FocusContext';
import { useAfterIdle } from '@/hooks/useAfterIdle';
import { useLabData } from '@/hooks/useLabData';
import { isDesktopNow } from '@/hooks/useMediaQuery';
import { labThreatsEnabled } from '@/lib/lab/flag';
import { fmtCount, fmtInt, fmtKwh, fmtUsd } from '@/lib/lab/format';
import { categoryVar } from '@/lib/lab/names';
import { CATEGORIES, type LabSummary } from '@/lib/lab/types';
import { LabStatusBadge } from '@/components/lab/shared/LabStatusBadge';
import { Sparkline } from '@/components/lab/shared/Sparkline';
import { Swatch } from '@/components/lab/shared/Swatch';
import { Value } from '@/components/lab/shared/Value';

/**
 * The home page's lab: a tile beside the contents on desktop, the section after the featured
 * projects on phones (docs/PORTFOLIO_V2_SPEC.md §4.1, §4.2; concept mobile-section). One card
 * for telemetry and one for the threat map: on desktop a card opens its view in the stage, on a
 * phone its page. Data from /api/lab/summary only; no globe here. The threats card is left out
 * while the threat map is off, or once a summary arrives without a threats block.
 */
export default function LabTile() {
  // After idle, like the neofetch rows: the same summary (one request between them), and loaded
  // before a phone scrolls here, so the cards never grow under the reader
  const idle = useAfterIdle();
  const { handleContentNavigation } = useFocusNavigation();
  // Desktop: the stage shows the view; phones follow the link to the page
  const openInStage = (type: 'lab-telemetry' | 'lab-threats') => (e: React.MouseEvent) => {
    if (!isDesktopNow()) return;
    e.preventDefault();
    e.stopPropagation();
    handleContentNavigation({ type });
  };
  const { payload, receivedAt } = useLabData<LabSummary>('/api/lab/summary', 300_000, { enabled: idle });
  const tel = payload?.telemetry;
  const thr = payload?.threats;
  const showThreats = labThreatsEnabled() && (payload === null || thr !== undefined);

  return (
    <div className="lab-root lab-tile">
      <div className="lab-tile-head">
        <h2 id="lab-title" className="section-title">
          Lab
        </h2>
        <Link href="/lab" className="lab-tile-open lab-link">
          /lab ↗
        </Link>
      </div>
      <p className="lab-text-2" style={{ margin: 0 }}>
        {showThreats ? 'My homelab and the honeypot I run, live.' : 'My homelab, live.'}
      </p>

      <Link href="/lab" className="lab-card lab-focus" onClick={openInStage('lab-telemetry')}>
        <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
          <span className="font-bold">~/lab</span>
          {tel && <LabStatusBadge state={tel.state} compact receivedAt={receivedAt ?? undefined} style={{ fontSize: '0.8rem' }} />}
        </span>
        {!tel && <span className="lab-card-pending" aria-hidden="true" />}
        {tel?.state === 'offline' && <span className="lab-card-pending">lab offline</span>}
        {tel && tel.state !== 'offline' && (
          <span className={tel.state === 'delayed' ? 'lab-dim' : undefined} style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <span className="lab-card-power">
              <span style={{ fontSize: '2.125rem', lineHeight: 1 }}>
                <Value text={fmtInt(tel.power_w)} unit="W" unitScale={0.5} />
              </span>
              <span className="lab-card-stats lab-text-2">
                <span className="lab-stat">{fmtKwh(tel.energy_kwh_24h)} / 24 h</span>
                {typeof tel.energy_cost_usd_24h === 'number' && (
                  <span className="lab-stat">{fmtUsd(tel.energy_cost_usd_24h)}/day</span>
                )}
                <span className="lab-stat">
                  {tel.hosts_up}/{tel.hosts_expected} hosts up
                </span>
              </span>
            </span>
            {tel.power_24h && <Sparkline values={tel.power_24h} height={40} />}
          </span>
        )}
        <span style={{ color: 'var(--accent-color)' }}>open telemetry →</span>
      </Link>

      {showThreats && (
        <Link href="/lab/threats" className="lab-card lab-focus" onClick={openInStage('lab-threats')}>
          <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
            <span className="font-bold">~/lab/threats</span>
            {thr && <LabStatusBadge state={thr.state} compact style={{ fontSize: '0.8rem' }} />}
          </span>
          {!thr && <span className="lab-card-pending lab-card-pending-threats" aria-hidden="true" />}
          {thr?.state === 'offline' && <span className="lab-card-pending lab-card-pending-threats">honeynet offline</span>}
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
      )}
    </div>
  );
}

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
