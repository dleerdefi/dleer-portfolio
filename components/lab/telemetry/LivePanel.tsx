'use client';

import React, { useRef } from 'react';
import { useLabData } from '@/hooks/useLabData';
import { useOnScreen } from '@/hooks/useOnScreen';
import { lastPointMs, windowText } from '@/lib/lab/live';
import { costAtDraw, fmtPct, fmtPerDay, fmtPerHour, withUnit } from '@/lib/lab/format';
import { HOSTS, drawNote, gpuName } from '@/lib/lab/names';
import type { TelemetryLiveDoc } from '@/lib/lab/schemas/telemetry';
import type { LabPayload } from '@/lib/lab/types';
import { LabStatusBadge } from '@/components/lab/shared/LabStatusBadge';
import { LiveChart } from '@/components/lab/shared/LiveChart';

type Live = Extract<LabPayload<TelemetryLiveDoc>, { state: 'live' | 'delayed' }>;

const RATIO = { min: 0, max: 1 };
const caption: React.CSSProperties = { color: 'var(--lab-text-2)', margin: 0 };

/**
 * /lab's "last 10 minutes" panel (LAB_UI_SPEC.md §6): v1/live.json, polled every 10 s only
 * while the panel is near the viewport (and the tab visible): lab power large, then each host's
 * CPU and each GPU's utilisation as small multiples on one 0–100 % scale.
 */
/** `rate`: now.json's electricity price, for the cost of the latest point (hidden while null). */
export function LivePanel({ rate = null }: { rate?: number | null }) {
  const box = useRef<HTMLElement>(null);
  const onScreen = useOnScreen(box);
  const { payload, error } = useLabData<LabPayload<TelemetryLiveDoc>>('/api/lab/status/live', 10_000, {
    enabled: onScreen,
  });
  const live = payload && payload.state !== 'offline' ? (payload as Live) : null;
  const offline = payload?.state === 'offline' || (payload === null && error);

  return (
    <section ref={box} className="lab-card lab-live" aria-label="Lab, last 10 minutes" style={{ minHeight: 360 }}>
      <header className="lab-live-head">
        <h2 style={{ fontSize: '1rem', margin: 0 }}>
          Last {live ? windowText((live.points - 1) * live.step_s) : '10 minutes'}
        </h2>
        {(live || offline) && <LabStatusBadge state={live ? live.state : 'offline'} compact announce={false} />}
      </header>
      {offline && <p style={caption}>The live feed is offline; the 24 h charts above still show the day.</p>}
      {live && <LiveCharts live={live} rate={rate} />}
    </section>
  );
}

function LiveCharts({ live, rate }: { live: Live; rate: number | null }) {
  const lastMs = lastPointMs(live);
  const minutes = Math.round(((live.points - 1) * live.step_s) / 60);
  const xLabels: [string, string, string] = [`-${minutes} min`, `-${minutes / 2} min`, 'now'];
  const shared = { lastMs, stepS: live.step_s };
  const power = live.lab.power_w;

  return (
    <div className={live.state === 'delayed' ? 'lab-dim' : undefined} style={{ display: 'grid', gap: '1rem' }}>
      <figure style={{ margin: 0 }}>
        <figcaption style={caption}>
          lab power <span style={{ color: 'var(--theme-text)' }}>{withUnit(latest(power), 'W')}</span>
          <LiveCost watts={latest(power)} rate={rate} />
        </figcaption>
        <LiveChart
          {...shared}
          values={power}
          height={160}
          axes
          xLabels={xLabels}
          ariaLabel={rangeLabel('Lab power', power, (v) => withUnit(v, 'W'), minutes)}
        />
      </figure>
      <div className="lab-live-multiples">
        <Multiples
          title="CPU by host"
          rows={live.hosts.map((h) => ({
            key: h.role,
            label: HOSTS[h.role].short,
            values: h.cpu_ratio,
          }))}
          shared={shared}
          minutes={minutes}
        />
        {live.gpus.length > 0 && (
          <Multiples
            title="GPU utilisation"
            rows={live.gpus.map((g) => ({
              key: `${g.role}-${g.index}`,
              label: gpuName(g.role, g.index),
              values: g.util_ratio,
            }))}
            shared={shared}
            minutes={minutes}
          />
        )}
      </div>
    </div>
  );
}

function Multiples({
  title,
  rows,
  shared,
  minutes,
}: {
  title: string;
  rows: { key: string; label: string; values: (number | null)[] }[];
  shared: { lastMs: number; stepS: number };
  minutes: number;
}) {
  return (
    <figure style={{ margin: 0, minWidth: 0 }}>
      <figcaption style={caption}>{title}, 0–100 %</figcaption>
      <div className="lab-live-rows">
        {rows.map((r) => (
          <div key={r.key} className="lab-live-row">
            <span className="lab-text-2">{r.label}</span>
            <LiveChart
              {...shared}
              values={r.values}
              height={32}
              domain={RATIO}
              ariaLabel={rangeLabel(`${title}: ${r.label}`, r.values, fmtPct, minutes)}
            />
            <span style={{ textAlign: 'right' }}>{fmtPct(latest(r.values))}</span>
          </div>
        ))}
      </div>
    </figure>
  );
}

/** " · $0.154/h · $3.70/day": the latest point priced at the rate; it moves every 10 s. */
export function LiveCost({ watts, rate }: { watts: number | null; rate: number | null }) {
  const cost = costAtDraw(watts, rate);
  if (!cost || rate === null) return null;
  return (
    <span title={drawNote(rate)}>
      {' '}
      · {fmtPerHour(cost.perHour)} · {fmtPerDay(cost.perDay)}
    </span>
  );
}

function latest(values: (number | null)[]): number | null {
  for (let i = values.length - 1; i >= 0; i--) if (values[i] !== null) return values[i];
  return null;
}

function rangeLabel(what: string, values: (number | null)[], format: (v: number) => string, minutes: number): string {
  const known = values.filter((v): v is number => v !== null);
  if (known.length === 0) return `${what}, last ${minutes} minutes: no data`;
  return `${what}, last ${minutes} minutes: between ${format(Math.min(...known))} and ${format(Math.max(...known))}, latest ${format(known[known.length - 1])}`;
}
