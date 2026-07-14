# TinaCMS dashboard (client editing) guide

Git-CMS layered on the static Astro site so the client can edit content without
touching code. The public site ships **zero** Tina weight — content is baked at
build; the editor is a separate SPA that commits Markdown/JSON to GitHub, which
triggers a Cloudflare rebuild.

Official Astro-compatible, keeps the site static, doesn't hurt PageSpeed.

## How it runs

- **Local editing** (clientId/token unset → null): `pnpm cms`
  (`tinacms dev -c "astro dev"`) writes straight to files. Admin at
  `http://localhost:4321/<admin>`.
- **Production** (TinaCloud): `tinacms build` bundles a cloud-connected admin;
  keys come from env (`TINA_PUBLIC_CLIENT_ID`, `TINA_TOKEN`). See
  `deploy-handoff-and-services.md` §2.
- Build script: `tinacms build --skip-cloud-checks && astro check && astro build
&& node process-html.mjs`.

## Admin lives at a HIDDEN path

`build.outputFolder` in `tina/config.ts` sets the admin URL. Use an obscure path,
e.g. `1048084admin` → admin at `/1048084admin` (not `/admin`). Security by
obscurity + keeps it out of the way. Mirror the folder name in `tsconfig` exclude
and `.gitignore` (`public/<folder>/`), and delete the stale `public/admin` if the
name changed.

## Collections (what the client can edit)

Defined in `tina/config.ts`:

- **Blog posts** (`src/content/blog`, Markdown) — title, description, cover
  (uploadable image, stored as a public path `/images/…`), coverAlt, pubDate,
  author, draft, rich-text body. `ui.filename` gives new posts an auto slug from
  the title and lets editors change the URL; `ui.defaultItem` seeds new posts
  (draft, author, date). Create/delete allowed.
- **SEO (page meta)** (`src/data_files/seo/*.json`, one per page) — metaTitle,
  metaDescription, per-page `noindex`, per-page `sitemapExclude`.
  `allowedActions: {create:false, delete:false}` (fixed page set).
- **Site settings & custom code** (`src/data_files/settings/site.json`) — global
  `noindex`, `robotsTxt`, header code (`<head>` inject — GA, Search Console,
  schema), footer code (before `</body>` — chat widgets), and a read-only
  "View sitemap" button component.
- **Business info (LocalBusiness schema)** (`src/data_files/business/info.json`)
  — name, phone, price range, area served, address, geo, open24/7, sameAs
  (social profiles), rating/reviewCount. `Meta.astro` emits LocalBusiness JSON-LD
  from these fields (only when name + phone present; empty fields omitted).

Custom code fields are injected build-time via `set:html`; the sitemap `filter`
in `astro.config.mjs` reads the SEO/settings JSON at config load to drop noindex
pages from `sitemap.xml`.

## Favicon + OG preview — do this MANUALLY per project (dev-plan step)

Not CMS fields (uploads/paths were fiddly; manual is more reliable). Add both the
way we did for locksmith, on every real project:

**Favicon (realfavicongenerator.net):**

1. Generate the pack at realfavicongenerator.net; download it.
2. Drop these in `/public`: `favicon.svg`, `favicon.ico`, `favicon-96x96.png`,
   `apple-touch-icon.png`, `site.webmanifest`, `web-app-manifest-192x192.png`,
   `web-app-manifest-512x512.png`.
3. Wire in `Meta.astro` `<head>`:
   ```html
   <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
   <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
   <link rel="shortcut icon" href="/favicon.ico" />
   <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
   <meta name="apple-mobile-web-app-title" content="Brand name" />
   <link rel="manifest" href="/site.webmanifest" />
   ```
4. **Delete the generator routes** `src/pages/favicon.ico.ts` and
   `src/pages/manifest.json.ts` (they conflict with the static files) and drop the
   old favicon getImage logic from `Meta.astro`. Set `site.webmanifest`
   `name`/`short_name`.

**OG / social preview image:**

1. Make a **1200×630** image.
2. Compress to **<300 KB** (WhatsApp won't render heavier previews):
   `sips -s format jpeg -s formatOptions 62 in.jpg --out public/images/prev.jpg`.
3. In `Meta.astro`, hardcode it:
   `const socialImage = new URL('/images/prev.jpg', Astro.url.origin).href;`
   with `og:image:type=image/jpeg`, `og:image:width=1200`, `og:image:height=630`.
4. After deploy, re-scrape via the Facebook Sharing Debugger (OG is cached hard);
   hard-refresh / incognito for the favicon (also cached hard).

Verify with realfavicongenerator's favicon-checker + a fresh social share.

## Analytics & privacy (via `headCode`)

The settings **headCode** field injects into every `<head>` — the usual home for
analytics. Pick a lane and document it per client:

- **Cookieless (recommended default):** Cloudflare Web Analytics (enable in the
  Pages dashboard) or Plausible — no cookies, so **no consent banner needed**.
  The starter's `analytics.ts` already fires `call_click`/`form_submit` into
  Plausible/GA if present.
- **Google Analytics (cookies):** under GDPR/ePrivacy this needs a **consent
  banner** before GA loads (esp. EU traffic) — don't paste GA into `headCode`
  unguarded. Add a Privacy Policy page + a consent solution. Prefer the cookieless
  lane unless the client specifically needs GA.

## Gotchas

- A schema change (fields, or sometimes `ui`) can fail TinaCloud's cloud check on
  CI → `--skip-cloud-checks` in the build (already set). Remote schema catches up.
- Editors' cloud edits create commits on `main`; before pushing local work do
  `git pull --rebase origin main` (their commits may be ahead).
- Blog cover images are served as-is from `/public/images` (no `astro:assets`
  optimization) — the trade-off for CMS-uploadable covers.
