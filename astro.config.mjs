import { defineConfig } from 'astro/config';
import fs from 'node:fs';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import compressor from 'astro-compressor';

// Read CMS SEO + settings at config load to drive the sitemap. Each
// src/data_files/seo/<key>.json maps to a route: home -> "/", else "/<key>/".
// A page is dropped from the sitemap if it (or the whole site) is noindex, or is
// explicitly sitemap-excluded.
const seoDir = new URL('./src/data_files/seo/', import.meta.url);
const siteSettings = JSON.parse(
  fs.readFileSync(
    new URL('./src/data_files/settings/site.json', import.meta.url)
  )
);
const sitemapExcludedPaths = new Set();
for (const file of fs.readdirSync(seoDir)) {
  if (!file.endsWith('.json')) continue;
  const key = file.replace(/\.json$/, '');
  const data = JSON.parse(fs.readFileSync(new URL(file, seoDir)));
  if (data.noindex || data.sitemapExclude) {
    sitemapExcludedPaths.add(key === 'home' ? '/' : `/${key}/`);
  }
}

// https://astro.build/config
export default defineConfig({
  // Set the REAL domain on launch (affects sitemap + canonical/OG/JSON-LD).
  site: 'https://example.com',
  image: {
    domains: ['images.unsplash.com'],
  },
  prefetch: true,
  // Inline component CSS into the <head> — kills render-blocking CSS requests on
  // a small site (net LCP/FCP win).
  build: {
    inlineStylesheets: 'always',
  },
  integrations: [
    sitemap({
      filter: page => {
        if (siteSettings.noindex) return false;
        return !sitemapExcludedPaths.has(new URL(page).pathname);
      },
    }),
    compressor({ gzip: false, brotli: true }),
  ],
  experimental: {
    clientPrerender: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
