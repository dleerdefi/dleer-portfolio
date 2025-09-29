'use client';

import React, { useState } from 'react';
import { useFocusState, ContentType } from '@/contexts/FocusContext';
import { usePersonalInfo, useProjects, useBlogPosts, useSkills, useUIStrings } from '@/lib/config';

interface ContentViewerProps {
  onNavigate?: (content: ContentType) => void;
}

const ContentViewer: React.FC<ContentViewerProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const { activeContent } = useFocusState();
  const personal = usePersonalInfo();
  const projectsConfig = useProjects();
  const blogPostsConfig = useBlogPosts();
  const skills = useSkills();
  const uiStrings = useUIStrings();

  const content = activeContent;

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
            <div style={{ color: 'var(--theme-text)' }}>
              <p className="text-lg mb-4 font-bold" style={{ color: 'var(--theme-text)' }}>
                {personal.title}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--theme-text)', opacity: 0.9 }}>
                {personal.bio.homeDescription ||
                  "Navigate through the file tree on the left to explore my portfolio. Each project showcases my expertise and passion for building exceptional software."}
              </p>
            </div>
            <div className="text-xs mt-8" style={{ color: 'var(--theme-text-dimmed)' }}>
              <p className="font-bold" style={{ color: 'var(--accent-color)' }}>{uiStrings.tips.title}</p>
              {uiStrings.tips.items.map((tip, index) => (
                <p key={index} className="mt-2">{tip}</p>
              ))}
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold" style={{ color: 'var(--accent-color)' }}>{uiStrings.headers.about}</h1>

            <div className="space-y-4" style={{ color: 'var(--theme-text)' }}>
              <p className="leading-relaxed">
                {personal.bio.long.split('\\n\\n')[0]}
              </p>

              <p className="leading-relaxed">
                {personal.bio.long.split('\\n\\n')[1]}
              </p>

              <div className="grid grid-cols-2 gap-8 mt-6">
                {skills.slice(0, 2).map((skillCategory, index) => (
                  <div key={skillCategory.category}>
                    <h2 className="font-bold mb-3" style={{ color: index === 0 ? 'var(--theme-success)' : 'var(--accent-color)' }}>
                      {skillCategory.category}
                    </h2>
                    <ul className="space-y-1 text-sm" style={{ color: 'var(--theme-text)', opacity: 0.9 }}>
                      {skillCategory.skills.map(skill => (
                        <li key={skill}>• {skill}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--theme-border)', opacity: 0.3 }}>
                <h2 className="font-bold mb-3" style={{ color: 'var(--theme-warning)' }}>{uiStrings.headers.currentFocus}</h2>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--theme-text)', opacity: 0.9 }}>
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
            <div className="text-sm flex items-center gap-2" style={{ color: 'var(--theme-text-dimmed)' }}>
              <span
                className="cursor-pointer transition-colors hover:opacity-80"
                style={{ color: 'var(--accent-color)' }}
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate?.({ type: 'projects-overview' });
                }}
              >
                Projects
              </span>
              <span style={{ color: 'var(--theme-text-dimmed)' }}>/</span>
              <span style={{ color: 'var(--theme-text)' }}>{project.displayName || project.name}</span>
            </div>

            <div className="border-b pb-4" style={{ borderColor: 'var(--theme-border)', opacity: 0.3 }}>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--accent-color)' }}>{project.name}</h1>
              <p className="mt-1" style={{ color: 'var(--theme-text-dimmed)' }}>{project.description}</p>
            </div>

            <div className="space-y-4" style={{ color: 'var(--theme-text)' }}>
              <div>
                <h2 className="font-bold mb-2" style={{ color: 'var(--theme-success)' }}>{uiStrings.headers.overview}</h2>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--theme-text)', opacity: 0.9 }}>
                  {project.overview || "This project demonstrates advanced development practices with focus on security, efficiency, and scalability. Implemented using modern development tools and following industry best practices."}
                </p>
              </div>

              <div>
                <h2 className="font-bold mb-2" style={{ color: 'var(--theme-success)' }}>{uiStrings.headers.techStack}</h2>
                <code className="text-xs font-mono p-3 rounded-lg mt-2 border block" style={{ color: 'var(--theme-info)', backgroundColor: 'var(--theme-bg)', borderColor: 'var(--theme-border)', opacity: 0.5 }}>
                  {project.techStack?.join(', ') || projectsConfig.find(p => p.id === project.id)?.techStackDisplay || 'Technologies not specified'}
                </code>
              </div>

              <div>
                <h2 className="font-bold mb-2" style={{ color: 'var(--theme-success)' }}>{uiStrings.headers.keyFeatures}</h2>
                <ul className="space-y-1 text-sm" style={{ color: 'var(--theme-text)', opacity: 0.9 }}>
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
                <button className="touch-target touch-feedback px-4 py-2 text-sm rounded hover:opacity-90 transition-all duration-200" style={{ backgroundColor: 'var(--accent-color)', color: 'var(--theme-bg)' }}>
                  {uiStrings.buttons.viewGithub}
                </button>
                <button className="touch-target touch-feedback px-4 py-2 border text-sm rounded transition-all duration-200" style={{ borderColor: 'var(--accent-color)', color: 'var(--accent-color)', backgroundColor: 'transparent' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(var(--accent-color-rgb), 0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
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
            <div className="text-sm flex items-center gap-2" style={{ color: 'var(--theme-text-dimmed)' }}>
              <span
                className="cursor-pointer transition-colors hover:opacity-80"
                style={{ color: 'var(--accent-color)' }}
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate?.({ type: 'blog-overview' });
                }}
              >
                Blog
              </span>
              <span style={{ color: 'var(--theme-text-dimmed)' }}>/</span>
              <span style={{ color: 'var(--theme-text)' }}>{blog.displayName || blog.title}</span>
            </div>

            <div className="border-b pb-4" style={{ borderColor: 'var(--theme-border)', opacity: 0.3 }}>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--accent-color)' }}>{blog.title}</h1>
              <p className="text-sm mt-1" style={{ color: 'var(--theme-text-dimmed)' }}>{blog.name}</p>
            </div>

            <div className="prose prose-invert text-sm leading-relaxed space-y-4" style={{ color: 'var(--theme-text)' }}>
              {blog.content ? (
                <div dangerouslySetInnerHTML={{ __html: blog.content }} />
              ) : (
                <>
                  <p style={{ color: 'var(--theme-text)', opacity: 0.9 }}>
                    {blog.excerpt || "Content coming soon..."}
                  </p>
                  <h2 className="font-bold" style={{ color: 'var(--theme-success)' }}>{uiStrings.headers.introduction}</h2>
                  <p style={{ color: 'var(--theme-text)', opacity: 0.9 }}>
                    Detailed explanation of the topic, with code examples and technical insights
                    that demonstrate deep understanding of the subject matter.
                  </p>
                  <h2 className="font-bold" style={{ color: 'var(--theme-success)' }}>{uiStrings.headers.conclusion}</h2>
                  <p style={{ color: 'var(--theme-text)', opacity: 0.9 }}>
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
            <h1 className="text-2xl font-bold" style={{ color: 'var(--accent-color)' }}>{uiStrings.headers.contact}</h1>

            <form className="space-y-4">
              <div>
                <label className="block text-sm" style={{ color: 'var(--theme-text-dimmed)' }}>{uiStrings.labels.name}</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded px-3 py-2 text-sm transition-colors"
                  style={{
                    backgroundColor: 'var(--theme-surface)',
                    color: 'var(--theme-text)',
                    borderWidth: '1px',
                    borderColor: 'rgba(var(--accent-color-rgb), 0.5)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--accent-color)';
                    e.target.style.outline = '2px solid var(--accent-color)';
                    e.target.style.outlineOffset = '2px';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(var(--accent-color-rgb), 0.5)';
                    e.target.style.outline = 'none';
                  }}
                  placeholder={uiStrings.placeholders.name}
                />
              </div>
              <div>
                <label className="block text-sm" style={{ color: 'var(--theme-text-dimmed)' }}>{uiStrings.labels.email}</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded px-3 py-2 text-sm transition-colors"
                  style={{
                    backgroundColor: 'var(--theme-surface)',
                    color: 'var(--theme-text)',
                    borderWidth: '1px',
                    borderColor: 'rgba(var(--accent-color-rgb), 0.5)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--accent-color)';
                    e.target.style.outline = '2px solid var(--accent-color)';
                    e.target.style.outlineOffset = '2px';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(var(--accent-color-rgb), 0.5)';
                    e.target.style.outline = 'none';
                  }}
                  placeholder={uiStrings.placeholders.email}
                />
              </div>
              <div>
                <label className="block text-sm" style={{ color: 'var(--theme-text-dimmed)' }}>{uiStrings.labels.message}</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  className="w-full rounded px-3 py-2 text-sm resize-none transition-colors"
                  style={{
                    backgroundColor: 'var(--theme-surface)',
                    color: 'var(--theme-text)',
                    borderWidth: '1px',
                    borderColor: 'rgba(var(--accent-color-rgb), 0.5)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--accent-color)';
                    e.target.style.outline = '2px solid var(--accent-color)';
                    e.target.style.outlineOffset = '2px';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(var(--accent-color-rgb), 0.5)';
                    e.target.style.outline = 'none';
                  }}
                  placeholder={uiStrings.placeholders.message}
                />
              </div>
              <div style={{ marginTop: '24px' }}>
                <button
                  type="submit"
                  className="touch-target touch-feedback px-4 py-2 text-sm rounded transition-all duration-200"
                  style={{
                    backgroundColor: 'var(--accent-color)',
                    color: 'var(--theme-bg)',
                    fontWeight: 'bold'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.9';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
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
            <p className="text-sm" style={{ color: 'var(--theme-text)' }}>
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
                    className="border rounded-lg transition-all duration-200 cursor-pointer hover:shadow-lg"
                    style={{
                      padding: '24px',
                      borderColor: 'var(--theme-border)',
                      backgroundColor: 'rgba(var(--theme-surface-rgb), 0.3)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent-color)';
                      e.currentTarget.style.backgroundColor = 'rgba(var(--theme-surface-rgb), 0.5)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(var(--accent-color-rgb), 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--theme-border)';
                      e.currentTarget.style.backgroundColor = 'rgba(var(--theme-surface-rgb), 0.3)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate?.({ type: 'project', data: projectData });
                    }}
                  >
                    <h3 className="font-bold text-base" style={{ color: 'var(--theme-success)', marginBottom: '8px' }}>{project.name}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--theme-text)', opacity: 0.9, marginBottom: '12px' }}>{project.description}</p>
                    <div className="flex gap-2 flex-wrap" style={{ marginTop: 'auto' }}>
                      {project.techStack.slice(0, 3).map((tech, idx) => (
                        <span
                          key={idx}
                          className="text-xs rounded border"
                          style={{
                            padding: '4px 8px',
                            color: 'var(--theme-info)',
                            backgroundColor: 'var(--theme-surface)',
                            borderColor: 'var(--theme-border)',
                            opacity: 0.8
                          }}
                        >
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
            <p className="text-sm" style={{ color: 'var(--theme-text)' }}>
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
                    className="border-b pb-4 transition-colors cursor-pointer"
                    style={{ borderColor: 'var(--theme-border)', opacity: 0.3 }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent-color)';
                      e.currentTarget.style.opacity = '0.8';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(var(--accent-color-rgb), 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--theme-border)';
                      e.currentTarget.style.opacity = '0.3';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate?.({ type: 'blog', data: blogData });
                    }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold" style={{ color: 'var(--theme-success)' }}>{post.title}</h3>
                      <span className="text-xs" style={{ color: 'var(--theme-text-dimmed)' }}>{post.date}</span>
                    </div>
                    <p className="text-sm mb-2" style={{ color: 'var(--theme-text)', opacity: 0.9 }}>{post.excerpt}</p>
                    <span className="text-xs" style={{ color: 'var(--accent-color)' }}>{post.category}</span>
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