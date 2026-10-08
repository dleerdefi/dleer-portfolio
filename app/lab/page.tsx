import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { EscKeyHandler } from '@/components/blog/EscKeyHandler';
import { FramedPageLayout } from '@/components/layout/FramedPageLayout';
import TelemetryPage from '@/components/lab/telemetry/TelemetryPage';
import { getPortfolioConfig } from '@/config/portfolio.config';
import { labEnabled } from '@/lib/lab/flag';

const title = 'Lab: telemetry';
const description = 'Live power, load and temperatures from the three PowerEdge servers in my homelab.';

export async function generateMetadata(): Promise<Metadata> {
  const ogImage = getPortfolioConfig().seo.ogImage;
  return {
    title,
    description,
    openGraph: { title, description, type: 'website', images: ogImage ? [ogImage] : undefined },
    twitter: { card: 'summary_large_image', title, description },
  };
}

/** /lab: the framed telemetry page (TELEMETRY_VIEW.md §5.2). `status.dleer.ai` redirects here. */
export default function LabTelemetryRoute() {
  if (!labEnabled()) notFound();
  return (
    <>
      <EscKeyHandler returnPath="/" />
      <FramedPageLayout>
        <TelemetryPage />
      </FramedPageLayout>
    </>
  );
}
