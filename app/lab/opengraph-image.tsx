import { notFound } from 'next/navigation';
import { labEnabled } from '@/lib/lab/flag';
import { OG_CONTENT_TYPE, OG_SIZE, renderPageCard } from '@/lib/og/card';

// The /lab card (lib/og/card.tsx). Like every lab route it 404s while the lab is off.
export const alt = 'Lab: telemetry';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  if (!labEnabled()) notFound();
  return renderPageCard({
    path: '~/lab',
    title: 'Lab: telemetry',
    summary: 'Live power, load and temperatures from the three PowerEdge servers in my homelab.',
    chips: ['PowerEdge T430', 'R730', 'R720xd', 'live'],
  });
}
