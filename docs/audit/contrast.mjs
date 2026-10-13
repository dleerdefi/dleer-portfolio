// Text contrast as rendered (WCAG 1.4.3): every visible text run against the pixels behind it.
// The desktop tiles are glass over a wallpaper, which axe and Lighthouse cannot see through (they
// report that text as "needs review"), so this records each run's color and boxes, hides all text,
// screenshots, and compares the run's color with the worst 10 % of the pixels behind it.
//
//   AUDIT_BASE=http://localhost:3111 node docs/audit/contrast.mjs
//
// Covers each preset with each of its wallpapers: the home page (its stage views and the tray's
// popovers) and the framed pages scrolled through. Options: PRESETS=nord,... WALLPAPERS=first
// (only each preset's first) ACCENTS=all (also the home page with each of the 15 accents)
// VP=390x844 (a phone: Tokyo Night, the home page scrolled through). Exits 1 on any failure.
// Needs playwright-core and a Chromium, as audit-shots.mjs does; build with the lab and the threat
// map on (LAB_DEMO_DATA=true at runtime) to cover them.
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.AUDIT_BASE || 'http://localhost:3111';
const [VW, VH] = (process.env.VP || '1440x900').split('x').map(Number);
const PHONE = VW < 1024;
const ROUTES = ['/projects', '/projects/homelab', '/projects/agentcm', '/blog', '/blog/local-ai-prepping-2025', '/lab', '/lab/threats', '/no-such-page'];
const ACCENTS = ['rose', 'pink', 'fuchsia', 'purple', 'violet', 'indigo', 'blue', 'sky', 'cyan', 'teal', 'emerald', 'green', 'lime', 'amber', 'orange'];

// The wallpapers each preset offers, read from lib/wallpapers.ts
const src = fs.readFileSync(path.join(path.dirname(new URL(import.meta.url).pathname), '../../lib/wallpapers.ts'), 'utf8');
const WALLS = {};
for (const m of src.matchAll(/'([\w-]+)': \[([^\]]*)\]/g)) WALLS[m[1]] = [...m[2].matchAll(/getImageUrl\('([^']+)'\)/g)].map((x) => x[1]);
const PRESETS = PHONE ? ['tokyo-night'] : (process.env.PRESETS || Object.keys(WALLS).join(',')).split(',');

function findChrome() {
  if (process.env.AUDIT_CHROME) return process.env.AUDIT_CHROME;
  const root = process.env.PLAYWRIGHT_BROWSERS_PATH;
  const dir = root && fs.existsSync(root) && fs.readdirSync(root).find((d) => /^chromium-\d+$/.test(d));
  return dir ? path.join(root, dir, 'chrome-linux', 'chrome') : undefined;
}

// In the page: each visible text run's color (as painted, via a canvas), size, and the parts of its
// boxes that show: inside every scroller, inside the frame on framed pages, mostly in view, and not
// under something else (a popover)
function collect() {
  const out = []; const W = innerWidth, H = innerHeight;
  const cv = document.createElement('canvas'); cv.width = cv.height = 1; const cx = cv.getContext('2d', { willReadFrequently: true });
  const rgba = (c) => { cx.clearRect(0, 0, 1, 1); cx.fillStyle = '#000'; cx.fillStyle = c; cx.fillRect(0, 0, 1, 1); const d = cx.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2], d[3] / 255]; };
  const framed = !!document.querySelector('div.fixed.overflow-y-auto') || (W < 1024 && !!document.querySelector('.home-frame'));
  const base = framed ? { l: 19, t: 19, r: W - 19, b: H - 19 } : { l: 0, t: 0, r: W, b: H };
  const clipOf = (el) => {
    let r = { ...base };
    for (let n = el.parentElement; n && n !== document.documentElement; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (!/(auto|scroll|hidden|clip)/.test(cs.overflowX + cs.overflowY)) continue;
      const b = n.getBoundingClientRect(); const l = b.left + n.clientLeft, t = b.top + n.clientTop;
      r = { l: Math.max(r.l, l), t: Math.max(r.t, t), r: Math.min(r.r, l + n.clientWidth), b: Math.min(r.b, t + n.clientHeight) };
    }
    return r;
  };
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let t;
  while ((t = tw.nextNode())) {
    const s = t.textContent.replace(/\s+/g, ' ').trim(); if (!s || !/[\p{L}\p{N}]/u.test(s)) continue;
    const el = t.parentElement; if (!el || el.closest('svg, script, style, noscript, .sr-only, button:disabled')) continue;
    let op = 1, hidden = false;
    for (let n = el; n; n = n.parentElement) { const c = getComputedStyle(n); op *= +c.opacity; if (c.display === 'none' || c.visibility === 'hidden') hidden = true; }
    if (hidden || op < 0.05) continue;
    const cs = getComputedStyle(el); const clip = clipOf(el); const range = document.createRange(); range.selectNodeContents(t);
    const rects = [];
    for (const q of range.getClientRects()) {
      const l = Math.max(q.left, clip.l, 0), tp = Math.max(q.top, clip.t, 0), r = Math.min(q.right, clip.r, W), b = Math.min(q.bottom, clip.b, H);
      if (r - l < 2 || b - tp < 0.7 * (q.bottom - q.top)) continue;
      const covered = [0.1, 0.3, 0.5, 0.7, 0.9].some((f) => { const hit = document.elementFromPoint(l + (r - l) * f, (tp + b) / 2); return hit && hit !== el && !el.contains(hit) && !hit.contains(el); });
      if (!covered) rects.push([Math.round(l), Math.round(tp), Math.round(r), Math.round(b)]);
    }
    if (!rects.length) continue;
    const sel = []; let n = el; for (let i = 0; i < 3 && n && n.nodeType === 1; i++, n = n.parentElement) sel.unshift(n.tagName.toLowerCase() + [...n.classList].filter((c) => !/[:[]/.test(c)).slice(0, 2).map((c) => '.' + c).join(''));
    const c = rgba(cs.color); c[3] *= op;
    out.push({ sel: sel.join('>'), text: s.slice(0, 40), color: c, size: parseFloat(cs.fontSize), weight: +cs.fontWeight, rects });
  }
  return out;
}

