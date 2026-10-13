import Image from 'next/image';
import type { ProjectSummary } from '@/lib/content-types';

// The text cover's drawing units: JetBrains Mono's advance is 0.6 em
const FONT = 14;
const LINE = 17.5;
const CHAR = FONT * 0.6;
const PAD = 12;

/**
 * A project's 16:9 cover: its hero image, or until it has one a text cover: the first diagram or
 * code block of its MDX drawn as an SVG picture that scales to the card (the readable diagram is
 * in the case study), or its name. Never a broken image. Decorative: the card or page around it
 * carries the title.
 */
export function ProjectCover({ project, sizes, priority = false }: { project: ProjectSummary; sizes: string; priority?: boolean }) {
  if (project.hero) {
    return (
      <div className="project-cover">
        <Image src={project.hero} alt="" fill sizes={sizes} priority={priority} style={{ objectFit: 'cover' }} />
      </div>
    );
  }
  const text = project.coverText;
  if (!text) {
    return (
      <div className="project-cover project-cover--text" aria-hidden="true">
        <span className="project-cover-bar">
          <span className="project-cover-dots">●●●</span> ~/projects/{project.slug}
        </span>
        <span className="project-cover-name">{project.title}</span>
      </div>
    );
  }
  const cols = Math.max(28, ...text.lines.map((line) => line.length));
  const width = cols * CHAR + 2 * PAD;
  const height = Math.max(text.lines.length * LINE + 2 * PAD, (width * 9) / 16 - 28);
  return (
    <div className="project-cover project-cover--text" aria-hidden="true">
      <span className="project-cover-bar">
        <span className="project-cover-dots">●●●</span> {text.title}
      </span>
      <svg className="project-cover-art" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMin meet" focusable="false">
        <text x={PAD} y={PAD + FONT} fontSize={FONT} xmlSpace="preserve">
          {text.lines.map((line, i) => (
            <tspan key={i} x={PAD} dy={i === 0 ? 0 : LINE}>
              {line || ' '}
            </tspan>
          ))}
        </text>
      </svg>
    </div>
  );
}
