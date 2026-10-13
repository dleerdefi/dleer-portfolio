// Consumer schemas for labsnap's documents: a mirror of now.v1.schema.json,
// history.v1.schema.json and live.v1.schema.json in the homelab (docs/lab/TELEMETRY_VIEW.md §2).

import { z } from 'zod';
import { ratio, role, timestamp } from './shared';
import type { Role } from '../types';

const watts = (max: number) => z.number().min(0).max(max).nullable();
const count = (max: number) => z.number().int().min(0).max(max).nullable();
const bytesPerS = z.number().int().min(0).max(1e11).nullable();

const host = <R extends Role>(r: R) =>
  z.object({
    role: z.literal(r),
    up: z.boolean(),
    power_w: watts(3000),
    cpu_ratio: ratio,
    mem_ratio: ratio,
    inlet_c: z.number().min(-10).max(70).nullable(),
    fan_rpm: z.number().min(0).max(30000).nullable(),
    // null where the BMC has no exhaust sensor (the T430)
    exhaust_c: z.number().min(-10).max(100).nullable(),
    psu_in_v: z.number().min(0).max(300).nullable(),
  });

const gpuIndex = z.number().int().min(0).max(7);

export const NowDoc = z.object({
  schema_version: z.literal(1),
  generated_at: timestamp,
  interval_s: z.number().int().min(10).max(600),
  stale_after_s: z.number().int().min(10).max(86400),
  lab: z.object({
    power_w: watts(10000),
    energy_kwh_24h: z.number().min(0).max(250).nullable(),
    energy_cost_usd_24h: z.number().min(0).max(100).nullable(),
    vms_running: count(500),
    targets_up: count(1000),
    targets_total: count(1000),
    alerts_firing: count(1000),
    disks: count(500),
    disks_healthy: count(500),
    drive_temp_max_c: z.number().min(0).max(100).nullable(),
    hosts_up: z.number().int().min(0).max(3),
    hosts_expected: z.literal(3),
  }),
  hosts: z.tuple([host('storage'), host('gpu'), host('apps')]),
  // The producer sorts GPUs by role then index; the consumer looks them up by role:index.
  gpus: z
    .array(
      z.object({
        role,
        index: gpuIndex,
        util_ratio: ratio,
        mem_ratio: ratio,
        power_w: watts(500),
        temp_c: z.number().min(0).max(120).nullable(),
        // NVENC / NVDEC load: a load, never a count of streams
        enc_ratio: ratio,
        dec_ratio: ratio,
      }),
    )
    .max(8),
  storage: z
    .object({
      used_bytes: z.number().int().min(0).max(1e15),
      total_bytes: z.number().int().min(0).max(1e15),
    })
    .nullable(),
  // TrueNAS data pools (boot pool excluded); null while TrueNAS isn't reporting
  nas: z
    .object({
      pool_healthy: z.boolean().nullable(),
      read_bytes_s: bytesPerS,
      write_bytes_s: bytesPerS,
      arc_hit_ratio: ratio,
    })
    .nullable(),
  // Self-hosted GitHub Actions runners, totals across every repo; null while not reporting
  ci: z
    .object({
      runners_online: count(500),
      runners_total: count(500),
      runners_busy: count(500),
      queue_oldest_s: z.number().int().min(0).max(2592000).nullable(),
      busy_hours_24h: z.number().min(0).max(12000).nullable(),
    })
    .nullable(),
  media: z
    .object({
      streams: z.number().int().min(0).max(100).nullable(),
      transcodes: z.number().int().min(0).max(100).nullable(),
    })
    .nullable(),
});
export type NowDoc = z.infer<typeof NowDoc>;

/**
 * history.json and live.json share one layout (the same series, fixed-length arrays, entry i at
 * start + i × step_s, null for gaps) and differ only in these bounds (status-contract.md).
 */
interface SeriesBounds {
  interval_s: [number, number];
  stale_after_s: [number, number];
  step_s: [number, number];
  maxPoints: number;
}

function seriesDoc(b: SeriesBounds) {
  const series = <T extends z.ZodType>(item: T) => z.array(item).max(b.maxPoints);
  const hostSeries = <R extends Role>(r: R) =>
    z.object({
      role: z.literal(r),
      power_w: series(watts(3000)),
      cpu_ratio: series(ratio),
    });
  const int = ([min, max]: [number, number]) => z.number().int().min(min).max(max);
  return (
    z
      .object({
        schema_version: z.literal(1),
        generated_at: timestamp,
        interval_s: int(b.interval_s),
        stale_after_s: int(b.stale_after_s),
        start: timestamp,
        step_s: int(b.step_s),
        points: int([2, b.maxPoints]),
        lab: z.object({ power_w: series(watts(10000)) }),
        hosts: z.tuple([hostSeries('storage'), hostSeries('gpu'), hostSeries('apps')]),
        gpus: z
          .array(
            z.object({
              role,
              index: gpuIndex,
              util_ratio: series(ratio),
              power_w: series(watts(500)),
              enc_ratio: series(ratio),
            }),
          )
          .max(8),
        nas: z.object({ read_bytes_s: series(bytesPerS), write_bytes_s: series(bytesPerS) }).nullable(),
        ci: z.object({ runners_busy: series(count(500)) }).nullable(),
        media: z.object({ streams: series(z.number().int().min(0).max(100).nullable()) }).nullable(),
      })
      // The contract: every series has exactly `points` entries (the JSON Schema only caps them).
      .refine((d) => historySeries(d).every((s) => s.length === d.points), {
        message: 'a series length differs from points',
      })
  );
}

/** v1/history.json: the last 7 days at most, 5-minute steps today. */
export const HistoryDoc = seriesDoc({ interval_s: [60, 3600], stale_after_s: [60, 86400], step_s: [60, 3600], maxPoints: 2017 });
export type HistoryDoc = z.infer<typeof HistoryDoc>;

/** v1/live.json: the same series over the last 10 minutes at 10-second steps (61 points). */
export const TelemetryLiveDoc = seriesDoc({ interval_s: [5, 60], stale_after_s: [5, 3600], step_s: [5, 60], maxPoints: 721 });
export type TelemetryLiveDoc = z.infer<typeof TelemetryLiveDoc>;

function historySeries(d: {
  lab: { power_w: unknown[] };
  hosts: { power_w: unknown[]; cpu_ratio: unknown[] }[];
  gpus: { util_ratio: unknown[]; power_w: unknown[]; enc_ratio: unknown[] }[];
  nas: { read_bytes_s: unknown[]; write_bytes_s: unknown[] } | null;
  ci: { runners_busy: unknown[] } | null;
  media: { streams: unknown[] } | null;
}): unknown[][] {
  return [
    d.lab.power_w,
    ...d.hosts.flatMap((h) => [h.power_w, h.cpu_ratio]),
    ...d.gpus.flatMap((g) => [g.util_ratio, g.power_w, g.enc_ratio]),
    ...(d.nas ? [d.nas.read_bytes_s, d.nas.write_bytes_s] : []),
    ...(d.ci ? [d.ci.runners_busy] : []),
    ...(d.media ? [d.media.streams] : []),
  ];
}
