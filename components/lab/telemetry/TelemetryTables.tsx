import React from 'react';
import { Meter } from '@/components/lab/shared/Meter';
import { fmtCelsius, fmtDeltaC, fmtPct, fmtWatts, withUnit } from '@/lib/lab/format';
import { HOSTS, gpuModel, gpuName } from '@/lib/lab/names';
import type { NowDoc } from '@/lib/lab/schemas/telemetry';
import { TranscodingBadge, airflowDelta, isTranscoding } from './LabExtras';

const meterWidth = 'clamp(2.5rem, 1.5rem + 5cqi, 4.5rem)';
// room for "100%" and no more, so the tile's tables fit
const valueWidth = '2.5em';

/**
 * One row per host: short name and role (fan and PSU input quietly under it), power, cpu and mem
 * meters, and air: inlet → exhaust with the airflow Δt under it (inlet alone where the BMC has no
 * exhaust sensor).
 */
export function HostTable({ hosts }: { hosts: NowDoc['hosts'] }) {
  return (
    <table className="lab-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th scope="col">host</th>
          <th scope="col" className="lab-num">power</th>
          <th scope="col">cpu</th>
          <th scope="col">mem</th>
          <th scope="col" className="lab-num" title="inlet → exhaust; Δt is exhaust minus inlet">
            air
          </th>
        </tr>
      </thead>
      <tbody>
        {hosts.map((h) => {
          const up = h.up;
          return (
            <tr key={h.role} style={{ opacity: up ? 1 : 0.5 }}>
              <th scope="row" style={{ color: 'var(--theme-text)', whiteSpace: 'nowrap' }}>
                <span className="font-bold">{HOSTS[h.role].short}</span>{' '}
                <span className="lab-text-2">{h.role}</span>
                {!up && <Down />}
                <div className="lab-text-2" style={{ fontSize: '0.85em', fontWeight: 400 }}>
                  fan {withUnit(up ? h.fan_rpm : null, 'rpm')} · psu {withUnit(up ? h.psu_in_v : null, 'V')}
                </div>
              </th>
              <td className="lab-num">{fmtWatts(up ? h.power_w : null)}</td>
              <td>
                <Meter value={up ? h.cpu_ratio : null} width={meterWidth} valueWidth={valueWidth} />
              </td>
              <td>
                <Meter value={up ? h.mem_ratio : null} width={meterWidth} valueWidth={valueWidth} />
              </td>
              <td className="lab-num">
                {h.exhaust_c === null ? (
                  fmtCelsius(up ? h.inlet_c : null)
                ) : (
                  <>
                    {up && h.inlet_c !== null ? Math.round(h.inlet_c) : '—'} → {fmtCelsius(up ? h.exhaust_c : null)}
                    <div className="lab-text-2" style={{ fontSize: '0.85em' }}>
                      Δt {fmtDeltaC(up ? airflowDelta(h) : null)}
                    </div>
                  </>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export function Down() {
  return (
    <span style={{ color: 'var(--theme-error)', marginLeft: '0.6em', fontWeight: 400 }}>
      <span aria-hidden="true">○</span> down
    </span>
  );
}

/**
 * GPUs by role and index; `full` names them with their #n and adds a host column. `enc` / `dec`
 * are the video engines' load (never a count of streams); the Quadro gets a `transcoding` badge
 * while its encoder runs.
 */
export function GpuTable({
  gpus,
  sparkline,
  encSparkline,
  full = false,
}: {
  gpus: NowDoc['gpus'];
  /** The page adds a `util, 24 h` column. */
  sparkline?: (role: string, index: number) => React.ReactNode;
  /** … and an `enc, 24 h` column. */
  encSparkline?: (role: string, index: number) => React.ReactNode;
  full?: boolean;
}) {
  if (gpus.length === 0) return null;
  return (
    <table className="lab-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th scope="col">gpu</th>
          {full && <th scope="col">in</th>}
          <th scope="col">util</th>
          <th scope="col">vram</th>
          {full ? (
            <>
              <th scope="col" className="lab-num" title="video encoder load (NVENC)">enc</th>
              <th scope="col" className="lab-num" title="video decoder load (NVDEC)">dec</th>
            </>
          ) : (
            <th scope="col" className="lab-num" title="video encoder / decoder load (NVENC / NVDEC)">
              enc/dec
            </th>
          )}
          <th scope="col" className="lab-num">power</th>
          <th scope="col" className="lab-num">temp</th>
          {sparkline && <th scope="col" style={{ paddingLeft: '1.5em' }}>util, 24 h</th>}
          {encSparkline && <th scope="col">enc, 24 h</th>}
        </tr>
      </thead>
      <tbody>
        {gpus.map((g) => (
          <tr key={`${g.role}:${g.index}`}>
            <th scope="row" style={{ color: 'var(--theme-text)', whiteSpace: 'nowrap' }}>
              <span className="font-bold">{full ? gpuName(g.role, g.index) : gpuModel(g.role, g.index)}</span>
              {!full && <span className="lab-text-2"> {HOSTS[g.role].short}</span>}
              {isTranscoding(g) && (
                <div className="lab-tag-line">
                  <TranscodingBadge />
                </div>
              )}
            </th>
            {full && <td className="lab-text-2">{HOSTS[g.role].short}</td>}
            <td>
              <Meter value={g.util_ratio} width={meterWidth} valueWidth={valueWidth} />
            </td>
            <td>
              <Meter value={g.mem_ratio} width={meterWidth} valueWidth={valueWidth} />
            </td>
            {full ? (
              <>
                <td className="lab-num">{fmtPct(g.enc_ratio)}</td>
                <td className="lab-num">{fmtPct(g.dec_ratio)}</td>
              </>
            ) : (
              <td className="lab-num">
                {fmtPct(g.enc_ratio)}/{fmtPct(g.dec_ratio)}
              </td>
            )}
            <td className="lab-num">{fmtWatts(g.power_w)}</td>
            <td className="lab-num">{fmtCelsius(g.temp_c)}</td>
            {sparkline && <td style={{ width: '22%', paddingLeft: '1.5em' }}>{sparkline(g.role, g.index)}</td>}
            {encSparkline && <td style={{ width: '16%' }}>{encSparkline(g.role, g.index)}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
