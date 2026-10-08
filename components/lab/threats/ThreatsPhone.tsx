'use client';

import React from 'react';
import { fmtInt } from '@/lib/lab/format';
import type { Category } from '@/lib/lab/types';
import { LabAttribution } from '@/components/lab/shared/LabAttribution';
import { CategoryLegend } from './CategoryLegend';
import { FeedPaused, GlobeSlot } from './GlobeSlot';
import type { ReplayEvent } from './ReplayClock';
import { ThreatFeed } from './ThreatFeed';
import { AiAgents, Behaviors, Cves, Malware, Signatures } from './stats/Activity';
import { Credentials, TopCountries, TopNetworks, TopPairs } from './stats/Lists';
import { HourlyByCategory } from './stats/Summary';
import type { DigestLive } from './useThreats';

/** /lab/threats below 1024 px (THREATS_VIEW.md §4.3, concepts mobile-threats and mobile-threats-globe). */
export function ThreatsPhone({
  d,
  replaying,
  lines,
  subscribe,
  hidden,
  onToggle,
  webLabel,
  nowMs,
}: {
  d: DigestLive;
  replaying: boolean;
  lines: ReplayEvent[];
  subscribe: (fn: (e: ReplayEvent) => void) => () => void;
  hidden: ReadonlySet<Category>;
  onToggle: (c: Category) => void;
  webLabel: string;
  nowMs: number;
}) {
  const cell = (value: number, label: string) => (
    <div className="lab-card" style={{ padding: '0.6rem 0.7rem', minWidth: 0 }}>
      <div style={{ fontSize: '1.125rem' }}>{fmtInt(value)}</div>
      <div className="lab-text-2" style={{ fontSize: '0.8rem' }}>
        {label}
      </div>
    </div>
  );
  return (
    <div className={`lab-page${d.state === 'delayed' ? ' lab-dim' : ''}`} style={{ gap: '1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0.5rem' }}>
        {cell(d.totals.events, 'events 24 h')}
        {cell(d.totals.sources, 'sources')}
        {cell(d.totals.countries, 'countries')}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <GlobeSlot d={d} maxSize={300} labels="none" subscribe={subscribe} hidden={hidden} />
        {!replaying && d.state === 'live' && <FeedPaused />}
      </div>
      <CategoryLegend variant="grid" counts={d.totals.by_category} hidden={hidden} onToggle={onToggle} />
      <div className="lab-card">
        <ThreatFeed lines={lines.slice(-10)} webLabel={webLabel} rows={10} />
      </div>
      <HourlyByCategory d={d} />
      <TopCountries d={d} count={20} />
      <Credentials d={d} count={10} />
      <TopNetworks d={d} />
      <TopPairs d={d} />
      <Behaviors d={d} />
      <Cves d={d} />
      <Malware d={d} nowMs={nowMs} />
      <AiAgents d={d} />
      <Signatures d={d} />
      <LabAttribution />
    </div>
  );
}
