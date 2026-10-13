import { notFound } from 'next/navigation';
import { allProjects } from 'content-collections';
import { OG_CONTENT_TYPE, OG_SIZE, renderPageCard } from '@/lib/og/card';

// One Open Graph card per project, rendered at build time (lib/og/card.tsx)
export const alt = 'Project';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return allProjects.map((project) => ({ slug: project.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = allProjects.find((p) => p.slug === slug);
  if (!project) notFound();
  return renderPageCard({
    path: `~/projects/${project.slug}`,
    title: project.title,
    summary: project.summary,
    status: project.status,
    chips: project.tech,
  });
}
