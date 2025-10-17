'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFocusState, useFocusNavigation, ContentType } from '@/contexts/FocusContext';
import { useUIStrings } from '@/lib/config';
import { allProjects, allBlogs } from 'content-collections';
import { FONT_SIZES } from '@/lib/constants/typography';

interface NavigationTileProps {
  onContentSelect?: (content: ContentType) => void;
  isBlurred?: boolean;
}

const NavigationTile: React.FC<NavigationTileProps> = ({ onContentSelect, isBlurred = false }) => {
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set());
  const router = useRouter();
  const { activeContent } = useFocusState();
  const { handleContentNavigation } = useFocusNavigation();
  const uiStrings = useUIStrings();

  // Use content-collections instead of config
  const projects = allProjects;
  const blogs = allBlogs.filter(blog => blog.status === 'published');

  const handleSelect = (content: ContentType, e?: React.MouseEvent) => {
    // Prevent event from bubbling up to tile container
    e?.stopPropagation();

    // Projects and blogs navigate to real Next.js routes (MDX pages) using slug
    if (content.type === 'project' && content.data?.slug) {
      // Navigate to individual project detail page using slug
      router.push(`/projects/${content.data.slug}`);
      return;
    }

    if (content.type === 'blog' && content.data?.slug) {
      // Navigate to individual blog detail page using slug
      router.push(`/blog/${content.data.slug}`);
      return;
    }

    if (content.type === 'projects-overview') {
      // Navigate to projects list page
      router.push('/projects');
      return;
    }

    if (content.type === 'blog-overview') {
      // Navigate to blog list page
      router.push('/blog');
      return;
    }

    // About and Contact: Update FocusContext for tiled mode display
    if (onContentSelect) {
      onContentSelect(content);
    } else {
      handleContentNavigation(content);
    }
  };

  const toggleDir = (dir: string) => {
    const newExpanded = new Set(expandedDirs);
    if (newExpanded.has(dir)) {
      newExpanded.delete(dir);
    } else {
      newExpanded.add(dir);
    }
    setExpandedDirs(newExpanded);
  };

  // Group projects by status and tags for categorization
  // Since MDX doesn't have category field, use tags to infer category
  const categorizeProject = (p: typeof projects[0]) => {
    const tags = p.tags.map(t => t.toLowerCase());
    if (tags.some(t => ['infrastructure', 'systems', 'kafka', 'neo4j', 'ml', 'security'].includes(t))) {
      return 'systems';
    }
    if (tags.some(t => ['product', 'growth', 'gamification', 'defi', 'yield'].includes(t))) {
      return 'product';
    }
    return 'experimental';
  };

  const projectsByCategory = {
    systems: projects.filter(p => categorizeProject(p) === 'systems'),
    product: projects.filter(p => categorizeProject(p) === 'product'),
    experimental: projects.filter(p => categorizeProject(p) === 'experimental')
  };

  const categoryNames = {
    systems: '🔧 Systems & Infrastructure',
    product: '🧭 Product & Leadership',
    experimental: '🛠 Experimental & Home Lab'
  };

  // Map MDX project data to navigation format
  const projectItems = projects.map(p => ({
    slug: p.slug,
    title: p.title,
    summary: p.summary,
    status: p.status,
    featured: p.featured,
    tags: p.tags
  }));

  const blogItems = blogs.map(b => ({
    slug: b.slug,
    title: b.title,
    date: b.date,
    summary: b.summary,
    tags: b.tags
  }));

  // Extract sections from blog content
  function extractBlogSections(content: string): string[] {
    const sections = content.match(/^##\s+(.+)$/gm) || [];
    return sections.map(s => s.replace(/^##\s+/, ''));
  }

  const isActive = (type: string, data?: any) => {
    if (activeContent.type === type) {
      if (data && activeContent.type === 'project') {
        return (activeContent as any).data?.slug === data.slug;
      }
      if (data && activeContent.type === 'blog') {
        return (activeContent as any).data?.slug === data.slug;
      }
      return true;
    }
    return false;
  };

  return (
    <div
      className="font-mono transition-all duration-300"
      style={{
        color: isBlurred ? 'rgba(var(--theme-text-rgb), 0.7)' : 'var(--theme-text)',
        fontSize: FONT_SIZES.sm
      }}>
      <div
        className="mb-3 font-bold transition-all duration-300"
        style={{
          color: isBlurred ? 'rgba(var(--theme-primary-rgb), 0.6)' : 'var(--theme-primary)',
          fontSize: FONT_SIZES.lg
        }}>{uiStrings.navigation.rootPath}</div>

      <div className="touch-spacing">
        {/* About */}
        <div
          className="touch-target touch-feedback cursor-pointer px-2 py-1 rounded transition-all duration-200"
          style={{
            backgroundColor: isActive('about') ? 'rgba(var(--accent-color-rgb), 0.2)' : 'transparent',
            color: isActive('about') ? 'var(--accent-color)' : 'inherit'
          }}
          onMouseEnter={(e) => {
            if (!isActive('about')) {
              e.currentTarget.style.backgroundColor = 'rgba(var(--accent-color-rgb), 0.1)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive('about')) {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
          onClick={(e) => handleSelect({ type: 'about' }, e)}
        >
          <span><span style={{ color: 'var(--accent-color)' }}>├──</span> About</span>
        </div>

        {/* Projects Directory */}
        <div>
          <div
            className="touch-target touch-feedback cursor-pointer px-2 py-1 rounded transition-all duration-200 flex items-center justify-between"
            style={{
              backgroundColor: isActive('projects-overview') ? 'rgba(var(--accent-color-rgb), 0.2)' : 'transparent'
            }}
            onMouseEnter={(e) => {
              if (!isActive('projects-overview')) {
                e.currentTarget.style.backgroundColor = 'rgba(var(--accent-color-rgb), 0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive('projects-overview')) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
            onClick={(e) => handleSelect({ type: 'projects-overview' }, e)}
          >
            <span>
              <span style={{ color: 'var(--accent-color)' }}>├──</span>{' '}
              <span style={{ color: isActive('projects-overview') ? 'var(--accent-color)' : 'var(--theme-text)', fontWeight: isActive('projects-overview') ? 'bold' : 'normal' }}>
                Projects/
              </span>
            </span>
            <span
              className="hover:opacity-80 px-2 -mr-1 rounded cursor-pointer"
              style={{ color: 'var(--accent-color)' }}
              onClick={(e) => {
                e.stopPropagation();
                toggleDir('projects');
              }}
            >
              {expandedDirs.has('projects') ? '▼' : '▶'}
            </span>
          </div>
          {expandedDirs.has('projects') && (
            <div className="ml-4">
              {/* Systems & Infrastructure */}
              {projectsByCategory.systems.length > 0 && (
                <>
                  <div className="mt-1 mb-1" style={{ color: 'var(--theme-text-dimmed)', fontSize: FONT_SIZES.sm }}>
                    {categoryNames.systems}
                  </div>
                  {projectsByCategory.systems.map((project, index) => {
                    const projData = projectItems.find(p => p.slug === project.slug);
                    return (
                      <div
                        key={project.slug}
                        className="touch-target touch-feedback cursor-pointer px-2 py-1 rounded transition-all duration-200 ml-2"
                        style={{
                          backgroundColor: isActive('project', projData) ? 'rgba(var(--accent-color-rgb), 0.2)' : 'transparent',
                          color: isActive('project', projData) ? 'var(--accent-color)' : 'inherit'
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive('project', projData)) {
                            e.currentTarget.style.backgroundColor = 'rgba(var(--accent-color-rgb), 0.1)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive('project', projData)) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }
                        }}
                        onClick={(e) => handleSelect({ type: 'project', data: projData }, e)}
                      >
                        <span>
                          <span style={{ color: 'var(--accent-color)' }}>
                            {index === projectsByCategory.systems.length - 1 && projectsByCategory.product.length === 0 && projectsByCategory.experimental.length === 0 ? '└──' : '├──'}
                          </span>{' '}
                          {project.title}
                        </span>
                      </div>
                    );
                  })}
                </>
              )}

              {/* Product & Leadership */}
              {projectsByCategory.product.length > 0 && (
                <>
                  <div className="mt-2 mb-1" style={{ color: 'var(--theme-text-dimmed)', fontSize: FONT_SIZES.sm }}>
                    {categoryNames.product}
                  </div>
                  {projectsByCategory.product.map((project, index) => {
                    const projData = projectItems.find(p => p.slug === project.slug);
                    return (
                      <div
                        key={project.slug}
                        className="touch-target touch-feedback cursor-pointer px-2 py-1 rounded transition-all duration-200 ml-2"
                        style={{
                          backgroundColor: isActive('project', projData) ? 'rgba(var(--accent-color-rgb), 0.2)' : 'transparent',
                          color: isActive('project', projData) ? 'var(--accent-color)' : 'inherit'
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive('project', projData)) {
                            e.currentTarget.style.backgroundColor = 'rgba(var(--accent-color-rgb), 0.1)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive('project', projData)) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }
                        }}
                        onClick={(e) => handleSelect({ type: 'project', data: projData }, e)}
                      >
                        <span>
                          <span style={{ color: 'var(--accent-color)' }}>
                            {index === projectsByCategory.product.length - 1 && projectsByCategory.experimental.length === 0 ? '└──' : '├──'}
                          </span>{' '}
                          {project.title}
                        </span>
                      </div>
                    );
                  })}
                </>
              )}

              {/* Experimental & Home Lab */}
              {projectsByCategory.experimental.length > 0 && (
                <>
                  <div className="mt-2 mb-1" style={{ color: 'var(--theme-text-dimmed)', fontSize: FONT_SIZES.sm }}>
                    {categoryNames.experimental}
                  </div>
                  {projectsByCategory.experimental.map((project, index) => {
                    const projData = projectItems.find(p => p.slug === project.slug);
                    return (
                      <div
                        key={project.slug}
                        className="touch-target touch-feedback cursor-pointer px-2 py-1 rounded transition-all duration-200 ml-2"
                        style={{
                          backgroundColor: isActive('project', projData) ? 'rgba(var(--accent-color-rgb), 0.2)' : 'transparent',
                          color: isActive('project', projData) ? 'var(--accent-color)' : 'inherit'
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive('project', projData)) {
                            e.currentTarget.style.backgroundColor = 'rgba(var(--accent-color-rgb), 0.1)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive('project', projData)) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }
                        }}
                        onClick={(e) => handleSelect({ type: 'project', data: projData }, e)}
                      >
                        <span>
                          <span style={{ color: 'var(--accent-color)' }}>
                            {index === projectsByCategory.experimental.length - 1 ? '└──' : '├──'}
                          </span>{' '}
                          {project.title}
                        </span>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          )}
        </div>

        {/* Blog Directory */}
        <div>
          <div
            className="touch-target touch-feedback cursor-pointer px-2 py-1 rounded transition-all duration-200 flex items-center justify-between"
            style={{
              backgroundColor: isActive('blog-overview') ? 'rgba(var(--accent-color-rgb), 0.2)' : 'transparent'
            }}
            onMouseEnter={(e) => {
              if (!isActive('blog-overview')) {
                e.currentTarget.style.backgroundColor = 'rgba(var(--accent-color-rgb), 0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive('blog-overview')) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
            onClick={(e) => handleSelect({ type: 'blog-overview' }, e)}
          >
            <span>
              <span style={{ color: 'var(--accent-color)' }}>├──</span>{' '}
              <span style={{ color: isActive('blog-overview') ? 'var(--accent-color)' : 'var(--theme-text)', fontWeight: isActive('blog-overview') ? 'bold' : 'normal' }}>
                Blog/
              </span>
            </span>
            <span
              className="hover:opacity-80 px-2 -mr-1 rounded cursor-pointer"
              style={{ color: 'var(--accent-color)' }}
              onClick={(e) => {
                e.stopPropagation();
                toggleDir('blog');
              }}
            >
              {expandedDirs.has('blog') ? '▼' : '▶'}
            </span>
          </div>
          {expandedDirs.has('blog') && (
            <div className="ml-4">
              {blogItems.map((blog, index) => (
                <div
                  key={blog.slug}
                  className="touch-target touch-feedback cursor-pointer px-2 py-1 rounded transition-all duration-200"
                  style={{
                    backgroundColor: isActive('blog', blog) ? 'rgba(var(--accent-color-rgb), 0.2)' : 'transparent',
                    color: isActive('blog', blog) ? 'var(--accent-color)' : 'inherit'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive('blog', blog)) {
                      e.currentTarget.style.backgroundColor = 'rgba(var(--accent-color-rgb), 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive('blog', blog)) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                  onClick={(e) => handleSelect({ type: 'blog', data: blog }, e)}
                >
                  <span>
                    <span className="text-[#9ece6a]">
                      <span style={{ color: 'var(--accent-color)' }}>{index === blogItems.length - 1 ? '└──' : '├──'}</span>
                    </span>{' '}
                    {blog.title}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contact */}
        <div
          className="touch-target touch-feedback cursor-pointer px-2 py-1 rounded transition-all duration-200"
          style={{
            backgroundColor: isActive('contact') ? 'rgba(var(--accent-color-rgb), 0.2)' : 'transparent',
            color: isActive('contact') ? 'var(--accent-color)' : 'inherit'
          }}
          onMouseEnter={(e) => {
            if (!isActive('contact')) {
              e.currentTarget.style.backgroundColor = 'rgba(var(--accent-color-rgb), 0.1)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive('contact')) {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
          onClick={(e) => handleSelect({ type: 'contact' }, e)}
        >
          <span><span style={{ color: 'var(--accent-color)' }}>└──</span> Contact</span>
        </div>
      </div>

      <div className="mt-auto pt-4" style={{ color: 'var(--theme-text-dimmed)', fontSize: FONT_SIZES.sm }}>
        <div className="border-t pt-3" style={{ borderColor: 'rgba(var(--theme-text-rgb), 0.1)' }}>
          <div style={{ opacity: 0.8 }}>
            {uiStrings.navigation.tabHint}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationTile;