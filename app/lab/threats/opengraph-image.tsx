import { notFound } from 'next/navigation';
import { labThreatsEnabled } from '@/lib/lab/flag';
import { OG_CONTENT_TYPE, OG_SIZE, renderPageCard } from '@/lib/og/card';

// The /lab/threats card (lib/og/card.tsx). 404s unless the lab and the threat map are both on.
export const alt = 'Lab: threat map';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  if (!labThreatsEnabled()) notFound();
  return renderPageCard({
    path: '~/lab/threats',
    title: 'Lab: threat map',
    summary: 'A honeypot I run, live on a globe: every arc is a real attack. No IP addresses are shown.',
    chips: ['honeypot', 'decoys', 'live'],
  });
}
