import { describe, expect, it } from 'vitest';
import { HistoryDoc, NowDoc } from '@/lib/lab/schemas/telemetry';
import { demoHistory } from '@/lib/lab/demo/history';
import { fmtTB } from '@/lib/lab/format';
import { golden, invalid, compactBytes } from './helpers';

// TELEMETRY_VIEW.md §7, against the vendored homelab examples.

describe('golden examples', () => {
  it('parses now.v1.json', () => {
    expect(NowDoc.safeParse(golden('now.v1.json')).success).toBe(true);
  });

  it('carries the public telemetry added in homelab PR #28', () => {
    const now = NowDoc.parse(golden('now.v1.json'));
    expect(now.lab).toMatchObject({ energy_cost_usd_24h: 4.96, vms_running: 6, targets_up: 27, alerts_firing: 0, disks_healthy: 20 });
    expect(now.hosts[0].exhaust_c).toBeNull(); // the T430's BMC has no exhaust sensor
    expect(now.hosts[2]).toMatchObject({ fan_rpm: 6500, exhaust_c: 51, psu_in_v: 116 });
    expect(now.gpus[0]).toMatchObject({ role: 'storage', enc_ratio: 0.31, dec_ratio: 0.12 });
    expect(now.nas).toMatchObject({ pool_healthy: true, read_bytes_s: 12500000, arc_hit_ratio: 0.9991 });
    expect(now.ci).toMatchObject({ runners_online: 14, runners_total: 22, busy_hours_24h: 6.4 });
    const history = HistoryDoc.parse(golden('history.v1.json'));
    expect(history.gpus[0].enc_ratio).toHaveLength(history.points);
    expect(history.nas!.read_bytes_s).toHaveLength(history.points);
    expect(history.ci!.runners_busy).toHaveLength(history.points);
  });

  it('accepts nas and ci as null, and requires the keys, as the producer does', () => {
    const doc = golden('now.v1.json') as Record<string, unknown>;
    expect(NowDoc.safeParse({ ...doc, nas: null, ci: null }).success).toBe(true);
    const { nas: _nas, ...withoutNas } = doc;
    expect(NowDoc.safeParse(withoutNas).success).toBe(false);
    const h = golden('history.v1.json') as Record<string, unknown>;
    expect(HistoryDoc.safeParse({ ...h, nas: null, ci: null }).success).toBe(true);
  });

  it('carries the summed data pools in storage, and accepts storage: null', () => {
    const now = NowDoc.parse(golden('now.v1.json'));
    expect(now.storage).not.toBeNull();
    expect(fmtTB(now.storage!.used_bytes)).toBe('38.6');
    expect(fmtTB(now.storage!.total_bytes)).toBe('50.3');
    // null while TrueNAS isn't reporting
    expect(NowDoc.safeParse({ ...(golden('now.v1.json') as object), storage: null }).success).toBe(true);
  });

  it('parses history.v1.json', () => {
    expect(HistoryDoc.safeParse(golden('history.v1.json')).success).toBe(true);
  });

  it('fits the loader caps when compact', () => {
    expect(compactBytes(golden('now.v1.json'))).toBeLessThanOrEqual(16 * 1024);
    expect(compactBytes(golden('history.v1.json'))).toBeLessThanOrEqual(512 * 1024);
  });
});

describe('invalid examples', () => {
  it.each([
    ['now-bad-timestamp.json', NowDoc],
    ['now-hosts-out-of-order.json', NowDoc],
    ['now-missing-media-key.json', NowDoc],
    ['now-nan-as-string.json', NowDoc],
    ['now-ratio-out-of-range.json', NowDoc],
    ['now-unknown-role.json', NowDoc],
    ['now-wrong-version.json', NowDoc],
    ['history-series-with-text.json', HistoryDoc],
    ['history-two-hosts.json', HistoryDoc],
  ] as const)('rejects %s', (name, schema) => {
    expect(schema.safeParse(invalid('labsnap', name)).success).toBe(false);
  });

  // The producer rejects these; the consumer tolerates additions by design and strips them.
  it.each([
    ['now-extra-host-field.json', NowDoc, 'hostname'],
    ['now-free-text-gpu-model.json', NowDoc, 'model'],
    ['history-gpu-extra-field.json', HistoryDoc, 'uuid'],
  ] as const)('parses %s with the extra key stripped', (name, schema, key) => {
    const parsed = schema.safeParse(invalid('labsnap', name));
    expect(parsed.success).toBe(true);
    expect(JSON.stringify(parsed.data)).not.toContain(`"${key}"`);
  });
});