// In the page: the worst-10 % contrast of each run against the screenshot (text hidden) under it
async function analyse({ png, runs }) {
  const img = new Image(); img.src = 'data:image/png;base64,' + png; await img.decode();
  const cv = document.createElement('canvas'); cv.width = img.width; cv.height = img.height;
  const cx = cv.getContext('2d', { willReadFrequently: true }); cx.drawImage(img, 0, 0);
  const px = cx.getImageData(0, 0, cv.width, cv.height).data;
  const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  const lum = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  const fails = [];
  for (const run of runs) {
    const [r, g, b, a] = run.color; const vals = [];
    for (const [l, t, rr, bb] of run.rects) {
      const step = Math.max(1, Math.floor(Math.sqrt(((rr - l) * (bb - t)) / 1500)));
      for (let y = t; y < bb; y += step) for (let x = l; x < rr; x += step) {
        const i = (y * cv.width + x) * 4; const br = px[i], bg = px[i + 1], bb2 = px[i + 2];
        const L1 = lum(r * a + br * (1 - a), g * a + bg * (1 - a), b * a + bb2 * (1 - a)), L2 = lum(br, bg, bb2);
        vals.push((Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05));
      }
    }
    if (!vals.length) continue;
    vals.sort((x, y) => x - y); const worst = vals[Math.floor(vals.length * 0.1)];
    const need = run.size >= 24 || (run.weight >= 700 && run.size >= 18.66) ? 3 : 4.5;
    if (worst < need) fails.push({ sel: run.sel, text: run.text, worst: +worst.toFixed(2), need });
  }
  return { checked: runs.length, fails };
}

