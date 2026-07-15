# Deploy, handoff & service registration playbook

End-to-end process for taking an Astro landing site live on a **client-owned**
stack: GitHub → Cloudflare Pages (auto-deploy) + TinaCloud CMS + Resend form.
Refined on the Boston Locksmith launch (WordPress → Astro migration, July 2026).

Architecture: the site stays **fully static** (Astro SSG). The only runtime piece
is one Cloudflare Pages Function for the contact form. Everything else is baked at
build time. GitHub `main` → Cloudflare rebuild → live.

---

## Order of operations for a NEW client site

1. Build the site (see main SKILL.md).
2. Register the 4 services below (ideally under the **client's** accounts).
3. Point the domain at Cloudflare Pages.
4. Post-launch tails.

Do them in this order — later steps need keys/URLs from earlier ones.

---

## 1. GitHub (repo owner = client)

Two paths:

- **Transfer** an existing repo to the client: repo **Settings → Danger Zone →
  Transfer ownership** → client's username/org. Client must **Accept** the
  transfer (email/notification). Keeps full history; old URL 301-redirects.
- **Fresh**: client creates an empty repo, you `git remote set-url origin …`
  and push.

After transfer/handoff:

- Client adds you as a **Collaborator** (Settings → Collaborators) with write
  access, or you can't push. Verify: `gh api repos/OWNER/REPO --jq .permissions`
  → `push: true`.
- Update your local remote: `git remote set-url origin https://github.com/OWNER/REPO.git`.

What a transfer does NOT carry over: Cloudflare/TinaCloud connections, secrets,
GitHub Action secrets — all re-connected below.

## 2. TinaCloud (production CMS editing) — app.tina.io

The admin only works in production with TinaCloud keys. Recreate per repo/owner.

1. **Create Project** → **Import your site** (existing repo, not a template).
2. Authorize GitHub, pick the repo, branch **`main`**.
3. **Site URLs** (comma-separated origins that may open the admin):
   `http://localhost:4321, https://<project>.pages.dev, https://<realdomain>`
   — editable later in Project Settings; add the exact prod URL Cloudflare gives.
4. "Use a separate content repo" = **OFF**.
5. Grab **Client ID** (public) + create a **read-only Token** (Tokens tab).
6. These become env vars: `TINA_PUBLIC_CLIENT_ID` (public) and `TINA_TOKEN`
   (secret) — in local `.env` (gitignored) and in Cloudflare (step 3).

See `tinacms-dashboard.md` for what the client can edit and the schema.

## 3. Cloudflare Pages (hosting) — client's Cloudflare account

⚠️ Use the **Pages** flow, NOT the **Workers** flow. If you see "Configure your
Worker project" / a `Deploy command: npx wrangler deploy` field, you're in the
wrong wizard — go back and choose **Pages → Connect to Git**. Direct URL:
`https://dash.cloudflare.com/?to=/:account/pages/new/provider/github`.

- Connect the repo. **Framework preset: Astro.** Build command **`pnpm build`**,
  output directory **`dist`** (no deploy command in Pages).
- Environment variables (Production + Preview):

  | Type       | Name                    | Value                                              |
  | ---------- | ----------------------- | -------------------------------------------------- |
  | Plaintext  | `NODE_VERSION`          | `22`                                               |
  | Plaintext  | `TINA_PUBLIC_CLIENT_ID` | from TinaCloud                                     |
  | **Secret** | `TINA_TOKEN`            | from TinaCloud (read-only)                         |
  | Plaintext  | `CONTACT_TO`            | client's inbox (form recipient)                    |
  | Plaintext  | `CONTACT_FROM`          | `Name <noreply@realdomain>` (verified domain only) |
  | **Secret** | `RESEND_API_KEY`        | from Resend                                        |

- 🔴 **Env changes need a REDEPLOY** to take effect (Pages Functions bind env at
  deploy time). Change the value → **Deployments → ⋯ → Retry deployment**, or push
  an empty commit (`git commit --allow-empty`). Editing the variable alone does
  nothing to the live function.
- The Pages `.pages.dev` subdomain is globally unique — if the name is taken
  (e.g. an old project of yours), the new project gets a suffix
  (`project-xxx.pages.dev`). Use the **stable** URL (no commit-hash prefix).

## 4. Resend (contact-form email) — resend.com

- The form Function (`functions/api/contact.ts`) emails via Resend.
- **Verify the sending domain** (Domains → Add Domain → real domain). Resend
  gives DNS records: a DKIM `resend._domainkey` TXT + SPF/MX on a `send.`
  subdomain. Add them in Cloudflare DNS as **DNS-only** (grey cloud).
- Create an API key with **Sending access** → `RESEND_API_KEY`.
- `CONTACT_FROM` **must** be on the verified domain (`noreply@realdomain`).
  Gmail/other domains are rejected. The default `onboarding@resend.dev` only
  sends to the Resend account owner's own email — fine for a first test, not for
  the client's inbox.
- Test: `curl -X POST https://DOMAIN/api/contact -H 'accept: application/json'
--data 'name=Test&phone=6170000000&message=test'` → expect `{"ok":true}`.
  `{"ok":false,...}` + HTTP 502 = Resend rejected (usually unverified sender).
  A 500 "not configured" = env vars missing/not redeployed.

## 5. DMARC (email deliverability / anti-spoof)

- Add via Cloudflare's "Add a DMARC record" recommendation → default is
  `v=DMARC1; p=none; rua=…` (**monitoring only** — safe, blocks nothing).
- Resend emails pass DMARC via **DKIM alignment** (resend.\_domainkey), so the
  form keeps working. Keep the `send.` subdomain SPF/MX.
- Later, after reviewing reports for a few weeks, tighten `p=none` →
  `p=quarantine` → `p=reject`.

---

## Domain migration (existing WordPress → new Astro)

Live-site cutover — keep the old site up until the new one is verified.

**Recon first** (`dig`): registrar ≠ DNS host ≠ web host often differ.

- `dig +short NS domain` — where DNS actually lives (may be the host, e.g.
  Hostinger `*.main-hosting.eu`, even if the registrar is Bluehost).
- `dig +short A domain`, `dig +short MX domain`, `dig +short TXT domain`.

**Critical checks before touching anything:**

- **Email**: if the client uses `@domain` email, you must preserve MX/SPF/DKIM.
  MX pointing at the apex (`0 domain.`) is the classic trap — repointing the apex
  to Pages breaks mail unless you move mail to a `mail.` subdomain first. If email
  isn't used, skip it.
- **SEO redirects**: pull the old sitemap (`/sitemap_index.xml`,
  `/wp-sitemap.xml`) to list indexed URLs. Map changed paths to `public/_redirects`
  (Cloudflare Pages) as 301s. **Do NOT redirect a path the new site already serves
  at the same URL** — it loops with Astro's trailing-slash redirect (e.g. a
  `/contact/ → /contact` rule fights `/contact → /contact/`). Home `/` needs none.

