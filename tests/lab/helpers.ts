import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export const ROOT = join(__dirname, '..', '..');
export const FIXTURES = join(ROOT, 'lib', 'lab', 'fixtures');
export const INVALID = join(ROOT, 'tests', 'fixtures', 'homelab', 'invalid');

export const readText = (path: string) => readFileSync(path, 'utf8');
export const golden = (name: string): unknown => JSON.parse(readText(join(FIXTURES, name)));
export const invalidText = (producer: 'labsnap' | 'threatsnap', name: string) =>
  readText(join(INVALID, producer, name));
export const invalid = (producer: 'labsnap' | 'threatsnap', name: string): unknown =>
  JSON.parse(invalidText(producer, name));

/** Compact JSON, as the producers write it (separators=(",", ":")). */
export const compactBytes = (doc: unknown) => Buffer.byteLength(JSON.stringify(doc), 'utf8');
