/** Checks built local paths and HTML anchors without making network requests. */
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';
import { isMain, walk } from './source-checks.mjs';

const origin = 'https://site.invalid';
const isFile = (path) => existsSync(path) && statSync(path).isFile();

function decode(text) {
  return text.replace(/&(?:amp|quot|apos|lt|gt|#\d+|#x[\da-f]+);/gi, (entity) => {
    const name = entity.slice(1, -1).toLowerCase();
    const named = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>' };
    if (named[name]) return named[name];
    const value = name.startsWith('#x') ? parseInt(name.slice(2), 16) : Number(name.slice(1));
    return value > 0 && value <= 0x10ffff ? String.fromCodePoint(value) : entity;
  });
}

function attributes(html, names) {
  const pattern = new RegExp(`\\s(${names})\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'gi');
  return [...html.matchAll(pattern)].map((match) => ({
    name: match[1].toLowerCase(),
    value: decode(match[2] ?? match[3] ?? match[4]),
  }));
}

function redirectsIn(toml) {
  return toml
    .split(/\[\[redirects\]\]/)
    .slice(1)
    .map((block) => {
      const value = (key) =>
        block.match(new RegExp(`^\\s*${key}\\s*=\\s*["']([^"']+)["']`, 'm'))?.[1];
      return {
        from: value('from'),
        to: value('to'),
        status: Number(block.match(/^\s*status\s*=\s*(\d+)/m)?.[1] ?? 301),
      };
    });
}

export function checkBuiltSite(root) {
  const dist = resolve(root, 'dist');
  if (!existsSync(dist))
    return { pages: 0, issues: ['No dist/ folder. Run pnpm build first.'], external: 0 };
  const pages = walk(dist, '.html');
  if (!pages.length)
    return { pages: 0, issues: ['No built HTML pages found in dist/.'], external: 0 };
  const redirects = redirectsIn(readFileSync(join(root, 'netlify.toml'), 'utf8'));
  const cache = new Map();
  const issues = new Set();
  const external = new Set();

  function resolveLocal(url, seen = new Set()) {
    const key = url.pathname + url.hash;
    if (seen.has(key)) return 'redirect loop';
    seen.add(key);
    const decoded = decodeURIComponent(url.pathname);
    const path = resolve(dist, `.${decoded}`);
    if (!path.startsWith(dist + sep) && path !== dist) return 'path escapes dist/';
    const file = [path, join(path, 'index.html'), `${path}.html`].find(isFile);
    if (file) {
      if (!url.hash || !file.endsWith('.html')) return null;
      const hash = decodeURIComponent(url.hash.slice(1));
      if (!hash || hash === 'top' || hash.startsWith(':~:text=')) return null;
      if (!cache.has(file)) {
        const html = readFileSync(file, 'utf8').replace(
          /<!--[\s\S]*?-->|<script\b[^>]*>[\s\S]*?<\/script>/gi,
          '',
        );
        cache.set(file, new Set(attributes(html, 'id|name').map((attr) => attr.value)));
      }
      return cache.get(file).has(hash) ? null : `missing anchor #${hash}`;
    }
    for (const rule of redirects) {
      if (!rule.from || !rule.to) continue;
      const prefix = rule.from.endsWith('/*') ? rule.from.slice(0, -1) : null;
      if (rule.from !== decoded && !(prefix && decoded.startsWith(prefix))) continue;
      // A 404 fallback must never make a missing route pass validation.
      if (![200, 301, 302, 303, 307, 308].includes(rule.status))
        return `HTTP ${rule.status} fallback`;
      const destination = rule.to.replace(':splat', prefix ? decoded.slice(prefix.length) : '');
      const next = new URL(destination, origin);
      if (next.origin !== origin) {
        external.add(next.href);
        return null; // Configured external destination; availability is not tested.
      }
      if (!next.hash) next.hash = url.hash;
      return resolveLocal(next, seen);
    }
    return 'missing page or file';
  }

  for (const file of pages) {
    const route =
      '/' +
      relative(dist, file)
        .split(sep)
        .join('/')
        .replace(/index\.html$/, '');
    const html = readFileSync(file, 'utf8')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/(<script\b[^>]*>)[\s\S]*?(<\/script>)/gi, '$1$2');
    for (const { value } of attributes(html, 'href|src|poster')) {
      if (/^(?:mailto|tel|data|javascript):/i.test(value)) continue;
      try {
        const url = new URL(value, new URL(route, origin));
        if (url.origin !== origin) {
          external.add(url.href);
          continue;
        }
        const reason = resolveLocal(url);
        if (reason) issues.add(`${route}: ${value} (${reason})`);
      } catch {
        issues.add(`${route}: ${value} (invalid URL or encoding)`);
      }
    }
  }
  return { pages: pages.length, issues: [...issues], external: external.size };
}

if (isMain(import.meta.url)) {
  const result = checkBuiltSite(process.cwd());
  for (const issue of result.issues) console.error(issue);
  if (result.issues.length) process.exitCode = 1;
  else console.log(`PASS: local links and anchors resolve across ${result.pages} built page(s).`);
  console.log(
    `${result.external} external URL(s) or redirect destination(s) were not fetched. srcset and dynamic navigation require separate review.`,
  );
}