**Cutover steps:**

1. Update the real domain in code (5 places): `astro.config.mjs` `site`,
   `constants.ts` `SITE.url`, `tina/config.ts` `SITE_URL`, `PageHero.astro`
   `ORIGIN`, and the robots `Sitemap:` line. Push.
2. Cloudflare → **Add a site** → domain (Free plan). It scans existing DNS;
   confirm it imported the records you care about. It gives 2 nameservers.
3. Change nameservers **at the registrar** (where the domain is registered) to
   Cloudflare's. ⚠️ **Disable DNSSEC at the registrar first** or the domain stops
   resolving after the NS switch.
4. Wait for propagation (`dig +short NS domain @1.1.1.1` shows Cloudflare). The
   site still serves the old host (Cloudflare proxies the imported apex A) — no
   downtime yet.
5. Pages project → **Custom domains** → add apex + `www`. This is the flip:
   Cloudflare replaces the apex `A` with a CNAME→`*.pages.dev`.
6. In Cloudflare **DNS → Records**, delete any leftover apex/`www` `A` record
   pointing at the old host IP (search the IP). Apex must be **only**
   CNAME→pages.dev. Keep the `google-site-verification` TXT.
7. Verify (see DNS-cache gotcha).

**Post-launch tails:** turn OFF global `noindex`; submit `sitemap-index.xml` to
Google Search Console (google-site-verification TXT preserved); fill Business
info (LocalBusiness schema); add a Privacy Policy page (footer link); decommission
the old host after a few stable days.

