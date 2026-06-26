import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import compressor from 'astro-compressor';

// https://astro.build/config
export default defineConfig({
  // https://docs.astro.build/en/guides/images/#authorizing-remote-images
  site: 'https://screwfast.uk',
  image: {
    domains: ['images.unsplash.com'],
  },
  prefetch: true,
  integrations: [
    sitemap(),
    compressor({
      gzip: false,
      brotli: true,
    }),
  ],
  experimental: {
    clientPrerender: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
