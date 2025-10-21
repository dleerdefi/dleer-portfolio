'use client';

import React from 'react';
import { ContentType } from '@/contexts/FocusContext';

interface BlogDetailContentProps {
  blog: any;
  onNavigate?: (content: ContentType) => void;
}

/**
 * Blog detail content component
 * Displays individual blog post with navigation
 */
export const BlogDetailContent: React.FC<BlogDetailContentProps> = ({ blog, onNavigate }) => {

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2" style={{ color: 'var(--theme-text-dimmed)', fontSize: 'clamp(1rem, 1rem + 1.5cqi, 1.125rem)' }}>
        <span
          className="cursor-pointer transition-colors hover:opacity-80"
          style={{ color: 'var(--accent-color)' }}
          onClick={(e) => {
            e.stopPropagation();
            onNavigate?.({ type: 'blog-overview' });
          }}
        >
          Blog
        </span>
        <span style={{ color: 'var(--theme-text-dimmed)' }}>/</span>
        <span style={{ color: 'var(--theme-text)' }}>{blog.displayName || blog.title}</span>
      </div>

      <div className="border-b pb-4" style={{ borderColor: 'var(--theme-border)', opacity: 0.3 }}>
        <h1 className="font-bold" style={{ color: 'var(--accent-color)', fontSize: 'clamp(1.75rem, 1.75rem + 4cqi, 2.25rem)' }}>{blog.title}</h1>
        <p className="mt-1" style={{ color: 'var(--theme-text-dimmed)', fontSize: 'clamp(1rem, 1rem + 1.5cqi, 1.125rem)' }}>{blog.name}</p>
      </div>

      <div className="prose prose-invert leading-relaxed space-y-4" style={{ color: 'var(--theme-text)', fontSize: 'clamp(1.125rem, 1.125rem + 2cqi, 1.25rem)' }}>
        {blog.content ? (
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        ) : (
          <>
            <p style={{ color: 'var(--theme-text)', opacity: 0.9 }}>
              {blog.excerpt || "Content coming soon..."}
            </p>
            <h2 className="font-bold mb-3 mt-4" style={{ color: 'var(--accent-color)', opacity: 0.9, fontSize: 'clamp(1.25rem, 1.25rem + 2.5cqi, 1.5rem)' }}>Introduction</h2>
            <p style={{ color: 'var(--theme-text)', opacity: 0.9 }}>
              Detailed explanation of the topic, with code examples and technical insights
              that demonstrate deep understanding of the subject matter.
            </p>
            <h2 className="font-bold mb-3 mt-4" style={{ color: 'var(--accent-color)', opacity: 0.9, fontSize: 'clamp(1.25rem, 1.25rem + 2.5cqi, 1.5rem)' }}>Conclusion</h2>
            <p style={{ color: 'var(--theme-text)', opacity: 0.9 }}>
              Summary of key points and takeaways from the article.
            </p>
          </>
        )}
      </div>
    </div>
  );
};