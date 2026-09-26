// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// The marketing site owns www. The Rails application lives on app.
// See AGENTS.md "Domains" before changing this.
export default defineConfig({
  site: 'https://www.sitesentinel.com.au',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  server: {
    host: '0.0.0.0',
    port: 4330,
  },
});
