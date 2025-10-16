# **Developer Spec — Blog v2 (for `dleer-portfolio`)**

## **0\) TL;DR**

Ship a production blog system with:

* **MDX authoring** via Contentlayer (blog \+ projects)

* **Zen view** (fullscreen list) for posts & projects, with **j/k/Enter/Esc**

* **MDX shortcodes** (Window / Terminal / Admonition / Key / Figure) for your Unix aesthetic

* **Subtle cursor-reactive blob** background (reduced-motion aware)

* **Media on CDN** (R2/S3) \+ `next/image` remote config

* **ISR \+ on-demand revalidate**, SEO (sitemap, RSS/JSON, OG)

**Success:** LCP ≤ 2.5s desktop, CLS ≤ 0.02, p95 TTFB ≤ 500ms (CDN-cached list), a11y AA, zero console errors.

---

## **1\) Boundaries & Tech (unchanged foundations)**

* **Framework:** Next.js **15.x App Router**, TypeScript strict, Tailwind v4 (already the case). [GitHub](https://github.com/dleerdefi/dleer-portfolio)

* **Deploy:** Railway (Dockerfile present), env-driven configuration. [GitHub](https://github.com/dleerdefi/dleer-portfolio)

* **Aesthetic:** Hyprland/tiling desktop \+ mobile modes (keep existing layout system). [GitHub](https://github.com/dleerdefi/dleer-portfolio)

**New dependencies**

* `contentlayer` \+ `next-contentlayer`

* `remark-gfm`, `rehype-slug`, `rehype-autolink-headings`

* (Optional) `reading-time` or custom util

---

## **2\) Content Model**

### **Collections**

* **Blog**: `/content/blog/**/index.mdx`

* **Projects**: `/content/projects/**/index.mdx`

### **MDX front-matter (Blog)**

`---`  
`title: "Building Software Like a Builder"`  
`slug: "build-like-a-builder"`  
`summary: "Preconstruction mindset for solo devs using coding agents."`  
`date: 2025-10-16`  
`updated: 2025-10-16`  
`tags: [ai, workflow, devtools]`  
`cover: "https://cdn.example.com/blog/build-like-a-builder/cover.jpg"`  
`status: published # or draft`  
`series: "Preconstruction"`  
`---`

### **Contentlayer (outline)**

* `contentlayer.config.ts` defines `Blog` & `Project` types with required fields; computed fields: `url` (`/blog/${slug}`), `readingTime`, derived `ogTitle`.

* MDX pipeline: `remark-gfm`, `rehype-slug`, `rehype-autolink-headings`.

**Acceptance**

* Build generates typed content; `Blog` & `Project` are importable with TS types.

---

## **3\) Routing & UX**

### **New routes**

* **`/blog`** — Zen list (center column 65–72ch), selection \+ keyboard nav (j/k/Enter/Esc), density toggle.

* **`/blog/[slug]`** — MDX detail; shortcodes rendered; heading anchors; next/prev links.

* **`/projects`**, **`/projects/[slug]`** — same pattern.

### **Desktop tile integration**

* Existing tiles (desktop layout) keep showing “Blog” and “Projects” summaries; clicking them **opens the relevant Zen view fullscreen** (your “Zen mode”). (Your README notes a tiled layout foundation we can extend. [GitHub](https://github.com/dleerdefi/dleer-portfolio))

**Acceptance**

* Keyboard nav works in list page; `Esc` returns to list from detail; focus ring visible.

---

## **4\) MDX Shortcodes (Unix aesthetic)**

Create in `components/mdx/` and map via MDX provider:

* `<Window title="docs/SPEC.md">…</Window>`

* `<Terminal cmd="neofetch">…</Terminal>`

* `<Admonition type="tip|warn|note">…</Admonition>`

* `<Key>Super</Key>`

* `<Figure src alt caption />` → wraps `next/image` (requires `alt`)

**A11y**

* `<Figure>` enforces `alt`.

* Admonitions have proper roles and AA contrast in dark mode.

**Acceptance**

* Sample post renders all components; ESLint/TS flags if `alt` missing.

---

## **5\) Subtle Background Blob**

* File: `components/SubtleBlobBackground.tsx`

* Layered `radial-gradient` CSS updated via CSS variables on `requestAnimationFrame`.

* **Reduced motion:** Disable when `prefers-reduced-motion: reduce` or tab hidden.

* Placed in `app/layout.tsx` **behind tiles**: `pointer-events:none; z-index:-1;`

**Acceptance**

* Idle CPU \< 1% desktop; no layout shifts; passes reduced-motion toggle.

---

## **6\) Storage & Media**

* **Keep MDX in Git**, store large images/videos in **R2/S3 \+ CDN**.

* `next.config.ts` → `images.remotePatterns` to allow CDN origin.

* Front-matter `cover` uses absolute CDN URLs.

* Cache: immutable (`max-age=31536000, immutable`) \+ content-hashed filenames.

**Railway note:** No LFS in build paths to avoid deploy flakes. (Your repo is already Railway-ready. [GitHub](https://github.com/dleerdefi/dleer-portfolio))

**Acceptance**

* `next/image` resolves remote images without CLS; CDN headers verified.

---

## **7\) SEO & Feeds**

* **OG**: `/og/[slug]` (Satori/resvg) with title/summary; cached.

* **Feeds**: `/rss.xml`, `/feed.json` from Contentlayer output.

* **Sitemap**: `/sitemap.xml` with `lastmod = updated || date`.

* **Meta**: from front-matter; canonical URLs per post.

**Acceptance**

* OG validator passes; RSS validator passes; sitemap includes all published posts.

---

## **8\) Rendering & Caching**

* **ISR**:

  * Lists (`/blog`, `/projects`) → `revalidate: 300`

  * Details → `revalidate: 86400`

* **On-demand revalidate**: `/api/revalidate?secret=…&path=/blog` invoked from CI on merge.

**Acceptance**

* Merge to `main` updates lists within 5 min or immediately via webhook.

---

## **9\) Performance Budgets**

* LCP ≤ 2.5s (desktop cable) / 3.5s (Fast 3G)

* CLS ≤ 0.02 (provide width/height to `next/image`)

* JS ≤ 220KB gzip on detail (excluding Next runtime)

* No blocking third-party scripts

---

## **10\) Repo Layout (additions only)**

`/content`  
  `/blog/<slug>/index.mdx      # assets next to post if small`  
  `/projects/<slug>/index.mdx`  
`/components/mdx/`  
  `Window.tsx Terminal.tsx Admonition.tsx Key.tsx Figure.tsx`  
`/components/SubtleBlobBackground.tsx`  
`/lib/contentlayer.ts          # utilities (readingTime, getAllPosts)`  
`/app/blog/page.tsx`  
`/app/blog/[slug]/page.tsx`  
`/app/projects/page.tsx`  
`/app/projects/[slug]/page.tsx`  
`/app/api/revalidate/route.ts  # on-demand ISR`

---

## **11\) Work Packages (slices) & DoD**

### **M1 — Contentlayer plumbing**

**Tasks**

* Add `contentlayer` \+ config (Blog, Project).

* Wire MDX provider with `remark-gfm`, `rehype-slug`, `rehype-autolink-headings`.

* Create one sample blog post.

**DoD**

* `npm run build` generates types; `/blog` statically lists sample.

---

### **M2 — Shortcodes**

**Tasks**

* Implement Window/Terminal/Admonition/Key/Figure.

* Add tests for Figure (`alt` required) and Admonition contrasts.

**DoD**

* Sample post renders shortcodes; a11y checks pass.

---

### **M3 — Zen List \+ Keyboard Nav**

**Tasks**

* `/blog` and `/projects` list pages with **j/k/Enter/Esc**.

* Density toggle; 65–72ch column; selection ring.

**DoD**

* Playwright e2e: navigate list, open detail, `Esc` returns.

---

### **M4 — Background Blob**

**Tasks**

* Add `SubtleBlobBackground` to `app/layout.tsx`.

* Ensure reduced-motion and visibility guards.

**DoD**

* CPU idle \<1%; audit passes reduced-motion.

---

### **M5 — CDN wiring**

**Tasks**

* Add `images.remotePatterns` for `cdn.yourdomain.com`.

* Replace sample covers with CDN URLs; confirm caching.

**DoD**

* No CLS on images; CDN headers `immutable`.

---

### **M6 — SEO/Feeds/OG**

**Tasks**

* Metadata functions; `/og/[slug]`; `/rss.xml`, `/feed.json`, `/sitemap.xml`.

**DoD**

* Validators green; OG cards render; social share looks correct.

---

### **M7 — ISR \+ CI guards**

**Tasks**

* `revalidate` strategy; add `/api/revalidate`.

* GitHub Action: on merge → call revalidate.

* CI check: fail build if any **LFS pointer** is under `content/` or `public/`.

**DoD**

* Merge updates prod; CI blocks pointer accidents.

---

## **12\) Implementation Notes**

### **MDX Provider (sketch)**

`// app/providers/mdx.tsx`  
`import { MDXProvider } from "@mdx-js/react";`  
`import Window from "@/components/mdx/Window";`  
`import Terminal from "@/components/mdx/Terminal";`  
`import Admonition from "@/components/mdx/Admonition";`  
`import Key from "@/components/mdx/Key";`  
`import Figure from "@/components/mdx/Figure";`

`export const mdxComponents = { Window, Terminal, Admonition, Key, Figure };`  
`export function WithMDX({ children }: { children: React.ReactNode }) {`  
  `return <MDXProvider components={mdxComponents}>{children}</MDXProvider>;`  
`}`

### **Layout hook**

* Add `<SubtleBlobBackground />` inside `app/layout.tsx` just under `<body>` to sit behind tiles.

### **Keyboard nav**

* In `/blog/page.tsx`, capture keydown on the main container; do **not** trap globally. Respect focus outlines.

---

## **13\) Testing**

**Unit**

* Shortcodes: prop validation, a11y (alt required), focus styles.

**E2E (Playwright)**

* `/blog` loads, `j/k` changes selection, `Enter` opens, `Esc` returns.

* Anchor links on headings copy to clipboard (optional).

**Lighthouse CI**

* Budgets: LCP/CLS/JS size; run on `/blog` & one post.

---

## **14\) Dev & Build Commands**

* `npm run dev` — local dev

* `npm run build && npm run start` — production

* `npm run typecheck && npm run lint` — quality gates

(Your README already documents setup and deploy flows; we’ll extend it with content instructions. [GitHub](https://github.com/dleerdefi/dleer-portfolio))

---

## **15\) Environment Variables**

`NEXT_PUBLIC_CDN_ORIGIN=https://cdn.yourdomain.com`  
`REVALIDATE_SECRET=…   # for /api/revalidate`

(Keep your existing contact/env variables as-is. [GitHub](https://github.com/dleerdefi/dleer-portfolio))

---

## **16\) Guardrails**

* **Pre-commit** hook blocks \>1MB binaries under `content/`.

**CI** fails if LFS pointer text appears in `content/` or `public/`:

 `grep -R --binary-files=without-match -n "git-lfs.github.com/spec" content public && \`  
  `echo "❌ LFS pointer detected. Move media to CDN." && exit 1 || echo "✓ No LFS pointers"`

* 

---

## **17\) Open Questions**

* Do you want **series pages** (`/series/[name]`) now or later?

* Add **math** support (remark-math \+ rehype-katex)?

* Any need for **draft preview mode** (private bucket with signed URLs)?

---

If you’d like, I can turn **M1–M7** into PR-ready task cards (with file paths & starter diffs) so you or Claude Code can implement slice-by-slice with minimal friction.

blog\_code\_example.ts 

"use client";  
import React, { useEffect, useMemo, useRef, useState } from "react";

export default function BlogDemo() {  
  return (  
    \<div className="relative min-h-screen bg-\[\#0f1115\] text-zinc-200 antialiased"\>  
      \<BlobBackground /\>  
      \<div className="max-w-5xl mx-auto px-4 py-10"\>  
        \<header className="mb-6 flex items-center justify-between"\>  
          \<h1 className="text-2xl font-semibold tracking-tight"\>\~/blog — Zen\</h1\>  
          \<div className="text-sm text-zinc-400"\>j/k to move · Enter open · Esc back\</div\>  
        \</header\>  
        \<div className="grid gap-6 md:grid-cols-\[320px\_1fr\]"\>  
          \<Sidebar /\>  
          \<ZenArea /\>  
        \</div\>  
      \</div\>  
    \</div\>  
  );  
}

function Sidebar() {  
  const items \= \[  
    { k: "j/k", v: "Move selection" },  
    { k: "Enter", v: "Open post" },  
    { k: "Esc", v: "Back to list" },  
    { k: "g/G", v: "Top/Bottom" },  
  \];  
  return (  
    \<div className="hidden md:block"\>  
      \<Window title="Shortcuts"\>  
        \<ul className="space-y-2 text-sm"\>  
          {items.map((i) \=\> (  
            \<li key={i.k} className="flex items-center gap-2"\>  
              \<kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs"\>  
                {i.k}  
              \</kbd\>  
              \<span className="text-zinc-400"\>{i.v}\</span\>  
            \</li\>  
          ))}  
        \</ul\>  
      \</Window\>  
      \<div className="mt-6"\>  
        \<Window title="Appearance"\>  
          \<div className="flex items-center justify-between text-sm"\>  
            \<span className="text-zinc-400"\>Density\</span\>  
            \<div className="flex items-center gap-2"\>  
              \<button className="px-2 py-1 rounded bg-zinc-800 border border-zinc-700 hover:bg-zinc-700"\>Cozy\</button\>  
              \<button className="px-2 py-1 rounded bg-zinc-800 border border-zinc-700 hover:bg-zinc-700"\>Compact\</button\>  
            \</div\>  
          \</div\>  
        \</Window\>  
      \</div\>  
    \</div\>  
  );  
}

function ZenArea() {  
  const \[mode, setMode\] \= useState("list"); // "list" | "detail"  
  const \[idx, setIdx\] \= useState(0);  
  const posts \= useMemo(  
    () \=\> \[  
      {  
        title: "Build Software Like a Builder",  
        slug: "build-like-a-builder",  
        summary: "Preconstruction mindset for solo devs using AI agents.",  
        date: "2025-10-16",  
        tags: \["ai", "workflow", "spec"\],  
      },  
      {  
        title: "GraphRAG in Practice",  
        slug: "graphrag-practice",  
        summary: "Neo4j \+ Contentlayer \+ agents for personal knowledge.",  
        date: "2025-09-28",  
        tags: \["neo4j", "rag", "agents"\],  
      },  
      {  
        title: "Homelab: Hyprland Dev Setup",  
        slug: "hyprland-dev-setup",  
        summary: "Unixporn aesthetics for productive coding.",  
        date: "2025-10-08",  
        tags: \["hyprland", "unix", "tiling"\],  
      },  
    \],  
    \[\]  
  );

  // keyboard navigation  
  useEffect(() \=\> {  
    const onKey \= (e) \=\> {  
      if (mode \=== "list") {  
        if (e.key \=== "j") setIdx((i) \=\> Math.min(i \+ 1, posts.length \- 1));  
        if (e.key \=== "k") setIdx((i) \=\> Math.max(i \- 1, 0));  
        if (e.key \=== "Enter") setMode("detail");  
        if (e.key \=== "g") setIdx(0);  
        if (e.key \=== "G") setIdx(posts.length \- 1);  
      } else {  
        if (e.key \=== "Escape") setMode("list");  
      }  
    };  
    window.addEventListener("keydown", onKey);  
    return () \=\> window.removeEventListener("keydown", onKey);  
  }, \[mode, posts.length\]);

  if (mode \=== "detail") return \<PostDetail onBack={() \=\> setMode("list")} post={posts\[idx\]} /\>;

  return (  
    \<Window title="/blog — Zen view"\>  
      \<ul className="divide-y divide-zinc-800"\>  
        {posts.map((p, i) \=\> (  
          \<li  
            key={p.slug}  
            className={  
              "flex items-start gap-4 p-4 hover:bg-zinc-900/50 " \+  
              (i \=== idx ? "ring-1 ring-indigo-500/60 rounded bg-zinc-900/60" : "")  
            }  
          \>  
            \<div className="mt-1 text-xs text-zinc-500 w-28 shrink-0"\>{formatDate(p.date)}\</div\>  
            \<div className="flex-1"\>  
              \<div className="flex items-center gap-2"\>  
                \<h3 className="text-base font-medium"\>{p.title}\</h3\>  
                \<span className="text-\[10px\] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"\>{p.tags\[0\]}\</span\>  
              \</div\>  
              \<p className="text-sm text-zinc-400 mt-1 line-clamp-2"\>{p.summary}\</p\>  
            \</div\>  
            \<button  
              className="ml-auto text-xs px-2 py-1 rounded bg-zinc-800 border border-zinc-700 hover:bg-zinc-700"  
              onClick={() \=\> setMode("detail")}  
            \>  
              Open  
            \</button\>  
          \</li\>  
        ))}  
      \</ul\>  
    \</Window\>  
  );  
}

function PostDetail({ onBack, post }) {  
  return (  
    \<div className="space-y-6"\>  
      \<div className="flex items-center justify-between"\>  
        \<button  
          onClick={onBack}  
          className="px-2.5 py-1.5 rounded bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-sm"  
        \>  
          ← Back  
        \</button\>  
        \<div className="text-xs text-zinc-500"\>{formatDate(post.date)}\</div\>  
      \</div\>

      \<Window title={\`\~/blog/${post.slug}.mdx\`}\>  
        \<article className="prose prose-invert max-w-none"\>  
          \<h1 className="\!mb-2"\>{post.title}\</h1\>  
          \<p className="\!mt-0 text-zinc-400"\>{post.summary}\</p\>

          \<Admonition type="tip"\>Rule: SPEC leads the code. Update the spec first, then implement.\</Admonition\>

          \<Terminal cmd="neofetch"\>  
            Project: TodoSync  
Stack: Next.js \+ FastAPI \+ Postgres \+ Redis  
          \</Terminal\>

          \<h2\>Why MDX\</h2\>  
          \<p\>  
            MDX lets us keep the Unix aesthetic via components like \<Key\>Super\</Key\>+\<Key\>V\</Key\> and  
            windowed frames while preserving Markdown ergonomics.  
          \</p\>

          \<Window title="docs/SPEC.md"\>  
            \<pre className="text-xs whitespace-pre-wrap leading-relaxed"\>  
{\`\#\# 4\. Acceptance Criteria  
\- Complete moves task to Done in \< 1s (200 OK, optimistic UI).  
\- Sync p50 \< 800ms across two devices.\`}  
            \</pre\>  
          \</Window\>

          \<Figure src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200\&q=80" alt="Code desk" caption="Unix vibes, clean contrasts." /\>  
        \</article\>  
      \</Window\>  
    \</div\>  
  );  
}

/\* \---- UI Atoms (Unix/Hyprland shortcodes) \---- \*/  
function Window({ title, children }) {  
  return (  
    \<div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 shadow-\[0\_0\_0\_1px\_rgba(255,255,255,0.02)\_inset\] overflow-hidden"\>  
      \<div className="flex items-center gap-2 px-3 py-2 border-b border-zinc-800/80 bg-zinc-900/60"\>  
        \<div className="flex gap-1.5"\>  
          \<Dot className="bg-red-500/80" /\>  
          \<Dot className="bg-yellow-500/80" /\>  
          \<Dot className="bg-green-500/80" /\>  
        \</div\>  
        \<div className="ml-3 text-xs text-zinc-400 truncate"\>{title}\</div\>  
      \</div\>  
      \<div className="p-4"\>{children}\</div\>  
    \</div\>  
  );  
}

function Dot({ className \= "" }) {  
  return \<span className={"inline-block h-2.5 w-2.5 rounded-full " \+ className} /\>;  
}

function Terminal({ cmd, children }) {  
  return (  
    \<div className="rounded-xl border border-zinc-800 bg-\[\#0b0d10\] overflow-hidden"\>  
      \<div className="px-3 py-2 text-\[11px\] text-zinc-400 border-b border-zinc-800"\>dleer@omarchy \~ $ {cmd}\</div\>  
      \<pre className="p-3 text-\[12px\] leading-relaxed text-zinc-200 whitespace-pre-wrap"\>{children}\</pre\>  
    \</div\>  
  );  
}

function Admonition({ type \= "note", children }) {  
  const theme \= {  
    tip: {  
      ring: "ring-emerald-400/30",  
      bg: "bg-emerald-400/5",  
      text: "text-emerald-200",  
      label: "Tip",  
    },  
    warn: {  
      ring: "ring-amber-400/30",  
      bg: "bg-amber-400/5",  
      text: "text-amber-200",  
      label: "Warning",  
    },  
    note: {  
      ring: "ring-sky-400/30",  
      bg: "bg-sky-400/5",  
      text: "text-sky-200",  
      label: "Note",  
    },  
  }\[type\];

  return (  
    \<div className={\`rounded-xl border border-zinc-800 ${theme.bg} ${theme.ring} ring-1 p-3 my-4\`}\>  
      \<div className={\`text-xs font-medium ${theme.text} mb-1\`}\>{theme.label}\</div\>  
      \<div className="text-sm text-zinc-200"\>{children}\</div\>  
    \</div\>  
  );  
}

function Key({ children }) {  
  return (  
    \<kbd className="inline-flex items-center px-1.5 py-0.5 rounded border border-zinc-700 bg-zinc-900 text-\[11px\] text-zinc-200"\>  
      {children}  
    \</kbd\>  
  );  
}

function Figure({ src, alt, caption }) {  
  return (  
    \<figure className="my-4"\>  
      {/\* Using \<img\> here for the sandbox; swap to next/image in app \*/}  
      \<img src={src} alt={alt} className="w-full rounded-lg border border-zinc-800" /\>  
      {caption && \<figcaption className="mt-2 text-xs text-zinc-500"\>{caption}\</figcaption\>}  
    \</figure\>  
  );  
}

/\* \---- Subtle background blob (CSS gradients) \---- \*/  
function BlobBackground() {  
  const ref \= useRef(null);  
  const target \= useRef({ x: 0.5, y: 0.5 });  
  const p1 \= useRef({ x: 0.3, y: 0.35 });  
  const p2 \= useRef({ x: 0.7, y: 0.6 });  
  const p3 \= useRef({ x: 0.5, y: 0.8 });

  useEffect(() \=\> {  
    const el \= ref.current;  
    if (\!el) return;  
    const reduce \= window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;  
    if (reduce) return; // keep static

    const onMove \= (e) \=\> {  
      target.current.x \= e.clientX / window.innerWidth;  
      target.current.y \= e.clientY / window.innerHeight;  
    };  
    const lerp \= (a, b, t) \=\> a \+ (b \- a) \* t;

    let raf;  
    const tick \= () \=\> {  
      p1.current.x \= lerp(p1.current.x, target.current.x, 0.12);  
      p1.current.y \= lerp(p1.current.y, target.current.y, 0.12);  
      p2.current.x \= lerp(p2.current.x, target.current.x, 0.08);  
      p2.current.y \= lerp(p2.current.y, target.current.y, 0.08);  
      p3.current.x \= lerp(p3.current.x, target.current.x, 0.05);  
      p3.current.y \= lerp(p3.current.y, target.current.y, 0.05);

      el.style.setProperty('--b1x', \`${(p1.current.x \* 100).toFixed(2)}%\`);  
      el.style.setProperty('--b1y', \`${(p1.current.y \* 100).toFixed(2)}%\`);  
      el.style.setProperty('--b2x', \`${(p2.current.x \* 100).toFixed(2)}%\`);  
      el.style.setProperty('--b2y', \`${(p2.current.y \* 100).toFixed(2)}%\`);  
      el.style.setProperty('--b3x', \`${(p3.current.x \* 100).toFixed(2)}%\`);  
      el.style.setProperty('--b3y', \`${(p3.current.y \* 100).toFixed(2)}%\`);

      raf \= requestAnimationFrame(tick);  
    };  
    window.addEventListener('mousemove', onMove, { passive: true });  
    raf \= requestAnimationFrame(tick);  
    return () \=\> {  
      window.removeEventListener('mousemove', onMove);  
      cancelAnimationFrame(raf);  
    };  
  }, \[\]);

  const bg \= {  
    background: \`  
      radial-gradient(40vmax 40vmax at var(--b1x, 30%) var(--b1y, 35%), rgba(136,192,208,0.09) 0%, transparent 60%),  
      radial-gradient(36vmax 36vmax at var(--b2x, 70%) var(--b2y, 60%), rgba(163,190,140,0.08) 0%, transparent 65%),  
      radial-gradient(32vmax 32vmax at var(--b3x, 50%) var(--b3y, 75%), rgba(180,142,173,0.09) 0%, transparent 70%)  
    \`,  
    filter: 'blur(28px)',  
    mixBlendMode: 'lighten',  
  };

  return \<div ref={ref} className="fixed inset-0 \-z-10 pointer-events-none" style={bg} /\>;  
}

function formatDate(s) {  
  try {  
    return new Date(s).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });  
  } catch {  
    return s;  
  }  
}  
2