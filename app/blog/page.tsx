import Link from 'next/link';
import type { Metadata } from 'next';
import { getPortfolioConfig } from '@/config/portfolio.config';
import { PostCard } from '@/components/blog/PostCard';
import { FramedPageLayout } from '@/components/layout/FramedPageLayout';
import { ListKeys } from '@/components/ui/ListKeys';
import { postSummaries } from '@/lib/content-index';

export const metadata: Metadata = {
  title: 'Writing',
  description: 'Posts on AI, agents and building software.',
};

/**
 * /blog: published posts as cards, newest first, server-rendered. With the blog's entry points
 * off (NEXT_PUBLIC_FEATURE_BLOG=false) the page says it is an archive and points at the projects.
 */
export default function BlogPage() {
  const posts = postSummaries().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const archive = !getPortfolioConfig().features?.blog;
  return (
    <FramedPageLayout autoFocus={false}>
      <ListKeys />
      <div className="list-page">
        <header className="list-head">
          <div>
            <h1>Writing</h1>
            <p>Posts on AI, agents and building software.</p>
          </div>
          <div className="list-head-side">
            <span className="key-hints">j/k move · Enter open · Esc back</span>
            <Link href="/" className="list-close" aria-label="Close and return home">
              ✕
            </Link>
          </div>
        </header>
        {archive && (
          <p className="list-note">
            An archive of earlier writing. The current work is in <Link href="/projects">projects</Link>.
          </p>
        )}
        {posts.length === 0 ? (
          <p className="list-foot">No posts yet.</p>
        ) : (
          <div className="card-grid">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
        <p className="list-foot">
          {posts.length} post{posts.length === 1 ? '' : 's'}
        </p>
      </div>
    </FramedPageLayout>
  );
}
