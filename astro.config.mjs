import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://programmingrio.top',
  adapter: vercel(),
  integrations: [sitemap()],
});
