import { describe, expect, it } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { HostCard } from '@/components/lab/telemetry/HostCard';
import { CiBlock, Cost, HealthLine, NasBlock, airflowDelta, isTranscoding } from '@/components/lab/telemetry/LabExtras';
import { GpuTable, HostTable } from '@/components/lab/telemetry/TelemetryTables';
import { fmtDeltaC, fmtDuration, fmtPct1, fmtRate, fmtUsd, DASH } from '@/lib/lab/format';
import { NowDoc } from '@/lib/lab/schemas/telemetry';
import { golden } from './helpers';

// TELEMETRY_VIEW.md §5–§6 for the fields added in homelab PR #28, rendered to markup.

const now = NowDoc.parse(golden('now.v1.json'));
const html = (el: React.ReactElement) => renderToStaticMarkup(el);
const text = (el: React.ReactElement) =>
  html(el)
    .replace(/<[^>]+>/g, '')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
const card = (host: NowDoc['hosts'][number], extra: Partial<React.ComponentProps<typeof HostCard>> = {}) =>
  React.createElement(HostCard, { host, power24h: null, cpu24h: null, powerDomain: null, ...extra });

describe('NAS and CI blocks', () => {
  it('hide entirely when their section is null (it is not zero)', () => {
    expect(html(React.createElement(NasBlock, { nas: null, storage: now.storage, read24h: null, write24h: null }))).toBe('');
    expect(html(React.createElement(CiBlock, { ci: null, busy24h: null }))).toBe('');
    const t430 = text(card(now.hosts[0], { storage: now.storage, nas: null }));
    expect(t430).not.toContain('ARC hit');
    expect(t430).toContain('38.6 / 50.3 TB'); // the bare pool line stays while storage is known
    expect(text(card(now.hosts[2], { ci: null }))).not.toContain('runners');
  });

  it('show pool health, the pool, throughput and ARC hits', () => {
    const t = text(React.createElement(NasBlock, { nas: now.nas, storage: now.storage, read24h: [1, 2], write24h: [1, 2] }));
    expect(t).toContain('healthy');
    expect(t).toContain('38.6 / 50.3 TB');
    expect(t).toContain('12.5 MB/s');
    expect(t).toContain('240 kB/s');
    expect(t).toContain('99.9%');
    const degraded = text(React.createElement(NasBlock, { nas: { ...now.nas!, pool_healthy: false }, storage: null, read24h: null, write24h: null }));
    expect(degraded).toContain('degraded');
  });

  it('render a single null value as a dash', () => {
    const t = text(React.createElement(NasBlock, { nas: { ...now.nas!, arc_hit_ratio: null, pool_healthy: null }, storage: null, read24h: null, write24h: null }));
    expect(t).toContain(`ARC hit${DASH}`);
    expect(t).toContain(`pool${DASH}`);
  });

  it('show runners, busy now, runner-hours, and the oldest queued job only when one waits', () => {
    const t = text(React.createElement(CiBlock, { ci: now.ci, busy24h: [0, 2] }));
    expect(t).toContain('14/22 online');
    expect(t).toContain('2 now');
    expect(t).toContain('6.4 runner-hours');
    expect(t).not.toContain('oldest job');
    const queued = text(React.createElement(CiBlock, { ci: { ...now.ci!, queue_oldest_s: 185 }, busy24h: null }));
    expect(queued).toContain('oldest job waiting 3 min');
  });
});

describe('airflow', () => {
  it('Δt is exhaust minus inlet, and unknown without an exhaust sensor', () => {
    expect(airflowDelta(now.hosts[2])).toBe(28);
    expect(airflowDelta(now.hosts[0])).toBeNull();
    expect(airflowDelta({ inlet_c: null, exhaust_c: 40 })).toBeNull();
  });

  it('hides exhaust and Δt where exhaust_c is null', () => {
    const t430 = text(card(now.hosts[0]));
    expect(t430).not.toContain('exhaust');
    expect(t430).not.toContain('Δt');
    expect(t430).toContain('2,280 rpm');
    expect(t430).toContain('118 V');
    const r720 = text(card(now.hosts[2]));
    expect(r720).toContain('exhaust51 °C');
    expect(r720).toContain('Δt +28 °C');
  });

  it('the tile table shows inlet → exhaust with Δt, and the inlet alone on the T430', () => {
    const rows = html(React.createElement(HostTable, { hosts: now.hosts })).split('<tr');
    const t430 = rows.find((r) => r.includes('T430'))!.replace(/<[^>]+>/g, '');
    const r720 = rows.find((r) => r.includes('R720xd'))!.replace(/<[^>]+>/g, '');
    expect(t430).not.toContain('→');
    expect(t430).not.toContain('Δt');
    expect(r720).toContain('23 → 51 °C');
    expect(r720).toContain('Δt +28 °C');
    expect(r720).toContain('fan 6,500 rpm · psu 116 V');
  });
});

