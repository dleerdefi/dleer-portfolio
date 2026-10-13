import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { dleerBlockLetters } from '@/components/assets/archAscii';
import { getPortfolioConfig } from '@/config/portfolio.config';

/**
 * Open Graph cards, rendered at build time by `next/og` (docs/PORTFOLIO_V2_SPEC.md, phase 0).
 * Satori draws them, so there are no CSS variables here: the colors are Tokyo Night's, the
 * site's default preset, and the font is a small TTF subset of JetBrains Mono (satori cannot
 * read the site's WOFF2 files).
 */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

const C = {
  bg: '#1a1b26',
  surface: '#16161e',
  text: '#c0caf5',
  dim: '#a9b1d6',
  muted: '#565f89',
  blue: '#7aa2f7',
  green: '#9ece6a',
  yellow: '#e0af68',
  red: '#f7768e',
  purple: '#bb9af7',
  cyan: '#7dcfff',
};

const STATUS_COLOR: Record<string, string> = {
  production: C.green,
  beta: C.cyan,
  development: C.yellow,
  concept: C.muted,
};

/** Cut `s` to at most `n` characters on a word boundary, with an ellipsis. */
export function clip(s: string, n: number): string {
  if (s.length <= n) return s;
  const cut = s.slice(0, n - 1);
  const space = cut.lastIndexOf(' ');
  return `${(space > n * 0.6 ? cut.slice(0, space) : cut).replace(/[\s,.;:–—-]+$/, '')}…`;
}

async function fonts() {
  const dir = join(process.cwd(), 'lib/og/fonts');
  const [regular, bold] = await Promise.all([
    readFile(join(dir, 'JetBrainsMono-Regular.subset.ttf')),
    readFile(join(dir, 'JetBrainsMono-Bold.subset.ttf')),
  ]);
  return [
    { name: 'JetBrains Mono', data: regular, weight: 400 as const, style: 'normal' as const },
    { name: 'JetBrains Mono', data: bold, weight: 700 as const, style: 'normal' as const },
  ];
}

/** The window frame every card shares: the accent border, the polybar line, the domain. */
function Frame({ children }: { children: React.ReactNode }) {
  const site = getPortfolioConfig();
  const domain = (process.env.NEXT_PUBLIC_SITE_URL || 'https://dleer.ai').replace(/^https?:\/\//, '').replace(/\/$/, '');
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', background: C.bg, padding: 24, fontFamily: 'JetBrains Mono' }}>
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          border: `2px solid ${C.purple}`,
          background: C.surface,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '14px 28px',
            borderBottom: `1px solid rgba(187, 154, 247, 0.3)`,
            fontSize: 22,
          }}
        >
          <div style={{ display: 'flex', gap: 14 }}>
            <span style={{ color: C.purple, fontWeight: 700 }}>[{site.personal.username.toUpperCase()}]</span>
            <span style={{ color: C.muted }}>portfolio</span>
          </div>
          <span style={{ color: C.dim }}>{domain}</span>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '40px 56px 44px' }}>{children}</div>
      </div>
    </div>
  );
}

function Swatches() {
  const colors = [C.bg, C.red, C.green, C.yellow, C.purple, C.cyan, C.blue, C.text];
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {colors.map((c, i) => (
        <div key={i} style={{ width: 22, height: 22, background: c, border: `1px solid ${C.muted}` }} />
      ))}
    </div>
  );
}

/** The site card: the neofetch tile, drawn. */
export async function renderSiteCard(): Promise<ImageResponse> {
  const { personal, seo } = getPortfolioConfig();
  return new ImageResponse(
    (
      <Frame>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 56 }}>
          <div style={{ display: 'flex', whiteSpace: 'pre', color: C.purple, fontSize: 25, lineHeight: 1.05, fontWeight: 700 }}>
            {dleerBlockLetters}
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', fontSize: 28, fontWeight: 700 }}>
              <span style={{ color: C.green }}>{personal.username}</span>
              <span style={{ color: C.purple }}>@</span>
              <span style={{ color: C.cyan }}>portfolio</span>
            </div>
            <div style={{ display: 'flex', color: C.muted, fontSize: 22 }}>{'-'.repeat(15)}</div>
            <div style={{ display: 'flex', color: C.text, fontSize: 38, fontWeight: 700, lineHeight: 1.15 }}>{personal.name}</div>
            <div style={{ display: 'flex', color: C.blue, fontSize: 24 }}>{personal.title}</div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 32 }}>
          <div style={{ display: 'flex', color: C.dim, fontSize: 26, lineHeight: 1.4, maxWidth: 820 }}>{clip(seo.description, 110)}</div>
          <Swatches />
        </div>
      </Frame>
    ),
    { ...OG_SIZE, fonts: await fonts() },
  );
}

export interface PageCardInput {
  /** The prompt line, e.g. `~/projects/agentcm`. */
  path: string;
  title: string;
  summary: string;
  /** A status chip (projects), colored by STATUS_COLOR. */
  status?: string;
  /** Plain chips after the status, e.g. the tech stack or a date. */
  chips?: string[];
}

/** A page card: prompt, title, summary, chips. Used by projects and posts. */
export async function renderPageCard({ path, title, summary, status, chips = [] }: PageCardInput): Promise<ImageResponse> {
  const statusColor = status ? STATUS_COLOR[status] ?? C.dim : C.dim;
  return new ImageResponse(
    (
      <Frame>
        <div style={{ display: 'flex', gap: 14, fontSize: 26, color: C.blue }}>
          <span style={{ color: C.purple, fontWeight: 700 }}>❯</span>
          <span>{clip(path, 52)}</span>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 22 }}>
          <div style={{ display: 'flex', color: C.text, fontSize: title.length > 34 ? 52 : 64, fontWeight: 700, lineHeight: 1.12 }}>
            {clip(title, 64)}
          </div>
          <div style={{ display: 'flex', color: C.dim, fontSize: 28, lineHeight: 1.4 }}>{clip(summary, 120)}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', fontSize: 21 }}>
          {status && (
            <span style={{ color: statusColor, border: `2px solid ${statusColor}`, padding: '6px 14px' }}>{status.toUpperCase()}</span>
          )}
          {chips.slice(0, 5).map((chip) => (
            <span key={chip} style={{ color: C.text, border: `1px solid ${C.muted}`, padding: '6px 14px' }}>
              {clip(chip, 22)}
            </span>
          ))}
        </div>
      </Frame>
    ),
    { ...OG_SIZE, fonts: await fonts() },
  );
}
