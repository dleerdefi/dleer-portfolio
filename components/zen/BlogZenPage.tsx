'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ZenList } from '@/components/zen/ZenList';
import type { PostSummary } from '@/lib/content-types';
import { FramedPageLayout } from '@/components/layout/FramedPageLayout';

/**
 * Blog Zen View - Fullscreen list of posts, with j/k/Enter/Esc keyboard navigation.
 * The /blog route (app/blog/page.tsx) sorts the slim post list on the server.
 */
export default function BlogZenPage({ posts: publishedBlogs }: { posts: PostSummary[] }) {
  const router = useRouter();

  const handleSelect = (blog: PostSummary) => {
    router.push(blog.url);
  };

  const handleExit = () => {
    router.push('/');
  };

  return (
    <FramedPageLayout autoFocus={false}>
      <ZenList
        items={publishedBlogs}
        onSelect={handleSelect}
        onExit={handleExit}
        title="Blog"
        subtitle="Technical articles and insights"
        emptyMessage="No blog posts found. Check back soon!"
        renderItem={(blog, _index, isSelected) => (
        <div>
          {/* Title */}
          <h2
            className="text-xl font-bold mb-4"
            style={{
              color: isSelected
                ? 'var(--accent-color)'
                : 'var(--theme-text)',
              lineHeight: '1.4',
              letterSpacing: '-0.01em',
            }}
          >
            {blog.title}
          </h2>

          {/* Metadata: Date and Reading Time */}
          <div className="flex items-center gap-4 text-sm">
            <time style={{ color: 'var(--theme-text-dimmed)' }}>
              {formatDate(blog.date)}
            </time>
            <span style={{ color: 'var(--theme-text-dimmed)' }}>•</span>
            <span style={{ color: 'var(--theme-text-dimmed)' }}>
              {blog.readingTime}
            </span>
          </div>
        </div>
      )}
      />
    </FramedPageLayout>
  );
}

/**
 * Format date to readable string
 */
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}