---

## Gotchas (all hit at least once)

- **Stale DNS cache in the shell** — a dev machine that resolved the domain
  before the NS change keeps hitting the OLD host IP, so `curl DOMAIN` shows the
  old site even when the world sees the new one. Verify the real state by forcing
  Cloudflare: `curl --resolve DOMAIN:443:104.21.x.x https://DOMAIN/`. A
  Cloudflare-proxied response has `server: cloudflare`; the origin's server header
  (e.g. `LiteSpeed` + `x-powered-by: PHP`) means you're hitting the old host.
- **Env change with no redeploy** = no effect on the live Function.
- **`tinacms build` cloud-schema mismatch** blocks CI: build script uses
  `tinacms build --skip-cloud-checks && astro check && astro build`. Also exclude
  the built admin from type-checking: `public/<admin>` in `tsconfig` exclude and
  `.gitignore` (else `astro check` SIGABRTs scanning the minified admin bundle).
- **Cloudflare Managed robots.txt** is auto-prepended: it blocks AI-training bots
  (GPTBot, ClaudeBot, Google-Extended, CCBot…) but sets `search=yes` +
  `Allow: /`, so Google/Bing indexing is unaffected. Not a bug.
- **OG image for WhatsApp**: keep it under ~300 KB (1200×630) or WhatsApp won't
  render the preview. Social platforms cache OG hard — re-scrape via Facebook
  Sharing Debugger; browsers cache favicons hard — hard-refresh/incognito.

---

## Launch checklist (run every launch)

- [ ] Real domain set in code (5 places) + `_redirects` for changed old URLs.
- [ ] Env vars set in Cloudflare (TINA*\*, CONTACT*\*, RESEND_API_KEY,
      NODE_VERSION=22) and a **redeploy** done after any change.
- [ ] Contact form: test POST returns `{"ok":true}`, email lands in the client's
      inbox; `CONTACT_FROM` on the Resend-verified domain; DMARC record added.
- [ ] Favicon + OG done manually (see `tinacms-dashboard.md`); OG re-scraped;
      favicon checked (realfavicongenerator favicon-checker).
- [ ] Global `noindex` OFF; robots.txt correct; `sitemap-index.xml` submitted to
      Google Search Console (verify via the google-site-verification TXT).
- [ ] **`www` → apex 301** redirect (Cloudflare → domain → Rules → Redirect
      Rules) so `www` isn't a duplicate. Full SEO pass: see `seo-checklist.md`.
- [ ] Analytics live (Cloudflare Web Analytics enabled in the Pages dashboard;
      `call_click`/`form_submit` events firing if a provider is wired).
- [ ] `_headers` deployed (security + immutable asset cache).
- [ ] Lighthouse ≥ (perf/a11y/best-practices/SEO) targets; console clean on load + scroll; keyboard nav + visible focus; reduced-motion respected.
- [ ] Privacy Policy page + footer link; cookie consent if GA/cookies are used.
- [ ] Monitoring set up (below).

## Post-launch monitoring (studio deliverable — don't skip)

- **Uptime**: UptimeRobot / Cloudflare Health Check on the homepage AND
  `POST /api/contact` (synthetic ping), alert to email/Telegram. The studio must
  learn about an outage before the client does.
- **Form reliability**: the Function logs every failed send and pings
  `ALERT_WEBHOOK` if set — so a broken `RESEND_API_KEY` / Resend 502 never loses a
  lead silently. Watch that channel; a silent form failure is the worst failure.
- **Maintenance cadence**: quarterly `pnpm up` + CI run; confirm the Resend
  domain/DKIM still verify; rotate keys periodically.
- **Back up service access**: content is in git, but the service config is not —
  keep a secured record of owners + keys (Cloudflare, TinaCloud, Resend). A lost
  clientId/token has nowhere to be restored from.
