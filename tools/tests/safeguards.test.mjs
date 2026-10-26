import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { inspectCopy } from '../check-copy.mjs';
import { inspectRepeats } from '../find-repeats.mjs';
import { checkBuiltSite } from '../check-links.mjs';
import { inspectCI, inspectScripts, requiredScripts } from '../check-guardrails.mjs';
import { checks, makeReport } from '../report-checks.mjs';
import { lighthouseReport } from '../report-lighthouse.mjs';

function fixture(t, files) {
  const root = mkdtempSync(join(tmpdir(), 'sitesentinel-checks-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const [file, content] of Object.entries({ 'netlify.toml': '', ...files })) {
    const path = join(root, file);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, content);
  }
  return root;
}

test('copy checks catch short visible text, accessibility labels and stock colours', () => {
  const findings = inspectCopy(
    '---\nconst label = "Data";\n---\n<button aria-label="Open menu" class="bg-blue-600">Hello</button>',
  );
  assert.equal(findings.length, 3);
  assert.ok(findings.every((item) => item.line === 4));
});

test('copy checks allow expressions and comments without treating anchors as colours', () => {
  const source =
    '<!-- explanatory words --><a href="#abc" class="text-navy">{content.label}</a>\n{items.map((item) => (<p>{item.label}</p>))}';
  assert.deepEqual(inspectCopy(source), []);
});

test('literal colour values are rejected in classes and scoped CSS', () => {
  for (const value of ['bg-[#fff]', 'color: rgb(1, 2, 3)', 'color: hsl(0 0% 0%)', 'color: navy']) {
    assert.ok(inspectCopy(`<style>.sample { ${value} }</style>`).length > 0, value);
  }
});

test('repeat review finds three source blocks but does not multiply a data loop', () => {
  assert.equal(inspectRepeats('<li class="card">{label}</li>'.repeat(3)).length, 1);
  assert.equal(inspectRepeats('{items.map(item => <li class="card">{item.label}</li>)}').length, 0);
});

test('link check resolves relative files, queries, encoded names and cross-page anchors', (t) => {
  const root = fixture(t, {
    'dist/index.html':
      '<a href="/guide/#details">Guide</a><a href="/file%20name.pdf?download=1">PDF</a>',
    'dist/guide/index.html':
      '<h1 id="details">Guide</h1><img src="../asset.svg"><a href="/#top">Top</a>',
    'dist/asset.svg': '<svg/>',
    'dist/file name.pdf': 'fixture',
  });
  assert.deepEqual(checkBuiltSite(root).issues, []);
});

test('404 catch-all cannot hide a broken page, anchor or script asset', (t) => {
  const root = fixture(t, {
    'netlify.toml': '[[redirects]]\nfrom = "/*"\nto = "/404.html"\nstatus = 404\n',
    'dist/index.html':
      '<a href="/missing">Missing</a><a href="#absent">Absent</a><script src="/missing.js">const href = "/ignore";</script>',
    'dist/404.html': '<p>Not found</p>',
  });
  const result = checkBuiltSite(root);
  assert.equal(result.issues.length, 3);
  assert.ok(result.issues.some((item) => item.includes('missing anchor #absent')));
  assert.ok(result.issues.some((item) => item.includes('/missing.js')));
});

test('valid redirects resolve, external redirects are declared unchecked, loops fail', (t) => {
  const root = fixture(t, {
    'netlify.toml':
      '[[redirects]]\nfrom="/old"\nto="/new"\nstatus=301\n[[redirects]]\nfrom="/api/*"\nto="https://example.com/:splat"\nstatus=301\n[[redirects]]\nfrom="/loop"\nto="/loop"\nstatus=302\n',
    'dist/index.html':
      '<a href="/old">New</a><a href="/api/resource">API</a><a href="/loop">Loop</a>',
    'dist/new/index.html': '<p>New</p>',
  });
  const result = checkBuiltSite(root);
  assert.equal(result.issues.length, 1);
  assert.match(result.issues[0], /redirect loop/);
  assert.equal(result.external, 1);
});

test('link checks reject invalid encoding and an empty build', (t) => {
  const empty = fixture(t, { 'dist/empty.txt': '' });
  assert.equal(checkBuiltSite(empty).issues.length, 1);
  const invalid = fixture(t, { 'dist/index.html': '<a href="/%zz">Bad</a>' });
  assert.match(checkBuiltSite(invalid).issues[0], /invalid URL or encoding/);
});

test('script wiring rejects removed gates and success-forcing shell commands', () => {
  assert.deepEqual(inspectScripts(requiredScripts), []);
  for (const change of [
    { postbuild: 'echo success' },
    { 'check:copy': 'node tools/check-copy.mjs || true' },
    { check: 'pnpm check:types' },
  ]) {
    assert.ok(inspectScripts({ ...requiredScripts, ...change }).length > 0);
  }
});

test('CI wiring rejects a skipped check or non-blocking final gate', () => {
  const source = readFileSync(new URL('../../.github/workflows/ci.yml', import.meta.url), 'utf8');
  assert.deepEqual(inspectCI(source), []);
  assert.ok(inspectCI(source.replace('id: copy\n', 'id: copy\n        if: false\n')).length > 0);
  assert.ok(
    inspectCI(
      source.replace(
        'name: Report and enforce results\n',
        'name: Report and enforce results\n        continue-on-error: true\n',
      ),
    ).length > 0,
  );
});

test('CI reports fail on failed, missing, cancelled and skipped required checks', () => {
  const passing = Object.fromEntries(checks.map(([id]) => [id, 'success']));
  assert.equal(makeReport(passing, 'abc', 'https://example.com/run').ok, true);
  for (const outcome of ['failure', 'skipped', 'cancelled', undefined]) {
    assert.equal(makeReport({ ...passing, build: outcome }, 'abc', '').ok, false);
  }
  assert.equal(makeReport({}, 'abc', '').ok, false);
});

test('Lighthouse never substitutes zero for missing scores or accepts failed collection', () => {
  const manifest = [
    { summary: { performance: 0.5, accessibility: 1, 'best-practices': 1, seo: 0.9 } },
  ];
  assert.equal(lighthouseReport(manifest, 'success').ok, true);
  assert.equal(lighthouseReport(manifest, 'failure').ok, false);
  assert.equal(lighthouseReport([], 'success').ok, false);
  const incomplete = lighthouseReport([{ summary: { performance: null } }], 'success');
  assert.equal(incomplete.ok, false);
  assert.match(incomplete.body, /Unavailable/);
});
