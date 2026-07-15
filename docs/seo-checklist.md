# SEO checklist

What to do for SEO on every client site. Most of it is baked into the starter
(Meta.astro, CMS SEO collection, sitemap/robots) — this is the full list so
nothing is missed, plus the per-project + off-site parts.

## Baked into the starter (verify, don't rebuild)

- `Meta.astro` emits per page: `<title>`, meta description, canonical, Open Graph,
  Twitter Card, `WebPage` JSON-LD, and `LocalBusiness` JSON-LD (from
  `business/info.json`, only when name + phone are set).
- `sitemap-index.xml` (auto) with a noindex/sitemap-exclude filter; `robots.txt`
  from the CMS settings; global + per-page `noindex` toggles.
- hreflang is single-language (`en`) — don't leave a hreflang pointing at a route
  that 404s (the template's `/fr/` was removed).
- Favicon/OG are manual per project (see `tinacms-dashboard.md`).

## On-page (during the build)

- [ ] **Unique** `metaTitle` + `metaDescription` per page in `seo/*.json`
      (keyword-focused, ~50-60 / ~150-160 chars). One `seo/<key>.json` per route.
- [ ] Exactly **one `<h1>`** per page; logical `<h2>/<h3>` hierarchy.
- [ ] Descriptive **alt text** on meaningful images (hero, service cards, blog
      covers); decorative images get empty `alt=""`.
- [ ] **Internal links** between pages (service cards → pages, footer nav,
      in-copy links). Descriptive anchor text, not "click here".
- [ ] Real, useful copy per page (a service page should actually cover that
      service — location + service keywords for local intent).

## Structured data

- [ ] **Fill `business/info.json` completely** — the LocalBusiness entity is only
      as strong as its data: `streetAddress`, `postalCode`, `latitude`,
      `longitude`, and `sameAs` (Google Business Profile URL, Angi, Thumbtack,
      Facebook…), plus `image` (logo). Empty fields = weaker signal.
- [ ] **BreadcrumbList on sub-pages** — drop in the ready
      `src/components/Breadcrumbs.astro` (`<Breadcrumbs items={[…]} />`): semantic
      breadcrumb `<nav>` + `BreadcrumbList` JSON-LD in one component.
- [ ] Optional: `FAQPage` on a real FAQ (low value since Google restricted FAQ
      rich results in 2023). **Avoid** self-serving `aggregateRating` — Google
      usually won't show stars and may ignore it.

## Technical / domain (launch)

- [ ] Real domain in code (5 places) — see `deploy-handoff-and-services.md`.
- [ ] **`www` → apex 301 redirect** (Cloudflare → domain → Rules → Redirect
      Rules), so `www` isn't a duplicate serving 200.
- [ ] Global `noindex` **OFF**; robots.txt correct; submit `sitemap-index.xml`
      to **Google Search Console** + **Bing Webmaster Tools**.
- [ ] Validate structured data (Google Rich Results Test) — no errors.
- [ ] HTTPS, mobile-friendly, Core Web Vitals green (perf playbook).

## AI / retrieval stance (already coherent via Cloudflare)

- Block **training** crawlers (GPTBot, ClaudeBot, CCBot, Google-Extended); **allow
  retrieval/search** bots (OAI-SearchBot, PerplexityBot, Googlebot) — those cite
  the site with a link + phone and bring leads. Verify the live robots.txt keeps
  retrieval bots allowed.
- `llms.txt`: optional, low value today (most files get zero AI requests; no major
  consumer confirmed). Skip unless a specific AI platform that sends you traffic
  actually asks for it.

## Off-site (client-side — the real local levers)

- [ ] **Google Business Profile** — the #1 lever for a local business (local pack + Maps). Claim + optimise; keep NAP consistent with the site.
- [ ] Consistent **NAP** (name/address/phone) across the site + directory
      citations.
- [ ] Keep gathering **reviews** (Google especially).
