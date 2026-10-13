import { describe, expect, it } from 'vitest';
import { neighbor, type TileBox } from '@/lib/tile-navigation';

// The desktop grid at 1440 x 900 with the lab tile: neofetch over nav | lab on the left half,
// the stage on the right half (12 px gaps)
const neofetch: TileBox = { id: 'neofetch', left: 12, top: 48, right: 714, bottom: 380 };
const nav: TileBox = { id: 'navigation', left: 12, top: 392, right: 380, bottom: 888 };
const lab: TileBox = { id: 'lab', left: 392, top: 392, right: 714, bottom: 888 };
const stage: TileBox = { id: 'content', left: 726, top: 48, right: 1428, bottom: 888 };
const withLab = [neofetch, nav, lab, stage];
const navWide: TileBox = { ...nav, right: 714 };
const withoutLab = [neofetch, navWide, stage];

describe('tile navigation', () => {
  it('moves right along the grid', () => {
    expect(neighbor(nav, withLab, 'right')).toBe('lab');
    expect(neighbor(lab, withLab, 'right')).toBe('content');
    expect(neighbor(neofetch, withLab, 'right')).toBe('content');
  });

  it('moves up and down in the left half', () => {
    expect(neighbor(neofetch, withLab, 'down')).toBe('navigation');
    expect(neighbor(nav, withLab, 'up')).toBe('neofetch');
    expect(neighbor(lab, withLab, 'up')).toBe('neofetch');
  });

  it('moves left from the lab and the stage', () => {
    expect(neighbor(lab, withLab, 'left')).toBe('navigation');
    expect(['neofetch', 'lab']).toContain(neighbor(stage, withLab, 'left'));
  });

  it('stays put at an edge', () => {
    expect(neighbor(neofetch, withLab, 'up')).toBeNull();
    expect(neighbor(stage, withLab, 'right')).toBeNull();
    expect(neighbor(nav, withLab, 'left')).toBeNull();
  });

  it('works without the lab tile', () => {
    expect(neighbor(navWide, withoutLab, 'right')).toBe('content');
    expect(neighbor(neofetch, withoutLab, 'down')).toBe('navigation');
  });
});
