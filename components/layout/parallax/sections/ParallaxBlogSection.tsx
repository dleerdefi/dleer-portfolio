import React from 'react';
import { BackButton } from '../components/BackButton';

interface BlogPost {
  id: string;
  title: string;
  date: string;
  excerpt?: string;
  category?: string;
}

interface ParallaxBlogSectionProps {
  blogPosts: BlogPost[];
  selectedBlog: string | null;
  setSelectedBlog: (id: string | null) => void;
}

/**
 * Blog section component for parallax layout
 * Handles both list view and detail view for blog posts
 */
export const ParallaxBlogSection: React.FC<ParallaxBlogSectionProps> = ({
  blogPosts,
  selectedBlog,
  setSelectedBlog
}) => {
  // If a blog post is selected, show its details
  if (selectedBlog) {
    const post = blogPosts.find(p => p.id === selectedBlog);
    if (!post) {
      setSelectedBlog(null);
      return null;
    }

    return (
      <div className="space-y-4">
        <BackButton
          onClick={() => setSelectedBlog(null)}
          text="Back to blog"
        />

        {/* Blog post details */}
        <h2 className="text-3xl font-bold" style={{ color: 'var(--accent-color)' }}>
          {post.title}
        </h2>

        <div className="flex items-center gap-3 text-sm">
          <span style={{ color: 'var(--theme-text-dimmed)' }}>
            {post.date}
          </span>
          {post.category && (
            <>
              <span style={{ color: 'var(--theme-text-dimmed)' }}>•</span>
              <span
                className="px-2 py-1 rounded text-xs"
                style={{
                  backgroundColor: 'rgba(var(--theme-info-rgb), 0.1)',
                  color: 'var(--theme-info)'
                }}
              >
                {post.category}
              </span>
            </>
          )}
        </div>

        <div className="space-y-4" style={{ color: 'var(--theme-text)', opacity: 0.9 }}>
          {post.excerpt && <p>{post.excerpt}</p>}

          {/* Placeholder for full content */}
          <div
            className="p-4 rounded"
            style={{
              backgroundColor: 'rgba(var(--theme-surface-rgb), 0.3)',
              border: '1px solid rgba(var(--accent-color-rgb), 0.1)'
            }}
          >
            <p className="text-sm italic" style={{ opacity: 0.7 }}>
              [Full blog content would appear here. This could be markdown content
              rendered with proper styling, code blocks, and other rich content.]
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Otherwise show the blog list
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold" style={{ color: 'var(--accent-color)' }}>
        Blog
      </h2>
      <div className="space-y-2">
        {blogPosts.map((post, index) => (
          <article
            key={post.id}
            className="group cursor-pointer py-2"
            onClick={() => setSelectedBlog(post.id)}
          >
            <h3
              className="text-lg font-semibold mb-1 transition-colors group-hover:brightness-110"
              style={{ color: 'var(--theme-primary)' }}
            >
              {post.title}
            </h3>
            {post.excerpt && (
              <p
                className="text-sm transition-opacity group-hover:opacity-100"
                style={{ color: 'var(--theme-text)', opacity: 0.8 }}
              >
                {post.excerpt}
              </p>
            )}
            {index < blogPosts.length - 1 && (
              <div
                className="mt-2 h-px"
                style={{
                  background: 'linear-gradient(90deg, rgba(var(--accent-color-rgb), 0.1) 0%, rgba(var(--accent-color-rgb), 0.05) 100%)'
                }}
              />
            )}
          </article>
        ))}
      </div>
    </div>
  );
};