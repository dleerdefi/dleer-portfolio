// Consumer schemas for threatsnap's documents: a mirror of threats.v1.schema.json and
// threats-live.v1.schema.json in the homelab (docs/lab/THREATS_VIEW.md §2). Mirror the
// producer schema, no more: ordering and subset promises the producer schema does not check
// are handled by rendering, not refinements.

import { z } from 'zod';
import {
  behavior,
  byCategory,
  category,
  cc,
  ccOrNull,
  count,
  credSources,
  credential,
  lat,
  lon,
  notIpShape,
  svc,
  target,
  timestamp,
  via,
} from './shared';

const hourlySeries = z.array(count).length(24);

const credentialRow = z.object({ value: credential, attempts: count, sources: credSources });

export const DigestDoc = z.object({
  schema_version: z.literal(1),
  generated_at: timestamp,
  interval_s: z.number().int().min(60).max(3600),
  stale_after_s: z.number().int().min(60).max(86400),
  window_s: z.literal(86400),
  targets: z
    .array(
      z.object({
        id: target,
        label: z.string().regex(/^[a-z0-9 .\-]{1,40}$/).refine(notIpShape),
        lat,
        lon,
        up: z.boolean(),
      }),
    )
    .length(2),
  totals: z.object({
    events: count,
    sources: count,
    countries: z.number().int().min(0).max(300),
    by_category: byCategory,
    by_target: z.object({ sensor: count, web: count }),
  }),
  hourly: z.object({
    start: timestamp,
    step_s: z.literal(3600),
    points: z.literal(24),
    by_category: z.object({
      recon: hourlySeries,
      brute_force: hourlySeries,
      web_exploit: hourlySeries,
      intrusion: hourlySeries,
      malware: hourlySeries,
      ai_agent: hourlySeries,
    }),
  }),
  geo: z
    .array(
      z.object({
        lat,
        lon,
        cc: ccOrNull,
        events: count,
        sources: count,
        top_category: category,
        by_category: byCategory,
      }),
    )
    .max(400),
  countries: z.array(z.object({ cc, events: count, sources: count })).max(20),
  asns: z
    .array(
      z.object({
        asn: z.number().int().min(1).max(4294967295),
        name: z
          .string()
          .regex(/^[A-Za-z0-9 .,&'()\-/]{1,64}$/)
          .refine(notIpShape)
          .nullable(),
        events: count,
        sources: count,
      }),
    )
    .max(20),
  credentials: z.object({
    usernames: z.array(credentialRow).max(10),
    passwords: z.array(credentialRow).max(10),
    pairs: z
      .array(
        z.object({
          username: credential,
          password: credential,
          attempts: count,
          sources: credSources,
        }),
      )
      .max(10),
  }),
  behaviors: z.array(z.object({ behavior, sessions: count })).length(9),
  signatures: z
    .array(
      z.object({
        name: z.string().regex(/^[A-Za-z0-9 ._:/()\-]{1,120}$/).refine(notIpShape),
        hits: count,
      }),
    )
    .max(10),
  cves: z.array(z.object({ id: z.string().regex(/^CVE-\d{4}-\d{4,7}$/), hits: count, sources: count })).max(10),
  malware: z
    .array(
      z.object({
        sha256: z.string().regex(/^[a-f0-9]{64}$/),
        first_seen: timestamp,
        sources: count,
        via,
      }),
    )
    .max(10),
  download_attempts: count,
  ai_agent: z.object({ suspected: count, likely: count }),
});
export type DigestDoc = z.infer<typeof DigestDoc>;

export const LiveEvent = z.object({
  t: z.number().int().min(0).max(890),
  lat,
  lon,
  cc: ccOrNull,
  cat: category,
  target,
  svc,
  n: z.number().int().min(1).max(1_000_000_000),
});
export type LiveEvent = z.infer<typeof LiveEvent>;

export const LiveDoc = z.object({
  schema_version: z.literal(1),
  generated_at: timestamp,
  interval_s: z.number().int().min(10).max(600),
  stale_after_s: z.number().int().min(10).max(3600),
  window_start: timestamp,
  window_s: z.literal(900),
  bucket_s: z.literal(10),
  events: z.array(LiveEvent).max(400),
  dropped: count,
});
export type LiveDoc = z.infer<typeof LiveDoc>;
