import React from 'react';
import { Meter } from '@/components/lab/shared/Meter';
import { Sparkline } from '@/components/lab/shared/Sparkline';
import {
  DASH,
  fmtCelsius,
  fmtDecimal,
  fmtDuration,
  fmtInt,
  fmtPct1,
  fmtRate,
  fmtTB,
  fmtUsd,
  costAtDraw,
  fmtPerDay,
} from '@/lib/lab/format';
import { COST_NOTE, drawNote } from '@/lib/lab/names';
import type { NowDoc } from '@/lib/lab/schemas/telemetry';

// The public telemetry added in homelab PR #28 (TELEMETRY_VIEW.md §5): cost, the lab health
// line, airflow, the NAS and CI blocks and the GPU video engines. A `null` section hides its
// block (it is not zero); a `null` value inside one renders as a dash.

type Lab = NowDoc['lab'];
type Host = NowDoc['hosts'][number];
type Gpu = NowDoc['gpus'][number];
type Series = (number | null)[] | null;

/** `≈ $4.96`, the rate it was priced at as its tooltip. */
export function Cost({ usd, suffix = '' }: { usd: number | null; suffix?: string }) {
  if (usd === null) return <span>{DASH}</span>;
  return (
    <span title={COST_NOTE}>
      {fmtUsd(usd)}
      {suffix}
    </span>
  );
}

/**
 * "≈ $3.70/day at this draw": the current power priced at the published rate. Hidden while the
 * rate is unknown (a now.json from before homelab PR #32) or the power is.
 */
export function AtDraw({ watts, rate, style }: { watts: number | null | undefined; rate: number | null | undefined; style?: React.CSSProperties }) {
  const cost = costAtDraw(watts ?? null, rate ?? null);
  if (!cost || rate == null) return null;
  return (
    <span className="lab-text-2" title={drawNote(rate)} style={style}>
      ≈ {fmtPerDay(cost.perDay)} at this draw
    </span>
  );
}

const counted = (n: number | null, one: string, many: string) => `${fmtInt(n)} ${n === 1 ? one : many}`;
const ofTotal = (part: number | null, total: number | null) => `${fmtInt(part)}/${fmtInt(total)}`;

/** `6 VMs · 27/27 targets up · 0 alerts · 20/20 disks healthy · hottest disk 31 °C` */
export function HealthLine({ lab, style }: { lab: Lab; style?: React.CSSProperties }) {
  const alerts = counted(lab.alerts_firing, 'alert', 'alerts');
  const parts: React.ReactNode[] = [
    counted(lab.vms_running, 'VM', 'VMs'),
    `${ofTotal(lab.targets_up, lab.targets_total)} targets up`,
    // Firing alerts show only as a count, in the warning colour: their names stay private.
    lab.alerts_firing !== null && lab.alerts_firing > 0 ? (
      <span style={{ color: 'var(--theme-warning)' }}>{alerts}</span>
    ) : (
      alerts
    ),
    `${ofTotal(lab.disks_healthy, lab.disks)} disks healthy`,
    `hottest disk ${fmtCelsius(lab.drive_temp_max_c)}`,
  ];
  return (
    <p className="lab-health" style={style}>
      {parts.map((p, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="lab-text-2"> · </span>}
          <span style={{ whiteSpace: 'nowrap' }}>{p}</span>
        </React.Fragment>
      ))}
    </p>
  );
}

/** Exhaust minus inlet; unknown when either is. */
export function airflowDelta(h: Pick<Host, 'inlet_c' | 'exhaust_c'>): number | null {
  return h.inlet_c === null || h.exhaust_c === null ? null : h.exhaust_c - h.inlet_c;
}

/** The Quadro's encoder runs while Plex transcodes. A load, never a count of streams. */
export function isTranscoding(g: Gpu): boolean {
  return g.role === 'storage' && g.enc_ratio !== null && g.enc_ratio > 0;
}

export function TranscodingBadge() {
  return (
    <span className="lab-tag" title="the Quadro's video encoder is busy (a load, not a count of streams)">
      transcoding
    </span>
  );
}

function PoolStatus({ healthy }: { healthy: boolean | null }) {
  if (healthy === null) return <span>{DASH}</span>;
  return (
    <span style={{ color: healthy ? 'var(--theme-success)' : 'var(--theme-error)', whiteSpace: 'nowrap' }}>
      <span aria-hidden="true">●</span> {healthy ? 'healthy' : 'degraded'}
    </span>
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="lab-subblock" aria-label={label}>
      <p className="lab-text-2 lab-subblock-title">{label}</p>
      <dl className="lab-kv">{children}</dl>
    </section>
  );
}

/** The T430's TrueNAS block: pool health and fill, read/write with 24 h sparklines, ARC hits. */
export function NasBlock({
  nas,
  storage,
  read24h,
  write24h,
}: {
  nas: NowDoc['nas'];
  storage: NowDoc['storage'];
  read24h: Series;
  write24h: Series;
}) {
  if (!nas) return null;
  return (
    <Block label="nas">
      <dt className="lab-text-2">pool</dt>
      <dd style={{ flexWrap: 'wrap', rowGap: '0.25rem' }}>
        <PoolStatus healthy={nas.pool_healthy} />
        {storage && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5em', whiteSpace: 'nowrap' }}>
            <Meter
              value={storage.total_bytes > 0 ? storage.used_bytes / storage.total_bytes : null}
              width="3.5rem"
              showValue={false}
            />
            {fmtTB(storage.used_bytes)} / {fmtTB(storage.total_bytes)} TB
          </span>
        )}
      </dd>
      <dt className="lab-text-2">read</dt>
      <dd>
        <span className="lab-rate">{fmtRate(nas.read_bytes_s)}</span>
        {read24h && <Sparkline values={read24h} height={20} />}
      </dd>
      <dt className="lab-text-2">write</dt>
      <dd>
        <span className="lab-rate">{fmtRate(nas.write_bytes_s)}</span>
        {write24h && <Sparkline values={write24h} height={20} />}
      </dd>
      <dt className="lab-text-2">ARC hit</dt>
      <dd>{fmtPct1(nas.arc_hit_ratio)}</dd>
    </Block>
  );
}

/** The R720xd's CI block: runners online, busy now with 24 h, runner-hours, the oldest queued job. */
export function CiBlock({ ci, busy24h }: { ci: NowDoc['ci']; busy24h: Series }) {
  if (!ci) return null;
  const queued = ci.queue_oldest_s !== null && ci.queue_oldest_s > 0;
  return (
    <Block label="ci">
      <dt className="lab-text-2">runners</dt>
      <dd>{ofTotal(ci.runners_online, ci.runners_total)} online</dd>
      <dt className="lab-text-2">busy</dt>
      <dd>
        <span className="lab-rate">{fmtInt(ci.runners_busy)} now</span>
        {busy24h && <Sparkline values={busy24h} height={20} />}
      </dd>
      <dt className="lab-text-2">24 h</dt>
      <dd>{fmtDecimal(ci.busy_hours_24h)} runner-hours</dd>
      {queued && (
        <>
          <dt className="lab-text-2">queue</dt>
          <dd>oldest job waiting {fmtDuration(ci.queue_oldest_s)}</dd>
        </>
      )}
    </Block>
  );
}
