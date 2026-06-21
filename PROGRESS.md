# LUNR Website — Progress

_Last updated: 2026-06-21_

---

## Data Deletion Instructions Page — ✅ COMPLETE, LIVE

**Goal:** publish a public **Data Deletion Instructions URL** required by the Meta developer
app (Adara connects to Meta APIs, so Meta requires a page telling users how to request data
deletion — the instructions-URL option, not the programmatic callback).

**Status (2026-06-21): DONE and live in production.** Verified:
- `https://hellolunr.com/data-deletion` → 307 → `www.hellolunr.com/data-deletion`
- `https://www.hellolunr.com/data-deletion` → 200 (`<title>Data Deletion Instructions — LUNR</title>`)

**URL for Meta App Settings → Basic → "Data Deletion Instructions URL":**
`https://www.hellolunr.com/data-deletion`

### What was built
- **New page:** `data-deletion/index.html` — served at `/data-deletion` (Vercel serves a
  directory's `index.html` at its path; no config needed). Mirrors the `/privacy` design
  system (same fonts, colors, orbs, footer). Public, no login, `<meta name="robots" content="index, follow">`.
  - Sections: (01) what data a request covers — account info, Meta API tokens, campaign/
    performance data, logs; (02) how to request — email `office@hellolunr.com` with subject
    "Data Deletion Request", plus the Meta Settings → Business Integrations disconnect path;
    (03) what happens next — deletion + token revocation, ~30 days, legal-retention caveat
    linking to `/privacy`; (04) contact card.
- **Build wiring:** added `"data-deletion"` to `ASSETS` in `scripts/build.mjs` so it copies
  into `dist/`. Build verified green.
- **SEO:** added `https://www.hellolunr.com/data-deletion` to `sitemap.xml`. Canonical + OG tags on the page.

### Commits
| Hash | Description |
|------|-------------|
| `d9098eb` | Add Data Deletion Instructions page at /data-deletion |

### Vercel
- Pushed to `main`; Git integration auto-triggered a Production deploy (status **Ready**) on
  the `lunr-website` project under team **"LUNR Oy"**. No manual deploy needed.

---

## Analytics Foundation — ✅ COMPLETE, LIVE

**Goal:** add a lightweight, production-safe analytics stack (GA4 + Microsoft Clarity),
conversion tracking, and SEO/Search Console readiness — without hardcoding any IDs.

**Status (2026-06-20): DONE and live in production on `www.hellolunr.com`.**

### Architecture (static site + tiny build step)
The site is plain static HTML, so a small build step injects IDs from env at build time:

- `vercel.json` → `buildCommand: npm run build`, `outputDirectory: dist`, `framework: null`.
- `scripts/build.mjs` reads `NEXT_PUBLIC_GA_MEASUREMENT_ID` / `NEXT_PUBLIC_CLARITY_PROJECT_ID`
  from env (local `.env`, gitignored; Vercel Production env vars in prod), generates
  `dist/analytics-config.js` (`window.__LUNR_ANALYTICS__`), and copies assets to `dist/`.
- `analytics.js` loads GA4 + Clarity only for IDs that are present (missing ID → loads
  nothing, no errors). Exposes a safe no-op `window.trackEvent(name, params)`.
- Validated with ESLint + strict `tsc` (`npm run lint` / `typecheck` both green).

### IDs (set in Vercel Production env, NOT in source)
- GA4 Measurement ID: `G-LSF2E22DPX`
- Microsoft Clarity Project ID: `x9ypbxtzzy`

### Events implemented (GA4)
- `page_view` — automatic on every page.
- `signup_started` — waitlist form submit with a valid email.
- `waitlist_signup` — waitlist Formspree success (also serves as `signup_completed`).
- `contact_click` — footer "Contact Us" link click (`{location:'footer'}`).
- Not present (no matching UI; documented): `book_call_click`, `demo_click`, `pricing_view`,
  `contact_form_submit` (site uses an email link), `connect_meta_click`.

### SEO / Search Console readiness
- `index.html`: meta description, canonical, robots, Open Graph + Twitter, Organization JSON-LD.
- `privacy/index.html`: canonical + Open Graph.
- New `robots.txt` + `sitemap.xml`.
- **Canonical host standardized on `www.hellolunr.com`** (apex 307-redirects to www; all
  canonical/OG/JSON-LD/robots/sitemap URLs use www).

### Footer / social polish
- "Contact Us" link (opens email compose to `office@hellolunr.com`), tracked as `contact_click`.
- LinkedIn + Instagram (`instagram.com/hellolunr/`) as small lucide-style **icons**; both in
  Organization JSON-LD `sameAs`.

### Files added
`analytics.js`, `global.d.ts`, `scripts/build.mjs`, `package.json`, `package-lock.json`,
`tsconfig.json`, `eslint.config.js`, `vercel.json`, `.env.example`, `robots.txt`, `sitemap.xml`,
`docs/analytics-setup.md`. Modified: `index.html`, `privacy/index.html`, `.gitignore`.

### Commits
| Hash | Description |
|------|-------------|
| `a028ea2` | Add analytics foundation: GA4 + Clarity, SEO, build step |
| `1939b57` | SEO: use www.hellolunr.com as canonical production domain |
| `1737503` | Add small Instagram icon link to footer (both pages) |
| `59b4041` | Make LinkedIn footer link an icon for consistency |
| `a9658e9` | Relabel footer email link to "Contact Us" |
| `3655d46` | Track Contact Us clicks as GA4 contact_click event |

### Remaining manual step (owner)
- **Google Search Console**: add the `hellolunr.com` Domain property (covers apex + www),
  verify via a `google-site-verification` TXT in GoDaddy, then submit
  `https://www.hellolunr.com/sitemap.xml`. Full walkthrough in `docs/analytics-setup.md`.

---

## Privacy Policy Page — ✅ COMPLETE, LIVE

**Goal:** publish a public Privacy Policy at **https://hellolunr.com/privacy**, hosted directly
on the site (static HTML, deployed via Vercel from GitHub).

**Status (2026-06-17): DONE.** Domain verified and assigned to the `lunr-website` project.
Live and returning HTTP 200:
- `https://hellolunr.com/` → 200
- `https://www.hellolunr.com/` → 200
- `https://hellolunr.com/privacy` → 307 → `www.hellolunr.com/privacy` → 200 (real policy, ~11KB)

Apex redirects to `www` (Vercel default). Email/MX preserved (nameservers stayed on GoDaddy,
verified via TXT). Nothing left to do.

### What was built

- **New page:** `privacy/index.html` — full Adara Privacy Policy converted to a clean web page
  (served at `/privacy` because Vercel serves a directory's `index.html` at its path; no config needed).
  - Title "Privacy Policy", Effective Date June 16, 2026, all 11 sections, contact card.
  - Matches the existing landing-page design system (same fonts, colors, orbs, footer).
  - Public, no login; `<meta name="robots" content="index, follow">`.
- **Footer link:** added `Privacy Policy` → `/privacy` in `index.html`.
- **Contact email:** uses `office@hellolunr.com` (PDF said `hello@`, corrected per owner).
- `.gitignore`: added `.vercel`.

### Commits

| Hash | Description |
|------|-------------|
| `a6461d3` | Add public Privacy Policy page at /privacy (+ footer link) |
| `a9a5f63` | Use office@hellolunr.com on Privacy Policy contact |
| `dbd3856` | Ignore .vercel local link directory |

> Note: `a6461d3` also swept in pre-existing uncommitted landing-page polish that was already
> in the working tree (SVG pillar icons replacing 01/02/03, focus-visible a11y outlines,
> responsive + reduced-motion tweaks, LinkedIn URL). Not part of the privacy task, but bundled.

### Vercel

- New project **`lunr-website`** under team **"LUNR Oy" (`lunr-oy-s-projects`)**.
- Production deployment is **Ready** and contains `/privacy`.
- Old project (different Vercel account) that previously owned the domain: domain **removed** from it.
- `hellolunr.com` is now **owned by the LUNR Oy team** (added 2026-06-16).

### DNS (GoDaddy)

- Already points at Vercel: apex `A 216.198.79.1`, `www CNAME → …vercel-dns-017.com`.
- No A/CNAME changes needed.

### TXT records used for domain verification (kept for the record)

GoDaddy admin added these two TXT records (all other records left untouched):

| Type | Name / Host | Value |
|------|-------------|-------|
| TXT | `_vercel` | `vc-domain-verify=hellolunr.com,7a627fbfeb8996667644` |
| TXT | `_vercel.www` | `vc-domain-verify=www.hellolunr.com,a2c56f58d18b731209d0` |

(GoDaddy auto-appends the base domain — do NOT type the full domain in the Name field.)

Chose TXT route (not nameserver delegation) to **preserve `@hellolunr.com` email** — switching
nameservers to Vercel would move all DNS and break MX/email until manually recreated.

### Status by layer

- ✅ **GitHub** — code correct and pushed.
- ✅ **Vercel build** — production deploy has `/privacy`.
- ✅ **GoDaddy A/CNAME** — points to Vercel.
- ✅ **Vercel domain verification** — verified via TXT; domain assigned. Site live (200).

**Live URL: https://hellolunr.com/privacy**
