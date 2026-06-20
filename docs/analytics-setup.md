# Analytics & SEO Setup — hellolunr.com

This site is a **static HTML** site (no framework) deployed on **Vercel**. Analytics
IDs are never hardcoded. They are read from environment variables at **build time**
by `scripts/build.mjs`, which generates `dist/analytics-config.js`. That file sets
`window.__LUNR_ANALYTICS__`, and `analytics.js` loads GA4 and/or Microsoft Clarity
only for the IDs that are present.

> If an ID is missing, nothing is loaded for that tool — no script request, no
> errors, no console warnings.

## How it fits together

```
Vercel env vars ──► scripts/build.mjs ──► dist/analytics-config.js
NEXT_PUBLIC_GA_MEASUREMENT_ID                window.__LUNR_ANALYTICS__ = {
NEXT_PUBLIC_CLARITY_PROJECT_ID                 gaMeasurementId, clarityProjectId }
                                                       │
                                              analytics.js (loads GA4 + Clarity,
                                              exposes window.trackEvent)
```

Required environment variables (see [`.env.example`](../.env.example)):

| Variable | Purpose | Format |
|---|---|---|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4 | `G-XXXXXXXXXX` |
| `NEXT_PUBLIC_CLARITY_PROJECT_ID` | Microsoft Clarity | e.g. `abcd1234ef` |

> The `NEXT_PUBLIC_` prefix is a naming convention only (this is not Next.js).
> These IDs are public — they ship to the browser. They are tracking IDs, not secrets.

---

## Google Analytics 4

### Create a property
1. Go to <https://analytics.google.com> → **Admin** (bottom-left gear).
2. Under the **Account** column pick or create an account (e.g. "LUNR").
3. In the **Property** column click **Create property**.
4. Name it (e.g. "hellolunr.com"), set time zone (Europe/Helsinki) and currency, **Next** → fill business details → **Create**.

### Create a web data stream
1. In the new property: **Admin → Data streams → Add stream → Web**.
2. Website URL: `https://hellolunr.com`, Stream name: "LUNR Web".
3. Click **Create stream**.

### Get the Measurement ID
- On the stream details page, copy the **Measurement ID** — it looks like `G-XXXXXXXXXX`.

### Where to put it
- **Local:** copy `.env.example` to `.env` and set `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX`.
- **Production:** Vercel → Project → **Settings → Environment Variables** (see Vercel section below).

---

## Microsoft Clarity

### Create a project
1. Go to <https://clarity.microsoft.com> and sign in.
2. Click **Add new project**.
3. Name: "LUNR", Website URL: `https://hellolunr.com`, category as appropriate.
4. Click **Add project**.

### Get the Project ID
- Open the project → **Settings → Overview** (or the install snippet). The Project ID
  is the short token in `https://www.clarity.ms/tag/<PROJECT_ID>` — copy `<PROJECT_ID>`.

### Where to put it
- **Local:** `.env` → `NEXT_PUBLIC_CLARITY_PROJECT_ID=<PROJECT_ID>`.
- **Production:** Vercel env vars.

> You do **not** need to paste Clarity's HTML snippet — `analytics.js` injects the
> official loader for you from the Project ID.

---

## Google Search Console

### Create a Domain property
1. Go to <https://search.google.com/search-console>.
2. Click the property dropdown → **Add property** → choose **Domain** (left side).
3. Enter `hellolunr.com` (no `https://`, no `www`). A Domain property covers apex,
   `www`, and all subpaths/protocols.

### DNS verification (GoDaddy)
1. Search Console shows a **TXT record** value like `google-site-verification=...`.
2. In GoDaddy → your domain → **DNS / Manage DNS**.
3. Add a record: **Type** `TXT`, **Name/Host** `@`, **Value** the full
   `google-site-verification=...` string. Leave TTL default.
4. Save. (GoDaddy auto-appends the base domain — type `@`, not the full domain.)
5. Back in Search Console click **Verify** (DNS can take minutes to a few hours).

> This is additive — it does **not** affect the existing `_vercel` TXT records or
> MX/email. Keep all existing records.

