import Link from 'next/link';

// About 35 columns, so a phone shows it whole
const DIAGRAM = `home       labsnap, threatsnap
             │ push JSON on a timer
             ▼
           private bucket
             │ read-only token
             ▼
this site  /api/lab/*
             │ validated, cached
             ▼
           edge cache ──► this page`;

/**
 * /lab's footer (docs/PORTFOLIO_V2_SPEC.md §4.6): how the numbers get here, push and never pull,
 * for the visitors who care about the architecture. The full story is the homelab case study.
 */
export function LabHowItWorks() {
  return (
    <section className="lab-card lab-how" aria-labelledby="lab-how-title">
      <h2 id="lab-how-title" className="lab-how-title">
        how this works
      </h2>
      <div className="lab-how-body">
        <pre className="lab-how-diagram" aria-hidden="true">
          {DIAGRAM}
        </pre>
        <p className="lab-how-text">
          Nothing at home serves this page. Two small programs on the homelab push JSON documents to a
          private bucket on a timer; this site reads them with a read-only token, on the server, checks
          every key against a schema, and caches them, so most visitors are answered by the edge. When
          the pushes stop, the badge says so.{' '}
          <Link href="/projects/homelab" className="lab-link lab-nowrap">
            The full story →
          </Link>
        </p>
      </div>
    </section>
  );
}
