'use client';

import React from 'react';
import { ContentType } from '@/contexts/FocusContext';
import { allBlogs } from 'content-collections';

interface BlogOverviewContentProps {
  onNavigate?: (content: ContentType) => void;
}

/**
 * Blog overview content component
 * Displays list of all blog posts with interactive cards
 */
export const BlogOverviewContent: React.FC<BlogOverviewContentProps> = ({ onNavigate }) => {
  // Get published blog posts from Content Collections, sorted by date (newest first)
  const publishedBlogs = allBlogs
    .filter(blog => blog.status === 'published')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <h1 className="font-bold" style={{ color: 'var(--accent-color)', fontSize: 'clamp(1.5rem, 1.5rem + 3cqi, 1.75rem)' }}>Blog</h1>
      <p style={{ color: 'var(--theme-text)', fontSize: 'clamp(1rem, 1rem + 1.5cqi, 1.125rem)' }}>
        Technical articles, tutorials, and insights from my development journey.
      </p>
      <div className="space-y-4">
        {publishedBlogs.map((post) => {
          // Use the post data directly - it already matches BlogData type from content-collections
          return (
            <div
              key={post.slug}
              className="border-b pb-4 transition-colors cursor-pointer"
              style={{ borderColor: 'rgba(var(--accent-color-rgb), 0.2)' }}
              onMouseEnter={(e) => {
                // Title changes to accent color
                const title = e.currentTarget.querySelector('h3');
                if (title) (title as HTMLElement).style.color = 'var(--accent-color)';

                // Excerpt becomes fully opaque
                const excerpt = e.currentTarget.querySelector('p');
                if (excerpt) (excerpt as HTMLElement).style.opacity = '1';

                // Border becomes more prominent (no glow)
                e.currentTarget.style.borderColor = 'rgba(var(--accent-color-rgb), 0.5)';
              }}
              onMouseLeave={(e) => {
                // Title back to theme text
                const title = e.currentTarget.querySelector('h3');
                if (title) (title as HTMLElement).style.color = 'var(--theme-text)';

                // Excerpt back to 80%
                const excerpt = e.currentTarget.querySelector('p');
                if (excerpt) (excerpt as HTMLElement).style.opacity = '0.8';

                // Border back to subtle
                e.currentTarget.style.borderColor = 'rgba(var(--accent-color-rgb), 0.2)';
              }}
              onClick={(e) => {
                e.stopPropagation();
                onNavigate?.({ type: 'blog', data: post });
              }}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold transition-colors" style={{ color: 'var(--theme-text)', fontSize: 'clamp(1.25rem, 1.25rem + 2.5cqi, 1.5rem)' }}>{post.title}</h3>
                <span style={{ color: 'var(--theme-text-dimmed)', fontSize: 'clamp(1rem, 1rem + 1.5cqi, 1.125rem)' }}>{post.date}</span>
              </div>
              <p className="desktop-only mb-2 transition-opacity" style={{ color: 'var(--theme-text)', opacity: 0.8, fontSize: 'clamp(1rem, 1rem + 1.5cqi, 1.125rem)' }}>{post.summary}</p>
              {post.tags && post.tags.length > 0 && (
                <div className="flex gap-2">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span key={tag} style={{ color: 'var(--theme-text-dimmed)', fontSize: 'clamp(11px, 2cqw, 18px)' }}>#{tag}</span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};