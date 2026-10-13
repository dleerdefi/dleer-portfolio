'use client';

import React from 'react';
import Link from 'next/link';
import { useFocusNavigation, type ContentType } from '@/contexts/FocusContext';
import { useAfterIdle } from '@/hooks/useAfterIdle';
import { useLabData } from '@/hooks/useLabData';
import { isDesktopNow } from '@/hooks/useMediaQuery';
import { labThreatsEnabled } from '@/lib/lab/flag';
import type { LabSummary } from '@/lib/lab/types';
import { LabStatusBadge } from '@/components/lab/shared/LabStatusBadge';
import { LabCarousel, type LabSlide } from './LabCarousel';
import { GpusSlide, HoneypotSlide, HostsSlide, PowerSlide, StorageSlide } from './LabSlides';

/**
 * The home page's lab: a tile beside the contents on desktop, the section after the featured
 * projects on phones (docs/PORTFOLIO_V2_SPEC.md §4.1, §4.2, §4.6). One card of slides
 * (LabCarousel): the power, the hosts, the GPUs, storage and CI, and the honeypot while the threat
 * map is on. On desktop a slide opens its view in the stage, on a phone its page. Data from
 * /api/lab/summary only, fetched after idle (one request shared with the neofetch rows); a slide
 * whose numbers are missing is left out, and until the summary arrives the card holds its space.
 */
export default function LabTile() {
  const idle = useAfterIdle();
  const { handleContentNavigation } = useFocusNavigation();
  // Desktop: the stage shows the view; phones follow the link to the page
  const openInStage = (content: ContentType) => (e: React.MouseEvent) => {
    if (!isDesktopNow()) return;
    e.preventDefault();
    e.stopPropagation();
    handleContentNavigation(content);
  };
  const { payload, receivedAt } = useLabData<LabSummary>('/api/lab/summary', 300_000, { enabled: idle });
  const tel = payload?.telemetry;
  const thr = payload?.threats;
  const threatsOn = labThreatsEnabled() && (payload === null || thr !== undefined);

  // Every telemetry slide shows the badge; the first one announces a change
  const telBadge = (announce: boolean) =>
    tel && <LabStatusBadge state={tel.state} compact announce={announce} receivedAt={receivedAt ?? undefined} style={{ fontSize: '0.8rem' }} />;
  const telLink = (section?: 'hosts' | 'gpus') => ({
    href: section ? `/lab#${section}` : '/lab',
    onClick: openInStage({ type: 'lab-telemetry', section }),
    badge: telBadge(!section),
  });
  const live = tel && tel.state !== 'offline';

  const slides: LabSlide[] = [
    {
      key: 'power',
      label: 'power',
      path: '~/lab',
      ...telLink(),
      body: !tel ? (
        <span className="lab-slide-pending" aria-hidden="true" />
      ) : tel.state === 'offline' ? (
        <span className="lab-slide-pending">lab offline</span>
      ) : (
        <PowerSlide tel={tel} />
      ),
      cta: 'open telemetry →',
    },
    ...(live && tel.hosts?.length
      ? [{ key: 'hosts', label: 'hosts', path: '~/lab/hosts', ...telLink('hosts'), body: <HostsSlide hosts={tel.hosts} />, cta: 'the servers →' }]
      : []),
    ...(live && tel.gpus?.length
      ? [{ key: 'gpus', label: 'GPUs', path: '~/lab/gpus', ...telLink('gpus'), body: <GpusSlide gpus={tel.gpus} />, cta: 'the GPUs →' }]
      : []),
    ...(live && (tel.nas || tel.ci)
      ? [{ key: 'storage', label: 'storage and CI', path: '~/lab/nas+ci', ...telLink('hosts'), body: <StorageSlide nas={tel.nas} ci={tel.ci} />, cta: 'the servers →' }]
      : []),
    ...(threatsOn
      ? [
          {
            key: 'threats',
            label: 'honeypot',
            path: '~/lab/threats',
            href: '/lab/threats',
            onClick: openInStage({ type: 'lab-threats' }),
            badge: thr && <LabStatusBadge state={thr.state} compact style={{ fontSize: '0.8rem' }} />,
            body: !thr ? (
              <span className="lab-slide-pending" aria-hidden="true" />
            ) : thr.state === 'offline' ? (
              <span className="lab-slide-pending">honeynet offline</span>
            ) : (
              <HoneypotSlide thr={thr} />
            ),
            cta: 'the threat map →',
          },
        ]
      : []),
  ];

  return (
    <div className="lab-root lab-tile">
      <div className="lab-tile-head">
        <h2 id="lab-title" className="section-title">
          Lab
        </h2>
        <Link href="/lab" className="lab-tile-open lab-link">
          /lab ↗
        </Link>
      </div>
      <p className="lab-text-2" style={{ margin: 0 }}>
        {threatsOn ? 'My homelab and the honeypot I run, live.' : 'My homelab, live.'}
      </p>
      <LabCarousel slides={slides} />
    </div>
  );
}
