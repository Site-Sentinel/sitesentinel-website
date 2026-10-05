/** Serve the fictional screenshot source with the current repository colour tokens. */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const css = await readFile(new URL('src/styles/global.css', root), 'utf8');
const tokens = css.match(/@theme\s*\{([\s\S]*?)\n\}/)?.[1];
if (!tokens) throw new Error('Design tokens were not found in global.css');
const source = await readFile(new URL('docs/platform-dashboard-mockup.html', root), 'utf8');
const html = source.replace('/* DESIGN_TOKENS */', `:root {${tokens}\n}`);

createServer(async (request, response) => {
  if (request.url === '/logo.svg') {
    response.writeHead(200, { 'Content-Type': 'image/svg+xml' });
    response.end(await readFile(new URL('public/images/logo-mark.svg', root)));
  } else if (request.url === '/') {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(html);
  } else {
    response.writeHead(404);
    response.end('Not found');
  }
}).listen(4387, '127.0.0.1', () => {
  console.log('Fictional dashboard mockup: http://127.0.0.1:4387');
});
