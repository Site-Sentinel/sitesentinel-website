#!/usr/bin/env node
/**
 * Validates the content layer before the site is allowed to build.
 *
 * Three jobs:
 *   1. Parse src/content/homepage.ts through its Zod schema, so bad copy fails
 *      here with a readable message instead of producing a broken page.
 *   2. Check every icon name resolves to a real Lucide icon.
 *   3. Report which images are still placeholders, and fail if a placeholder
 *      would ship to production (CI sets CHECK_STRICT_IMAGES=1).
 *
 * Run it directly any time with: pnpm check:content
 */
import { existsSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = process.cwd();
const STRICT_IMAGES = process.env.CHECK_STRICT_IMAGES === '1';

const problems: string[] = [];
const placeholders: string[] = [];

let homepage: Record<string, unknown>;
try {
  ({ homepage } = (await import('../src/content/homepage.ts')) as {
    homepage: Record<string, unknown>;
  });
} catch (error) {
  console.error('\nFAILED: the homepage content did not pass validation.\n');
  console.error(
    '  Open src/content/homepage.ts and fix the field named below.\n' +
      '  The rules live in src/content/schema.ts.\n',
  );
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}

/** Walks the parsed content object collecting every icon name and image src. */
const icons: string[] = [];
const images: { src: string; alt: string }[] = [];

function visit(node: unknown): void {
  if (Array.isArray(node)) {
    node.forEach(visit);
    return;
  }
  if (node === null || typeof node !== 'object') return;

  const record = node as Record<string, unknown>;
  if (typeof record.icon === 'string') icons.push(record.icon);
  if (typeof record.src === 'string' && typeof record.alt === 'string') {
    images.push({ src: record.src, alt: record.alt });
  }
  if (typeof record.logo === 'string') images.push({ src: record.logo, alt: 'logo' });
  Object.values(record).forEach(visit);
}
visit(homepage);

// 2. Icon names.
//
// Resolved against the real file list that @lucide/astro ships rather than by
// importing the package, because its entry point is TypeScript source that node
// will not strip inside node_modules.
// The package only declares an "import" condition in its exports map, so this
// resolves through import.meta.resolve rather than require.resolve. We resolve a
// known icon and read its directory, which is the full list of valid names.
const lucideIconDir = dirname(
  fileURLToPath(import.meta.resolve('@lucide/astro/icons/shield-check')),
);
const availableIcons = new Set(
  readdirSync(lucideIconDir)
    .filter((f) => f.endsWith('.ts'))
    .map((f) => f.slice(0, -3)),
);

/** ShieldCheck becomes shield-check, which is how Lucide names its files. */
const toKebab = (name: string) =>
  name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();

for (const name of new Set(icons)) {
  if (!/^[A-Z]/.test(name)) {
    problems.push(`Icon "${name}" must be PascalCase, for example "ShieldCheck".`);
    continue;
  }
  if (!availableIcons.has(toKebab(name))) {
    problems.push(
      `Unknown icon "${name}". Browse the real names at https://lucide.dev/icons ` +
        `and write them PascalCase here, so "shield-check" becomes "ShieldCheck".`,
    );
  }
}

// 3. Images
for (const { src } of images) {
  if (!existsSync(join(ROOT, 'public', src.replace(/^\//, '')))) placeholders.push(src);
}

if (problems.length) {
  console.error('\nFAILED: content problems found.\n');
  for (const p of problems) console.error('  ' + p);
  console.error('');
  process.exit(1);
}

const unique = [...new Set(placeholders)].sort();
if (unique.length) {
  const heading = STRICT_IMAGES
    ? `FAILED: ${unique.length} image(s) are still placeholders and this is a production build.`
    : `NOTE: ${unique.length} image(s) are still placeholders and will render as a grey panel.`;
  console[STRICT_IMAGES ? 'error' : 'warn'](`\n${heading}\n`);
  for (const p of unique) console[STRICT_IMAGES ? 'error' : 'warn'](`  public${p}`);
  console[STRICT_IMAGES ? 'error' : 'warn'](
    '\n  Drop each file at the path shown above and the placeholder disappears.\n',
  );
  if (STRICT_IMAGES) process.exit(1);
}

console.log(
  `PASS: content valid. ${images.length} image reference(s), ${new Set(icons).size} icon(s).`,
);
