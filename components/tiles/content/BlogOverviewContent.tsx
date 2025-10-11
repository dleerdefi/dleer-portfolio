'use client';

import React from 'react';
import { ContentType } from '@/contexts/FocusContext';
import { useBlogPosts } from '@/lib/config';

interface BlogOverviewContentProps {
  onNavigate?: (content: ContentType) => void;
}

/**
 * Blog overview content component
 * Displays list of all blog posts with interactive cards
 */
export const BlogOverviewContent: React.FC<BlogOverviewContentProps> = ({ onNavigate }) => {
  const blogPostsConfig = useBlogPosts();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold" style={{ color: 'var(--accent-color)' }}>Blog</h1>
      <p className="text-sm" style={{ color: 'var(--theme-text)' }}>
        Technical articles, tutorials, and insights from my development journey.
      </p>
      <div className="space-y-4">
        {blogPostsConfig.map((post) => {
          // Transform blog post to match navigation format
          const blogData = {
            id: post.id,
            name: post.filename.replace(/\.md$/i, ''),
            displayName: post.title,
            title: post.title,
            date: post.date,
            content: post.content,
            excerpt: post.excerpt,
            sections: post.content ?
              (post.content.match(/^##\s+(.+)$/gm) || []).map(s => s.replace(/^##\s+/, '')) :
              []
          };
          return (
            <div
              key={post.id}
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
                onNavigate?.({ type: 'blog', data: blogData });
              }}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold transition-colors" style={{ color: 'var(--theme-text)' }}>{post.title}</h3>
                <span className="text-xs" style={{ color: 'var(--theme-text-dimmed)' }}>{post.date}</span>
              </div>
              <p className="text-sm mb-2 transition-opacity" style={{ color: 'var(--theme-text)', opacity: 0.8 }}>{post.excerpt}</p>
              <span className="text-xs" style={{ color: 'var(--theme-text-dimmed)' }}>{post.category}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};