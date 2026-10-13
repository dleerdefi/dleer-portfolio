/**
 * The slim shapes of projects and posts that client components receive (docs/PORTFOLIO_V2_SPEC.md,
 * phase 1). Server components build them with lib/content-index.ts and pass them down, so the
 * client bundle never carries a document's raw MDX or compiled HTML.
 */
export interface ProjectSummary {
  slug: string;
  url: string;
  title: string;
  summary: string;
  date: string;
  status: 'concept' | 'development' | 'beta' | 'production';
  featured: boolean;
  tags: string[];
  tech: string[];
  github?: string;
  demo?: string;
}

export interface PostSummary {
  slug: string;
  url: string;
  title: string;
  summary: string;
  date: string;
  tags: string[];
  readingTime: string;
}

export interface ContentIndex {
  projects: ProjectSummary[];
  posts: PostSummary[];
}
