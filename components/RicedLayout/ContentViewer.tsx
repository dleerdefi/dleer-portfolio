'use client';

import React, { useState } from 'react';
import { ContentType } from './LayoutManager';
import { usePersonalInfo, useProjects, useBlogPosts, useSkills, useUIStrings } from '@/lib/config';

interface ContentViewerProps {
  content: ContentType;
  onNavigate?: (content: ContentType) => void;
}

const ContentViewer: React.FC<ContentViewerProps> = ({ content, onNavigate }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const personal = usePersonalInfo();
  const projectsConfig = useProjects();
  const blogPostsConfig = useBlogPosts();
  const skills = useSkills();
  const uiStrings = useUIStrings();

  const renderContent = () => {
    switch (content.type) {
      case 'home':
        return (
          <div className="space-y-6">
            <div className="text-center overflow-x-auto">
              <pre
                className="opacity-90 inline-block"
                style={{
                  color: 'var(--accent-color)',
                  background: 'transparent',
                  padding: 0,
                  border: 'none',
                  margin: '0 auto',
                  fontSize: 'clamp(0.5rem, 2.5vw, 0.75rem)',
                  whiteSpace: 'pre'
                }}
              >
{uiStrings.welcomeAscii || `WELCOME`}
              </pre>
            </div>
            <div className="text-[#a9b1d6]">
              <p className="text-lg mb-4 text-[#c0caf5] font-bold">
                {personal.title}
              </p>
              <p className="text-sm leading-relaxed text-[#a9b1d6]/90">
                {personal.bio.homeDescription ||
                  "Navigate through the file tree on the left to explore my portfolio. Each project showcases my expertise and passion for building exceptional software."}
              </p>
            </div>
            <div className="text-xs text-[#565f89] mt-8">
              <p className="font-bold text-[#bb9af7]">{uiStrings.tips.title}</p>
              {uiStrings.tips.items.map((tip, index) => (
                <p key={index} className="mt-2">{tip}</p>
              ))}
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-[#7aa2f7]">{uiStrings.headers.about}</h1>

            <div className="text-[#a9b1d6] space-y-4">
              <p className="leading-relaxed">
                {personal.bio.long.split('\n\n')[0]}
              </p>

              <p className="leading-relaxed">
                {personal.bio.long.split('\n\n')[1]}
              </p>

              <div className="grid grid-cols-2 gap-8 mt-6">
                {skills.slice(0, 2).map((skillCategory, index) => (
                  <div key={skillCategory.category}>
                    <h2 className={`${index === 0 ? 'text-[#9ece6a]' : 'text-[#bb9af7]'} font-bold mb-3`}>
                      {skillCategory.category}
                    </h2>
                    <ul className="space-y-1 text-sm text-[#a9b1d6]/90">
                      {skillCategory.skills.map(skill => (
                        <li key={skill}>• {skill}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-[#414868]/30">
                <h2 className="text-[#e0af68] font-bold mb-3">{uiStrings.headers.currentFocus}</h2>
                <p className="text-sm text-[#a9b1d6]/90 leading-relaxed">
                  {personal.bio.currentFocus ||
                    "Continuously learning and exploring new technologies to build better software and create exceptional user experiences."}
                </p>
              </div>
            </div>
          </div>
        );

      case 'project':
        const project = (content as any).data;
        return (
          <div className="space-y-6">
            {/* Breadcrumb Navigation */}
            <div className="text-sm text-[#565f89] flex items-center gap-2">
              <span
                className="text-[#7aa2f7] hover:text-[#7aa2f7]/80 cursor-pointer transition-colors"
                onClick={() => onNavigate?.({ type: 'projects-overview' })}
              >
                Projects
              </span>
              <span className="text-[#565f89]">/</span>
              <span className="text-[#a9b1d6]">{project.displayName || project.name}</span>
            </div>

            <div className="border-b border-[#414868]/30 pb-4">
              <h1 className="text-2xl font-bold text-[#7aa2f7]">{project.name}</h1>
              <p className="text-[#565f89] mt-1">{project.description}</p>
            </div>

            <div className="space-y-4 text-[#a9b1d6]">
              <div>
                <h2 className="text-[#9ece6a] font-bold mb-2">{uiStrings.headers.overview}</h2>
                <p className="text-sm leading-relaxed text-[#a9b1d6]/90">
                  {project.overview || "This project demonstrates advanced development practices with focus on security, efficiency, and scalability. Implemented using modern development tools and following industry best practices."}
                </p>
              </div>

              <div>
                <h2 className="text-[#9ece6a] font-bold mb-2">{uiStrings.headers.techStack}</h2>
                <code className="text-[#7dcfff] text-xs font-mono bg-[#1a1b26] p-3 rounded-lg mt-2 border border-[#414868]/50 block">
                  {project.techStack?.join(', ') || projectsConfig.find(p => p.id === project.id)?.techStackDisplay || 'Technologies not specified'}
                </code>
              </div>

              <div>
                <h2 className="text-[#9ece6a] font-bold mb-2">{uiStrings.headers.keyFeatures}</h2>
                <ul className="space-y-1 text-sm text-[#a9b1d6]/90">
                  {(project.features || [
                    "Fully tested and documented codebase",
                    "Optimized implementations",
                    "Comprehensive documentation",
                    "Production-ready deployment"
                  ]).map((feature: string, index: number) => (
                    <li key={index}>• {feature}</li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-3" style={{ paddingTop: '32px' }}>
                <button className="touch-target touch-feedback px-4 py-2 bg-[#7aa2f7] text-[#1a1b26] text-sm rounded hover:bg-[#7aa2f7]/90 transition-all duration-200">
                  {uiStrings.buttons.viewGithub}
                </button>
                <button className="touch-target touch-feedback px-4 py-2 border border-[#7aa2f7] text-[#7aa2f7] text-sm rounded hover:bg-[#7aa2f7]/10 transition-all duration-200">
                  {uiStrings.buttons.liveDemo}
                </button>
              </div>
            </div>
          </div>
        );

      case 'blog':
        const blog = (content as any).data;
        return (
          <div className="space-y-6">
            {/* Breadcrumb Navigation */}
            <div className="text-sm text-[#565f89] flex items-center gap-2">
              <span
                className="text-[#7aa2f7] hover:text-[#7aa2f7]/80 cursor-pointer transition-colors"
                onClick={() => onNavigate?.({ type: 'blog-overview' })}
              >
                Blog
              </span>
              <span className="text-[#565f89]">/</span>
              <span className="text-[#a9b1d6]">{blog.displayName || blog.title}</span>
            </div>

            <div className="border-b border-[#414868]/30 pb-4">
              <h1 className="text-2xl font-bold text-[#7aa2f7]">{blog.title}</h1>
              <p className="text-[#565f89] text-sm mt-1">{blog.name}</p>
            </div>

            <div className="prose prose-invert text-[#a9b1d6] text-sm leading-relaxed space-y-4">
              {blog.content ? (
                <div dangerouslySetInnerHTML={{ __html: blog.content }} />
              ) : (
                <>
                  <p className="text-[#a9b1d6]/90">
                    {blog.excerpt || "Content coming soon..."}
                  </p>
                  <h2 className="text-[#9ece6a] font-bold">{uiStrings.headers.introduction}</h2>
                  <p className="text-[#a9b1d6]/90">
                    Detailed explanation of the topic, with code examples and technical insights
                    that demonstrate deep understanding of the subject matter.
                  </p>
                  <h2 className="text-[#9ece6a] font-bold">{uiStrings.headers.conclusion}</h2>
                  <p className="text-[#a9b1d6]/90">
                    Summary of key points and takeaways from the article.
                  </p>
                </>
              )}
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-[#7aa2f7]">{uiStrings.headers.contact}</h1>

            <form className="space-y-4">
              <div>
                <label className="block text-[#565f89] text-sm">{uiStrings.labels.name}</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#1a1b26] border border-[#414868]/50 rounded px-3 py-2 text-[#a9b1d6] text-sm focus:outline-none focus:border-[#7aa2f7] transition-colors"
                  placeholder={uiStrings.placeholders.name}
                />
              </div>
              <div>
                <label className="block text-[#565f89] text-sm">{uiStrings.labels.email}</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#1a1b26] border border-[#414868]/50 rounded px-3 py-2 text-[#a9b1d6] text-sm focus:outline-none focus:border-[#7aa2f7] transition-colors"
                  placeholder={uiStrings.placeholders.email}
                />
              </div>
              <div>
                <label className="block text-[#565f89] text-sm">{uiStrings.labels.message}</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  className="w-full bg-[#1a1b26] border border-[#414868]/50 rounded px-3 py-2 text-[#a9b1d6] text-sm focus:outline-none focus:border-[#7aa2f7] resize-none transition-colors"
                  placeholder={uiStrings.placeholders.message}
                />
              </div>
              <div style={{ marginTop: '24px' }}>
                <button
                  type="submit"
                  className="touch-target touch-feedback px-4 py-2 bg-[#7aa2f7] text-[#1a1b26] text-sm rounded hover:bg-[#7aa2f7]/90 transition-all duration-200"
                >
                  {uiStrings.buttons.sendMessage}
                </button>
              </div>
            </form>
          </div>
        );

      case 'projects-overview':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold" style={{ color: 'var(--accent-color)' }}>Projects</h1>
            <p className="text-[#a9b1d6] text-sm">
              A collection of my recent work and open-source contributions.
            </p>
            <div className="grid gap-4">
              {projectsConfig.map((project) => {
                // Transform project to match navigation format
                const projectData = {
                  id: project.id,
                  name: project.name.replace(/\.(tsx?|jsx?|py|rs|go)$/i, ''),
                  displayName: project.name.split('.')[0].split('-').map(word =>
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' '),
                  description: project.description,
                  overview: project.overview,
                  features: project.features,
                  techStack: project.techStack,
                  sections: [
                    'Overview',
                    ...(project.features ? ['Features'] : []),
                    'Tech Stack'
                  ]
                };
                return (
                  <div
                    key={project.id}
                    className="border border-[#414868]/30 rounded-lg p-4 hover:border-[#7aa2f7]/50 transition-colors cursor-pointer"
                    onClick={() => onNavigate?.({ type: 'project', data: projectData })}
                  >
                    <h3 className="text-[#9ece6a] font-bold mb-2">{project.name}</h3>
                    <p className="text-[#a9b1d6]/90 text-xs mb-3">{project.description}</p>
                    <div className="flex gap-2 flex-wrap">
                      {project.techStack.slice(0, 3).map((tech, idx) => (
                        <span key={idx} className="text-[#7dcfff] text-xs bg-[#1a1b26] px-2 py-1 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'blog-overview':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold" style={{ color: 'var(--accent-color)' }}>Blog</h1>
            <p className="text-[#a9b1d6] text-sm">
              Technical articles, tutorials, and insights from my development journey.
            </p>
            <div className="space-y-4">
              {blogPostsConfig.map((post) => {
                // Transform blog post to match navigation format
                const blogData = {
                  id: post.id,
                  name: post.filename.replace(/\.md$/i, ''),
                  displayName: post.title,
                  title: post.title,
                  date: post.date,
                  content: post.content,
                  excerpt: post.excerpt,
                  sections: post.content ?
                    (post.content.match(/^##\s+(.+)$/gm) || []).map(s => s.replace(/^##\s+/, '')) :
                    []
                };
                return (
                  <div
                    key={post.id}
                    className="border-b border-[#414868]/30 pb-4 hover:border-[#7aa2f7]/50 transition-colors cursor-pointer"
                    onClick={() => onNavigate?.({ type: 'blog', data: blogData })}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-[#9ece6a] font-bold">{post.title}</h3>
                      <span className="text-[#565f89] text-xs">{post.date}</span>
                    </div>
                    <p className="text-[#a9b1d6]/90 text-sm mb-2">{post.excerpt}</p>
                    <span className="text-[#bb9af7] text-xs">{post.category}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="font-mono text-sm">
      {renderContent()}
    </div>
  );
};

export default ContentViewer;