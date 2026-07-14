# Project AI Guide

For AI assistants (Claude, Cursor, Copilot, etc.): this is the **studio starter**
— a clean Astro landing base (derived from ScrewFast, stripped down) preloaded
with the reusable infrastructure a client site needs: a **TinaCMS dashboard**, a
**Resend contact form**, SEO/schema, and Cloudflare Pages deploy wiring. Clone it,
fill in the content, ship. See [README.md](README.md) for human-facing setup.

> **Methodology & playbooks:** the full step-by-step lives in-repo under
> [`docs/`](docs/) (self-contained — travels with a clone). It mirrors Igor's
> `astro-landing-workflow` skill; if that skill is loaded, its build playbook
> (PageSpeed 100, conventions, component patterns) applies too.

## Development plan (order of operations)

Every client site follows this lifecycle. Do the phases in order — later ones
need outputs (keys, URLs, content) from earlier ones.

1. **Intake & scope** — gather the brief, agree the tier/SOW → [`docs/intake-and-pricing.md`](docs/intake-and-pricing.md).
2. **Design → build** — Astro SSG from the design; fill the empty `index.astro`
   - sub-pages; follow the conventions + PageSpeed playbook (below / skill).
3. **CMS** — the TinaCMS dashboard is already wired; configure per project →
   [`docs/tinacms-dashboard.md`](docs/tinacms-dashboard.md).
4. **Favicon & OG** — manual, per project (quickstart step 5).
5. **Provision services** (client-owned, in order): GitHub → TinaCloud →
   Cloudflare Pages → Resend (+ DMARC) → [`docs/deploy-handoff-and-services.md`](docs/deploy-handoff-and-services.md).
6. **Launch / migrate domain** — new domain, or migrate an existing site
   (WordPress etc.); run the **launch checklist** in that same doc.
7. **Handoff** — transfer the repo to the client (keep collaborator access), hand
   over the dashboard + [`docs/client-handbook-template.md`](docs/client-handbook-template.md).
8. **Post-launch & maintenance** — analytics live, monitoring/uptime, `noindex`
   off, sitemap to Search Console, support retainer (see the deploy + intake docs).

## Project Overview

Stack: Astro (static SSG), Tailwind v4 (`@tailwindcss/vite`), Lenis smooth scroll,
GSAP (available), a Content-Collections **blog**, **TinaCMS** (Git-CMS dashboard),
a **Cloudflare Pages Function** contact form (Resend). Single locale (English).
Package manager **pnpm** via corepack.

The homepage ([src/pages/index.astro](src/pages/index.astro)) is an intentionally
empty canvas — apply the client's design there. Original ScrewFast landing
**section components are kept as reference** under `src/components/sections/`, plus
a ready **ContactForm.astro** section wired to the form Function.

## New project quickstart

1. `cp .env.example .env` (leave TINA\_\* empty for local editing).
2. `pnpm install` → `pnpm cms` (site + local admin at `/studio-admin`) or
   `pnpm dev` (site only).
3. Fill in: `src/data_files/constants.ts` (SITE/OG), `business/info.json`
   (schema), `seo/*.json` (one per page), brand tokens in
   `src/assets/styles/global.css`, images in `src/images/`.
4. Build the homepage + pages; add blog posts in the CMS or `src/content/blog/`.
5. **Favicon & social preview (manual, per project — the locksmith way):**
   generate a favicon pack at realfavicongenerator.net → drop in `/public`, wire
   the tags in [Meta.astro](src/components/Meta.astro), and delete the
   `favicon.ico.ts` + `manifest.json.ts` routes (they conflict). Add a **1200×630**
   OG image compressed to **<300 KB** at `/public/images/prev.jpg`, hardcoded in
   Meta.astro. Full recipe: [`docs/tinacms-dashboard.md`](docs/tinacms-dashboard.md)
   → "Favicon + OG preview".
6. Launch: register services + point the domain →
   [`docs/deploy-handoff-and-services.md`](docs/deploy-handoff-and-services.md).

## Path Aliases

Defined in [tsconfig.json](tsconfig.json):

