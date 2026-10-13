/**
 * The slim shapes of projects and posts that client components receive (docs/PORTFOLIO_V2_SPEC.md,
 * phase 1). Server components build them with lib/content-index.ts and pass them down, so the
 * client bundle never carries a document's raw MDX or compiled HTML.
 */
export type ProjectStatus = 'concept' | 'development' | 'beta' | 'coming-soon' | 'production';

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface ProjectSummary {
  slug: string;
  url: string;
  title: string;
  summary: string;
  date: string;
  /** As of the build: `coming-soon` turns `production` on its release date (lib/projects.ts) */
  status: ProjectStatus;
  /** YYYY-MM-DD, while `coming-soon` */
  releaseDate?: string;
  featured: boolean;
  featuredRank?: number;
  tags: string[];
  tech: string[];
  github?: string;
  demo?: string;
  /** 16:9 image: the card's cover and the page's hero */
  hero?: string;
  /** Without a hero, the card draws this: the MDX's first diagram or code block */
  coverText?: { title: string; lines: string[] };
  audience?: string;
  /** Resolved: "github" values filled from the API, or left out when the API gave nothing */
  metrics: ProjectMetric[];
  links: { label: string; url: string }[];
  /** The repository's last push (GitHub), for "updated 3 days ago" */
  pushedAt?: string;
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
