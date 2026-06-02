# LUNR Website Deployment Guide

## Folder Structure

Deploy this folder:

```text
lunr-website/
  index.html
  LUNR_WHITE.png
  DEPLOYMENT_GUIDE.md
```

## Upload to GitHub

```bash
cd /Users/cnkbat/Desktop/LUNR/Website/lunr-website
git init
git add index.html LUNR_WHITE.png DEPLOYMENT_GUIDE.md
git commit -m "Prepare LUNR landing page for deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/lunr-website.git
git push -u origin main
```

Replace `YOUR_USERNAME` and the repository URL with your actual GitHub repo.

## Deploy on Vercel

1. Go to Vercel.
2. Click `Add New Project`.
3. Import the GitHub repository.
4. Use these settings:
   - Framework preset: `Other`
   - Build command: leave empty
   - Output directory: leave empty
5. Click `Deploy`.

## Connect GoDaddy Domain

1. Open the Vercel project.
2. Go to `Settings > Domains`.
3. Add your root domain, for example `yourdomain.com`.
4. Add the `www` version too, for example `www.yourdomain.com`.
5. Choose which one should be primary. Vercel commonly recommends using `www` as primary and redirecting the root domain to it.

## GoDaddy DNS Records

Use the exact DNS values Vercel shows in your project dashboard. The common Vercel records are:

```text
Type: A
Host: @
Value: 76.76.21.21
```

```text
Type: CNAME
Host: www
Value: cname.vercel-dns-0.com
```

In GoDaddy:

1. Go to your domain.
2. Open `DNS Management`.
3. Remove conflicting old records for `@` and `www`.
4. Add the Vercel `A` record for `@`.
5. Add the Vercel `CNAME` record for `www`.
6. Keep email-related records like `MX` and email `TXT` records if you use domain email.

## Confirm HTTPS / SSL

1. Wait for DNS propagation.
2. In Vercel, check `Settings > Domains`.
3. The domain should show as configured.
4. Visit:

```text
https://yourdomain.com
https://www.yourdomain.com
```

5. Confirm the browser shows the lock icon.

Vercel automatically provisions SSL after DNS verification succeeds.