describe('history series length', () => {
  it('fails a document whose series length differs from points', () => {
    const doc = golden('history.v1.json') as { hosts: { power_w: unknown[] }[] };
    doc.hosts[1].power_w.pop();
    expect(HistoryDoc.safeParse(doc).success).toBe(false);
  });

  it('checks the new series too (nas, ci, GPU encoder)', () => {
    type Doc = {
      nas: { write_bytes_s: unknown[] };
      ci: { runners_busy: unknown[] };
      gpus: { enc_ratio: unknown[] }[];
    };
    for (const cut of [
      (d: Doc) => d.nas.write_bytes_s.pop(),
      (d: Doc) => d.ci.runners_busy.pop(),
      (d: Doc) => d.gpus[0].enc_ratio.pop(),
    ]) {
      const doc = golden('history.v1.json') as Doc;
      cut(doc);
      expect(HistoryDoc.safeParse(doc).success).toBe(false);
    }
  });

  it('fails when points disagrees with every series', () => {
    const doc = golden('history.v1.json') as { points: number };
    doc.points = 14;
    expect(HistoryDoc.safeParse(doc).success).toBe(false);
  });
});

describe('demo history', () => {
  const nowFixture = golden('now.v1.json') as Parameters<typeof demoHistory>[1];
  const at = Date.parse('2026-10-08T12:34:56Z');
  const doc = demoHistory(at, nowFixture);

  it('is a valid history document of 289 points', () => {
    const parsed = HistoryDoc.safeParse(doc);
    expect(parsed.success).toBe(true);
    expect(doc.points).toBe(289);
    expect(doc.lab.power_w).toHaveLength(289);
  });

  it('is deterministic', () => {
    expect(demoHistory(at, nowFixture)).toEqual(doc);
    // the values do not depend on the clock, only the timestamps do
    const later = demoHistory(at + 7_200_000, nowFixture);
    expect(later.lab).toEqual(doc.lab);
    expect(later.hosts).toEqual(doc.hosts);
  });


  it('has one null gap in every series', () => {
    const all = [
      doc.lab.power_w,
      ...doc.hosts.flatMap((h) => [h.power_w, h.cpu_ratio]),
      ...doc.gpus.flatMap((g) => [g.util_ratio, g.power_w, g.enc_ratio]),
      doc.nas!.read_bytes_s,
      doc.nas!.write_bytes_s,
      doc.ci!.runners_busy,
      doc.media!.streams,
    ];
    for (const s of all) expect(s.filter((v) => v === null)).toHaveLength(1);
  });

  it('ends exactly at the now fixture values', () => {
    const now = NowDoc.parse(nowFixture);
    const last = <T,>(s: T[]) => s[s.length - 1];
    expect(last(doc.lab.power_w)).toBe(now.lab.power_w);
    now.hosts.forEach((h, i) => {
      expect(last(doc.hosts[i].power_w)).toBe(h.power_w);
      expect(last(doc.hosts[i].cpu_ratio)).toBe(h.cpu_ratio);
    });
    now.gpus.forEach((g, i) => {
      expect(last(doc.gpus[i].util_ratio)).toBe(g.util_ratio);
      expect(last(doc.gpus[i].power_w)).toBe(g.power_w);
      expect(last(doc.gpus[i].enc_ratio)).toBe(g.enc_ratio);
    });
    expect(last(doc.nas!.read_bytes_s)).toBe(now.nas!.read_bytes_s);
    expect(last(doc.nas!.write_bytes_s)).toBe(now.nas!.write_bytes_s);
    expect(last(doc.ci!.runners_busy)).toBe(now.ci!.runners_busy);
    expect(last(doc.media!.streams)).toBe(now.media!.streams);
  });

  it('starts 24 h before the last 5-minute boundary', () => {
    expect(doc.start).toBe('2026-10-07T12:30:00Z');
    expect(doc.generated_at).toBe('2026-10-08T12:33:56Z');
  });
});
