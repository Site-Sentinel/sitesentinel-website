/** Wiring checks are a backstop; trusted reviews and branch protection still matter. */
import { existsSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { isMain, walk } from './source-checks.mjs';

export const requiredScripts = {
  'check:content': 'node --experimental-strip-types tools/check-content.ts',
  'check:dashes': 'node tools/check-dashes.mjs',
  'check:copy': 'node tools/check-copy.mjs',
  'check:repeats': 'node tools/find-repeats.mjs',
  'check:links': 'node tools/check-links.mjs',
  'check:guardrails': 'node tools/check-guardrails.mjs',
  'check:tests': 'node --test tools/tests/*.test.mjs',
  'check:types': 'astro check',
  'check:lint': 'eslint .',
  'check:format': 'prettier --check .',
  prebuild: 'pnpm run check:content && pnpm run check:dashes && pnpm run check:copy',
  build: 'astro build',
  postbuild: 'pnpm run check:links',
  check:
    'pnpm run check:guardrails && pnpm run check:content && pnpm run check:dashes && pnpm run check:copy && pnpm run check:types && pnpm run check:format && pnpm run check:lint && pnpm run check:repeats && pnpm run check:tests',
};

export function inspectScripts(scripts) {
  return Object.entries(requiredScripts).flatMap(([name, command]) =>
    scripts[name] === command
      ? []
      : [
          `package.json: restore ${name} to ${JSON.stringify(command)}. Intentional changes require updating the guardrail and review.`,
        ],
  );
}

export function inspectCI(source) {
  const issues = [];
  const steps = source.split(/^ {6}- /m).slice(1);
  const commands = {
    install: 'pnpm install --frozen-lockfile',
    guardrails: 'pnpm check:guardrails',
    content: 'pnpm check:content',
    dashes: 'pnpm check:dashes',
    copy: 'pnpm check:copy',
    types: 'pnpm check:types',
    format: 'pnpm check:format',
    lint: 'pnpm check:lint',
    repeats: 'pnpm check:repeats',
    tests: 'pnpm check:tests',
    build: 'pnpm build',
  };
  for (const [id, command] of Object.entries(commands)) {
    const step = steps.find((item) => item.includes(`\n        id: ${id}\n`));
    if (!step || !step.includes(`\n        run: ${command}\n`) || /^ {8}if:/m.test(step)) {
      issues.push(`ci.yml: ${id} must run ${command} without a conditional skip.`);
    }
    if (!source.includes(`"${id}": "\${{ steps.${id}.outcome }}"`)) {
      issues.push(`ci.yml: the results gate must include ${id}.outcome.`);
    }
  }
  const report = steps.find((item) => item.startsWith('name: Report and enforce results\n'));
  if (
    !report?.includes('        if: always()\n') ||
    !report.includes('        run: node tools/report-checks.mjs\n') ||
    report.includes('continue-on-error:')
  ) {
    issues.push(
      'ci.yml: the results gate must always run and must fail the job on incomplete checks.',
    );
  }
  const checksJob = source.match(/^ {2}checks:\n([\s\S]*?)^ {4}steps:/m)?.[1];
  if (!checksJob || /^ {4}(?:if|continue-on-error):/m.test(checksJob)) {
    issues.push('ci.yml: the Checks job cannot be skipped or allowed to fail.');
  }
  return issues;
}

export function checkGuardrails(root) {
  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  const issues = inspectScripts(pkg.scripts ?? {});
  const requiredFiles = [
    'tools/check-content.ts',
    'tools/check-dashes.mjs',
    'tools/check-copy.mjs',
    'tools/find-repeats.mjs',
    'tools/check-links.mjs',
    'tools/check-guardrails.mjs',
    'tools/report-checks.mjs',
    'tools/report-lighthouse.mjs',
    'tools/source-checks.mjs',
    'tools/tests/safeguards.test.mjs',
    '.github/workflows/ci.yml',
    '.github/workflows/agent-guardrails.yml',
    '.github/workflows/lighthouse.yml',
    'lighthouserc.json',
  ];
  for (const file of requiredFiles) {
    if (!existsSync(join(root, file)) || !readFileSync(join(root, file), 'utf8').trim()) {
      issues.push(`${file}: required safeguard is missing or empty.`);
    }
  }
  if (existsSync(join(root, '.github/workflows/ci.yml'))) {
    issues.push(...inspectCI(readFileSync(join(root, '.github/workflows/ci.yml'), 'utf8')));
  }
  const dependencies = { ...pkg.dependencies, ...pkg.devDependencies };
  for (const name of Object.keys(dependencies)) {
    if (
      /^(?:react|react-dom|vue|svelte|solid-js|preact|jquery|@astrojs\/(?:react|vue|svelte|solid|preact))$/.test(
        name,
      )
    ) {
      issues.push(
        `${name}: client frameworks require a deliberate maintainer-approved architecture change.`,
      );
    }
  }
  for (const extension of ['.astro', '.ts']) {
    for (const file of walk(join(root, 'src'), extension)) {
      if (/eslint-disable(?!-next-line)\b/.test(readFileSync(file, 'utf8')))
        issues.push(`${file}: file-wide lint disable is forbidden.`);
    }
  }
  const ignored = readFileSync(join(root, '.gitignore'), 'utf8').split(/\r?\n/);
  if (!ignored.includes('docs/private/'))
    issues.push('.gitignore: docs/private/ must remain ignored.');
  const tracked = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' }).split(
    '\0',
  );
  for (const file of tracked) {
    if (/(^|\/)\.env(?:\.|$)|^docs\/private\//.test(file))
      issues.push(`${file}: private path is tracked. Stop and notify the maintainer.`);
  }
  return issues;
}

if (isMain(import.meta.url)) {
  const issues = checkGuardrails(process.cwd());
  for (const issue of issues) console.error(issue);
  if (issues.length) process.exitCode = 1;
  else
    console.log(
      'PASS: required scripts, files, framework rules and private-path guards are intact.',
    );
}
