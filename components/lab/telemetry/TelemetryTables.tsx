import React from 'react';
import { Meter } from '@/components/lab/shared/Meter';
import { fmtCelsius, fmtWatts } from '@/lib/lab/format';
import { HOSTS, gpuModel, gpuName } from '@/lib/lab/names';
import type { NowDoc } from '@/lib/lab/schemas/telemetry';

const meterWidth = 'clamp(3rem, 2rem + 6cqi, 5rem)';

/** One row per host: short name and role, power, cpu and mem meters, inlet. */
export function HostTable({ hosts }: { hosts: NowDoc['hosts'] }) {
  return (
    <table className="lab-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th scope="col">host</th>
          <th scope="col" className="lab-num">power</th>
          <th scope="col">cpu</th>
          <th scope="col">mem</th>
          <th scope="col" className="lab-num">inlet</th>
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
              </th>
              <td className="lab-num">{fmtWatts(up ? h.power_w : null)}</td>
              <td>
                <Meter value={up ? h.cpu_ratio : null} width={meterWidth} />
              </td>
              <td>
                <Meter value={up ? h.mem_ratio : null} width={meterWidth} />
              </td>
              <td className="lab-num">{fmtCelsius(up ? h.inlet_c : null)}</td>
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

/** GPUs by role and index; `full` names them with their #n and adds a host column. */
export function GpuTable({
  gpus,
  sparkline,
  full = false,
}: {
  gpus: NowDoc['gpus'];
  /** The page adds a `util, 24 h` column. */
  sparkline?: (role: string, index: number) => React.ReactNode;
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
          <th scope="col" className="lab-num">power</th>
          <th scope="col" className="lab-num">temp</th>
          {sparkline && <th scope="col" style={{ paddingLeft: '1.5em' }}>util, 24 h</th>}
        </tr>
      </thead>
      <tbody>
        {gpus.map((g) => (
          <tr key={`${g.role}:${g.index}`}>
            <th scope="row" style={{ color: 'var(--theme-text)', whiteSpace: 'nowrap' }}>
              <span className="font-bold">{full ? gpuName(g.role, g.index) : gpuModel(g.role, g.index)}</span>
              {!full && <span className="lab-text-2"> {HOSTS[g.role].short}</span>}
            </th>
            {full && <td className="lab-text-2">{HOSTS[g.role].short}</td>}
            <td>
              <Meter value={g.util_ratio} width={meterWidth} />
            </td>
            <td>
              <Meter value={g.mem_ratio} width={meterWidth} />
            </td>
            <td className="lab-num">{fmtWatts(g.power_w)}</td>
            <td className="lab-num">{fmtCelsius(g.temp_c)}</td>
            {sparkline && <td style={{ width: '28%', paddingLeft: '1.5em' }}>{sparkline(g.role, g.index)}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
