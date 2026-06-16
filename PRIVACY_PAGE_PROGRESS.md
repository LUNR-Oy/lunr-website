# Privacy Policy Page — Progress & Handoff

_Last updated: 2026-06-16_

Goal: publish a public Privacy Policy at **https://hellolunr.com/privacy**, hosted directly
on the site (static HTML, deployed via Vercel from GitHub).

---

## ✅ Done

### Code (GitHub — `LUNR-Oy/lunr-website`, branch `main`)
- **New page:** `privacy/index.html` — full Adara Privacy Policy converted to a clean web page
  (served at `/privacy` because Vercel serves a directory's `index.html` at its path; no config needed).
  - Title "Privacy Policy", Effective Date June 16, 2026, all 11 sections, contact card.
  - Matches the existing landing-page design system (same fonts, colors, orbs, footer).
  - Public, no login; `<meta name="robots" content="index, follow">`.
- **Footer link:** added `Privacy Policy` → `/privacy` in `index.html`.
- **Contact email:** uses `office@hellolunr.com` (PDF said `hello@`, corrected per owner).
- `.gitignore`: added `.vercel`.

Commits (all pushed to `origin/main`):
| Hash | Description |
|------|-------------|
| `a6461d3` | Add public Privacy Policy page at /privacy (+ footer link) |
| `a9a5f63` | Use office@hellolunr.com on Privacy Policy contact |
| `dbd3856` | Ignore .vercel local link directory (HEAD) |

> Note: `a6461d3` also swept in pre-existing uncommitted landing-page polish that was already
> in the working tree (SVG pillar icons replacing 01/02/03, focus-visible a11y outlines,
> responsive + reduced-motion tweaks, LinkedIn URL). Not part of the privacy task, but bundled.

### Vercel
- New project **`lunr-website`** under team **"LUNR Oy" (`lunr-oy-s-projects`)**.
- Production deployment is **Ready** and contains `/privacy`
  (e.g. `lunr-website-iurauvqyb-lunr-oy-s-projects.vercel.app`).
- Old project (different Vercel account) that previously owned the domain: domain **removed** from it.
- `hellolunr.com` is now **owned by the LUNR Oy team** (added 2026-06-16).

### DNS (GoDaddy)
- Already points at Vercel: apex `A 216.198.79.1`, `www CNAME → …vercel-dns-017.com`.
- No A/CNAME changes needed.

---

## ⏳ Remaining — ONE step: verify domain ownership in Vercel

Vercel won't route the domain until ownership is verified, because GoDaddy still uses its own
nameservers (`ns75/ns76.domaincontrol.com`), not Vercel's. Live URL currently returns
`404 DEPLOYMENT_NOT_FOUND` ("no production deployment") for this reason.

**Action — GoDaddy admin adds these two TXT records** (leave all other records untouched):

| Type | Name / Host | Value |
|------|-------------|-------|
| TXT | `_vercel` | `vc-domain-verify=hellolunr.com,7a627fbfeb8996667644` |
| TXT | `_vercel.www` | `vc-domain-verify=www.hellolunr.com,a2c56f58d18b731209d0` |

(GoDaddy auto-appends the base domain — do NOT type the full domain in the Name field.)

Chosen the TXT route (not nameserver delegation) to **preserve `@hellolunr.com` email** — switching
nameservers to Vercel would move all DNS and break MX/email until manually recreated.

### After the TXT records propagate
1. Verify in Vercel (dashboard "Verify" button, or it auto-verifies).
2. Assign the domain to the `lunr-website` project's production
   (project → Settings → Domains → add `hellolunr.com` + `www.hellolunr.com`;
   or CLI `vercel alias set <prod-deployment-url> hellolunr.com` once verified).
3. Verify live: `https://hellolunr.com/privacy` should return HTTP 200 with the policy page.
4. If it shows stale content, Redeploy / purge cache (old build was CDN-cached ~14 days).

---

## Status by layer
- ✅ **GitHub** — code correct and pushed.
- ✅ **Vercel build** — production deploy has `/privacy`.
- ✅ **GoDaddy A/CNAME** — already points to Vercel.
- ⏳ **Vercel domain verification** — blocked on the 2 TXT records above. This is the only thing left.

## Final URL (after verification)
**https://hellolunr.com/privacy**
