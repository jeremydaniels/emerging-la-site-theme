// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://emergingla.com',
  trailingSlash: 'never',
  build: {
    // One .html per route rather than /route/index.html.
    format: 'file',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
