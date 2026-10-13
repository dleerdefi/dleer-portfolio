'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { domainOf } from '@/lib/lab/chart';
import { fmtDecimal, fmtInt, withUnit } from '@/lib/lab/format';
import { COST_NOTE } from '@/lib/lab/names';
import { LabFramedHeader } from '@/components/lab/LabFramedHeader';
import { LabHeader, LabStateLine } from '@/components/lab/shared/LabHeader';
import { LabStatusBadge } from '@/components/lab/shared/LabStatusBadge';
import { useNarrow } from '@/components/lab/shared/useNarrow';
import { LineChart } from '@/components/lab/shared/LineChart';
import { Sparkline } from '@/components/lab/shared/Sparkline';
import { Value } from '@/components/lab/shared/Value';
import { HostCard } from './HostCard';
import { Cost, HealthLine } from './LabExtras';
import { GpuTable } from './TelemetryTables';
import { hostsText } from './HostsLine';
import { HistoryOr } from './TelemetryTile';
import { LabHowItWorks } from './LabHowItWorks';
import { TelemetryPhone } from './TelemetryPhone';
import { threatsTeaser, useTelemetry } from './useTelemetry';

const caption: React.CSSProperties = { color: 'var(--lab-text-2)', margin: '0 0 0.5rem' };

/** The body of /lab (TELEMETRY_VIEW.md §5.2, concept page-lab). */
export default function TelemetryPage() {
  const t = useTelemetry();
  const narrow = useNarrow();
  const { now, history } = t;
  const teaser = threatsTeaser(t.threats);
  const powerDomain = history ? domainOf(...history.hosts.map((h) => h.power_w)) : null;
  const gpuSeries = (role: string, index: number) => history?.gpus.find((g) => g.role === role && g.index === index);
  const ratioSparkline = (s: (number | null)[] | undefined) =>
    s ? <Sparkline values={s} domain={{ min: 0, max: 1 }} height={22} /> : null;

  const state = t.view === 'loading' ? null : t.view;
  // The home page's lab card links to /lab#hosts and /lab#gpus, which exist only once the data has
  // arrived: scroll to them then, once
  const hasData = Boolean(now);
  useEffect(() => {
    if (!hasData || !window.location.hash) return;
    document.getElementById(window.location.hash.slice(1))?.scrollIntoView({ block: 'start' });
  }, [hasData]);
  return (
    <>
      <LabFramedHeader
        current="telemetry"
        aside={<LabStatusBadge state={state} compact demo={now?.demo} style={{ fontSize: '0.8rem' }} />}
      />
      <section className="lab-root lab-page-width lab-page" aria-label="Lab telemetry">
        <LabHeader
          title="~/lab"
          state={narrow ? null : state}
          ageS={now?.age_s}
          receivedAt={t.receivedAt}
          demo={narrow ? false : now?.demo}
          titleSize="1.75rem"
          badgeSize="0.875rem"
        />
        {narrow ? (
          <TelemetryPhone t={t} />
        ) : (
          <>
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
                        <div className="lab-text-2" style={{ marginTop: '0.2rem' }}>
                          <Cost usd={now.lab.energy_cost_usd_24h} />
                          <sup aria-hidden="true">*</sup>
                        </div>
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

                <HealthLine lab={now.lab} />

                <div className="lab-host-cards" id="hosts">
                  {now.hosts.map((host, i) => (
                    <HostCard
                      key={host.role}
                      host={host}
                      power24h={history?.hosts[i].power_w ?? null}
                      cpu24h={history?.hosts[i].cpu_ratio ?? null}
                      powerDomain={powerDomain}
                      storage={host.role === 'storage' ? now.storage : null}
                      media={host.role === 'storage' ? now.media : null}
                      nas={host.role === 'storage' ? now.nas : null}
                      nas24h={history?.nas ? { read: history.nas.read_bytes_s, write: history.nas.write_bytes_s } : null}
                      ci={host.role === 'apps' ? now.ci : null}
                      ciBusy24h={history?.ci?.runners_busy ?? null}
                    />
                  ))}
                </div>

                {now.gpus.length > 0 && (
                  <div className="lab-card" id="gpus" style={{ overflowX: 'auto' }}>
                    <GpuTable
                      gpus={now.gpus}
                      full
                      sparkline={(role, index) => ratioSparkline(gpuSeries(role, index)?.util_ratio)}
                      encSparkline={(role, index) => ratioSparkline(gpuSeries(role, index)?.enc_ratio)}
                    />
                  </div>
                )}

                <p className="lab-text-2" style={{ margin: 0, fontSize: '0.8rem' }}>
                  * ≈ $ per 24 h: {COST_NOTE}.
                </p>
              </div>
            )}

            {teaser && (
              <div
                className="lab-card"
                style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}
              >
                <span>
                  <span aria-hidden="true" style={{ color: 'var(--accent-text)' }}>
                    ❯{' '}
                  </span>
                  honeypot: <b>{fmtInt(teaser.events)}</b> events in 24 h from <b>{fmtInt(teaser.countries)}</b>{' '}
                  countries
                </span>
                <Link href="/lab/threats" className="lab-link" style={{ textDecoration: 'none' }}>
                  ~/lab/threats →
                </Link>
              </div>
            )}
          </>
        )}
        {/* After the first answer, so the numbers arriving never push it down (a layout shift) */}
        {t.view !== 'loading' && <LabHowItWorks />}
      </section>
    </>
  );
}

function chartLabel(series: (number | null)[]): string {
  const known = series.filter((v): v is number => v !== null);
  if (known.length === 0) return 'Lab power, last 24 hours: no data';
  const lo = Math.min(...known);
  const hi = Math.max(...known);
  return `Lab power, last 24 hours: between ${withUnit(lo, 'W')} and ${withUnit(hi, 'W')}, latest ${withUnit(known[known.length - 1], 'W')}`;
}
