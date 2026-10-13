import Link from 'next/link';
import type { PostSummary, ProjectSummary } from '@/lib/content-types';
import { StatusChip } from '@/components/projects/ProjectCard';
import { ContactForm } from './ContactForm';

/*
 * The phone column's sections after the hero, the featured block and the lab (docs/PORTFOLIO_V2_SPEC.md
 * §4.2). Server-rendered and hidden on desktop by CSS, where the stage shows the contact form.
 */

/** Every project the featured block does not show, as compact rows. */
export function ProjectsSection({ projects }: { projects: ProjectSummary[] }) {
  if (projects.length === 0) return null;
  return (
    <section id="section-projects" className="phone-section" aria-labelledby="projects-title">
      <h2 id="projects-title" className="section-title">
        Projects
      </h2>
      <ul className="project-rows" role="list">
        {projects.map((p) => (
          <li key={p.slug}>
            <Link href={p.url} className="project-row">
              <span className="project-row-head">
                <span className="project-row-title">{p.title}</span>
                <StatusChip status={p.status} releaseDate={p.releaseDate} />
              </span>
              <span className="project-row-summary">{p.summary}</span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="section-link">
        <Link href="/projects">all projects →</Link>
      </p>
    </section>
  );
}

/** The newest posts, with the blog's entry points on (NEXT_PUBLIC_FEATURE_BLOG). */
export function WritingSection({ posts, total }: { posts: PostSummary[]; total: number }) {
  return (
    <section id="section-writing" className="phone-section" aria-labelledby="writing-title">
      <h2 id="writing-title" className="section-title">
        Writing
      </h2>
      <ul className="project-rows" role="list">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link href={p.url} className="project-row">
              <span className="project-row-title">{p.title}</span>
              <span className="project-row-summary">{p.readingTime}</span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="section-link">
        <Link href="/blog">{total > posts.length ? `all ${total} posts →` : 'all writing →'}</Link>
      </p>
    </section>
  );
}

export function ContactSection() {
  return (
    <section id="section-contact" className="phone-section" aria-labelledby="contact-title">
      <ContactForm />
    </section>
  );
}
