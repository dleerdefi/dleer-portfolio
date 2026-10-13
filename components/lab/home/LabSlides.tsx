import React from 'react';
import { fmtCelsius, fmtCount, fmtInt, fmtKwh, fmtPct, fmtRate, fmtUsd } from '@/lib/lab/format';
import { categoryVar, gpuName, HOSTS } from '@/lib/lab/names';
import { CATEGORIES, type LabSummary } from '@/lib/lab/types';
import { Sparkline } from '@/components/lab/shared/Sparkline';
import { Swatch } from '@/components/lab/shared/Swatch';
import { Value } from '@/components/lab/shared/Value';

type Telemetry = LabSummary['telemetry'];
type Threats = NonNullable<LabSummary['threats']>;

/*
 * The bodies of the home page's lab card slides (LabTile.tsx), from /api/lab/summary: the power,
 * the hosts, the GPUs, storage and CI, the honeypot. Each is a few lines of headline numbers; the
 * full views are /lab and /lab/threats. `null` renders as a dash.
 */

/**
 * Figures joined by a dot ("cpu 12% · inlet 22 °C") that wrap between figures and never inside
 * one: every figure carries its dot, and the dot that would start a line sits in the clipped
 * margin (13-lab.css). A screen reader hears the dots between figures only.
 */
function Figs({ items, className }: { items: React.ReactNode[]; className?: string }) {
  return (
    <span className={className ? `lab-figs ${className}` : 'lab-figs'}>
      <span className="lab-figs-in">
        {items.filter(Boolean).map((item, i) => (
          <span key={i} className="lab-fig">
            <span className="lab-fig-sep" aria-hidden={i === 0 || undefined}>
              {' · '}
            </span>
            {item}
          </span>
        ))}
      </span>
    </span>
  );
}

/** A row's name and, after it, dimmed, what it is; the second part wraps whole */
function RowName({ name, note }: { name: string; note: string }) {
  return (
    <span className="lab-row-name">
      {name} <span className="lab-text-2 lab-nowrap">{note}</span>
    </span>
  );
}

export function PowerSlide({ tel }: { tel: Telemetry }) {
  return (
    <span className={tel.state === 'delayed' ? 'lab-slide-body lab-dim' : 'lab-slide-body'}>
      <span className="lab-slide-power">
        <span style={{ fontSize: '2.125rem', lineHeight: 1 }}>
          <Value text={fmtInt(tel.power_w)} unit="W" unitScale={0.5} />
        </span>
        <Figs
          className="lab-slide-stats lab-text-2"
          items={[
            `${fmtKwh(tel.energy_kwh_24h)} / 24 h`,
            typeof tel.energy_cost_usd_24h === 'number' && `${fmtUsd(tel.energy_cost_usd_24h)}/day`,
            `${tel.hosts_up}/${tel.hosts_expected} hosts up`,
          ]}
        />
      </span>
      {tel.power_24h && <Sparkline values={tel.power_24h} height={40} />}
    </span>
  );
}

export function HostsSlide({ hosts }: { hosts: NonNullable<Telemetry['hosts']> }) {
  return (
    <span className="lab-slide-body lab-rows">
      {hosts.map((h) => (
        <span key={h.role} className="lab-row">
          <RowName name={HOSTS[h.role].short} note={HOSTS[h.role].job} />
          {h.up ? (
            <Figs
              items={[
                `cpu ${fmtPct(h.cpu_ratio)}`,
                <>
                  <span className="lab-wide">inlet </span>
                  {fmtCelsius(h.inlet_c)}
                </>,
              ]}
            />
          ) : (
            <span className="lab-row-figures" style={{ color: 'var(--theme-error)' }}>
              down
            </span>
          )}
        </span>
      ))}
    </span>
  );
}

export function GpusSlide({ gpus }: { gpus: NonNullable<Telemetry['gpus']> }) {
  return (
    <span className="lab-slide-body lab-rows">
      {gpus.map((g) => (
        <span key={`${g.role}:${g.index}`} className="lab-row">
          <RowName name={gpuName(g.role, g.index)} note={HOSTS[g.role].short} />
          <Figs
            items={[
              `util ${fmtPct(g.util_ratio)}`,
              fmtCelsius(g.temp_c),
              typeof g.enc_ratio === 'number' && g.enc_ratio > 0 && `enc ${fmtPct(g.enc_ratio)}`,
            ]}
          />
        </span>
      ))}
    </span>
  );
}

export function StorageSlide({ nas, ci }: { nas: Telemetry['nas']; ci: Telemetry['ci'] }) {
  return (
    <span className="lab-slide-body lab-rows">
      {nas && (
        <span className="lab-row">
          <RowName name="NAS" note={HOSTS.storage.short} />
          <span className="lab-row-figures">
            pool{' '}
            {nas.pool_healthy === null ? '—' : nas.pool_healthy ? 'healthy' : <span style={{ color: 'var(--theme-error)' }}>degraded</span>}
          </span>
          <Figs className="lab-text-2" items={[`read ${fmtRate(nas.read_bytes_s)}`, `write ${fmtRate(nas.write_bytes_s)}`]} />
        </span>
      )}
      {ci && (
        <span className="lab-row">
          <RowName name="CI runners" note={HOSTS.apps.short} />
          <Figs items={[`${fmtInt(ci.runners_online)}/${fmtInt(ci.runners_total)} online`, `${fmtInt(ci.runners_busy)} busy`]} />
        </span>
      )}
    </span>
  );
}

export function HoneypotSlide({ thr }: { thr: Threats }) {
  const counts = thr.by_category;
  const top = counts ? [...CATEGORIES].sort((a, b) => counts[b] - counts[a]).slice(0, 3) : [];
  const max = counts && top.length ? counts[top[0]] || 1 : 1;
  return (
    <span className={thr.state === 'delayed' ? 'lab-slide-body lab-dim' : 'lab-slide-body'}>
      <span>
        <span style={{ fontSize: '1.5rem' }}>{fmtInt(thr.events)}</span>{' '}
        <span className="lab-text-2">
          events in 24 h from <b style={{ color: 'var(--theme-text)' }}>{fmtInt(thr.countries)}</b> countries
        </span>
      </span>
      {counts && (
        <span className="lab-bars">
          {top.map((c) => (
            <React.Fragment key={c}>
              <span className="lab-bars-name">
                <Swatch category={c} />
                <span className="lab-ellipsis">{c}</span>
              </span>
              <span className="lab-bar" aria-hidden="true">
                <span style={{ display: 'block', height: '100%', width: `${counts[c] > 0 ? Math.max(2, (counts[c] / max) * 100) : 0}%`, background: categoryVar(c) }} />
              </span>
              <span style={{ textAlign: 'right' }}>{fmtCount(counts[c])}</span>
            </React.Fragment>
          ))}
        </span>
      )}
    </span>
  );
}
