// Consumer schemas for labsnap's documents: a mirror of now.v1.schema.json and
// history.v1.schema.json in the homelab (docs/lab/TELEMETRY_VIEW.md §2).

import { z } from 'zod';
import { ratio, role, timestamp } from './shared';
import type { Role } from '../types';

const watts = (max: number) => z.number().min(0).max(max).nullable();

const host = <R extends Role>(r: R) =>
  z.object({
    role: z.literal(r),
    up: z.boolean(),
    power_w: watts(3000),
    cpu_ratio: ratio,
    mem_ratio: ratio,
    inlet_c: z.number().min(-10).max(70).nullable(),
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
      }),
    )
    .max(8),
  storage: z
    .object({
      used_bytes: z.number().int().min(0).max(1e15),
      total_bytes: z.number().int().min(0).max(1e15),
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

const series = <T extends z.ZodType>(item: T) => z.array(item).max(2017);
const hostSeries = <R extends Role>(r: R) =>
  z.object({
    role: z.literal(r),
    power_w: series(watts(3000)),
    cpu_ratio: series(ratio),
  });

export const HistoryDoc = z
  .object({
    schema_version: z.literal(1),
    generated_at: timestamp,
    interval_s: z.number().int().min(60).max(3600),
    stale_after_s: z.number().int().min(60).max(86400),
    start: timestamp,
    step_s: z.number().int().min(60).max(3600),
    points: z.number().int().min(2).max(2017),
    lab: z.object({ power_w: series(watts(10000)) }),
    hosts: z.tuple([hostSeries('storage'), hostSeries('gpu'), hostSeries('apps')]),
    gpus: z
      .array(
        z.object({
          role,
          index: gpuIndex,
          util_ratio: series(ratio),
          power_w: series(watts(500)),
        }),
      )
      .max(8),
    media: z.object({ streams: series(z.number().int().min(0).max(100).nullable()) }).nullable(),
  })
  // The contract: every series has exactly `points` entries (the JSON Schema only caps them).
  .refine((d) => historySeries(d).every((s) => s.length === d.points), {
    message: 'a series length differs from points',
  });
export type HistoryDoc = z.infer<typeof HistoryDoc>;

function historySeries(d: {
  lab: { power_w: unknown[] };
  hosts: { power_w: unknown[]; cpu_ratio: unknown[] }[];
  gpus: { util_ratio: unknown[]; power_w: unknown[] }[];
  media: { streams: unknown[] } | null;
}): unknown[][] {
  return [
    d.lab.power_w,
    ...d.hosts.flatMap((h) => [h.power_w, h.cpu_ratio]),
    ...d.gpus.flatMap((g) => [g.util_ratio, g.power_w]),
    ...(d.media ? [d.media.streams] : []),
  ];
}
