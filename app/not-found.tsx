import Link from 'next/link';
import type { Metadata } from 'next';
import { FramedPageLayout } from '@/components/layout/FramedPageLayout';

export const metadata: Metadata = {
  title: 'Not found',
  robots: { index: false },
};

/**
 * Any path that does not exist, the lab's with its flags off included. Next's default 404 sets a
 * white page, which the site's light theme text made unreadable; this one is a framed page like
 * /projects, in the visitor's preset.
 */
export default function NotFound() {
  return (
    <FramedPageLayout autoFocus={false}>
      <div className="list-page">
        <header className="list-head">
          <div>
            <h1>404: nothing here</h1>
            <p>The page moved, or never existed.</p>
          </div>
          <div className="list-head-side">
            <Link href="/" className="list-close" aria-label="Close and return home">
              ✕
            </Link>
          </div>
        </header>
        <ul className="link-row">
          <li>
            <Link href="/">~ home</Link>
          </li>
          <li>
            <Link href="/projects">projects</Link>
          </li>
        </ul>
      </div>
    </FramedPageLayout>
  );
}
