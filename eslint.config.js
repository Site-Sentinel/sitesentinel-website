// @ts-check
import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import globals from 'globals';

export default defineConfig(
  { ignores: ['dist/**', '.astro/**', 'node_modules/**', 'docs/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    rules: {
      // Content drives the components, so unused vars are almost always a
      // genuine mistake rather than a work in progress.
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // Astro components legitimately need `any` when resolving a dynamic
      // component by name. Everywhere else it is a smell, so warn rather than error.
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  {
    // The build tools are node scripts: they run outside the browser and are
    // expected to print and to exit with a status code.
    files: ['tools/**', '*.config.js', '*.config.mjs'],
    languageOptions: { globals: { ...globals.node } },
    rules: { 'no-console': 'off' },
  },
  {
    // Astro frontmatter runs on the server at build time, so node globals and
    // node: imports are legitimate there too.
    files: ['**/*.astro'],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
  },
);
