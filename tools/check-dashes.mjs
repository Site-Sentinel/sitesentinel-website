#!/usr/bin/env node
/**
 * Hard guard for the no-em-dash / no-en-dash house rule.
 *
 * Em dashes (U+2014) and en dashes (U+2013) must never appear in this repo.
 * Replace them with a comma, a colon, a full stop, or brackets. Restructure the
 * sentence if none of those fit.
 *
 * LLMs produce em dashes constantly, which is exactly why this is a build gate
 * and not a style note. Runs automatically before every build.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIRS = ['src', 'tools'];
const ROOT_FILES = ['README.md', 'AGENTS.md', 'CLAUDE.md', 'netlify.toml'];
const EXTS = ['.astro', '.ts', '.tsx', '.js', '.mjs', '.md', '.css', '.json', '.toml', '.yml'];
// Built from char codes so this file contains no dash characters itself.
const EM_DASH = String.fromCharCode(0x2014);
const EN_DASH = String.fromCharCode(0x2013);
const DASH = new RegExp(`[${EM_DASH}${EN_DASH}]`);

function walk(dir, out = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const name of entries) {
    if (name === 'node_modules' || name.startsWith('.')) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (EXTS.some((e) => name.endsWith(e))) out.push(full);
  }
  return out;
}

const files = DIRS.flatMap((d) => walk(join(ROOT, d)));
for (const name of ROOT_FILES) {
  try {
    statSync(join(ROOT, name));
    files.push(join(ROOT, name));
  } catch {
    /* file not present yet */
  }
}

const offenders = [];
for (const file of files) {
  readFileSync(file, 'utf8')
    .split('\n')
    .forEach((line, i) => {
      if (DASH.test(line)) offenders.push(`${relative(ROOT, file)}:${i + 1}: ${line.trim()}`);
    });
}

if (offenders.length) {
  console.error(
    `\nFAILED: found ${offenders.length} em dash or en dash.\n\n` +
      `  These characters are banned in this repository.\n` +
      `  Replace each one with a comma, a colon, a full stop, or brackets.\n` +
      `  Example: "Kate - contracting income" becomes "Kate: contracting income".\n`,
  );
  for (const o of offenders) console.error('  ' + o);
  console.error('');
  process.exit(1);
}

console.log('PASS: no em dashes or en dashes.');
