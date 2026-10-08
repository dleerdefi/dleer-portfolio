import React from 'react';
import { Meter } from '@/components/lab/shared/Meter';
import { Sparkline } from '@/components/lab/shared/Sparkline';
import { Value } from '@/components/lab/shared/Value';
import type { Domain } from '@/lib/lab/chart';
import { DASH, fmtCelsius, fmtInt, fmtTB } from '@/lib/lab/format';
import { HOSTS } from '@/lib/lab/names';
import type { NowDoc } from '@/lib/lab/schemas/telemetry';
import { Down } from './TelemetryTables';

type Host = NowDoc['hosts'][number];

/**
 * One server on /lab: name and job, watts with its 24 h power sparkline (shared domain across
 * the three cards), cpu meter and sparkline (0–1), mem, inlet; on the T430 the storage pool and
 * Plex lines when those reserved fields are filled.
 */
export function HostCard({
  host,
  power24h,
  cpu24h,
  powerDomain,
  storage,
  media,
}: {
  host: Host;
  power24h: (number | null)[] | null;
  cpu24h: (number | null)[] | null;
  powerDomain: Domain | null;
  storage?: NowDoc['storage'];
  media?: NowDoc['media'];
}) {
  const up = host.up;
  const name = HOSTS[host.role];
  const v = <T,>(x: T) => (up ? x : null);
  return (
    <article className="lab-card" style={{ opacity: up ? 1 : 0.5 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
        <h3 className="font-bold" style={{ margin: 0, fontSize: '1rem' }}>
          {name.name}
          {!up && <Down />}
        </h3>
        <span className="lab-text-2">{name.job}</span>
      </header>
      <div className="lab-host-row">
        <div>
          <div style={{ fontSize: '1.75rem', lineHeight: 1.1 }}>
            <Value text={fmtInt(v(host.power_w))} unit="W" unitScale={0.5} />
          </div>
          <div className="lab-text-2">power</div>
        </div>
        {power24h && <Sparkline values={power24h} domain={powerDomain} height={36} />}
      </div>
      <dl className="lab-kv">
        <dt className="lab-text-2">cpu</dt>
        <dd>
          <Meter value={v(host.cpu_ratio)} width="6rem" />
          {cpu24h && <Sparkline values={cpu24h} domain={{ min: 0, max: 1 }} height={22} />}
        </dd>
        <dt className="lab-text-2">mem</dt>
        <dd>
          <Meter value={v(host.mem_ratio)} width="6rem" />
        </dd>
        <dt className="lab-text-2">inlet</dt>
        <dd>{fmtCelsius(v(host.inlet_c))}</dd>
        {storage && (
          <>
            <dt className="lab-text-2">pool</dt>
            <dd>
              <Meter value={storage.total_bytes > 0 ? storage.used_bytes / storage.total_bytes : null} width="4rem" showValue={false} />
              <span style={{ whiteSpace: 'nowrap' }}>
                {fmtTB(storage.used_bytes)} / {fmtTB(storage.total_bytes)} TB
              </span>
            </dd>
          </>
        )}
        {media && (
          <>
            <dt className="lab-text-2">plex</dt>
            <dd style={{ flexWrap: 'wrap', columnGap: '0.5em', rowGap: 0 }}>
              <span style={{ whiteSpace: 'nowrap' }}>
                {media.streams === null ? DASH : `${media.streams} ${media.streams === 1 ? 'stream' : 'streams'}`} ·
              </span>
              <span style={{ whiteSpace: 'nowrap' }}>
                {media.transcodes === null ? DASH : `${media.transcodes} transcoding`}
              </span>
            </dd>
          </>
        )}
      </dl>
    </article>
  );
}
