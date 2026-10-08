import { describe, expect, it } from 'vitest';
import { DigestDoc, LiveDoc } from '@/lib/lab/schemas/threats';
import { ipShapes } from '@/lib/lab/schemas/shared';
import { compactBytes, golden, invalid, invalidText } from './helpers';

// THREATS_VIEW.md §11, against the vendored homelab examples.

describe('golden examples', () => {
  it('parses threats.v1.json', () => {
    expect(DigestDoc.safeParse(golden('threats.v1.json')).success).toBe(true);
  });

  it('parses threats-live.v1.json', () => {
    expect(LiveDoc.safeParse(golden('threats-live.v1.json')).success).toBe(true);
  });

  it('fits the contract size caps when compact', () => {
    expect(compactBytes(golden('threats.v1.json'))).toBeLessThanOrEqual(64 * 1024);
    expect(compactBytes(golden('threats-live.v1.json'))).toBeLessThanOrEqual(48 * 1024);
  });

  it('contains no IP-shaped string', () => {
    expect(ipShapes(JSON.stringify(golden('threats.v1.json')))).toEqual([]);
    expect(ipShapes(JSON.stringify(golden('threats-live.v1.json')))).toEqual([]);
  });
});

describe('invalid examples', () => {
  it.each([
    ['threats-bad-cve-id.json', DigestDoc],
    ['threats-credential-email.json', DigestDoc],
    ['threats-credential-one-source.json', DigestDoc],
    ['threats-ip-in-label.json', DigestDoc],
    ['threats-ipv6-in-asn-name.json', DigestDoc],
    ['threats-missing-behavior.json', DigestDoc],
    ['threats-null-count.json', DigestDoc],
    ['threats-unknown-category.json', DigestDoc],
    ['threats-live-offset-outside-window.json', LiveDoc],
    ['threats-live-too-many-events.json', LiveDoc],
    ['threats-live-unknown-service.json', LiveDoc],
  ] as const)('rejects %s', (name, schema) => {
    expect(schema.safeParse(invalid('threatsnap', name)).success).toBe(false);
  });

  it('rejects threats-nan.json: JSON.parse fails on NaN', () => {
    expect(() => JSON.parse(invalidText('threatsnap', 'threats-nan.json'))).toThrow();
  });

  it('threats-oversized.json is schema-valid but over the 64 KiB cap', () => {
    const doc = invalid('threatsnap', 'threats-oversized.json');
    expect(DigestDoc.safeParse(doc).success).toBe(true);
    expect(compactBytes(doc)).toBeGreaterThan(64 * 1024);
  });

  it.each([
    ['threats-unknown-key.json', DigestDoc, 'source_ips'],
    ['threats-live-source-address.json', LiveDoc, 'src'],
  ] as const)('parses %s with the extra key stripped and no address left', (name, schema, key) => {
    const parsed = schema.safeParse(invalid('threatsnap', name));
    expect(parsed.success).toBe(true);
    const out = JSON.stringify(parsed.data);
    expect(out).not.toContain(`"${key}"`);
    expect(ipShapes(out)).toEqual([]);
  });
});

describe('ipShapes', () => {
  it('finds IPv4 and IPv6 shapes', () => {
    expect(ipShapes('x 203.0.113.9 y')).toEqual(['203.0.113.9']);
    expect(ipShapes('"2001:db8::1"')).toEqual(['2001:db8::1']);
    expect(ipShapes('"2001:db8:0:0:0:0:0:1"')).toEqual(['2001:db8:0:0:0:0:0:1']);
    expect(ipShapes('::ffff:203.0.113.9')).toContain('::ffff:203.0.113.9');
  });

  it('ignores timestamps, coordinates and JSON syntax', () => {
    expect(ipShapes('{"generated_at":"2026-10-07T19:05:00Z","lat":31.2,"lon":121.5,"t":890}')).toEqual([]);
    expect(ipShapes('19:05:00')).toEqual([]);
  });
});
