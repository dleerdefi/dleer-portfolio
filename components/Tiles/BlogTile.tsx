'use client';

import React from 'react';

const BlogTile: React.FC = () => {
  const posts = [
    {
      id: 1,
      title: 'Building Secure DeFi Protocols',
      date: '2024-12-20',
      excerpt: 'Best practices for smart contract security...',
    },
    {
      id: 2,
      title: 'Neo4j and LLMs: A Perfect Match',
      date: '2024-12-15',
      excerpt: 'Leveraging knowledge graphs for AI applications...',
    },
    {
      id: 3,
      title: 'Token Economics Design Patterns',
      date: '2024-12-10',
      excerpt: 'Creating sustainable tokenomics models...',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="text-term-text-dim text-sm">
        <p>$ curl -s blog.rss | head -20</p>
      </div>

      <div className="space-y-3 mt-4">
        <h2 className="text-xl font-bold text-tokyo-blue">## Recent Posts</h2>

        {posts.map((post) => (
          <article
            key={post.id}
            className="p-3 border border-term-border hover:border-tokyo-blue hover:bg-term-surface-alt transition-all cursor-pointer"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-tokyo-green font-bold">{post.title}</h3>
              <time className="text-term-text-dim text-xs">{post.date}</time>
            </div>
            <p className="text-term-text-dim text-sm">{post.excerpt}</p>
          </article>
        ))}
      </div>

      <div className="pt-4 border-t border-term-border">
        <p className="text-term-text-dim text-xs">
          Subscribe to RSS: <span className="text-tokyo-orange">https://dleer.dev/blog.rss</span>
        </p>
      </div>
    </div>
  );
};

export default BlogTile;