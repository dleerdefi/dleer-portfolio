'use client';

import React, { useState } from 'react';
import { useFocusState, useFocusNavigation, ContentType } from '@/contexts/FocusContext';
import { useProjects, useBlogPosts, useUIStrings } from '@/lib/config';

interface NavigationTileProps {
  onContentSelect?: (content: ContentType) => void;
  isBlurred?: boolean;
}

const NavigationTile: React.FC<NavigationTileProps> = ({ onContentSelect, isBlurred = false }) => {
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set());
  const { activeContent } = useFocusState();
  const { handleContentNavigation } = useFocusNavigation();
  const projects = useProjects();
  const blogs = useBlogPosts();
  const uiStrings = useUIStrings();

  const handleSelect = (content: ContentType) => {
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

  // Map configuration data to navigation format with clean names
  const projectItems = projects.map(p => ({
    id: p.id,
    name: p.name.replace(/\.(tsx?|jsx?|py|rs|go)$/i, ''), // Remove file extensions
    displayName: p.name.split('.')[0].split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' '),
    description: p.description,
    sections: [
      'Overview',
      ...(p.features ? ['Features'] : []),
      'Tech Stack'
    ]
  }));

  const blogItems = blogs.map(b => ({
    id: b.id,
    name: b.filename.replace(/\.md$/i, ''), // Remove .md extension
    displayName: b.title,
    date: b.date,
    sections: extractBlogSections(b.content || '')
  }));

  // Extract sections from blog content
  function extractBlogSections(content: string): string[] {
    const sections = content.match(/^##\s+(.+)$/gm) || [];
    return sections.map(s => s.replace(/^##\s+/, ''));
  }

  const isActive = (type: string, data?: any) => {
    if (activeContent.type === type) {
      if (data && activeContent.type === 'project') {
        return (activeContent as any).data?.id === data.id;
      }
      if (data && activeContent.type === 'blog') {
        return (activeContent as any).data?.id === data.id;
      }
      return true;
    }
    return false;
  };

  return (
    <div className={`font-mono text-sm transition-all duration-300`}
      style={{
        color: isBlurred ? 'rgba(var(--theme-text-rgb), 0.7)' : 'var(--theme-text)'
      }}>
      <div className={`mb-3 font-bold transition-all duration-300`}
        style={{
          color: isBlurred ? 'rgba(var(--theme-primary-rgb), 0.6)' : 'var(--theme-primary)'
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
          onClick={() => handleSelect({ type: 'about' })}
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
            onClick={() => handleSelect({ type: 'projects-overview' })}
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
              {projectItems.map((project, index) => (
                <div
                  key={project.id}
                  className="touch-target touch-feedback cursor-pointer px-2 py-1 rounded transition-all duration-200"
                  style={{
                    backgroundColor: isActive('project', project) ? 'rgba(var(--accent-color-rgb), 0.2)' : 'transparent',
                    color: isActive('project', project) ? 'var(--accent-color)' : 'inherit'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive('project', project)) {
                      e.currentTarget.style.backgroundColor = 'rgba(var(--accent-color-rgb), 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive('project', project)) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                  onClick={() => handleSelect({ type: 'project', data: project })}
                >
                  <span>
                    <span className="text-[#9ece6a]">
                      <span style={{ color: 'var(--accent-color)' }}>{index === projectItems.length - 1 ? '└──' : '├──'}</span>
                    </span>{' '}
                    {project.displayName}
                  </span>
                </div>
              ))}
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
            onClick={() => handleSelect({ type: 'blog-overview' })}
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
                  key={blog.id}
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
                  onClick={() => handleSelect({ type: 'blog', data: blog })}
                >
                  <span>
                    <span className="text-[#9ece6a]">
                      <span style={{ color: 'var(--accent-color)' }}>{index === blogItems.length - 1 ? '└──' : '├──'}</span>
                    </span>{' '}
                    {blog.displayName}
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
          onClick={() => handleSelect({ type: 'contact' })}
        >
          <span><span style={{ color: 'var(--accent-color)' }}>└──</span> Contact</span>
        </div>
      </div>

      <div className="mt-auto pt-4 text-xs text-[#565f89]">
        <div className="border-t border-[#565f89]/20 pt-3">
          <div>{`${2} directories, ${2 + projectItems.length + blogItems.length} files`}</div>
          <div className="mt-2 text-[#565f89]/80">
            {uiStrings.navigation.tabHint}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationTile;