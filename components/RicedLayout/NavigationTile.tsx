'use client';

import React, { useState } from 'react';
import { ContentType } from './LayoutManager';

interface NavigationTileProps {
  onContentSelect: (content: ContentType) => void;
  activeContent: ContentType;
}

const NavigationTile: React.FC<NavigationTileProps> = ({ onContentSelect, activeContent }) => {
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set());

  const toggleDir = (dir: string) => {
    const newExpanded = new Set(expandedDirs);
    if (newExpanded.has(dir)) {
      newExpanded.delete(dir);
    } else {
      newExpanded.add(dir);
    }
    setExpandedDirs(newExpanded);
  };

  const projects = [
    { id: 'defi-lending', name: 'defi-lending.sol', description: 'Decentralized lending protocol' },
    { id: 'neo4j-rag', name: 'neo4j-rag.py', description: 'Knowledge graph RAG system' },
    { id: 'token-model', name: 'token-model.ts', description: 'Token economics simulator' },
    { id: 'amm-opt', name: 'amm-optimization.sol', description: 'Concentrated liquidity AMM' },
  ];

  const blogs = [
    { id: 'defi-security', name: '2024-12-20-defi-security.md', title: 'Building Secure DeFi Protocols' },
    { id: 'neo4j-llm', name: '2024-12-15-neo4j-llm.md', title: 'Neo4j and LLMs' },
  ];

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
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  className={`touch-target touch-feedback cursor-pointer hover:bg-[#7aa2f7]/10 px-2 py-1 rounded transition-all duration-200 ${
                    isActive('project', project) ? 'bg-[#7aa2f7]/20 text-[#7aa2f7]' : ''
                  }`}
                  onClick={() => onContentSelect({ type: 'project', data: project })}
                >
                  <span>
                    <span className="text-[#9ece6a]">
                      {index === projects.length - 1 ? '└──' : '├──'}
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
              {blogs.map((blog, index) => (
                <div
                  key={blog.id}
                  className={`touch-target touch-feedback cursor-pointer hover:bg-[#7aa2f7]/10 px-2 py-1 rounded transition-all duration-200 ${
                    isActive('blog', blog) ? 'bg-[#7aa2f7]/20 text-[#7aa2f7]' : ''
                  }`}
                  onClick={() => onContentSelect({ type: 'blog', data: blog })}
                >
                  <span>
                    <span className="text-[#9ece6a]">
                      {index === blogs.length - 1 ? '└──' : '├──'}
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