import { allBlogs } from 'content-collections';

/**
 * RSS 2.0 Feed
 * Provides blog posts in standard RSS format for feed readers
 */
export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const publishedBlogs = allBlogs
    .filter((blog) => blog.status === 'published')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Portfolio Blog</title>
    <link>${siteUrl}</link>
    <description>Technical articles and insights on software engineering, AI, and web development</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${publishedBlogs
      .map(
        (blog) => `
    <item>
      <title><![CDATA[${blog.title}]]></title>
      <link>${siteUrl}${blog.url}</link>
      <guid isPermaLink="true">${siteUrl}${blog.url}</guid>
      <description><![CDATA[${blog.summary}]]></description>
      <pubDate>${new Date(blog.date).toUTCString()}</pubDate>
      ${blog.updated ? `<lastmod>${new Date(blog.updated).toUTCString()}</lastmod>` : ''}
      ${blog.tags.map((tag) => `<category>${tag}</category>`).join('\n      ')}
      ${blog.series ? `<category domain="series">${blog.series}</category>` : ''}
    </item>`
      )
      .join('\n')}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
