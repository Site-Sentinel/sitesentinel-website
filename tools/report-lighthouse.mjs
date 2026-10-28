import { appendFileSync } from 'node:fs';
import { isMain } from './source-checks.mjs';

export function lighthouseReport(manifest, outcome) {
  const categories = ['performance', 'accessibility', 'best-practices', 'seo'];
  const results = Array.isArray(manifest) ? manifest : [];
  const complete =
    outcome === 'success' &&
    results.length > 0 &&
    results.every((result) =>
      categories.every(
        (key) => typeof result.summary?.[key] === 'number' && Number.isFinite(result.summary[key]),
      ),
    );
  const rows = results.map(
    (result) =>
      `| Homepage | ${categories
        .map((key) => {
          const value = result.summary?.[key];
          return typeof value === 'number' && Number.isFinite(value)
            ? Math.round(value * 100)
            : 'Unavailable';
        })
        .join(' | ')} |`,
  );
  return {
    ok: complete,
    body: [
      '## Lighthouse: repository build',
      '',
      'Mobile Lighthouse audit of a fresh build in GitHub. These are lab scores, not live Netlify measurements, visual review or publishing approval.',
      '',
      '| Page | Performance | Accessibility | Best practices | SEO |',
      '| --- | --- | --- | --- | --- |',
      ...rows,
      '',
      complete
        ? "Download the HTML and JSON reports from this run's artifacts. Scores are advisory; there is no pass threshold."
        : 'Audit incomplete: results are missing or Lighthouse failed. Inspect the failed step; no scores are assumed.',
    ].join('\n'),
  };
}

if (isMain(import.meta.url)) {
  let manifest;
  try {
    manifest = JSON.parse(process.env.LIGHTHOUSE_MANIFEST || '[]');
  } catch {
    manifest = [];
  }
  const report = lighthouseReport(manifest, process.env.LIGHTHOUSE_OUTCOME);
  console.log(report.body);
  if (process.env.GITHUB_STEP_SUMMARY)
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, report.body + '\n');
  if (!report.ok) process.exitCode = 1;
}
