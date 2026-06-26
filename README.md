# Landing Page Base

A clean Astro 5 landing-page starter — a stripped-down base ready for a custom
design. Built on [Astro](https://astro.build/) + [Tailwind CSS v4](https://tailwindcss.com/),
with [Lenis](https://github.com/darkroomengineering/lenis) smooth scroll and
[GSAP](https://gsap.com/) available for animation.

> Derived from the [ScrewFast](https://github.com/mearashadowfax/ScrewFast)
> template (MIT). The blog, Starlight docs, products, insights, authentication,
> Preline UI and i18n have been removed to leave a minimal, single-language base.
> The original landing **section components are kept as reference** under
> `src/components/sections/`.

## Stack

- **Framework:** Astro 5 (static output)
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`, tokens in `@theme`)
- **Smooth scroll:** Lenis
- **Animation:** GSAP (installed, not yet wired)
- **Build extras:** sitemap, brotli/zstd compression, HTML minify
- **Dev port:** 4321 · **Output:** `dist/`

## Getting Started

This project is configured for **pnpm** (`pnpm-lock.yaml`). The first install
needs build scripts for `sharp` and `esbuild` approved — that's already set in
[`pnpm-workspace.yaml`](pnpm-workspace.yaml).

```bash
pnpm install
pnpm dev          # http://localhost:4321
```

If you don't have pnpm: `corepack pnpm install` (Node ships corepack), or switch
the lockfile to your package manager of choice.

### Commands

| Command        | Action                                                   |
| -------------- | -------------------------------------------------------- |
| `pnpm dev`     | Start the dev server at `localhost:4321`                 |
| `pnpm build`   | `astro check` + build + HTML minify (`process-html.mjs`) |
| `pnpm preview` | Preview the production build locally                     |

## Project Structure

```
src/
├── components/
│   ├── sections/   # Navbar & Footer (active) + reference landing sections
│   └── ui/         # buttons, blocks, forms, icons, links, avatars, stars
├── layouts/
│   └── MainLayout.astro   # Navbar + <slot /> + Footer, SEO, Lenis
├── pages/
│   ├── index.astro        # clean canvas — build your design here
│   ├── 404.astro
│   └── *.ts               # favicon / manifest / robots generators
├── data_files/   # constants.ts (SITE/SEO/OG), faqs/features/pricing.json
├── utils/        # navigation.ts (nav, footer, social links)
├── assets/       # global.css, lenis.css, lenisSmoothScroll.js
└── images/       # imported via @images/ (astro:assets)
```

See [AI_GUIDE.md](AI_GUIDE.md) for conventions, path aliases, and notes for AI
assistants.

## Customization

- **Site / SEO / OG:** [src/data_files/constants.ts](src/data_files/constants.ts)
- **Nav, footer & social links:** [src/utils/navigation.ts](src/utils/navigation.ts)
- **Theme tokens:** `@theme` block in [src/assets/styles/global.css](src/assets/styles/global.css)
- **Homepage:** [src/pages/index.astro](src/pages/index.astro)

> Note: Preline was removed, so the reference sections' Preline-driven interactivity
> (FAQ accordion, feature tabs, mobile nav toggle) is inert until you add your own JS.
> Dark mode still works (self-contained inline script in MainLayout/Navbar).

## Deployment

`pnpm build` outputs static files to `dist/`. Deploy that directory to any static
host:

```bash
# Vercel
vercel deploy --prebuilt --prod
# Netlify
netlify deploy --prod --dir=dist
```

Set the real domain in `site` inside [astro.config.mjs](astro.config.mjs) so
`canonical` URLs and the sitemap generate correctly.

## License

MIT — inherited from the original ScrewFast template. See [LICENSE](LICENSE).
