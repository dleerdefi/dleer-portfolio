import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { EscKeyHandler } from '@/components/blog/EscKeyHandler';
import { FramedPageLayout } from '@/components/layout/FramedPageLayout';
import ThreatsPage from '@/components/lab/threats/ThreatsPage';
import { getPortfolioConfig } from '@/config/portfolio.config';
import { labEnabled } from '@/lib/lab/flag';

const title = 'Lab: threat map';
const description = 'Where attacks on my honeypot come from, live, by type. No IP addresses are shown.';

export async function generateMetadata(): Promise<Metadata> {
  const ogImage = getPortfolioConfig().seo.ogImage;
  return {
    title,
    description,
    openGraph: { title, description, type: 'website', images: ogImage ? [ogImage] : undefined },
    twitter: { card: 'summary_large_image', title, description },
  };
}

/** /lab/threats: the framed threat-map page (THREATS_VIEW.md §4.2). `threats.dleer.ai` redirects here. */
export default function LabThreatsRoute() {
  if (!labEnabled()) notFound();
  return (
    <>
      <EscKeyHandler returnPath="/" />
      <FramedPageLayout>
        <ThreatsPage />
      </FramedPageLayout>
    </>
  );
}
