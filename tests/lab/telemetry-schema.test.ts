import { describe, expect, it } from 'vitest';
import { HistoryDoc, NowDoc } from '@/lib/lab/schemas/telemetry';
import { demoHistory } from '@/lib/lab/demo/history';
import { golden, invalid, compactBytes } from './helpers';

// TELEMETRY_VIEW.md §7, against the vendored homelab examples.

describe('golden examples', () => {
  it('parses now.v1.json', () => {
    expect(NowDoc.safeParse(golden('now.v1.json')).success).toBe(true);
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
      ...doc.gpus.flatMap((g) => [g.util_ratio, g.power_w]),
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
    });
    expect(last(doc.media!.streams)).toBe(now.media!.streams);
  });

  it('starts 24 h before the last 5-minute boundary', () => {
    expect(doc.start).toBe('2026-10-07T12:30:00Z');
    expect(doc.generated_at).toBe('2026-10-08T12:33:56Z');
  });
});
