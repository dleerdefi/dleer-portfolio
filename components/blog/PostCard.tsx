import Link from 'next/link';
import type { PostSummary } from '@/lib/content-types';

const date = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });

/**
 * A post as a whole-card link, the project card's shell (16-projects.css) without a cover: the
 * path and date, the title (first in the DOM, the accessible name), the summary, the reading time
 * and the first tags.
 */
export function PostCard({ post }: { post: PostSummary }) {
  return (
    <Link href={post.url} className="project-card">
      <span className="project-card-title">{post.title}</span>
      <span className="project-card-top">
        <span className="project-card-path" aria-hidden="true">
          ~/blog/{post.slug}
        </span>
        <time className="post-card-date" dateTime={post.date}>
          {date(post.date)}
        </time>
      </span>
      <span className="project-card-summary">{post.summary}</span>
      <span className="project-card-meta">{[post.readingTime, ...post.tags.slice(0, 3)].join(' · ')}</span>
    </Link>
  );
}
