import BlogZenPage from '@/components/zen/BlogZenPage';
import { postSummaries } from '@/lib/content-index';

/** /blog: published posts, newest first. Only summaries reach the client. */
export default function BlogPage() {
  const posts = postSummaries().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return <BlogZenPage posts={posts} />;
}
