// Pieces shared by the telemetry and threat schemas, mirroring the homelab's JSON Schemas
// (labsnap and threatsnap). Zod objects strip unknown keys by default: the contracts allow
// additions within v1, and stripping keeps them out of responses until the UI knows them.

import { z } from 'zod';
import { BEHAVIORS, CATEGORIES, MALWARE_VIA, ROLES, SERVICES, TARGETS } from '../types';

export const timestamp = z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
export const ratio = z.number().min(0).max(1).nullable();
export const role = z.enum(ROLES);

export const count = z.number().int().min(0).max(1_000_000_000);
export const lat = z.number().min(-90).max(90);
export const lon = z.number().min(-180).max(180);
export const cc = z.string().regex(/^[A-Z]{2}$/);
export const ccOrNull = cc.nullable();

export const category = z.enum(CATEGORIES);
export const target = z.enum(TARGETS);
export const svc = z.enum(SERVICES);
export const behavior = z.enum(BEHAVIORS);
export const via = z.enum(MALWARE_VIA);

/** A dotted quad anywhere in a string: the producer schemas' `not` pattern. */
const IP_SHAPE = /[0-9]{1,3}(\.[0-9]{1,3}){3}/;
export const notIpShape = (s: string) => !IP_SHAPE.test(s);

export const credential = z
  .string()
  .regex(/^[\x21-\x7E]{1,24}$/)
  .refine((s) => notIpShape(s) && !s.includes('://') && !/@[^@]*\./.test(s) && !s.includes('::'));

/** At least five distinct sources: the contract's floor for published credentials. */
export const credSources = z.number().int().min(5).max(1_000_000_000);

export const byCategory = z.object({
  recon: count,
  brute_force: count,
  web_exploit: count,
  intrusion: count,
  malware: count,
  ai_agent: count,
});

// The IP-shape scan over a whole serialized payload, mirroring `filters.ip_shapes` in
// threatsnap: IPv4 dotted quads, and IPv6 candidates (runs of hex digits, dots and colons that
// contain a hex digit and either `::` or at least three colons). Timestamps such as 19:05:00
// have two colons and no `::`, so they never match.
const V4 = /(?<!\d)\d{1,3}(?:\.\d{1,3}){3}(?!\d)/g;
const V6_RUN = /[0-9A-Fa-f.]*:[0-9A-Fa-f:.]*/g;
const HEX = /[0-9A-Fa-f]/;

export function ipShapes(text: string): string[] {
  const found: string[] = [...(text.match(V4) ?? [])];
  for (const run of text.match(V6_RUN) ?? []) {
    if (!HEX.test(run)) continue;
    if (run.includes('::') || run.split(':').length - 1 >= 3) found.push(run);
  }
  return found;
}
