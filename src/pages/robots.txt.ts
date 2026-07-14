// robots.txt is edited in the CMS (Site settings → robots.txt) — see
// src/data_files/settings/site.json. Keep the Sitemap line and update its domain
// on launch.
import type { APIRoute } from 'astro';
import settings from '@data/settings/site.json';

export const GET: APIRoute = () =>
  new Response(settings.robotsTxt.trim() + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
