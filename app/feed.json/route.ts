import { allBlogs } from 'content-collections';

/**
 * JSON Feed 1.1
 * Modern feed format with better structure than RSS
 * @see https://www.jsonfeed.org/version/1.1/
 */
export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const publishedBlogs = allBlogs
    .filter((blog) => blog.status === 'published')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: 'Portfolio Blog',
    home_page_url: siteUrl,
    feed_url: `${siteUrl}/feed.json`,
    description: 'Technical articles and insights on software engineering, AI, and web development',
    language: 'en',
    items: publishedBlogs.map((blog) => ({
      id: `${siteUrl}${blog.url}`,
      url: `${siteUrl}${blog.url}`,
      title: blog.title,
      summary: blog.summary,
      content_html: blog.html,
      date_published: blog.date,
      date_modified: blog.updated || blog.date,
      tags: blog.tags,
      image: blog.cover || undefined,
      _series: blog.series || undefined,
      _reading_time: blog.readingTime || undefined,
    })),
  };

  return new Response(JSON.stringify(feed, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
