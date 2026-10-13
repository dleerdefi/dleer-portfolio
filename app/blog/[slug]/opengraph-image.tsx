import { notFound } from 'next/navigation';
import { allBlogs } from 'content-collections';
import { OG_CONTENT_TYPE, OG_SIZE, renderPageCard } from '@/lib/og/card';

// One Open Graph card per published post, rendered at build time (lib/og/card.tsx)
export const alt = 'Blog post';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return allBlogs.filter((b) => b.status === 'published').map((b) => ({ slug: b.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = allBlogs.find((b) => b.slug === slug);
  if (!blog) notFound();
  return renderPageCard({
    path: `~/blog/${blog.slug}`,
    title: blog.title,
    summary: blog.summary,
    chips: [blog.date, blog.readingTime, ...blog.tags.slice(0, 2)],
  });
}
