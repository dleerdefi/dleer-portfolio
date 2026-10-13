/**
 * The text cover a project card shows until the project has a hero image
 * (docs/PORTFOLIO_V2_SPEC.md §4.4): the first `<Terminal>` diagram of its MDX, or else its first
 * fenced code block, at most `MAX_LINES` lines. Computed once, when content-collections builds.
 */
// A type, not an interface: content-collections only accepts serializable (index-signature) types
export type CoverText = {
  /** The Terminal's `cmd`, or the code block's language */
  title: string;
  lines: string[];
};

export const MAX_LINES = 12;

function trimBlank(lines: string[]): string[] {
  let start = 0;
  let end = lines.length;
  while (start < end && !lines[start].trim()) start++;
  while (end > start && !lines[end - 1].trim()) end--;
  return lines.slice(start, end);
}

export function extractCoverText(mdx: string): CoverText | undefined {
  const terminal = mdx.match(/<Terminal(?:\s+cmd="([^"]*)")?[^>]*>\n([\s\S]*?)\n<\/Terminal>/);
  const code = terminal ? null : mdx.match(/^```([\w-]*)[^\n]*\n([\s\S]*?)\n```/m);
  const found = terminal ?? code;
  if (!found) return undefined;
  const lines = trimBlank(found[2].split('\n').map((line) => line.replace(/\s+$/, ''))).slice(0, MAX_LINES);
  if (lines.length === 0) return undefined;
  return { title: found[1] || (terminal ? 'terminal' : 'code'), lines };
}
