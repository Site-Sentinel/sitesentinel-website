import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export function walk(dir, extension) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return walk(path, extension);
    return entry.isFile() && path.endsWith(extension) ? [path] : [];
  });
}

// Keep offsets intact so diagnostics refer to actual source lines.
export const blank = (text) => text.replace(/[^\n]/g, ' ');
export const lineAt = (text, offset) => text.slice(0, offset).split('\n').length;

export function markupOf(source) {
  return source
    .replace(/^---\r?\n[\s\S]*?\r?\n---/, blank)
    .replace(/<!--[\s\S]*?-->/g, blank)
    .replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, blank)
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, blank);
}

export function inspectSources(inspect, root = process.cwd()) {
  return walk(join(root, 'src'), '.astro').flatMap((file) =>
    inspect(readFileSync(file, 'utf8')).map((issue) => ({
      ...issue,
      file: relative(root, file),
    })),
  );
}

export function isMain(url) {
  return Boolean(process.argv[1]) && url === pathToFileURL(resolve(process.argv[1])).href;
}
