import Link from 'next/link';
import type { ProjectSummary } from '@/lib/content-types';

/** The project's links: its own list (URLs open in a new tab, site paths in place), then GitHub and the live site unless the list has them. */
export function projectLinks(project: ProjectSummary): { label: string; url: string }[] {
  const links = [...project.links];
  const has = (url: string) => links.some((l) => l.url.replace(/\/$/, '') === url.replace(/\/$/, ''));
  if (project.github && !has(project.github)) links.push({ label: 'GitHub', url: project.github });
  if (project.demo && !has(project.demo)) links.push({ label: 'Live', url: project.demo });
  return links;
}

export function LinkRow({ project }: { project: ProjectSummary }) {
  const links = projectLinks(project);
  if (links.length === 0) return null;
  return (
    <ul className="link-row" role="list">
      {links.map((link) => (
        <li key={link.url}>
          {link.url.startsWith('/') ? (
            <Link href={link.url}>{link.label} →</Link>
          ) : (
            <a href={link.url} target="_blank" rel="noopener noreferrer">
              {link.label} ↗
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}
