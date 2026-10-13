import { archLogoASCII, dleerBlockLetters, minimalLogo } from '@/components/assets/archAscii';
import { getPortfolioConfig } from '@/config/portfolio.config';
import { labEnabled } from '@/lib/lab/flag';
// Lab rows are a client island, loaded only while the lab is on (docs/lab/LAB_UI_SPEC.md §3)
import { NeofetchLabRows } from '@/components/home/LabIslands';
import { HeroPhoto } from '@/components/home/HeroPhoto';

const SWATCHES = ['--theme-bg', '--theme-error', '--theme-success', '--theme-warning', '--accent-color', '--theme-info', '--theme-primary', '--theme-text'];

/**
 * The neofetch block, server-rendered: the desktop's top-left tile and the phone's hero. On
 * desktop the profile photo stands where the logo would, beside the rows; a phone shows the logo
 * above them (app/styles/15-home-layout.css). Without a configured photo (a fork that has not set
 * NEXT_PUBLIC_PROFILE_PHOTO) the desktop keeps the logo too.
 */
export function Neofetch() {
  const { personal, system, technologies } = getPortfolioConfig();
  const photo = personal.profilePhoto;
  const stack = (technologies?.items ?? []).map((t) => t.name).join(', ');
  const logoType = process.env.NEXT_PUBLIC_ASCII_LOGO || 'dleer';
  const logo = logoType === 'dleer' ? dleerBlockLetters : logoType === 'arch' ? archLogoASCII : minimalLogo;
  const rows = [system.github, system.twitter, system.linkedin, system.youtube, system.instagram, system.tiktok].filter(
    (row): row is NonNullable<typeof row> => Boolean(row)
  );

  return (
    <div className={photo ? 'neofetch neofetch--photo' : 'neofetch'}>
      {photo && <HeroPhoto alt={photo.alt} />}
      <pre className="neofetch-logo" aria-hidden="true">
        {logo}
      </pre>
      <div className="neofetch-info">
        <p className="neofetch-user">
          <span style={{ color: 'var(--theme-success)' }}>{personal.username}</span>
          <span style={{ color: 'var(--accent-color)' }}>@</span>
          <span style={{ color: 'var(--theme-info)' }}>portfolio</span>
        </p>
        <p className="neofetch-rule" aria-hidden="true">
          ---------------
        </p>
        <ul className="neofetch-rows">
          {rows.map((row) => (
            <li key={row.platform}>
              <span className="neofetch-key">{row.platform}</span>:{' '}
              <a href={row.url} target="_blank" rel="noopener noreferrer">
                {row.username}
              </a>
              {row.followers && row.followers !== 'N/A' && <span className="neofetch-dim"> ({row.followers})</span>}
            </li>
          ))}
          {stack && (
            <li>
              <span className="neofetch-key">Stack</span>: {stack}
            </li>
          )}
        </ul>
        {labEnabled() && (
          <div className="neofetch-rows neofetch-lab">
            <NeofetchLabRows />
          </div>
        )}
        <div className="neofetch-swatches" aria-hidden="true">
          {SWATCHES.map((v) => (
            <span key={v} style={{ backgroundColor: `var(${v})` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
