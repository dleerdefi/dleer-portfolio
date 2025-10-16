'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ZenList } from '@/components/zen/ZenList';
import { allBlogs } from 'content-collections';

/**
 * Blog Zen View - Fullscreen list of blog posts
 * Features j/k/Enter/Esc keyboard navigation
 * Displays published blog posts from content-collections
 *
 * Route: /blog-zen
 */
export default function BlogZenPage() {
  const router = useRouter();

  // Filter to published posts only, sorted by date (newest first)
  const publishedBlogs = allBlogs
    .filter((blog) => blog.status === 'published')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleSelect = (blog: typeof allBlogs[0]) => {
    router.push(blog.url);
  };

  const handleExit = () => {
    router.back();
  };

  return (
    <ZenList
      items={publishedBlogs}
      onSelect={handleSelect}
      onExit={handleExit}
      title="~/blog"
      subtitle="Technical articles and insights"
      emptyMessage="No blog posts found. Check back soon!"
      renderItem={(blog, _index, isSelected) => (
        <div className="space-y-2">
          {/* Header: Title and Date */}
          <div className="flex items-start justify-between gap-4">
            <h2
              className="text-xl font-bold flex-1"
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
            <span
              className="text-sm shrink-0"
              style={{ color: 'var(--theme-text-dimmed)' }}
            >
              {formatDate(blog.date)}
            </span>
          </div>

          {/* Summary */}
          <p
            className="text-base"
            style={{
              color: 'var(--theme-text-dimmed)',
              lineHeight: '1.6',
            }}
          >
            {blog.summary}
          </p>

          {/* Metadata: Tags, Reading Time, Series */}
          <div className="flex items-center gap-4 text-xs flex-wrap">
            {/* Tags */}
            {blog.tags.length > 0 && (
              <div className="flex items-center gap-2">
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 border"
                    style={{
                      borderColor: 'var(--theme-border)',
                      color: 'var(--theme-text-dimmed)',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Reading time */}
            <span style={{ color: 'var(--theme-text-dimmed)' }}>
              {blog.readingTime}
            </span>

            {/* Series indicator */}
            {blog.series && (
              <span
                className="px-2 py-0.5 border"
                style={{
                  borderColor: 'var(--accent-color)',
                  color: 'var(--accent-color)',
                }}
              >
                Series: {blog.series}
              </span>
            )}
          </div>
        </div>
      )}
    />
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
