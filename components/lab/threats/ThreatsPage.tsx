'use client';

import React, { useState } from 'react';
import type { Category } from '@/lib/lab/types';
import { LabHeader, LabStateLine } from '@/components/lab/shared/LabHeader';
import { LabAttribution } from '@/components/lab/shared/LabAttribution';
import { CategoryLegend, toggleHidden } from './CategoryLegend';
import { FeedPaused, GlobeSlot } from './GlobeSlot';
import { ThreatFeed } from './ThreatFeed';
import { AiAgents, Behaviors, Cves, Malware, Signatures } from './stats/Activity';
import { Credentials, TopCountries, TopNetworks, TopPairs } from './stats/Lists';
import { HourlyByCategory, LastDay } from './stats/Summary';
import { useReplayFeed } from './useReplayFeed';
import { useThreats } from './useThreats';

/** The body of /lab/threats (THREATS_VIEW.md §4.2, concept page-threats). */
export default function ThreatsPage() {
  const t = useThreats();
  const [hidden, setHidden] = useState<ReadonlySet<Category>>(() => new Set());
  const feed = useReplayFeed(t.live, t.replaying, t.serverOffsetMs, hidden);
  const d = t.digest;
  const webLabel = d?.targets.find((x) => x.id === 'web')?.label ?? 'web';
  const serverNow = Date.now() + (t.serverOffsetMs ?? 0);

  return (
    <section className="lab-root lab-page-width lab-page" aria-label="Lab threat map">
      <LabHeader
        title="~/lab/threats"
        state={t.view === 'loading' ? null : t.view}
        ageS={t.ageS}
        receivedAt={t.receivedAt}
        demo={t.demo}
        titleSize="1.75rem"
        badgeSize="0.875rem"
      />
      <p className="lab-text-2" style={{ margin: 0 }}>
        A honeypot I run on a small cloud VM, plus decoy paths on this site. Every arc is a real attack from the last
        few minutes. No IP addresses are shown.
      </p>

      {t.view === 'loading' && <LabStateLine>loading…</LabStateLine>}
      {!d && t.view === 'offline' && <LabStateLine offline>honeynet offline</LabStateLine>}

      {d && (
        <div className={`lab-page${d.state === 'delayed' ? ' lab-dim' : ''}`}>
          <div className="lab-threats-grid">
            <div className="lab-threats-globe">
              <GlobeSlot d={d} maxSize={440} labels="full" subscribe={feed.subscribe} hidden={hidden} />
              {!t.replaying && d.state === 'live' && <FeedPaused />}
              <CategoryLegend
                variant="chips"
                counts={d.totals.by_category}
                hidden={hidden}
                onToggle={(c) => setHidden((h) => toggleHidden(h, c))}
              />
            </div>
            <div className="lab-stack">
              <LastDay d={d} />
              <HourlyByCategory d={d} />
              <TopCountries d={d} count={5} />
              <Credentials d={d} count={4} />
            </div>
          </div>

          <div className="lab-card">
            <ThreatFeed lines={feed.lines} webLabel={webLabel} full rows={5} columns={2} />
          </div>
          <LabAttribution />

          <div className="lab-two-col">
            <TopCountries d={d} count={20} withSources />
            <div className="lab-stack">
              <TopNetworks d={d} />
              <TopPairs d={d} />
            </div>
            <Behaviors d={d} />
            <div className="lab-stack">
              <Cves d={d} />
              <AiAgents d={d} />
            </div>
            <Malware d={d} nowMs={serverNow} />
            <Signatures d={d} />
          </div>
        </div>
      )}
    </section>
  );
}
