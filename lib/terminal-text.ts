/**
 * A `<Terminal>` diagram in MDX is a template literal whose every line starts with `|`:
 *
 *   <Terminal cmd="the public data path">{`
 *   |home (LAN)        private bucket
 *   |           ── PUT history ───►
 *   `}</Terminal>
 *
 * MDX strips up to two leading spaces from each line of an expression (and every leading space
 * from plain lines inside a component), which shifts a diagram's columns; the margin keeps them.
 * Returns the text without the margin (a line of just `|` is blank), or null when it has none.
 */
export function stripMargin(text: string): string | null {
  const lines = text.replace(/^\n/, '').replace(/\n\s*$/, '').split('\n');
  if (!lines.every((line) => line.startsWith('|') || !line.trim())) return null;
  if (!lines.some((line) => line.startsWith('|'))) return null;
  return lines.map((line) => line.slice(1)).join('\n');
}
