import { appendFileSync, writeFileSync } from 'node:fs';
import { isMain } from './source-checks.mjs';

export const checks = [
  ['install', 'Dependencies installed', 'Check the dependency install log.'],
  [
    'guardrails',
    'Safeguard wiring',
    'Restore required checks and inspect any private-path warning.',
  ],
  [
    'content',
    'Content, icons and image descriptions',
    'Fix the content field named in the log. Image placeholders are reported separately.',
  ],
  ['dashes', 'No long dashes', 'Replace the em or en dash named in the log.'],
  ['copy', 'Copy and colour rules', 'Move wording into src/content/ or use a named colour token.'],
  ['types', 'Types', 'Fix the file and property named in the log.'],
  ['format', 'Formatting', 'Run pnpm fix, review the result and commit it.'],
  ['lint', 'Lint', 'Fix the code issue named in the log.'],
  [
    'repeats',
    'Repeated-markup review (advisory)',
    'Read any REVIEW lines; intentional repetition does not block the build.',
  ],
  ['tests', 'Safeguard regression tests', 'Fix the failing test without disabling the safeguard.'],
  ['build', 'Build and local links', 'Fix the build error or missing local destination/anchor.'],
];

export function makeReport(outcomes, sha, run) {
  const incomplete = checks.filter(([id]) => outcomes[id] !== 'success');
  const rows = checks.map(([id, name, advice]) => {
    const outcome = outcomes[id] || 'not run';
    return `| ${name} | ${outcome} | ${outcome === 'success' ? (id === 'repeats' ? 'Review warnings in the log.' : '') : advice} |`;
  });
  return {
    ok: incomplete.length === 0,
    body: [
      '<!-- sitesentinel-checks-report -->',
      incomplete.length ? '## Checks need attention' : '## Required build and source checks passed',
      '',
      `Commit: \`${sha}\``,
      '',
      '| Check | Result | What to do |',
      '| --- | --- | --- |',
      ...rows,
      '',
      'This table does not confirm Netlify deployment, visual review, external link availability or permission to publish. Existing image placeholders remain visible in the content log.',
      '',
      `[Full check log](${run})`,
    ].join('\n'),
  };
}

if (isMain(import.meta.url)) {
  const report = makeReport(
    JSON.parse(process.env.CHECK_RESULTS || '{}'),
    process.env.REVIEW_SHA || 'unknown',
    process.env.RUN_URL || '',
  );
  if (process.env.GITHUB_STEP_SUMMARY)
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, report.body + '\n');
  if (process.env.CHECK_REPORT_PATH) writeFileSync(process.env.CHECK_REPORT_PATH, report.body);
  console.log(report.body);
  if (!report.ok) process.exitCode = 1;
}
