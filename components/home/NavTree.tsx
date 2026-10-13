'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useFocus, type ContentType } from '@/contexts/FocusContext';
import { useFeatureFlags } from '@/lib/config';
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

type NavLink = { slug: string; title: string; url: string };

/**
 * A directory of pages: the arrow shows a few entries and "N more". Its name links to the list,
 * or, given `onOpen`, switches the stage to it (projects/, like lab/ and contact).
 */
function LinkDir({
  name,
  href,
  entries,
  more,
  defaultOpen = false,
  onOpen,
  active = false,
}: {
  name: string;
  href: string;
  entries: NavLink[];
  more: number;
  defaultOpen?: boolean;
  onOpen?: () => void;
  active?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const label = (
    <>
      <span className="tree-branch" aria-hidden="true">
        ├──
      </span>{' '}
      {name}/
    </>
  );
  return (
    <li>
      <div className="nav-dir">
        {onOpen ? (
          <button type="button" className="nav-entry" aria-current={active ? 'page' : undefined} onClick={onOpen}>
            {label}
          </button>
        ) : (
          <Link href={href} className="nav-entry">
            {label}
          </Link>
        )}
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-label={open ? `Collapse ${name}` : `Expand ${name}`}
          onClick={() => setOpen(!open)}
        >
          {open ? '▼' : '▶'}
        </button>
      </div>
      {open && (
        <ul className="nav-children" role="list">
          {entries.map((entry, i) => (
            <li key={entry.slug}>
              <Link href={entry.url} className="nav-entry">
                <span className="tree-branch" aria-hidden="true">
                  {i === entries.length - 1 && more === 0 ? '└──' : '├──'}
                </span>{' '}
                <span className="nav-label">{entry.title}</span>
              </Link>
            </li>
          ))}
          {more > 0 && (
            <li>
              <Link href={href} className="nav-entry nav-more" onClick={
                  onOpen &&
                  ((e) => {
                    e.preventDefault();
                    onOpen();
                  })
                }>
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
  );
}

/**
 * The contents tile (desktop): the site as a file tree. home, projects/ and contact switch the
 * stage; projects/ opens with the featured three, each a link to its case study; lab/ is LabDirectory;
 * blog/, with the blog's entry points on, lists the newest posts.
 */
export default function NavTree({
  featured,
  more,
  posts = [],
  morePosts = 0,
}: {
  featured: NavLink[];
  more: number;
  posts?: NavLink[];
  morePosts?: number;
}) {
  const { activeContent, handleContentNavigation } = useFocus();
  const features = useFeatureFlags();

  const view = (content: ContentType) => () => handleContentNavigation(content);
  const is = (type: ContentType['type']) => activeContent.type === type;

  return (
    <nav className="nav-tree" aria-labelledby="contents-title">
      <h2 id="contents-title" className="nav-title">
        Contents
      </h2>
      <ul className="nav-list" role="list">
        <ViewEntry branch="├──" label="home" active={is('home')} onSelect={view({ type: 'home' })} />
        <LinkDir
          name="projects"
          href="/projects"
          entries={featured}
          more={more}
          defaultOpen
          onOpen={view({ type: 'projects-overview' })}
          active={is('projects-overview')}
        />
        {features.lab && (
          <li>
            <LabDirectory activeType={activeContent.type} onSelect={(content, e) => {
              e.stopPropagation();
              handleContentNavigation(content);
            }} />
          </li>
        )}
        {features.blog && <LinkDir name="blog" href="/blog" entries={posts} more={morePosts} />}
        <ViewEntry branch="└──" label="contact" active={is('contact')} onSelect={view({ type: 'contact' })} />
      </ul>
    </nav>
  );
}
