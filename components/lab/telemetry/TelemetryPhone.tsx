'use client';

import React from 'react';
import Link from 'next/link';
import { fmtCelsius, fmtInt, fmtKwh, fmtWatts } from '@/lib/lab/format';
import { HOSTS, gpuName } from '@/lib/lab/names';
import { LabStateLine } from '@/components/lab/shared/LabHeader';
import { Meter } from '@/components/lab/shared/Meter';
import { Sparkline } from '@/components/lab/shared/Sparkline';
import { Value } from '@/components/lab/shared/Value';
import { Down } from './TelemetryTables';
import { HistoryOr } from './TelemetryTile';
import { threatsTeaser, type useTelemetry } from './useTelemetry';

/** /lab below 1024 px (TELEMETRY_VIEW.md §5.3, concept mobile-lab). */
export function TelemetryPhone({ t }: { t: ReturnType<typeof useTelemetry> }) {
  const { now } = t;
  const teaser = threatsTeaser(t.threats);
  return (
    <>
      {t.view === 'loading' && <LabStateLine>loading…</LabStateLine>}
      {t.view === 'offline' && <LabStateLine offline>lab offline</LabStateLine>}
      {now && (
        <div className={`lab-page${now.state === 'delayed' ? ' lab-dim' : ''}`} style={{ gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '3.25rem', lineHeight: 1 }}>
                <Value text={fmtInt(now.lab.power_w)} unit="W" unitScale={0.4} />
              </div>
              <div className="lab-text-2" style={{ marginTop: '0.4rem' }}>
                at the wall, now
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div>{fmtKwh(now.lab.energy_kwh_24h)} 24 h</div>
              <div>
                {now.lab.hosts_up}/{now.lab.hosts_expected} hosts up
              </div>
            </div>
          </div>

          <div>
            <p className="lab-text-2" style={{ margin: '0 0 0.4rem' }}>
              power, last 24 h
            </p>
            <HistoryOr history={t.history} offline={t.historyOffline} render={(h) => <Sparkline values={h.lab.power_w} height={64} />} />
          </div>

          {now.hosts.map((h) => (
            <section key={h.role} className="lab-card" style={{ opacity: h.up ? 1 : 0.5 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                <span className="font-bold">
                  {HOSTS[h.role].name}
                  {!h.up && <Down />}
                </span>
                <span>{fmtWatts(h.up ? h.power_w : null)}</span>
              </div>
              <div className="lab-phone-meters">
                <span className="lab-text-2">cpu</span>
                <Meter value={h.up ? h.cpu_ratio : null} width="100%" />
                <span className="lab-text-2">mem</span>
                <Meter value={h.up ? h.mem_ratio : null} width="100%" />
              </div>
            </section>
          ))}

          {now.gpus.length > 0 && (
            <section className="lab-card" aria-label="GPUs">
              <table className="lab-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {now.gpus.map((g) => (
                    <tr key={`${g.role}:${g.index}`}>
                      <th scope="row" style={{ color: 'var(--theme-text)', whiteSpace: 'nowrap' }}>
                        {gpuName(g.role, g.index)}
                      </th>
                      <td style={{ width: '45%' }}>
                        <Meter value={g.util_ratio} width="100%" />
                      </td>
                      <td className="lab-num">{fmtCelsius(g.temp_c)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}
        </div>
      )}
      {teaser && (
        <div className="lab-card" style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <span>honeypot · {fmtInt(teaser.events)} events</span>
          <Link href="/lab/threats" className="lab-link" style={{ textDecoration: 'none' }}>
            threats →
          </Link>
        </div>
      )}
    </>
  );
}
