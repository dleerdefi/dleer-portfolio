'use client';

import React from 'react';
import Link from 'next/link';
import { domainOf } from '@/lib/lab/chart';
import { fmtDecimal, fmtInt, withUnit } from '@/lib/lab/format';
import { LabHeader, LabStateLine } from '@/components/lab/shared/LabHeader';
import { LineChart } from '@/components/lab/shared/LineChart';
import { Sparkline } from '@/components/lab/shared/Sparkline';
import { Value } from '@/components/lab/shared/Value';
import { HostCard } from './HostCard';
import { GpuTable } from './TelemetryTables';
import { hostsText } from './HostsLine';
import { HistoryOr } from './TelemetryTile';
import { threatsTeaser, useTelemetry } from './useTelemetry';

const caption: React.CSSProperties = { color: 'var(--lab-text-2)', margin: '0 0 0.5rem' };

/** The body of /lab (TELEMETRY_VIEW.md §5.2, concept page-lab). */
export default function TelemetryPage() {
  const t = useTelemetry();
  const { now, history } = t;
  const teaser = threatsTeaser(t.threats);
  const powerDomain = history ? domainOf(...history.hosts.map((h) => h.power_w)) : null;
  const gpuUtil = (role: string, index: number) =>
    history?.gpus.find((g) => g.role === role && g.index === index)?.util_ratio ?? null;

  return (
    <section className="lab-root lab-page-width lab-page" aria-label="Lab telemetry">
      <LabHeader
        title="~/lab"
        state={t.view === 'loading' ? null : t.view}
        ageS={now?.age_s}
        receivedAt={t.receivedAt}
        demo={now?.demo}
        titleSize="1.75rem"
        badgeSize="0.875rem"
      />
      <p className="lab-text-2" style={{ margin: 0 }}>
        Three PowerEdge servers in my homelab, live: power from each server&apos;s iDRAC, load from Prometheus.
        Pushed every 30 s; nothing at home accepts a connection to serve this page.
      </p>

      {t.view === 'loading' && <LabStateLine>loading…</LabStateLine>}
      {t.view === 'offline' && <LabStateLine offline>lab offline</LabStateLine>}

      {now && (
        <div className={`lab-page${now.state === 'delayed' ? ' lab-dim' : ''}`}>
          <div className="lab-hero-grid">
            <div>
              <div style={{ fontSize: 'clamp(3.25rem, 2rem + 4vw, 4.5rem)', lineHeight: 1 }}>
                <Value text={fmtInt(now.lab.power_w)} unit="W" unitScale={0.4} />
              </div>
              <div className="lab-text-2" style={{ marginTop: '0.5rem' }}>
                at the wall, now
              </div>
              <div className="lab-stat-boxes">
                <div className="lab-card">
                  <div style={{ fontSize: '1.25rem' }}>{fmtDecimal(now.lab.energy_kwh_24h)}</div>
                  <div className="lab-text-2">kWh, 24 h</div>
                </div>
                <div className="lab-card">
                  <div style={{ fontSize: '1.25rem' }}>{hostsText(now.lab.hosts_up, now.lab.hosts_expected)}</div>
                  <div className="lab-text-2">hosts up</div>
                </div>
              </div>
            </div>
            <figure style={{ margin: 0, minWidth: 0 }}>
              <figcaption style={caption}>lab power, last 24 h</figcaption>
              <HistoryOr
                history={history}
                offline={t.historyOffline}
                height={200}
                render={(h) => (
                  <LineChart
                    values={h.lab.power_w}
                    stepS={h.step_s}
                    height={200}
                    format={(v) => withUnit(v, 'W')}
                    ariaLabel={chartLabel(h.lab.power_w)}
                  />
                )}
              />
            </figure>
          </div>

          <div className="lab-host-cards">
            {now.hosts.map((host, i) => (
              <HostCard
                key={host.role}
                host={host}
                power24h={history?.hosts[i].power_w ?? null}
                cpu24h={history?.hosts[i].cpu_ratio ?? null}
                powerDomain={powerDomain}
                storage={host.role === 'storage' ? now.storage : null}
                media={host.role === 'storage' ? now.media : null}
              />
            ))}
          </div>

          {now.gpus.length > 0 && (
            <div className="lab-card" style={{ overflowX: 'auto' }}>
              <GpuTable
                gpus={now.gpus}
                full
                sparkline={(role, index) => {
                  const s = gpuUtil(role, index);
                  return s ? <Sparkline values={s} domain={{ min: 0, max: 1 }} height={22} /> : null;
                }}
              />
            </div>
          )}
        </div>
      )}

      {teaser && (
        <div className="lab-card" style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <span>
            <span aria-hidden="true" style={{ color: 'var(--accent-color)' }}>
              ❯{' '}
            </span>
            honeypot: <b>{fmtInt(teaser.events)}</b> events in 24 h from <b>{fmtInt(teaser.countries)}</b> countries
          </span>
          <Link href="/lab/threats" className="lab-link" style={{ textDecoration: 'none' }}>
            ~/lab/threats →
          </Link>
        </div>
      )}
    </section>
  );
}

function chartLabel(series: (number | null)[]): string {
  const known = series.filter((v): v is number => v !== null);
  if (known.length === 0) return 'Lab power, last 24 hours: no data';
  const lo = Math.min(...known);
  const hi = Math.max(...known);
  return `Lab power, last 24 hours: between ${withUnit(lo, 'W')} and ${withUnit(hi, 'W')}, latest ${withUnit(known[known.length - 1], 'W')}`;
}
