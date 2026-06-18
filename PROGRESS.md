# LUNR Website — Progress

_Last updated: 2026-06-19_

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
