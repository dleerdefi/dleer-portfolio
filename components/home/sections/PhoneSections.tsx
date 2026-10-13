import Link from 'next/link';
import { getPortfolioConfig } from '@/config/portfolio.config';
import type { ProjectSummary } from '@/lib/content-types';
import { StatusChip } from '@/components/projects/ProjectCard';
import { TechIcon } from '@/components/ui/TechIcon';
import { ContactForm } from './ContactForm';

/*
 * The phone column's sections after the hero, the featured block and the lab (docs/PORTFOLIO_V2_SPEC.md
 * §4.2). Server-rendered and hidden on desktop by CSS, where the stage shows About and Contact.
 */

export function AboutSection() {
  const { personal } = getPortfolioConfig();
  const paragraphs = [personal.bio.experience, personal.bio.leadership].filter(Boolean);
  return (
    <section id="section-about" className="phone-section" aria-labelledby="about-title">
      <h2 id="about-title" className="section-title">
        About
      </h2>
      {paragraphs.map((p) => (
        <p key={p} className="section-text">
          {p}
        </p>
      ))}
      {personal.bio.tagline && <p className="section-tagline">{personal.bio.tagline}</p>}
    </section>
  );
}

export function StackSection() {
  const items = getPortfolioConfig().technologies?.items ?? [];
  if (items.length === 0) return null;
  return (
    <section id="section-stack" className="phone-section" aria-labelledby="stack-title">
      <h2 id="stack-title" className="section-title">
        Stack
      </h2>
      <ul className="stack-grid" role="list">
        {items.map((tech) => (
          <li key={tech.name}>
            <TechIcon iconName={tech.icon} name={tech.name} size={24} />
          </li>
        ))}
      </ul>
    </section>
  );
}

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
                <StatusChip status={p.status} />
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

export function ContactSection() {
  return (
    <section id="section-contact" className="phone-section" aria-labelledby="contact-title">
      <ContactForm />
    </section>
  );
}
