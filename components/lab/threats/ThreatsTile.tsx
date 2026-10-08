'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { ContentType } from '@/contexts/FocusContext';
import { FONT_SIZES } from '@/lib/constants/typography';
import type { Category } from '@/lib/lab/types';
import { LabHeader, LabStateLine } from '@/components/lab/shared/LabHeader';
import { LabAttribution } from '@/components/lab/shared/LabAttribution';
import { CategoryLegend, toggleHidden } from './CategoryLegend';
import { FeedPaused, GlobeSlot } from './GlobeSlot';
import { REPLAY_RECENCY } from './ReplayClock';
import { ThreatFeed } from './ThreatFeed';
import { TileSummary } from './stats/Summary';
import { useReplayFeed } from './useReplayFeed';
import { useThreats } from './useThreats';

const box: React.CSSProperties = { border: '1px solid var(--theme-border)', padding: '0.9rem 1rem', minWidth: 0 };

/** `~/lab/threats` in the content tile (THREATS_VIEW.md §4.1, concept tile-threats). */
export default function ThreatsTile(_props: { onNavigate?: (content: ContentType) => void }) {
  const t = useThreats();
  const [hidden, setHidden] = useState<ReadonlySet<Category>>(() => new Set());
  const feed = useReplayFeed(t.live, t.replaying, t.serverOffsetMs, hidden);
  const d = t.digest;
  const webLabel = d?.targets.find((x) => x.id === 'web')?.label ?? 'web';

  return (
    <section className="lab-root" aria-label="Lab threat map" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <LabHeader
        title="~/lab/threats"
        state={t.view === 'loading' ? null : t.view}
        ageS={t.ageS}
        receivedAt={t.receivedAt}
        demo={t.demo}
        titleSize={FONT_SIZES.xl}
        badgeSize={FONT_SIZES.xs}
      />
      <p className="lab-text-2" style={{ margin: 0, fontSize: FONT_SIZES.sm }}>
        A honeypot I run on a small cloud VM. Every arc is a real attack from {REPLAY_RECENCY}. No IP addresses are
        shown.
      </p>

      {t.view === 'loading' && <LabStateLine>loading…</LabStateLine>}
      {!d && t.view === 'offline' && <LabStateLine offline>honeynet offline</LabStateLine>}

      {d && (
        <div className={d.state === 'delayed' ? 'lab-dim' : undefined} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: FONT_SIZES.xs }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 45%) minmax(0, 1fr)', gap: '1.5rem', alignItems: 'start' }}>
            <div>
              <GlobeSlot d={d} maxSize={360} labels="short" subscribe={feed.subscribe} hidden={hidden} />
              {!t.replaying && d.state === 'live' && <FeedPaused />}
            </div>
            <div>
              <p className="lab-text-2" style={{ margin: '0 0 0.6rem' }}>
                last 24 h · tap to filter
              </p>
              <CategoryLegend
                variant="column"
                counts={d.totals.by_category}
                hidden={hidden}
                onToggle={(c) => setHidden((h) => toggleHidden(h, c))}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.35fr) minmax(0, 1fr)', gap: '1rem', alignItems: 'stretch' }}>
            <div style={box}>
              <p style={{ margin: '0 0 0.5rem', color: 'var(--theme-text)' }}>$ journalctl -u honeynet -f</p>
              <ThreatFeed lines={feed.lines} webLabel={webLabel} rows={8} />
            </div>
            <div style={{ ...box, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
              <TileSummary d={d} />
              <Link href="/lab/threats" className="lab-link" style={{ whiteSpace: 'nowrap' }} onClick={(e) => e.stopPropagation()}>
                full page → /lab/threats
              </Link>
            </div>
          </div>

          <LabAttribution />
        </div>
      )}
    </section>
  );
}
