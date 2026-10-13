// Audit script for docs/PORTFOLIO_V2_SPEC.md §8: screenshots and load metrics of the production
// build. Run against a `next start` of a production build; see the spec for the commands.
//   AUDIT_BASE=http://localhost:3111 AUDIT_OUT=./audit-out node docs/audit/audit-shots.mjs
// Needs playwright-core (npm install --no-save playwright-core) and a Chromium: Playwright's
// (PLAYWRIGHT_BROWSERS_PATH, as in Claude Code cloud sessions) or AUDIT_CHROME=<path to a binary>.
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.AUDIT_BASE || 'http://localhost:3111';
const OUT = path.resolve(process.env.AUDIT_OUT || './audit-out');
fs.mkdirSync(OUT, { recursive: true });

const pages = ['/', '/projects', '/projects/llm-security-auditor', '/blog', '/blog/local-ai-prepping-2025', '/lab', '/lab/threats'];
const viewports = [
  { name: 'desktop-1440', width: 1440, height: 900, mobile: false, all: true },
  { name: 'desktop-1920', width: 1920, height: 1080, mobile: false },
  { name: 'laptop-1280', width: 1280, height: 720, mobile: false },
  { name: 'phone-390', width: 390, height: 844, mobile: true, all: true },
  { name: 'phone-360', width: 360, height: 780, mobile: true },
  { name: 'phone-320', width: 320, height: 568, mobile: true },
  { name: 'phone-430', width: 430, height: 932, mobile: true },
  { name: 'tablet-768', width: 768, height: 1024, mobile: true },
  { name: 'phone-landscape', width: 844, height: 390, mobile: true },
];
const phoneUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

function findChrome() {
  if (process.env.AUDIT_CHROME) return process.env.AUDIT_CHROME;
  const root = process.env.PLAYWRIGHT_BROWSERS_PATH;
  if (root && fs.existsSync(root)) {
    const dir = fs.readdirSync(root).find((d) => /^chromium-\d+$/.test(d));
    if (dir) return path.join(root, dir, 'chrome-linux', 'chrome');
  }
  return undefined; // playwright-core then needs AUDIT_CHROME
}

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try { if ((await fetch(BASE + '/')).ok) return; } catch {}
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error(`no server at ${BASE}`);
}

await waitForServer();
const browser = await chromium.launch({ executablePath: findChrome(), args: ['--no-sandbox', '--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
const report = [];
for (const vp of viewports) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1, isMobile: vp.mobile, hasTouch: vp.mobile, userAgent: vp.mobile ? phoneUA : undefined });
  for (const route of pages) {
    if (!vp.all && route !== '/') continue;
    const page = await ctx.newPage();
    const errors = []; const requests = [];
    page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`${m.type()}: ${m.text().slice(0, 200)}`); });
    page.on('pageerror', (e) => errors.push(`pageerror: ${e.message.slice(0, 200)}`));
    page.on('response', (r) => { const len = Number(r.headers()['content-length'] || 0); requests.push({ url: r.url().replace(BASE, ''), status: r.status(), len }); });
    const t0 = Date.now();
    await page.goto(BASE + route, { waitUntil: 'commit' });
    await page.waitForTimeout(100);
    const name = `${vp.name}${route === '/' ? '-home' : route.replace(/\//g, '_')}`;
    await page.screenshot({ path: path.join(OUT, `${name}-first-paint.png`) }); // blank here = no server-rendered content
    await page.waitForLoadState('networkidle', { timeout: 60000 });
    const loadMs = Date.now() - t0;
    await page.waitForTimeout(1500);
    const metrics = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0];
      const res = performance.getEntriesByType('resource');
      const sum = (f) => res.filter(f).reduce((a, r) => a + (r.transferSize || 0), 0);
      return {
        domContentLoaded: Math.round(nav?.domContentLoadedEventEnd || 0),
        jsKB: Math.round(sum((r) => r.name.includes('/_next/static/chunks')) / 1024),
        imgKB: Math.round(sum((r) => r.initiatorType === 'img' || r.name.includes('/_next/image') || /\.(webp|png|jpg|avif)(\?|$)/.test(r.name)) / 1024),
        fontKB: Math.round(sum((r) => /\.woff2?(\?|$)/.test(r.name)) / 1024),
        resources: res.length,
        docHeight: document.documentElement.scrollHeight,
        hScroll: document.documentElement.scrollWidth > window.innerWidth,
        title: document.title,
      };
    });
    await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: vp.mobile });
    if (vp.mobile && route === '/') {
      for (const frac of [0.25, 0.5, 0.75]) {
        await page.evaluate((f) => { const el = document.querySelector('[role="main"], main') || document.scrollingElement; const max = el.scrollHeight - el.clientHeight; el.scrollTop = max * f; window.scrollTo(0, max * f); }, frac);
        await page.waitForTimeout(600);
        await page.screenshot({ path: path.join(OUT, `${name}-scroll${Math.round(frac * 100)}.png`) });
      }
    }
    report.push({ vp: vp.name, route, loadMs, ...metrics, failed: requests.filter((r) => r.status >= 400), errors: [...new Set(errors)].slice(0, 8), topRequests: requests.sort((a, b) => b.len - a.len).slice(0, 6) });
    await page.close();
  }
  await ctx.close();
}
await browser.close();
fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));
console.log('| viewport | route | load ms | DCL ms | JS KB | img KB | font KB | requests | h-scroll | errors |');
console.log('|---|---|---|---|---|---|---|---|---|---|');
for (const r of report) console.log(`| ${r.vp} | ${r.route} | ${r.loadMs} | ${r.domContentLoaded} | ${r.jsKB} | ${r.imgKB} | ${r.fontKB} | ${r.resources} | ${r.hScroll ? 'YES' : 'no'} | ${r.errors.length + r.failed.length} |`);
for (const r of report) for (const e of [...r.failed.map((f) => `${f.status} ${f.url}`), ...r.errors]) console.log(`  [${r.vp} ${r.route}] ${e}`);