### Validation steps
1. After verification, open **Sitemaps** (left nav) → submit `sitemap.xml`
   (full: `https://hellolunr.com/sitemap.xml`).
2. Use **URL Inspection** on `https://hellolunr.com/` → **Request indexing**.
3. Confirm `https://hellolunr.com/robots.txt` is reachable and references the sitemap.

---

## Vercel

### Environment variable setup
1. Vercel → the **lunr-website** project (team "LUNR Oy") → **Settings → Environment Variables**.
2. Add:
   - `NEXT_PUBLIC_GA_MEASUREMENT_ID` = `G-XXXXXXXXXX`
   - `NEXT_PUBLIC_CLARITY_PROJECT_ID` = `<PROJECT_ID>`
3. Select environments: **Production** (and **Preview** if you want analytics on
   preview deploys — usually leave Preview unset to avoid polluting data).
4. Save.

### Build configuration
`vercel.json` already sets:
```json
{ "buildCommand": "npm run build", "outputDirectory": "dist", "framework": null }
```
No dashboard build-setting changes are needed; `vercel.json` overrides them.

### Production deployment verification
1. **Redeploy** after adding env vars (env changes require a new build):
   Deployments → latest → **Redeploy**, or push to the production branch.
2. After deploy, visit `https://hellolunr.com/analytics-config.js` — it should show
   your real IDs (not `null`).
3. Run the browser checks below.

---

## Testing

### Page views (GA4)
- Open `https://hellolunr.com` in a browser. In DevTools **Network**, filter `gtag`
  and `collect` — you should see a request to `googletagmanager.com/gtag/js` and a
  `g/collect` (or `/collect`) hit.
- In GA4 → **Reports → Realtime**, confirm your visit appears within ~30s.

### Custom events
- On the landing page, enter a valid email and submit the waitlist form.
- Network: look for `collect` requests with `en=signup_started` and `en=waitlist_signup`.
- GA4 → **Realtime → Event count by Event name** should show `signup_started` and
  `waitlist_signup`. (Mark `waitlist_signup` as a Key Event/Conversion in
  **Admin → Events** to track it as a conversion.)
- You can also run `window.trackEvent('test_event', { foo: 'bar' })` in the console.

### Clarity recordings
- Browse the site for ~30–60s.
- Clarity dashboard → your project → **Recordings**. Sessions appear after a short
  delay (minutes). **Heatmaps** populate once enough traffic accrues.
- Confirm the tag loaded: Network shows `clarity.ms/tag/<PROJECT_ID>`.

### "Loads nothing when unset"
- With env vars blank, `dist/analytics-config.js` contains `null` values; no GA or
  Clarity request is made and the console stays clean. `window.trackEvent(...)` is a
  safe no-op.

### Search Console readiness
- `https://hellolunr.com/robots.txt` returns the policy + sitemap line.
- `https://hellolunr.com/sitemap.xml` returns valid XML with both URLs.
- View source on `/` → confirm `<link rel="canonical">`, `<meta name="description">`,
  Open Graph tags, and the Organization JSON-LD are present.

---

## Events reference

| Event | Where it fires | Status |
|---|---|---|
| `page_view` | Automatic on every page (GA4 `config`) | ✅ implemented |
| `signup_started` | Waitlist form submit with a valid email | ✅ implemented |
| `waitlist_signup` | Waitlist Formspree submission succeeds (also = `signup_completed`) | ✅ implemented |
| `signup_completed` | — | ↳ same action as `waitlist_signup`; not fired separately |
| `contact_form_submit` | No contact form exists (only a mailto link) | ⚠️ not present |
| `book_call_click` | No booking UI exists | ⚠️ not present |
| `demo_click` | No demo UI exists | ⚠️ not present |
| `pricing_view` | No pricing section/page exists | ⚠️ not present |
| `connect_meta_click` | No "connect Meta" UI exists (Adara app not on this site) | ⚠️ not present |

To add any "not present" event later: build the real UI, then call
`window.trackEvent('<event_name>', { ...params })` from its handler.
