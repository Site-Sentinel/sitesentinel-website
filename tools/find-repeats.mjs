/** Advisory only: repeated source blocks can be intentional layout. */
import { inspectSources, isMain, lineAt, markupOf } from './source-checks.mjs';

export function inspectRepeats(source) {
  const markup = markupOf(source);
  const blocks = new Map();
  for (const match of markup.matchAll(/<(article|li|section|figure|details)\b[^>]*>/g)) {
    const signature = match[0].replace(/\s+/g, ' ').trim();
    const locations = blocks.get(signature) ?? [];
    locations.push(lineAt(source, match.index));
    blocks.set(signature, locations);
  }
  return [...blocks].flatMap(([signature, lines]) =>
    lines.length >= 3
      ? [
          {
            line: lines[0],
            message: `${lines.length} similar source blocks (${signature}). Review whether a content array or shared component would help.`,
          },
        ]
      : [],
  );
}

if (isMain(import.meta.url)) {
  const findings = inspectSources(inspectRepeats);
  for (const issue of findings)
    console.warn(`REVIEW ${issue.file}:${issue.line}: ${issue.message}`);
  console.log(`Repeated-markup review: ${findings.length} advisory finding(s). No files changed.`);
}
