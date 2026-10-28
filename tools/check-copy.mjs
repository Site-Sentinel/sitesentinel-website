/** Static markup guard. Dynamic strings still need editorial review. */
import { blank, inspectSources, isMain, lineAt, markupOf } from './source-checks.mjs';

const stock =
  /\b(?:bg|text|border|ring|from|via|to|fill|stroke|outline|decoration|accent|shadow)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|sky|blue|indigo|violet|purple|fuchsia|pink|rose|cyan)-\d{2,3}\b/g;

export function inspectCopy(source) {
  const issues = [];
  const markup = markupOf(source);
  const report = (offset, message) => issues.push({ line: lineAt(source, offset), message });

  for (const match of markup.matchAll(/>([^<>]*)</g)) {
    // Expressions are data-driven. An unfinished expression can wrap JSX.
    const text = match[1]
      .replace(/\{[^{}]*\}/g, '')
      .replace(/\{[\s\S]*$/, '')
      .replace(/&(?:#\d+|#x[\da-f]+|\w+);/gi, '')
      .trim();
    if (/[a-z]/i.test(text)) {
      report(match.index + 1, `Move visible text into src/content/: ${text.slice(0, 90)}`);
    }
  }
  for (const match of markup.matchAll(
    /\b(?:aria-label|alt|title|placeholder)\s*=\s*(["'])(.*?)\1/g,
  )) {
    if (/[a-z]/i.test(match[2])) {
      report(match.index, `Move the ${match[0].split('=')[0]} wording into src/content/.`);
    }
  }

  // Keep existing neutral white/black utilities supported, as in the original
  // guardrail. Numbered stock colours and literal colour values are forbidden.
  const code = source
    .replace(/<!--[\s\S]*?-->|\/\*[\s\S]*?\*\//g, blank)
    .replace(/\bhref\s*=\s*(["'])[^"']*\1/g, blank);
  const colours = /#[\da-f]{3,8}\b|\b(?:rgba?|hsla?|hwb|oklch|oklab|lab|lch|color)\s*\(/gi;
  for (const pattern of [stock, colours]) {
    for (const match of code.matchAll(pattern)) {
      report(match.index, `Use a colour token from src/styles/global.css instead of ${match[0]}.`);
    }
  }
  for (const match of code.matchAll(
    /\b(?:color|background(?:-color)?|border-color|fill|stroke)\s*:\s*(navy|blue|red|green|white|black|cyan|magenta|yellow|grey|gray)\b/gi,
  )) {
    report(match.index, `Use a colour token instead of ${match[1]}.`);
  }
  return issues;
}

if (isMain(import.meta.url)) {
  const issues = inspectSources(inspectCopy);
  for (const issue of issues) console.error(`${issue.file}:${issue.line}: ${issue.message}`);
  if (issues.length) process.exitCode = 1;
  else console.log('PASS: static copy and colour checks. Dynamic wording still needs review.');
}