const HIDE = '*,*::before,*::after{color:transparent!important;-webkit-text-fill-color:transparent!important;text-shadow:none!important;text-decoration-color:transparent!important;caret-color:transparent!important}';
const browser = await chromium.launch({ executablePath: findChrome(), args: ['--no-sandbox'] });
let checked = 0; const failures = new Map();
async function measure(p, where) {
  await p.mouse.move(2, VH - 2); await p.waitForTimeout(100); // no hover state
  const runs = await p.evaluate(collect);
  const style = await p.addStyleTag({ content: HIDE }); await p.waitForTimeout(150);
  const png = (await p.screenshot()).toString('base64');
  await style.evaluate((e) => e.remove());
  const res = await p.evaluate(analyse, { png, runs });
  checked += res.checked;
  for (const f of res.fails) {
    const k = `${where.split(' ')[0]}  ${f.sel}`; const prev = failures.get(k);
    if (!prev || f.worst < prev.worst) failures.set(k, { ...f, where });
  }
}
const scrollThrough = async (p, where) => {
  for (let i = 0; i < 14; i++) {
    const more = await p.evaluate((i) => { const sc = document.querySelector('div.fixed.overflow-y-auto') || document.scrollingElement; sc.scrollTop = i * innerHeight * 0.85; return sc.scrollTop + sc.clientHeight < sc.scrollHeight - 2; }, i);
    await p.waitForTimeout(600); await measure(p, `${where} #${i}`); if (!more) break;
  }
};

for (const preset of PRESETS) {
  const walls = process.env.WALLPAPERS === 'first' ? WALLS[preset].slice(0, 1) : WALLS[preset];
  for (const wall of walls) {
    const ctx = await browser.newContext({
      viewport: { width: VW, height: VH }, deviceScaleFactor: 1, reducedMotion: 'reduce',
      ...(PHONE ? { isMobile: true, hasTouch: true, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' } : {}),
    });
    await ctx.addInitScript(([pr, w]) => { localStorage.setItem('theme-preset', pr); localStorage.setItem('theme-background-image-' + pr, '/images/' + w); }, [preset, wall]);
    const p = await ctx.newPage(); const tag = `${preset}/${wall.replace(/\.\w+$/, '')}`;
    await p.goto(BASE + '/'); await p.waitForTimeout(3000);
    if (PHONE) await scrollThrough(p, `${tag} /`);
    else {
      await measure(p, `${tag} /`);
      for (const ws of ['contact', 'lab']) {
        const b = p.locator('nav[aria-label="Workspaces"] button', { hasText: ws }).first();
        if (await b.count()) { await b.click(); await p.waitForTimeout(2500); await measure(p, `${tag} / (${ws})`); }
      }
      const hp = p.locator('button', { hasText: 'Honeypot' }).first();
      if (await hp.count()) { await hp.click(); await p.waitForTimeout(3500); await measure(p, `${tag} / (threats)`); }
      await p.keyboard.press('Escape'); await p.waitForTimeout(800);
      for (const pop of ['Keyboard shortcuts', 'Wallpaper', 'Accent color']) {
        await p.locator(`button[aria-label^="${pop}"]`).first().click(); await p.waitForTimeout(600);
        await measure(p, `${tag} / (${pop.toLowerCase()})`);
        await p.keyboard.press('Escape'); await p.waitForTimeout(400);
      }
      if (process.env.ACCENTS === 'all') {
        for (const acc of ACCENTS) {
          await p.locator('button[aria-label^="Accent color"]').click(); await p.waitForTimeout(400);
          await p.locator(`button.swatch[aria-label="${acc}"]`).click(); await p.waitForTimeout(600);
          await measure(p, `${tag} / (accent ${acc})`);
        }
      }
    }
    if (wall === WALLS[preset][0]) for (const route of ROUTES) { await p.goto(BASE + route); await p.waitForTimeout(2800); await scrollThrough(p, `${tag} ${route}`); }
    await ctx.close();
  }
}
await browser.close();
console.log(`${checked} text runs checked, ${failures.size} failing`);
for (const [k, f] of [...failures].sort((a, b) => a[1].worst - b[1].worst)) console.log(`  ${f.worst.toFixed(2)} < ${f.need}  ${k}  "${f.text}"  (${f.where})`);
process.exit(failures.size ? 1 : 0);
