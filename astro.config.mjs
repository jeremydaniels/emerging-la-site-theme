// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://emergingla.com',
  trailingSlash: 'never',
  build: {
    // /about/index.html, not /about.html.
    //
    // This has to stay 'directory'. With 'file' the build emits flat
    // /about.html files, and a request for /about only resolves if the host
    // rewrites extensionless URLs. Vercel does not do that by default
    // (cleanUrls is off unless you ask for it), so every route except / was
    // returning the 404 page in production while /about.html served fine.
    // 'directory' resolves on any static host with no host-specific config,
    // and it also keeps Astro.url.pathname clean, which the canonical and
    // og:url tags in BaseLayout are built from.
    format: 'directory',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
