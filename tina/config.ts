import React from 'react';
import { defineConfig } from 'tinacms';

// Live site URL for the "View sitemap" buttons. Set to the real domain on launch
// (same value as `site` in astro.config.mjs).
const SITE_URL = 'https://example.com';

const linkBtnStyle = {
  display: 'inline-block',
  padding: '8px 14px',
  background: '#0574e4',
  color: '#fff',
  borderRadius: '6px',
  textDecoration: 'none',
  fontSize: '14px',
  fontWeight: 500,
};

// Read-only field that renders two buttons to the live sitemap.
const SitemapButtons = () =>
  React.createElement(
    'div',
    { style: { display: 'flex', gap: '10px', padding: '4px 0 12px' } },
    React.createElement(
      'a',
      {
        href: `${SITE_URL}/sitemap-index.xml`,
        target: '_blank',
        rel: 'noreferrer',
        style: linkBtnStyle,
      },
      'Sitemap index'
    ),
    React.createElement(
      'a',
      {
        href: `${SITE_URL}/sitemap-0.xml`,
        target: '_blank',
        rel: 'noreferrer',
        style: linkBtnStyle,
      },
      'Sitemap URLs'
    )
  );

// Git-CMS. clientId/token unset (null) => LOCAL editing: /studio-admin writes
// straight to the files. Set the env vars (TinaCloud) for production editing.
export default defineConfig({
  branch: 'main',
  clientId: process.env.TINA_PUBLIC_CLIENT_ID || null,
  token: process.env.TINA_TOKEN || null,
  // Admin at a NON-obvious path (change per project). Mirror the folder name in
  // tsconfig `exclude` and .gitignore.
  build: { outputFolder: 'studio-admin', publicFolder: 'public' },
  media: { tina: { mediaRoot: 'images', publicFolder: 'public' } },
  schema: {
    collections: [
      {
        name: 'blog',
        label: 'Blog posts',
        path: 'src/content/blog',
        format: 'md',
        match: { exclude: '_*' }, // skip _-prefixed files (e.g. _template.md)
        ui: {
          filename: {
            readonly: false, // filename = the URL slug; editable
            slugify: values =>
              (values?.title || 'new-post')
                .toString()
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, ''),
          },
          defaultItem: () => ({
            draft: true,
            author: 'Team',
            pubDate: new Date().toISOString(),
          }),
        },
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Title',
            isTitle: true,
            required: true,
          },
          {
            type: 'string',
            name: 'description',
            label: 'Description (card + meta)',
            required: true,
            ui: { component: 'textarea' },
          },
          {
            type: 'image',
            name: 'cover',
            label: 'Cover image',
            required: true,
          },
          { type: 'string', name: 'coverAlt', label: 'Cover alt text' },
          {
            type: 'datetime',
            name: 'pubDate',
            label: 'Publish date',
            required: true,
          },
          { type: 'string', name: 'author', label: 'Author' },
          {
            type: 'boolean',
            name: 'draft',
            label: 'Draft (hide from the live site)',
          },
          { type: 'rich-text', name: 'body', label: 'Body', isBody: true },
        ],
      },
      {
        name: 'seo',
        label: 'SEO (page meta)',
        path: 'src/data_files/seo',
        format: 'json',
        // Fixed set of pages — editors change meta, not add/remove pages. Add a
        // <key>.json per route and reference it in the page's frontmatter.
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          {
            type: 'string',
            name: 'metaTitle',
            label: 'Meta title (tab + Google result)',
            required: true,
          },
          {
            type: 'string',
            name: 'metaDescription',
            label: 'Meta description (~150-160 chars)',
            required: true,
            ui: { component: 'textarea' },
          },
          {
            type: 'boolean',
            name: 'noindex',
            label: 'Hide THIS page from search engines',
          },
          {
            type: 'boolean',
            name: 'sitemapExclude',
            label: 'Exclude THIS page from sitemap.xml',
          },
        ],
      },
      {
        name: 'settings',
        label: 'Site settings & custom code',
        path: 'src/data_files/settings',
        format: 'json',
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          {
            type: 'boolean',
            name: 'noindex',
            label: 'Hide the ENTIRE site from search engines',
            description:
              'Turn ON before launch / on a temp domain. OFF to let Google index.',
          },
          {
            type: 'string',
            name: 'robotsTxt',
            label: 'robots.txt',
            description: 'Keep the Sitemap line; update its domain on launch.',
            ui: { component: 'textarea' },
          },
          {
            type: 'string',
            name: 'sitemapView',
            label: 'View sitemap (opens on the live site)',
            ui: { component: SitemapButtons },
          },
          {
            type: 'string',
            name: 'headCode',
            label: 'Header code (injected into <head>)',
            description:
              'Google Analytics, Search Console verification, schema, etc. Full tags.',
            ui: { component: 'textarea' },
          },
          {
            type: 'string',
            name: 'bodyEndCode',
            label: 'Footer code (before </body>)',
            description: 'Chat widgets and other end-of-page scripts.',
            ui: { component: 'textarea' },
          },
        ],
      },
      {
        name: 'business',
        label: 'Business info (schema)',
        path: 'src/data_files/business',
        format: 'json',
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          { type: 'string', name: 'name', label: 'Business name' },
          {
            type: 'string',
            name: 'telephone',
            label: 'Phone (international, e.g. +1617…)',
          },
          {
            type: 'string',
            name: 'priceRange',
            label: 'Price range (e.g. $$)',
          },
          { type: 'string', name: 'areaServed', label: 'Area served' },
          { type: 'string', name: 'streetAddress', label: 'Street address' },
          { type: 'string', name: 'addressLocality', label: 'City' },
          { type: 'string', name: 'addressRegion', label: 'State / region' },
          { type: 'string', name: 'postalCode', label: 'ZIP / postal code' },
          {
            type: 'string',
            name: 'addressCountry',
            label: 'Country code (e.g. US)',
          },
          { type: 'string', name: 'latitude', label: 'Latitude' },
          { type: 'string', name: 'longitude', label: 'Longitude' },
          { type: 'boolean', name: 'open24_7', label: 'Open 24/7' },
          {
            type: 'image',
            name: 'image',
            label: 'Business image / logo (for schema)',
          },
          {
            type: 'string',
            name: 'sameAs',
            label: 'Social / profile URLs',
            list: true,
          },
          {
            type: 'string',
            name: 'ratingValue',
            label: 'Average rating (optional)',
          },
          {
            type: 'string',
            name: 'reviewCount',
            label: 'Review count (optional)',
          },
        ],
      },
    ],
  },
});