| Alias           | Resolves to            |
| --------------- | ---------------------- |
| `@/*`           | `src/*`                |
| `@components/*` | `src/components/*`     |
| `@data/*`       | `src/data_files/*`     |
| `@images/*`     | `src/images/*`         |
| `@scripts/*`    | `src/assets/scripts/*` |
| `@styles/*`     | `src/assets/styles/*`  |
| `@utils/*`      | `src/utils/*`          |

Example: `import { SITE } from "@data/constants";`

## Key Folders

| Purpose                | Path                               | Notes                                                                                                                        |
| ---------------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Layout                 | [src/layouts/](src/layouts/)       | [MainLayout.astro](src/layouts/MainLayout.astro) wraps Navbar, `<slot />`, FooterSection; loads global.css + Lenis.          |
| Pages                  | [src/pages/](src/pages/)           | File-based routing. `index.astro` (home), `404.astro`, plus generated `favicon.ico.ts`, `manifest.json.ts`, `robots.txt.ts`. |
| Reusable UI & sections | [src/components/](src/components/) | `sections/` (reference landing/features/testimonials/pricing/FAQ + active Navbar/Footer); `ui/` for buttons, blocks, etc.    |
| Site config & data     | [src/data_files/](src/data_files/) | [constants.ts](src/data_files/constants.ts): SITE, SEO, OG, partnersData. `faqs.json`, `features.json`, `pricing.json`.      |
| Navigation             | [src/utils/](src/utils/)           | [navigation.ts](src/utils/navigation.ts) default-exports `{ navBarLinks, footerLinks, socialLinks }`.                        |
| Styles & scripts       | [src/assets/](src/assets/)         | `styles/` (global.css, lenis.css); `scripts/` ([lenisSmoothScroll.js](src/assets/scripts/lenisSmoothScroll.js)).             |
| Images (imported)      | [src/images/](src/images/)         | Use with `@images/`; processed by `astro:assets`.                                                                            |
| Static assets          | [public/](public/)                 | Served as-is.                                                                                                                |

### Components currently wired up (rendered)

- **MainLayout** → [Meta.astro](src/components/Meta.astro) (SEO/OG/JSON-LD),
  [Navbar.astro](src/components/sections/navbar&footer/Navbar.astro),
  [FooterSection.astro](src/components/sections/navbar&footer/FooterSection.astro),
  [BrandLogo.astro](src/components/BrandLogo.astro), [ThemeIcon.astro](src/components/ThemeIcon.astro).
- Dark mode is handled by a self-contained inline script in MainLayout + Navbar
  (localStorage `hs_theme`); it does **not** depend on any UI library.

### Reference-only sections (not imported anywhere — copy from them)

`src/components/sections/landing` (HeroSection, HeroSectionAlt, ClientsSection),
`features` (FeaturesGeneral, FeaturesNavs, FeaturesStats, FeaturesStatsAlt),
`testimonials` (TestimonialsSection, TestimonialsSectionAlt, TestimonialItem),
`pricing` (PricingSection), `misc` (FAQ).

> ⚠️ Preline was removed. Interactive bits in these reference sections that
> relied on Preline — the FAQ accordion (`hs-accordion`), FeaturesNavs tabs
> (`hs-tab`), and the Navbar mobile collapse (`hs-collapse`) — are **not
> interactive** until you wire your own JS. They still render statically.

## Conventions

- **Styling:** Tailwind CSS v4 only (refer to Tailwind v4 docs). Tokens live in
  `@theme` inside [global.css](src/assets/styles/global.css) — no `tailwind.config.js`.
- **No inline styles** — use Tailwind utilities.
- **Smooth scroll:** Lenis via [lenisSmoothScroll.js](src/assets/scripts/lenisSmoothScroll.js), loaded in MainLayout.
- **Animations:** GSAP is installed and available; add it via a `<script>` in a
  component/layout when needed.
- **SEO:** [Meta.astro](src/components/Meta.astro) reads SITE/SEO/OG from
  `@data/constants`; per-page overrides via MainLayout props
  (`title`, `meta`, `structuredData`, `customDescription`, `customOgTitle`).

## Development Commands

