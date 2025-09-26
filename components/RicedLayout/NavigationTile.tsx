'use client';

import React, { useState } from 'react';
import { ContentType } from './LayoutManager';
import { useProjects, useBlogPosts } from '@/lib/config';

interface NavigationTileProps {
  onContentSelect: (content: ContentType) => void;
  activeContent: ContentType;
}

const NavigationTile: React.FC<NavigationTileProps> = ({ onContentSelect, activeContent }) => {
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set());
  const projects = useProjects();
  const blogs = useBlogPosts();

  const toggleDir = (dir: string) => {
    const newExpanded = new Set(expandedDirs);
    if (newExpanded.has(dir)) {
      newExpanded.delete(dir);
    } else {
      newExpanded.add(dir);
    }
    setExpandedDirs(newExpanded);
  };

  // Map configuration data to navigation format
  const projectItems = projects.map(p => ({
    id: p.id,
    name: p.filename,
    description: p.description
  }));

  const blogItems = blogs.map(b => ({
    id: b.id,
    name: b.filename,
    title: b.title
  }));

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
      <div className="mb-3 text-[#7aa2f7] font-bold">~/portfolio</div>

      <div className="touch-spacing">
        {/* About */}
        <div
          className={`touch-target touch-feedback cursor-pointer hover:bg-[#7aa2f7]/10 px-2 py-1 rounded transition-all duration-200 ${
            isActive('about') ? 'bg-[#7aa2f7]/20 text-[#7aa2f7]' : ''
          }`}
          onClick={() => onContentSelect({ type: 'about' })}
        >
          <span><span className="text-[#9ece6a]">├──</span> about.md</span>
        </div>

        {/* Projects Directory */}
        <div>
          <div
            className="touch-target touch-feedback cursor-pointer hover:bg-[#7aa2f7]/10 px-2 py-1 rounded transition-all duration-200"
            onClick={() => toggleDir('projects')}
          >
            <span>
              <span className="text-[#9ece6a]">├──</span>{' '}
              <span className="text-[#7aa2f7]">
                {expandedDirs.has('projects') ? '▼' : '▶'} projects/
              </span>
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
                    {project.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Blog Directory */}
        <div>
          <div
            className="touch-target touch-feedback cursor-pointer hover:bg-[#7aa2f7]/10 px-2 py-1 rounded transition-all duration-200"
            onClick={() => toggleDir('blog')}
          >
            <span>
              <span className="text-[#9ece6a]">├──</span>{' '}
              <span className="text-[#7aa2f7]">
                {expandedDirs.has('blog') ? '▼' : '▶'} blog/
              </span>
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
                    {blog.name}
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
          <span><span className="text-[#9ece6a]">└──</span> contact.sh</span>
        </div>
      </div>

      <div className="mt-auto pt-4 text-xs text-[#565f89]">
        <div className="border-t border-[#565f89]/20 pt-3">
          <div>4 directories, 8 files</div>
          <div className="mt-2 text-[#565f89]/80">
            Tab to navigate between tiles
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationTile;