'use client';

import React, { useState } from 'react';
import { useFocusState, ContentType } from '@/contexts/FocusContext';
import { usePersonalInfo, useProjects, useBlogPosts, useSkills, useUIStrings } from '@/lib/config';
import { AboutTechGrid } from './about/AboutTechGrid';

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
      case 'about':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold" style={{ color: 'var(--accent-color)' }}>
              {personal.greeting || `Hi, I'm ${personal.name}`}
            </h1>

            <div className="space-y-4" style={{ color: 'var(--theme-text)' }}>
              {/* Introduction */}
              {personal.bio.intro && (
                <p className="leading-relaxed">
                  {personal.bio.intro}
                </p>
              )}

              {/* Experience */}
              {personal.bio.experience && (
                <p className="leading-relaxed" style={{ opacity: 0.95 }}>
                  {personal.bio.experience}
                </p>
              )}

              {/* Leadership */}
              {personal.bio.leadership && (
                <p className="leading-relaxed" style={{ opacity: 0.9 }}>
                  {personal.bio.leadership}
                </p>
              )}

              {/* Tagline */}
              {personal.bio.tagline && (
                <p
                  className="text-sm italic pt-4 border-t"
                  style={{
                    color: 'var(--theme-text-dimmed)',
                    borderColor: 'rgba(var(--accent-color-rgb), 0.2)',
                    opacity: 0.8
                  }}
                >
                  {personal.bio.tagline}
                </p>
              )}

              {/* Technology Icons Grid */}
              <AboutTechGrid />
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
                <button className="touch-target touch-feedback px-4 py-2 text-sm rounded hover:opacity-90 transition-all duration-200 block w-auto" style={{ backgroundColor: 'var(--accent-color)', color: 'var(--theme-bg)' }}>
                  {uiStrings.buttons.viewGithub}
                </button>
                <button className="touch-target touch-feedback px-4 py-2 border text-sm rounded transition-all duration-200 block w-auto" style={{ borderColor: 'var(--accent-color)', color: 'var(--accent-color)', backgroundColor: 'transparent' }}
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
                  className="touch-target touch-feedback px-4 py-2 text-sm rounded transition-all duration-200 block w-auto"
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
            <div className="space-y-4">
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
                    className="border-b pb-4 transition-colors cursor-pointer"
                    style={{ borderColor: 'rgba(var(--accent-color-rgb), 0.2)' }}
                    onMouseEnter={(e) => {
                      // Title changes to accent color
                      const title = e.currentTarget.querySelector('h3');
                      if (title) (title as HTMLElement).style.color = 'var(--accent-color)';

                      // Description becomes fully opaque
                      const desc = e.currentTarget.querySelector('p');
                      if (desc) (desc as HTMLElement).style.opacity = '1';

                      // Border becomes more prominent (no glow)
                      e.currentTarget.style.borderColor = 'rgba(var(--accent-color-rgb), 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      // Title back to theme text
                      const title = e.currentTarget.querySelector('h3');
                      if (title) (title as HTMLElement).style.color = 'var(--theme-text)';

                      // Description back to 80%
                      const desc = e.currentTarget.querySelector('p');
                      if (desc) (desc as HTMLElement).style.opacity = '0.8';

                      // Border back to subtle
                      e.currentTarget.style.borderColor = 'rgba(var(--accent-color-rgb), 0.2)';
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate?.({ type: 'project', data: projectData });
                    }}
                  >
                    <h3 className="font-bold text-base mb-2 transition-colors" style={{ color: 'var(--theme-text)' }}>{project.name}</h3>
                    <p className="text-sm mb-3 transition-opacity" style={{ color: 'var(--theme-text)', opacity: 0.8 }}>{project.description}</p>
                    <div className="flex gap-2 flex-wrap">
                      {project.techStack.slice(0, 3).map((tech, idx) => (
                        <span
                          key={idx}
                          className="text-xs"
                          style={{
                            color: 'var(--theme-text-dimmed)'
                          }}
                        >
                          {tech}{idx < Math.min(2, project.techStack.length - 1) ? ' •' : ''}
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
                    style={{ borderColor: 'rgba(var(--accent-color-rgb), 0.2)' }}
                    onMouseEnter={(e) => {
                      // Title changes to accent color
                      const title = e.currentTarget.querySelector('h3');
                      if (title) (title as HTMLElement).style.color = 'var(--accent-color)';

                      // Excerpt becomes fully opaque
                      const excerpt = e.currentTarget.querySelector('p');
                      if (excerpt) (excerpt as HTMLElement).style.opacity = '1';

                      // Border becomes more prominent (no glow)
                      e.currentTarget.style.borderColor = 'rgba(var(--accent-color-rgb), 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      // Title back to theme text
                      const title = e.currentTarget.querySelector('h3');
                      if (title) (title as HTMLElement).style.color = 'var(--theme-text)';

                      // Excerpt back to 80%
                      const excerpt = e.currentTarget.querySelector('p');
                      if (excerpt) (excerpt as HTMLElement).style.opacity = '0.8';

                      // Border back to subtle
                      e.currentTarget.style.borderColor = 'rgba(var(--accent-color-rgb), 0.2)';
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate?.({ type: 'blog', data: blogData });
                    }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold transition-colors" style={{ color: 'var(--theme-text)' }}>{post.title}</h3>
                      <span className="text-xs" style={{ color: 'var(--theme-text-dimmed)' }}>{post.date}</span>
                    </div>
                    <p className="text-sm mb-2 transition-opacity" style={{ color: 'var(--theme-text)', opacity: 0.8 }}>{post.excerpt}</p>
                    <span className="text-xs" style={{ color: 'var(--theme-text-dimmed)' }}>{post.category}</span>
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