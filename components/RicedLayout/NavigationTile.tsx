'use client';

import React, { useState } from 'react';
import { ContentType } from './LayoutManager';
import { useProjects, useBlogPosts, useUIStrings } from '@/lib/config';

interface NavigationTileProps {
  onContentSelect: (content: ContentType) => void;
  activeContent: ContentType;
}

const NavigationTile: React.FC<NavigationTileProps> = ({ onContentSelect, activeContent }) => {
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set());
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const projects = useProjects();
  const blogs = useBlogPosts();
  const uiStrings = useUIStrings();

  const toggleDir = (dir: string) => {
    const newExpanded = new Set(expandedDirs);
    if (newExpanded.has(dir)) {
      newExpanded.delete(dir);
    } else {
      newExpanded.add(dir);
    }
    setExpandedDirs(newExpanded);
  };

  const toggleItem = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
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
    <div className="font-mono text-sm text-[#a9b1d6]">
      <div className="mb-3 text-[#7aa2f7] font-bold">{uiStrings.navigation.rootPath}</div>

      <div className="touch-spacing">
        {/* About */}
        <div
          className={`touch-target touch-feedback cursor-pointer hover:bg-[#7aa2f7]/10 px-2 py-1 rounded transition-all duration-200 ${
            isActive('about') ? 'bg-[#7aa2f7]/20 text-[#7aa2f7]' : ''
          }`}
          onClick={() => onContentSelect({ type: 'about' })}
        >
          <span><span className="text-[#9ece6a]">├──</span> About</span>
        </div>

        {/* Projects Directory */}
        <div>
          <div className="flex items-center">
            <span
              className="touch-target touch-feedback cursor-pointer hover:bg-[#7aa2f7]/10 px-2 py-1 rounded transition-all duration-200 flex-1"
              onClick={() => onContentSelect({ type: 'projects-overview' })}
            >
              <span className="text-[#9ece6a]">├──</span>{' '}
              <span className={`text-[#7aa2f7] ${isActive('projects-overview') ? 'font-bold' : ''}`}>
                Projects/
              </span>
            </span>
            <span
              className="cursor-pointer px-1 text-[#7aa2f7] hover:text-[#7aa2f7]/80"
              onClick={() => toggleDir('projects')}
            >
              {expandedDirs.has('projects') ? '▼' : '▶'}
            </span>
          </div>
          {expandedDirs.has('projects') && (
            <div className="ml-4">
              {projectItems.map((project, index) => (
                <div
                  key={project.id}
                  className={`touch-target touch-feedback cursor-pointer hover:bg-[#7aa2f7]/10 px-2 py-1 rounded transition-all duration-200 ${
                    isActive('project', project) ? 'bg-[#7aa2f7]/20 text-[#7aa2f7]' : ''
                  }`}
                  onClick={() => onContentSelect({ type: 'project', data: project })}
                >
                  <span>
                    <span className="text-[#9ece6a]">
                      {index === projectItems.length - 1 ? '└──' : '├──'}
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
          <div className="flex items-center">
            <span
              className="touch-target touch-feedback cursor-pointer hover:bg-[#7aa2f7]/10 px-2 py-1 rounded transition-all duration-200 flex-1"
              onClick={() => onContentSelect({ type: 'blog-overview' })}
            >
              <span className="text-[#9ece6a]">├──</span>{' '}
              <span className={`text-[#7aa2f7] ${isActive('blog-overview') ? 'font-bold' : ''}`}>
                Blog/
              </span>
            </span>
            <span
              className="cursor-pointer px-1 text-[#7aa2f7] hover:text-[#7aa2f7]/80"
              onClick={() => toggleDir('blog')}
            >
              {expandedDirs.has('blog') ? '▼' : '▶'}
            </span>
          </div>
          {expandedDirs.has('blog') && (
            <div className="ml-4">
              {blogItems.map((blog, index) => (
                <div
                  key={blog.id}
                  className={`touch-target touch-feedback cursor-pointer hover:bg-[#7aa2f7]/10 px-2 py-1 rounded transition-all duration-200 ${
                    isActive('blog', blog) ? 'bg-[#7aa2f7]/20 text-[#7aa2f7]' : ''
                  }`}
                  onClick={() => onContentSelect({ type: 'blog', data: blog })}
                >
                  <span>
                    <span className="text-[#9ece6a]">
                      {index === blogItems.length - 1 ? '└──' : '├──'}
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
          className={`touch-target touch-feedback cursor-pointer hover:bg-[#7aa2f7]/10 px-2 py-1 rounded transition-all duration-200 ${
            isActive('contact') ? 'bg-[#7aa2f7]/20 text-[#7aa2f7]' : ''
          }`}
          onClick={() => onContentSelect({ type: 'contact' })}
        >
          <span><span className="text-[#9ece6a]">└──</span> Contact</span>
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