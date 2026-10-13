import type { ProjectStatus } from '@/lib/content-types';
import { shortDate } from '@/lib/projects';

const LABEL: Record<ProjectStatus, string> = {
  production: 'production',
  beta: 'beta',
  development: 'in development',
  'coming-soon': 'coming soon',
  concept: 'concept',
};

/**
 * A project's status as a small bordered chip, colored by app/styles/16-projects.css. A coming-soon
 * project with a date reads "coming Oct 16"; the status itself flips on that date (lib/projects.ts).
 */
export function StatusChip({ status, releaseDate }: { status: ProjectStatus; releaseDate?: string }) {
  const label = status === 'coming-soon' && releaseDate ? `coming ${shortDate(releaseDate)}` : LABEL[status];
  return <span className={`status-chip status-${status}`}>{label}</span>;
}
