# Project AI Guide

For AI assistants (Claude, Cursor, Copilot, etc.): this file describes the
project structure and conventions of this **clean landing-page base**, derived
from the ScrewFast template with blog, docs, products, insights, auth and i18n
stripped out. See [README.md](README.md) for human-facing setup.

## Project Overview

A minimal Astro 5 landing-page starter. Stack: Astro 5, Tailwind v4 (via
`@tailwindcss/vite`), Lenis (smooth scroll), GSAP (available, not yet used).
There are no content collections, no Starlight docs, no Preline, and a single
locale (English).

The homepage ([src/pages/index.astro](src/pages/index.astro)) is an intentionally
empty canvas — apply your own design there. The original ScrewFast landing
**section components are kept as reference** under `src/components/sections/`
(see below) so you can copy patterns from them.

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

| Purpose                | Path                               | Notes                                                                                                                         |
| ---------------------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
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

- `pnpm dev` — run dev server (http://localhost:4321)
- `pnpm build` — typecheck (`astro check`), build, then HTML minify ([process-html.mjs](process-html.mjs))
- `pnpm preview` — preview production build

## Recommendations for AI

- Use **path aliases** in suggested code.
- Put new reusable components under [src/components/](src/components/) (`sections/` or `ui/` by purpose).
- Use **Tailwind v4** only; do not use Tailwind v3 syntax.
- Edit nav/footer copy in [src/utils/navigation.ts](src/utils/navigation.ts).
- There are no content collections — if you add a blog/docs, create
  `src/content.config.ts` and the relevant `src/content/` folders first.
