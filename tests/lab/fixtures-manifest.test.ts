import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { FIXTURES, INVALID, ROOT } from './helpers';

// The vendored homelab examples are verbatim copies; a hand edit fails here.
// Re-sync with docs/lab/HOMELAB_REFERENCE.md §6.

interface Entry {
  path: string;
  source: string;
  branch: string;
  commit: string;
  sha256: string;
}

const manifest = JSON.parse(readFileSync(join(FIXTURES, 'MANIFEST.json'), 'utf8')) as { files: Entry[] };

describe('MANIFEST.json', () => {
  it.each(manifest.files.map((f) => [f.path, f] as const))('%s matches its recorded sha256', (_path, entry) => {
    const hash = createHash('sha256').update(readFileSync(join(ROOT, entry.path))).digest('hex');
    expect(hash).toBe(entry.sha256);
    expect(entry.commit).toMatch(/^[0-9a-f]{40}$/);
    expect(entry.source).toMatch(/^stacks\/(monitoring\/labsnap|honeynet\/threatsnap)\/examples\//);
  });

  it('lists every vendored file', () => {
    const onDisk = [
      ...readdirSync(FIXTURES)
        .filter((f) => f.endsWith('.json') && f !== 'MANIFEST.json')
        .map((f) => `lib/lab/fixtures/${f}`),
      ...['labsnap', 'threatsnap'].flatMap((p) =>
        readdirSync(join(INVALID, p)).map((f) => `tests/fixtures/homelab/invalid/${p}/${f}`),
      ),
    ].sort();
    expect(manifest.files.map((f) => f.path).sort()).toEqual(onDisk);
  });
});
