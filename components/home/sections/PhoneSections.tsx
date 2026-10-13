import Link from 'next/link';
import type { PostSummary } from '@/lib/content-types';
import { ContactForm } from './ContactForm';

/*
 * The phone column's sections after the hero, the featured block (every project is one tap
 * away there, through its "N more projects" card) and the lab (docs/PORTFOLIO_V2_SPEC.md
 * §4.2). Server-rendered and hidden on desktop by CSS, where the stage shows the contact form.
 */

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
