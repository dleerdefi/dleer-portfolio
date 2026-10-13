'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useContentIndex } from '@/contexts/ContentIndexContext';
import { useFocus, type ContentType } from '@/contexts/FocusContext';
import { useFeatureFlags } from '@/lib/config';
import { featuredProjects } from '@/lib/projects';
import { LabDirectory } from '@/components/tiles/nav/LabDirectory';

/** A view switch in the tree: a real button, current view marked for assistive tech. */
function ViewEntry({ branch, label, active, onSelect }: { branch: string; label: string; active: boolean; onSelect: () => void }) {
  return (
    <li>
      <button type="button" className="nav-entry" aria-current={active ? 'page' : undefined} onClick={onSelect}>
        <span className="tree-branch" aria-hidden="true">
          {branch}
        </span>{' '}
        {label}
      </button>
    </li>
  );
}

/**
 * The contents tile (desktop): the site as a file tree. home, about and contact switch the
 * stage; projects/ opens with the featured three and links to the rest; lab/ is LabDirectory.
 */
export default function NavTree() {
  const { projects } = useContentIndex();
  const featured = featuredProjects(projects);
  const more = projects.length - featured.length;
  const { activeContent, handleContentNavigation } = useFocus();
  const features = useFeatureFlags();
  const [projectsOpen, setProjectsOpen] = useState(true);

  const view = (content: ContentType) => () => handleContentNavigation(content);
  const is = (type: ContentType['type']) => activeContent.type === type;

  return (
    <nav className="nav-tree" aria-labelledby="contents-title">
      <h2 id="contents-title" className="nav-title">
        Contents
      </h2>
      <ul className="nav-list" role="list">
        <ViewEntry branch="├──" label="home" active={is('home')} onSelect={view({ type: 'home' })} />
        <li>
          <div className="nav-dir">
            <Link href="/projects" className="nav-entry">
              <span className="tree-branch" aria-hidden="true">
                ├──
              </span>{' '}
              projects/
            </Link>
            <button
              type="button"
              className="nav-toggle"
              aria-expanded={projectsOpen}
              aria-label={projectsOpen ? 'Collapse projects' : 'Expand projects'}
              onClick={() => setProjectsOpen(!projectsOpen)}
            >
              {projectsOpen ? '▼' : '▶'}
            </button>
          </div>
          {projectsOpen && (
            <ul className="nav-children" role="list">
              {featured.map((p) => (
                <li key={p.slug}>
                  <Link href={p.url} className="nav-entry">
                    <span className="tree-branch" aria-hidden="true">
                      ├──
                    </span>{' '}
                    <span className="nav-label">{p.title}</span>
                  </Link>
                </li>
              ))}
              {more > 0 && (
                <li>
                  <Link href="/projects" className="nav-entry nav-more">
                    <span className="tree-branch" aria-hidden="true">
                      └──
                    </span>{' '}
                    {more} more
                  </Link>
                </li>
              )}
            </ul>
          )}
        </li>
        {features.lab && (
          <li>
            <LabDirectory activeType={activeContent.type} onSelect={(content, e) => {
              e.stopPropagation();
              handleContentNavigation(content);
            }} />
          </li>
        )}
        <ViewEntry branch="├──" label="about" active={is('about')} onSelect={view({ type: 'about' })} />
        <ViewEntry branch="└──" label="contact" active={is('contact')} onSelect={view({ type: 'contact' })} />
      </ul>
    </nav>
  );
}
