// A deterministic 24 h demo history (289 points at 5 min) pinned to the now fixture: the
// golden history.v1.json has only 13 points, too few for the charts. Shapes are fixed by
// position, not by the clock: a nightly backup on `storage` about 20 h ago, a quiet stretch,
// a GPU job on `gpu` (A4000 #0) about 9 h ago, one missed scrape about 7 h ago (a `null` in
// every series), and Plex streams in the last few hours. Every series ends exactly at the now
// fixture's values, so a hero number matches its chart's end label. docs/lab/concepts was drawn
// from this shape.

const POINTS = 289;
const STEP_S = 300;
const GAP = 201;
const SEED = 0x1ab5eed;

interface NowFixture {
  lab: { power_w: number | null };
  hosts: { role: string; power_w: number | null; cpu_ratio: number | null }[];
  gpus: { role: string; index: number; util_ratio: number | null; power_w: number | null }[];
  media: { streams: number | null } | null;
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const hoursAgo = (i: number) => ((POINTS - 1 - i) * STEP_S) / 3600;
/** A raised-cosine bump: 1 at `center` hours ago, 0 beyond `half` hours from it. */
const bump = (h: number, center: number, half: number) =>
  Math.abs(h - center) >= half ? 0 : 0.5 * (1 + Math.cos((Math.PI * (h - center)) / half));
/** 1 between `from` and `to` hours ago, with 15 min ramps. */
const plateau = (h: number, from: number, to: number) => {
  const ramp = 0.25;
  if (h < from - ramp || h > to + ramp) return 0;
  return Math.min(1, (h - (from - ramp)) / ramp, (to + ramp - h) / ramp);
};
/** 0 for the last `hours`, -1 before, with a 15 min ramp: "it started recently". */
const recent = (h: number, hours: number) => -Math.min(1, Math.max(0, (h - hours) / 0.25));

const round = (v: number, decimals: number) => Number(v.toFixed(decimals));

export function demoHistory(now: number, fixture: NowFixture) {
  const rand = mulberry32(SEED);
  const noise = (amp: number) => (rand() * 2 - 1) * amp;

  const series = (
    end: number | null,
    shape: (h: number) => number,
    { amp, decimals, max }: { amp: number; decimals: number; max: number },
  ): (number | null)[] =>
    Array.from({ length: POINTS }, (_, i) => {
      if (i === GAP || end === null) return null;
      if (i === POINTS - 1) return end;
      const v = end + shape(hoursAgo(i)) + noise(amp);
      return round(Math.min(max, Math.max(0, v)), decimals);
    });

  const watts = { amp: 2.5, decimals: 1, max: 3000 };
  const ratio = (amp: number) => ({ amp, decimals: 4, max: 1 });

  const [storage, gpu, apps] = fixture.hosts;
  const hosts = [
    {
      role: 'storage',
      power_w: series(storage.power_w, (h) => 70 * plateau(h, 17.5, 20.5), watts),
      cpu_ratio: series(storage.cpu_ratio, (h) => 0.3 * plateau(h, 17.5, 20.5), ratio(0.01)),
    },
    {
      role: 'gpu',
      power_w: series(gpu.power_w, (h) => 170 * bump(h, 9.5, 2.5) + 34 * recent(h, 0.5), watts),
      cpu_ratio: series(gpu.cpu_ratio, (h) => 0.22 * bump(h, 9.5, 2.5), ratio(0.008)),
    },
    {
      role: 'apps',
      power_w: series(apps.power_w, () => 0, { ...watts, amp: 2 }),
      cpu_ratio: series(apps.cpu_ratio, () => 0, ratio(0.006)),
    },
  ];

  const gpuShapes: Record<string, { util: (h: number) => number; power: (h: number) => number }> = {
    // the Plex VM's card: busy while streams run, in the last three hours
    'storage:0': { util: (h) => 0.1 * recent(h, 3), power: (h) => 14 * recent(h, 3) },
    // the GPU job, and a little load again in the last half hour
    'gpu:0': {
      util: (h) => 0.6 * bump(h, 9.5, 2.5) + 0.29 * recent(h, 0.5),
      power: (h) => 130 * bump(h, 9.5, 2.5) + 34 * recent(h, 0.5),
    },
  };
  const flat = { util: () => 0, power: () => 0 };
  const gpus = fixture.gpus.map((g) => {
    const shape = gpuShapes[`${g.role}:${g.index}`] ?? flat;
    return {
      role: g.role,
      index: g.index,
      util_ratio: series(g.util_ratio, shape.util, ratio(0.01)),
      power_w: series(g.power_w, shape.power, { amp: 0.8, decimals: 1, max: 500 }),
    };
  });

  const labPower = Array.from({ length: POINTS }, (_, i) => {
    if (i === POINTS - 1) return fixture.lab.power_w;
    const parts = hosts.map((h) => h.power_w[i]);
    return parts.some((p) => p === null) ? null : round(parts.reduce<number>((a, p) => a + (p ?? 0), 0), 1);
  });

  const streamsEnd = fixture.media?.streams ?? null;
  const media = fixture.media
    ? {
        streams: Array.from({ length: POINTS }, (_, i) => {
          if (i === GAP || streamsEnd === null) return null;
          const h = hoursAgo(i);
          return h <= 3 ? streamsEnd : h <= 5 ? Math.min(1, streamsEnd) : 0;
        }),
      }
    : null;

  const startMs = Math.floor(now / (STEP_S * 1000)) * STEP_S * 1000 - (POINTS - 1) * STEP_S * 1000;
  return {
    schema_version: 1,
    generated_at: new Date(now - 60_000).toISOString().replace(/\.\d{3}Z$/, 'Z'),
    interval_s: 300,
    stale_after_s: 900,
    start: new Date(startMs).toISOString().replace(/\.\d{3}Z$/, 'Z'),
    step_s: STEP_S,
    points: POINTS,
    lab: { power_w: labPower },
    hosts,
    gpus,
    media,
  };
}
