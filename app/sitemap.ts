import { MetadataRoute } from 'next';
import { allBlogs, allProjects } from 'content-collections';

/**
 * Dynamic sitemap generation for SEO
 * Includes all published blog posts and projects
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/blog-zen`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/projects-zen`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  // Blog posts (only published)
  const blogPages: MetadataRoute.Sitemap = allBlogs
    .filter((blog) => blog.status === 'published')
    .map((blog) => ({
      url: `${siteUrl}${blog.url}`,
      lastModified: new Date(blog.updated || blog.date),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));

  // Project pages
  const projectPages: MetadataRoute.Sitemap = allProjects.map((project) => ({
    url: `${siteUrl}${project.url}`,
    lastModified: new Date(project.updated || project.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...blogPages, ...projectPages];
}
