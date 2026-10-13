import type { ProjectMetric } from '@/lib/content-types';
import { relativeTime } from '@/lib/projects';

/** The project page's numbers: each metric large over its label, and the last push. */
export function MetricsRow({ metrics, pushedAt }: { metrics: ProjectMetric[]; pushedAt?: string }) {
  if (metrics.length === 0 && !pushedAt) return null;
  return (
    <dl className="metrics-row">
      {metrics.map((m) => (
        <div key={m.label} className="metric">
          <dt>{m.label}</dt>
          <dd>{m.value}</dd>
        </div>
      ))}
      {pushedAt && (
        <div className="metric">
          <dt>updated</dt>
          <dd className="metric-small">{relativeTime(pushedAt)}</dd>
        </div>
      )}
    </dl>
  );
}