- `pnpm dev` — site only (http://localhost:4321)
- `pnpm cms` — site + local TinaCMS admin (`tinacms dev -c "astro dev"`), edit at `/studio-admin`
- `pnpm build` — runs [build.mjs](build.mjs): builds the CMS admin **only if**
  `TINA_*` env is set, then `astro check` + build + HTML minify. So it builds out
  of the box with no keys.
- `pnpm preview --host` — preview the production build on the LAN (phone checks)

## Studio infrastructure (built in)

- **TinaCMS** ([tina/config.ts](tina/config.ts)) — collections: **blog**, **seo**
  (per-page meta + noindex + sitemapExclude, `src/data_files/seo/*.json`),
  **settings** (global noindex, robots.txt, head/body code injection,
  `settings/site.json`), **business** (LocalBusiness schema, `business/info.json`).
  Admin at a hidden path (`studio-admin` — change per project in tina/config +
  tsconfig exclude + .gitignore). Local vs TinaCloud via `TINA_*` env. Details:
  [`docs/tinacms-dashboard.md`](docs/tinacms-dashboard.md).
- **Contact form** — [functions/api/contact.ts](functions/api/contact.ts)
  (Cloudflare Pages Function → Resend) + [ContactForm.astro](src/components/sections/ContactForm.astro)
  - [contact-form.ts](src/assets/scripts/contact-form.ts) (fetch + honeypot +
    native fallback). Env: `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM` (verified
    domain). **Hardening (built in):** server-side length caps; optional
    `TURNSTILE_SECRET` (Turnstile — also add the widget + a `cf-turnstile` field
    with your site key to the form, and load the Turnstile script); optional
    `ALERT_WEBHOOK` + a failure log so a lead is never lost silently.
- **Conversion tracking** — [analytics.ts](src/assets/scripts/analytics.ts)
  (loaded eagerly): auto-tracks `tel:` clicks (`call_click`) + form success
  (`form_submit`), provider-agnostic (Plausible/GA if wired via CMS headCode).
  Enable **Cloudflare Web Analytics** (free, cookieless) in the Pages dashboard.
- **Security + cache headers** — [public/\_headers](public/_headers)
  (X-Content-Type-Options, Referrer-Policy, X-Frame-Options, HSTS,
  Permissions-Policy + immutable cache on hashed assets). Add a tuned CSP per
  project if needed (mind the CMS `headCode` injection).
- **Accessibility** — CSS `prefers-reduced-motion` reset in `global.css` (JS
  animations must guard too); use real `<label>`s. Run a Lighthouse a11y ≥ 95 +
  keyboard pass before handoff.
- **SEO/schema** — [Meta.astro](src/components/Meta.astro) reads settings
  (noindex) + business (LocalBusiness JSON-LD); [robots.txt.ts](src/pages/robots.txt.ts)
  serves the CMS robots; [astro.config.mjs](astro.config.mjs) drops noindex pages
  from the sitemap. Favicon/OG: template defaults — swap to
  realfavicongenerator + a fixed `<300 KB` OG image on a real project.
- **Deploy** — Cloudflare Pages (Pages flow, framework Astro, build `pnpm build`,
  output `dist`) + Netlify mirror. Env changes need a redeploy. Full launch +
  domain migration + handoff:
  [`docs/deploy-handoff-and-services.md`](docs/deploy-handoff-and-services.md).
- **Performance (PageSpeed 100 — apply the playbook by default).** Baked in:
  inline critical CSS (`build.inlineStylesheets: 'always'`), interaction JS
  lazy-booted off the critical path in [MainLayout](src/layouts/MainLayout.astro)
  (add more `import()`s inside `boot()`), Brotli compression. When building:
  images via `astro:assets` (AVIF+WebP, responsive `widths`+`sizes`, raster in
  `src/images/`); self-host fonts (`font-display: swap`); animate only
  `transform`/`opacity`; split long ScrollTrigger setup into `setTimeout(0)`
  groups; batch DOM reads. Full list + gotchas: `astro-landing-workflow` skill →
  Performance playbook.

## Recommendations for AI

- Use **path aliases** in suggested code.
- Put new reusable components under [src/components/](src/components/) (`sections/` or `ui/` by purpose).
- Use **Tailwind v4** only; do not use Tailwind v3 syntax.
- Edit nav/footer copy in [src/utils/navigation.ts](src/utils/navigation.ts).
- There are no content collections — if you add a blog/docs, create
  `src/content.config.ts` and the relevant `src/content/` folders first.
