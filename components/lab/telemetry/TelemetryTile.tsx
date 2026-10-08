'use client';

import React from 'react';
import Link from 'next/link';
import type { ContentType } from '@/contexts/FocusContext';
import { FONT_SIZES } from '@/lib/constants/typography';
import { domainOf } from '@/lib/lab/chart';
import { DASH, fmtInt, fmtKwh, fmtWatts } from '@/lib/lab/format';
import { HOSTS } from '@/lib/lab/names';
import { LabHeader, LabStateLine } from '@/components/lab/shared/LabHeader';
import { Sparkline } from '@/components/lab/shared/Sparkline';
import { Value } from '@/components/lab/shared/Value';
import { HostTable, GpuTable } from './TelemetryTables';
import { HostsGlyph, hostsText } from './HostsLine';
import { threatsTeaser, useTelemetry, type HistoryLive } from './useTelemetry';

const caption: React.CSSProperties = { color: 'var(--lab-text-2)', fontSize: FONT_SIZES.xs, margin: '0 0 0.4rem' };

/** `~/lab/telemetry` in the content tile (TELEMETRY_VIEW.md §5.1, concept tile-telemetry). */
export default function TelemetryTile({ onNavigate }: { onNavigate?: (content: ContentType) => void }) {
  const t = useTelemetry();
  const { now } = t;
  const teaser = threatsTeaser(t.threats);

  return (
    <section className="lab-root" aria-label="Lab telemetry" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', minHeight: '100%' }}>
      <LabHeader
        title="~/lab/telemetry"
        state={t.view === 'loading' ? null : t.view}
        ageS={now?.age_s}
        receivedAt={t.receivedAt}
        demo={now?.demo}
        titleSize={FONT_SIZES.xl}
        badgeSize={FONT_SIZES.xs}
      />
      <p className="lab-text-2" style={{ margin: 0, fontSize: FONT_SIZES.sm }}>
        Three PowerEdge servers in my homelab, live. Power is read from each server&apos;s iDRAC.
      </p>

      {t.view === 'loading' && <LabStateLine>loading…</LabStateLine>}
      {t.view === 'offline' && <LabStateLine offline>lab offline</LabStateLine>}

      {now && (
        <div className={now.state === 'delayed' ? 'lab-dim' : undefined} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: FONT_SIZES.xs }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 'clamp(3rem, 2.4rem + 4cqi, 3.5rem)', lineHeight: 1, color: 'var(--theme-text)' }}>
                <Value text={fmtInt(now.lab.power_w)} unit="W" />
              </div>
              <div className="lab-text-2" style={{ marginTop: '0.5rem' }}>at the wall, now</div>
            </div>
            <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: 'auto auto', columnGap: '0.75em', rowGap: '0.3em', fontSize: FONT_SIZES.sm }}>
              <dt className="lab-text-2">24 h</dt>
              <dd style={{ margin: 0 }}>{fmtKwh(now.lab.energy_kwh_24h)}</dd>
              <dt className="lab-text-2">hosts</dt>
              <dd style={{ margin: 0 }}>
                {hostsText(now.lab.hosts_up, now.lab.hosts_expected)} up{' '}
                <HostsGlyph up={now.lab.hosts_up} expected={now.lab.hosts_expected} state={now.state} />
              </dd>
            </dl>
          </div>

          <div>
            <p style={caption}>power, last 24 h</p>
            <HistoryOr history={t.history} offline={t.historyOffline} render={(h) => <Sparkline values={h.lab.power_w} height={56} />} />
          </div>

          <HostTable hosts={now.hosts} />
          <GpuTable gpus={now.gpus} />

          <div>
            <p style={caption}>power by host, 24 h · same scale</p>
            <HistoryOr
              history={t.history}
              offline={t.historyOffline}
              render={(h) => <SmallMultiples history={h} watts={now.hosts.map((x) => (x.up ? x.power_w : null))} />}
            />
          </div>
        </div>
      )}

      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', fontSize: FONT_SIZES.xs }}>
        <Link href="/lab" className="lab-link" onClick={(e) => e.stopPropagation()}>
          full page → /lab
        </Link>
        {teaser && (
          <button
            type="button"
            className="lab-link"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate?.({ type: 'lab-threats' });
            }}
            style={{ background: 'none', border: 0, padding: 0, cursor: 'pointer', font: 'inherit' }}
          >
            honeypot: {fmtInt(teaser.events)} events / 24 h →
          </button>
        )}
      </div>
    </section>
  );
}

/** Charts need history: until it arrives they hold their height; offline, they say so. */
export function HistoryOr({
  history,
  offline,
  render,
  height = 56,
}: {
  history: HistoryLive | null;
  offline: boolean;
  render: (h: HistoryLive) => React.ReactNode;
  height?: number;
}) {
  if (history) return <>{render(history)}</>;
  if (offline) return <LabStateLine>history unavailable</LabStateLine>;
  return <div style={{ height }} aria-hidden="true" />;
}

function SmallMultiples({ history, watts }: { history: HistoryLive; watts: (number | null)[] }) {
  const series = history.hosts.map((h) => h.power_w);
  const domain = domainOf(...series);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1.25rem' }}>
      {history.hosts.map((h, i) => (
        <div key={h.role}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5em' }}>
            <span>{HOSTS[h.role].short}</span>
            <span>{watts[i] === null ? DASH : fmtWatts(watts[i])}</span>
          </div>
          <Sparkline values={series[i]} domain={domain} height={32} />
        </div>
      ))}
    </div>
  );
}
