# Client intake, scope & pricing

The business side of running the studio: what to gather before starting, how to
scope a build, and how to package/price it. Formalising this is the freelancer →
studio jump — it kills scope creep and the endless "can you also send me…".

---

## Intake brief (collect BEFORE writing code)

Send this as a form/questionnaire. Answers map straight into the CMS data files.

**Business basics** → `src/data_files/business/info.json` (LocalBusiness schema)

- Legal/display name, phone (international format), email
- Address (street, city, region, ZIP, country) — or "service-area only"
- Area served, hours (or 24/7), price range
- Social / profile URLs (Google, Angi, Thumbtack, Facebook, Instagram…)

**Positioning** → hero + copy

- One-line description; goals (calls? form leads? bookings?)
- Target audience; top 3 competitors (links)
- Primary CTA (Call now? Request a quote? Book?)

**Structure** → pages + `src/data_files/seo/*.json`

- Which pages/services (each service page = one route + one seo json)
- Any blog? Any legal pages beyond Privacy Policy?

**Brand & assets** (get the actual files up front)

- Logo (SVG preferred), brand colours, fonts
- Photos (real > stock); testimonials/reviews; certifications/badges
- Favicon source (or we generate) + a hero/social image direction

**Access & infra** (needed for launch)

- Domain + **registrar** login (or who controls DNS); is email on the domain?
- Which accounts will own it: GitHub, Cloudflare, TinaCloud, Resend (theirs vs
  ours during build, transfer at handoff)
- Analytics preference (Cloudflare Web Analytics default / GA / Plausible)

**Project** — timeline, budget range, launch deadline, decision-maker.

> **Rule:** don't start the build until brand assets + copy direction + domain
> access path are in hand. Missing inputs are the #1 cause of stalls (favicon,
> OG image, recipient email all bit us on locksmith).

---

## Service tiers (SOW skeleton)

Adjust names/prices to your market; the point is fixed scope + clear boundaries.

| Tier            | Includes                                                                       | Typical scope             |
| --------------- | ------------------------------------------------------------------------------ | ------------------------- |
| **Landing**     | 1 page, responsive, PageSpeed-100, contact form, SEO meta, deploy              | single-page lead-gen      |
| **Multi-page**  | Landing + up to N sub-pages (services), shared components                      | small business site       |
| **+ CMS**       | TinaCMS dashboard (blog + per-page SEO + settings + business), client training | client wants to self-edit |
| **+ Migration** | Move an existing domain (WordPress etc.): DNS, 301 redirect map, cutover       | replacing a live site     |

**Every tier includes** (studio standard, not "extras"): mobile-first responsive,
PageSpeed-100 playbook, accessibility pass, security headers, sitemap/robots,
LocalBusiness schema, conversion tracking, contact form with spam hardening +
failure alerting, favicon/OG, monitoring setup, launch checklist.

**Explicitly out of scope** (quote separately): copywriting, photography/branding,
logo design, ongoing content, third-party integrations (CRM, booking, payments),
multi-language, e-commerce.

**Boundaries:** define a **revision limit** (e.g. 2 rounds) and bill extra rounds
/ new pages / new features. Put it in the SOW so "just one more thing" is a line
item, not free work.

---

## Support retainer (recurring revenue)

Pitch a monthly plan at handoff — this is where a studio makes durable income and
keeps the site healthy:

- Hosting/CMS/email accounts kept alive + monitored (uptime + form alerts)
- Quarterly dependency updates (`pnpm up`) + CI run + redeploy
- Confirm Resend domain/DKIM still verify; rotate keys
- A budget of content edits / small tweaks per month
- Backup of service access (owners + keys) kept current
- Priority response SLA

Without it: the site rots (stale deps, expired keys, silent form breakage) and
the client blames the studio. With it: predictable income + a reason to stay in
touch. See `deploy-handoff-and-services.md` → Post-launch monitoring for the
technical side.
