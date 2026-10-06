# Railway Memory Optimization
## Reducing RAM cost of the portfolio service on Railway

**Status**: Implemented (pending merge to `main`)
**Created**: 2026-10-06

---

## Table of Contents

1. [Summary](#summary)
2. [Production Baseline](#production-baseline)
3. [Methodology](#methodology)
4. [Findings](#findings)
5. [Changes Implemented](#changes-implemented)
6. [Results](#results)
7. [Deployment & Verification](#deployment--verification)
8. [Rollback Procedure](#rollback-procedure)
9. [Investigated, Not Changed](#investigated-not-changed)
10. [Optional Further Savings](#optional-further-savings)
11. [Reproducing the Measurements](#reproducing-the-measurements)

---

## Summary

The portfolio service on Railway holds **~0.5 GB of RAM around the clock**
while using almost no CPU. Railway bills
memory at **$10 per GB-month** on actual usage, so RAM is effectively the
whole bill.

Profiling a local copy of the production setup showed that almost none of
that memory is doing useful work:

| Cause | RAM | Fix |
|---|---|---|
| glibc fragmentation from sharp (`/_next/image` resizing) | ~310 MB | Two `malloc` env vars |
| Idle `npm` parent process from `npm run start` | ~60 MB | Start `next` directly |

Two config-only changes (`railway.toml`, `next.config.ts`) cut steady-state
memory from **~600 MB to ~213 MB (−65%)** in the local copy, with **no measurable
change** to page or image latency. Expected RAM cost drops from roughly
**$4.90/month to $2.20/month**.

No application code, routes, rendering, or build output changed.

---

## Production Baseline

Railway metrics for the production service, taken 2026-10-06, covering the
7 days after the 2026-09-30 deploy:

| Metric | Value |
|---|---|
| Memory (current) | 0.495 GB |
| Memory (24h / 72h average) | 0.504 GB / 0.493 GB |
| Memory (min / max since deploy) | 0.458 GB / 0.574 GB |
| CPU (average) | 0.00005 vCPU (≈ $0.001/month) |
| HTTP requests (7 days) | 4,582 total, ~650/day |
| Status mix | 2xx 949 · 3xx 342 · **4xx 3,291 (72%)** · 5xx 0 |

The 4xx traffic is almost entirely vulnerability scanners (`/.env`,
`/wp-admin/install.php`, `/.git/config`, `/xmlrpc.php`, fake Server Action
POSTs, and similar). Real visitors are a small fraction of requests.

Memory is **flat**, not growing: it reaches ~0.46–0.57 GB shortly after the
first visitors and stays there. That pattern points to memory held by the
process rather than a leak or traffic load.

Deployment details (from build logs):

- Builder: Railpack 0.40.1, Node 22.23.2, Debian trixie (glibc 2.41)
- Build: `npm run build` → standard (non-standalone) `.next` output
- Start (before this change): `npm run start` → `next start`
- Almost every page is prerendered (`○` static / `●` SSG). Only
  `/api/contact`, `/api/revalidate`, `/rss.xml`, and `/feed.json` are dynamic.

---

## Methodology

Production couldn't be profiled in place, so a local copy was built and
measured under simulated traffic:

1. `npm install` + `npm run build` with the production `NEXT_PUBLIC_CDN_URL`
   and `NEXT_PUBLIC_SITE_URL`.
2. Started the server **exactly as Railway does** (`npm run start`, `PORT=8080`,
   `NODE_ENV=production`).
3. Ran traffic in phases and measured after each one:
   - Static pages: `/`, `/blog`, `/projects`, sitemap, RSS, JSON feed
   - SSG detail pages: all blog posts and several project pages
   - Bot scans: the most common 404 probes seen in Railway HTTP logs, plus
     fake Server Action POSTs
   - Audio: full downloads of all 4 MP3s (~12 MB)
   - Image optimizer: every image in `public/images` at 5 `srcset` widths
     through `/_next/image` (same sharp pipeline as CDN-sourced images)
   - Two more full passes of everything, then 20 s idle
4. Recorded RSS/PSS for the whole process tree (`/proc/<pid>/smaps_rollup`)
   and `process.memoryUsage()` inside the Next server (via a `-r` preload hook).

The local copy reached **~615 MB**, close to the 460–570 MB Railway reports,
so it reproduces the production problem.

Environment differences: local was Ubuntu glibc 2.39, Node 22.22, 4 vCPU.
Production is Debian glibc 2.41, Node 22.23, on a larger shared host.

---

## Findings

### Memory by traffic type (before)

| Phase | Total RSS | Next server RSS | JS heap used | Δ vs previous |
|---|---|---|---|---|
| Idle after boot | 301 MB | 217 MB | 67 MB | — |
| Static pages | 304 MB | 220 MB | 71 MB | +3 MB |
| SSG detail pages | 306 MB | 222 MB | 78 MB | +2 MB |
| Bot 404 scans | 308 MB | 224 MB | 72 MB | +2 MB |
| Audio downloads | 302 MB | 225 MB | 73 MB | ~0 |
| **Image optimizer (sharp)** | **611 MB** | **536 MB** | **62 MB** | **+309 MB** |
| 2 more full passes + idle | 622 MB | 546 MB | 68 MB | +11 MB |

Key observations:

1. **Pages, bots, and audio cost almost nothing.** The site is prerendered,
   so requests are served from disk.
2. **The image optimizer accounts for ~310 MB**, and it's **native memory,
   not JavaScript**. The JS heap stays around 60–80 MB while RSS jumps by
   300 MB. sharp/libvips allocate and free large pixel buffers through
   glibc `malloc`, and glibc's per-thread arenas and dynamic mmap threshold
   keep that memory reserved instead of returning it to the OS. sharp's own
   documentation calls out the glibc allocator as unsuitable for this
   workload.
3. **`npm run start` adds a resident `npm` process** (~60 MB RSS) whose only
   job is to spawn `next start`.
4. Next.js 15's default `images.minimumCacheTTL` is **60 seconds**. Optimized
   images served with `Cache-Control: public, max-age=60, must-revalidate`
   go stale after a minute, so on a low-traffic site almost every visit
   causes sharp to reprocess those images in the background.

### Allocator experiments

All runs used the same traffic script:

| Configuration | After images | Steady state (after idle) |
|---|---|---|
| `npm run start` (production today) | 611 MB | 622 MB |
| + `MALLOC_ARENA_MAX=2` | 391 MB | 401 MB |
| + jemalloc (`LD_PRELOAD`) | 403 MB | 358 MB |
| `next start` direct + `MALLOC_ARENA_MAX=2` | 296 MB | 286 MB |
| direct + jemalloc | 317 MB | 253 MB |
| **direct + `MALLOC_ARENA_MAX=2` + `MALLOC_MMAP_THRESHOLD_=131072`** | **228 MB** | **217 MB** |
| standalone `server.js` + same malloc vars (optional, see below) | 167 MB | 158 MB |

`MALLOC_MMAP_THRESHOLD_=131072` forces allocations ≥128 KB (decoded image
buffers) onto `mmap`, so they go back to the OS as soon as they're freed.
`MALLOC_ARENA_MAX=2` caps how many separate heaps glibc creates per thread.
Together they beat jemalloc, need no extra apt package, and keep sharp's
behavior as it is today (sharp lowers its concurrency to 1 when it detects
glibc; with jemalloc it would raise it to the host's core count).

---

## Changes Implemented

### 1. `railway.toml`: tuned start command

```toml
startCommand = "MALLOC_ARENA_MAX=2 MALLOC_MMAP_THRESHOLD_=131072 exec node_modules/.bin/next start"
```

- Same `next start` server as before, with no npm process in front of it.
- Railpack runs start commands in a shell, so the env-var prefix works.
  The variables live in the repo instead of the Railway dashboard.
- `exec` makes Next PID 1. Next.js installs its own `SIGTERM` handler
  (`start-server.js`), so redeploys shut it down cleanly. This was verified
  locally.
- Port binding (`PORT=8080` from Railway) and the `/` healthcheck behave
  the same as today.

### 2. `next.config.ts`: `images.minimumCacheTTL: 14400`

- Optimized images stay cached for 4 hours instead of 60 seconds. This is
  the value Next.js 16 adopted as its new default.
- sharp runs far less often, which cuts memory spikes and CPU.
- Browsers also cache images longer (`max-age=14400`), so repeat visits
  load faster and use less egress.
- Trade-off: if an image is replaced on the CDN **under the same filename**,
  visitors may see the old version for up to 4 hours. A redeploy clears the
  server-side cache. New filenames show up immediately.

---

## Results

### Memory (same traffic script)

| Phase | Before | After | Change |
|---|---|---|---|
| Idle after boot | 285 MB | 200 MB | −30% |
| After image optimizer pass | 611 MB | 225 MB | −63% |
| After 2 more full passes | 619 MB | 230 MB | −63% |
| Steady state (20 s idle) | 600 MB | 213 MB | **−65%** |

### Latency (2 runs each, 60 requests per route)

| Route | Before p50 / p95 | After p50 / p95 |
|---|---|---|
| `/` | 1.5–1.8 / 2.4–3.3 ms | 1.6 / 2.5–3.0 ms |
| `/blog/local-ai-prepping-2025` | 2.1–2.3 / 2.8–3.3 ms | 2.1–2.3 / 2.7–3.2 ms |
| `/projects/peak-ai-agent-stack` | 1.7–1.8 / 2.0 ms | 1.8–2.1 / 2.4–2.5 ms |
| Warm `/_next/image` (1920w) | 1.7–1.9 / 2.1–2.4 ms | 1.7–1.9 / 2.2–4.0 ms |
| Cold optimization of 60 image variants | 11.3–12.0 s | 11.8 s |

The differences are within run-to-run noise.

### Functional checks

- `npm run typecheck`: pass
- `npm run lint`: pass (only the existing `PostAudio.tsx` hooks warning)
- `npm run build`: 25/25 pages generated, same route table as before
- `/`, `/blog`, a blog post, a project page, `/rss.xml`, fonts, and audio
  all return 200
- `/_next/image` returns `image/webp` with `Cache-Control: public, max-age=14400, must-revalidate`
- Both env vars confirmed in the running process's environment
- Process exits cleanly on `SIGTERM`

### Estimated cost

| | Average RAM | RAM cost/month |
|---|---|---|
| Before | ~0.49 GB | ~$4.90 |
| After (estimated) | ~0.21–0.23 GB | ~$2.10–2.30 |

CPU cost is negligible in both cases (< $0.01/month). The "after" figure
comes from the local copy; confirm it on Railway's metrics graph once
deployed.

---

## Deployment & Verification

1. Merge this branch into `main`. Railway auto-deploys from `main`.
2. Railway switches traffic to the new deployment only after its
   healthcheck (`GET /`) passes. If it fails, the current deployment keeps
   serving.
3. Check the deploy logs:
   - You should see `▲ Next.js 15.5.9` and `✓ Ready`, with **no**
     `> dleer-portfolio@0.1.0 start` / `npm warn` lines (npm no longer runs).
4. Spot-check the site: home page, a blog post with images, the background
   switcher, and the audio player.
5. After ~24 hours, open the service's **Metrics → Memory** tab in Railway. Expect roughly 0.2–0.25 GB instead of ~0.5 GB.

---

## Rollback Procedure

Either:

- **Fast:** in Railway, roll back to the previous deployment (Deployments
  → previous successful deploy → Rollback), or
- **Config:** revert the commit. Restoring the old `railway.toml` (no
  `startCommand`) brings back `npm run start`, and removing
  `minimumCacheTTL` restores the 60 s default.

Neither change touches data, routes, or the build, so rollback is safe.

---

## Investigated, Not Changed

| Idea | Result | Decision |
|---|---|---|
| Remove ISR `revalidate = 86400` from blog/project pages | Content is compiled at build time, so revalidating can never produce new output. But simulating a regeneration of every page moved RSS by < 10 MB (page modules are already loaded on first request). | Not worth changing for cost |
| Block bot scans | Measured +2 MB for a full scan burst | Not a cost driver (see optional WAF note) |
| Audio files served from Railway | No lasting memory impact (streamed from disk) | Not a cost driver |
| JS heap tuning (`--max-old-space-size`, semi-space) | Heap is only 60–110 MB; the problem was native memory | Not needed |
| Railway Serverless (app sleeping) | Would add cold-start latency for the first visitor after idle, and constant bot traffic would keep waking it | Rejected (affects UX) |
| Lowering the service memory limit | Billing follows usage, not limits; a too-low limit risks OOM restarts | Not needed |

---

## Optional Further Savings

These aren't implemented. Each trades extra setup or risk for further
savings.

### Option A: Next.js standalone output (−60 MB more, ~$0.60/month)

Measured locally: **158 MB** steady state (vs 213 MB after this change). It
also shrinks the runtime app from ~606 MB of `node_modules` to ~86 MB.

Steps:

1. `next.config.ts`: add `output: 'standalone'`.
2. `package.json`: copy assets into the standalone folder after the build:
   ```json
   "build": "next build && cp -r public .next/standalone/ && cp -r .next/static .next/standalone/.next/"
   ```
3. `railway.toml`:
   ```toml
   startCommand = "HOSTNAME=0.0.0.0 MALLOC_ARENA_MAX=2 MALLOC_MMAP_THRESHOLD_=131072 exec node .next/standalone/server.js"
   ```

Why it isn't done yet: this repo tried standalone before (commits
`574159d` → `94eec39`) and backed it out after healthcheck failures. The
usual causes are a missing `HOSTNAME=0.0.0.0` (standalone binds to the
container hostname by default) and `public/` / `.next/static` not being
copied. Both are handled above, but the saving is small relative to the
risk of another deploy debugging session.

### Option B: Offload image resizing to Cloudflare (removes sharp from the server)

Images already come from `cdn.dleer.ai` (R2 behind Cloudflare). With
Cloudflare **Image Transformations** enabled on the `dleer.ai` zone, a Next.js
custom loader can request resized images straight from Cloudflare's edge.
`/_next/image` and sharp then never run on Railway.

- Expected: server memory near the ~150–200 MB floor regardless of image
  traffic, faster image delivery from Cloudflare's edge cache, and less
  Railway egress.
- Cost: Cloudflare includes a monthly allowance of free unique
  transformations (5,000/month at the time of writing; verify in the
  Cloudflare dashboard). This site's few dozen images × a handful of
  widths fits well inside that.
- Sketch:
  ```ts
  // next.config.ts
  images: { loader: 'custom', loaderFile: './lib/cloudflare-image-loader.ts' }

  // lib/cloudflare-image-loader.ts
  export default function cloudflareLoader({ src, width, quality }: {
    src: string; width: number; quality?: number;
  }) {
    const cdn = process.env.NEXT_PUBLIC_CDN_URL;
    if (!cdn || !src.startsWith(cdn)) return src; // local/dev fallback
    const path = src.slice(cdn.length);
    return `${cdn}/cdn-cgi/image/width=${width},quality=${quality ?? 75},format=auto${path}`;
  }
  ```
- Prerequisites and caveats: enable Image Transformations for the zone in
  Cloudflare (Images → Transformations). Make sure the local fallback still
  works for forks without a CDN. Test the background, profile photo, and
  MDX `Figure` images. **Not tested in this audit**, because the CDN wasn't
  reachable from the test environment.

### Option C: Static hosting (eliminates the Railway service)

Every page is already prerendered. With `output: 'export'` the site could
be served from Cloudflare Pages (or R2 + Cloudflare) at little or no cost.

- Blockers: `/api/contact` (Resend) would need to move to a Cloudflare
  Worker / Pages Function. `/api/revalidate` would go away (it isn't needed,
  since content changes require a rebuild anyway). `/rss.xml` and
  `/feed.json` would need to become static route handlers. `next/image`
  optimization would need Option B or pre-sized images.
- Largest saving (the Railway bill for this service goes to $0), but also
  the largest change. Treat it as a project, not a tweak.

### Option D: Cloudflare WAF rule for scanner traffic (hygiene, not cost)

72% of requests are vulnerability probes. If `dleer.ai` is proxied through
Cloudflare, a free WAF custom rule can block paths like `/.env*`, `/.git/*`,
`/wp-*`, `/xmlrpc.php`, and `/@fs/*` at the edge. This won't measurably
change RAM, but it reduces log noise (including the recurring
`Failed to find Server Action "x"` errors) and attack surface.

---

## Reproducing the Measurements

```bash
# Build like production
NEXT_PUBLIC_CDN_URL=https://cdn.dleer.ai NEXT_PUBLIC_SITE_URL=https://dleer.ai npm run build

# Before: how production started previously
PORT=8080 NODE_ENV=production npm run start

# After: the railway.toml start command
PORT=8080 NODE_ENV=production bash -c \
  'MALLOC_ARENA_MAX=2 MALLOC_MMAP_THRESHOLD_=131072 exec node_modules/.bin/next start'

# Exercise the image optimizer (repeat for each image/width), then check RSS
curl -s -o /dev/null "http://localhost:8080/_next/image?url=%2Fimages%2Fshiny_purple.webp&w=1920&q=85"
ps -o rss=,args= -C node   # RSS in KB
```

Delete `.next/cache/images` between runs so each run starts with a cold
image cache.