describe('GPU video engines', () => {
  it('badge the Quadro as transcoding while its encoder runs, and only then', () => {
    expect(isTranscoding(now.gpus[0])).toBe(true);
    expect(isTranscoding({ ...now.gpus[0], enc_ratio: 0 })).toBe(false);
    expect(isTranscoding({ ...now.gpus[0], enc_ratio: null })).toBe(false);
    // an A4000's encoder is not Plex
    expect(isTranscoding({ ...now.gpus[1], enc_ratio: 0.5 })).toBe(false);
    const busy = html(React.createElement(GpuTable, { gpus: now.gpus }));
    expect(busy.match(/>transcoding</g)).toHaveLength(1);
    const idle = html(React.createElement(GpuTable, { gpus: now.gpus.map((g) => ({ ...g, enc_ratio: 0 })) }));
    expect(idle).not.toContain('>transcoding<');
  });

  it('show encoder and decoder load as a load, never as a stream count', () => {
    const tile = text(React.createElement(GpuTable, { gpus: now.gpus }));
    expect(tile).toContain('31%/12%');
    const page = text(React.createElement(GpuTable, { gpus: now.gpus, full: true }));
    expect(page).toContain('31%12%');
    expect(page).not.toMatch(/stream/);
  });
});

describe('lab health and cost', () => {
  it('reads as one line', () => {
    expect(text(React.createElement(HealthLine, { lab: now.lab }))).toBe(
      '6 VMs · 27/27 targets up · 0 alerts · 20/20 disks healthy · hottest disk 31 °C',
    );
  });

  it('shows firing alerts as a count in the warning colour, and nothing more', () => {
    const quiet = html(React.createElement(HealthLine, { lab: now.lab }));
    expect(quiet).not.toContain('--theme-warning');
    const firing = html(React.createElement(HealthLine, { lab: { ...now.lab, alerts_firing: 2 } }));
    expect(firing).toContain('<span style="color:var(--theme-warning)">2 alerts</span>');
    expect(text(React.createElement(HealthLine, { lab: { ...now.lab, alerts_firing: 1 } }))).toContain('1 alert ·');
  });

  it('renders a null count as a dash', () => {
    const t = text(React.createElement(HealthLine, { lab: { ...now.lab, vms_running: null, targets_up: null } }));
    expect(t).toContain(`${DASH} VMs`);
    expect(t).toContain(`${DASH}/27 targets up`);
  });

  it('prices the 24 h energy with the rate in its tooltip', () => {
    const c = html(React.createElement(Cost, { usd: 4.96 }));
    expect(c).toContain('≈ $4.96');
    expect(c).toContain('Puget Sound Energy residential rate, $0.2056/kWh; excludes the basic charge and taxes');
    expect(text(React.createElement(Cost, { usd: null }))).toBe(DASH);
  });
});

describe('format', () => {
  it('throughput in decimal units', () => {
    expect(fmtRate(240_000)).toBe('240 kB/s');
    expect(fmtRate(12_500_000)).toBe('12.5 MB/s');
    expect(fmtRate(144_978_472)).toBe('145 MB/s');
    expect(fmtRate(2_400)).toBe('2.4 kB/s');
    expect(fmtRate(512)).toBe('512 B/s');
    expect(fmtRate(0)).toBe('0 B/s');
    expect(fmtRate(1.5e9)).toBe('1.5 GB/s');
  });

  it('signed airflow, durations, ARC percent and cost; null stays a dash', () => {
    expect(fmtDeltaC(28)).toBe('+28 °C');
    expect(fmtDeltaC(-2.4)).toBe('−2 °C');
    expect(fmtDuration(42)).toBe('42 s');
    expect(fmtDuration(185)).toBe('3 min');
    expect(fmtDuration(3900)).toBe('1 h 5 min');
    expect(fmtDuration(183600)).toBe('2 d 3 h');
    expect(fmtPct1(0.9991)).toBe('99.9%');
    expect(fmtUsd(3.81)).toBe('≈ $3.81');
    for (const f of [fmtRate, fmtDeltaC, fmtDuration, fmtPct1, fmtUsd]) expect(f(null)).toBe(DASH);
  });
});
