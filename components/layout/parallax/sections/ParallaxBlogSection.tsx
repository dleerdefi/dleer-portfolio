import React from 'react';
import { useRouter } from 'next/navigation';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  category?: string;
}

interface ParallaxBlogSectionProps {
  blogPosts: BlogPost[];
}

/**
 * Blog section component for parallax layout
 * Displays blog list and navigates to fullscreen detail pages
 */
export const ParallaxBlogSection: React.FC<ParallaxBlogSectionProps> = ({
  blogPosts
}) => {
  const router = useRouter();

  return (
    <div>
      {/* Blog list container - no glass morphism */}
      <div className="p-6 space-y-6">
        <h2
          className="text-3xl font-bold"
          style={{ color: 'var(--accent-color)' }}
        >
          Blog
        </h2>

        <div className="space-y-3">
          {blogPosts.map((post, index) => (
            <article
              key={post.id}
              className="group cursor-pointer py-2"
              onClick={() => router.push(`/blog/${post.slug}`)}
            >
              <h3
                className="text-lg font-semibold mb-1 transition-colors group-hover:brightness-110"
                style={{ color: 'var(--theme-text)' }}
              >
                {post.title}
              </h3>
              {index < blogPosts.length - 1 && (
                <div
                  className="mt-3 h-px"
                  style={{
                    background: 'linear-gradient(90deg, rgba(var(--accent-color-rgb), 0.1) 0%, rgba(var(--accent-color-rgb), 0.05) 100%)'
                  }}
                />
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};