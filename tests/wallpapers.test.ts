import { statSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { themeBackgrounds } from '@/lib/wallpapers';
import { BLURRED_WALLPAPERS } from '@/lib/wallpapers.generated';

// Every wallpaper a preset offers needs its pre-blurred copy (scripts/build-wallpapers.mjs);
// without one, Background shows the gradient alone.
const names = Object.values(themeBackgrounds)
  .flat()
  .map((url) => url.split('/').pop()!.replace(/\.webp$/, ''));

describe('pre-blurred wallpapers', () => {
  it.each(names)('%s has a pre-blurred copy', (name) => {
    expect(BLURRED_WALLPAPERS[name]).toBeDefined();
  });

  it.each(names)('%s stays small (under 20 KB)', (name) => {
    expect(statSync(`assets/wallpapers/${name}.webp`).size).toBeLessThan(20 * 1024);
  });

  it('has no copies for wallpapers no preset offers', () => {
    expect(Object.keys(BLURRED_WALLPAPERS).sort()).toEqual([...names].sort());
  });
});
