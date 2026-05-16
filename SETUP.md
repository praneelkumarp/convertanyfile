# ConvertAnyFile — Launch-Ready Setup

This is the launch-ready version of ConvertAnyFile. Ship target: within 7 days.

---

## Quick Start

1. Extract this zip to your project location
2. `cd convertanyfile`
3. `bun install` (or `npm install`)
4. `bun dev`
5. Open http://localhost:8080

---

## What's New In This Version

Compared to the previous complete zip:

### New / improved
- **Mobile-responsive Header** with hamburger menu (was a fixed wide nav)
- **Footer** added across all pages (was missing entirely)
- **Mobile-friendly Consent Banner** — collapsed strip on phones, expands on tap
- **Contact page** (`/contact`) — email, social links, what to reach out about
- **Terms of Service page** (`/terms`) — template with bracketed sections for you to fill
- **Improved About page** with founder section, values, CTA
- **Stronger neon hero** with decorative gradient orbs
- **Mobile fixes everywhere** — 44px touch targets, responsive padding, smaller fonts on small screens
- **Updated sitemap.xml** to include new pages

### Removed false claims
- Home page no longer says "Works Offline" (you don't have a service worker)
- Cleaned up vague feature copy

---

## YOUR LAUNCH CHECKLIST

### Required before launch (do these — they're in the code with `[BRACKETED]` or `TODO` markers)

#### 1. Personalize the About page (~15 min)
- Open `src/pages/About.tsx`
- Find the comment `{/* TODO: Praneel — expand this section in your own words. */}`
- Write your founder story in your own voice (just 2-3 paragraphs)

#### 2. Fill in Contact page (~5 min)
- Open `src/pages/Contact.tsx`
- Find `hello@convertanyfile.co` and replace with your real email
- Update social media handles (currently `@convertanyfile` placeholders)
- Update social link URLs (currently `https://twitter.com/` etc.)

#### 3. Fill in Terms of Service (~10 min)
- Open `src/pages/Terms.tsx`
- Search for all `[BRACKETED_TEXT]` and replace:
  - `[LAUNCH_DATE]` — e.g. "15 May 2026"
  - `[JURISDICTION — ...]` — your suggested text already in there
  - `[YOUR_EMAIL]` — your support email

#### 4. Update Footer social links (~5 min)
- Open `src/components/Footer.tsx`
- Replace placeholder URLs (`https://twitter.com/`, etc.) with your real profiles

#### 5. Replace OG image (~30 min)
- The current `index.html` points to `https://lovable.dev/opengraph-image-p98pqg.png`
- Create a 1200×630 image in Canva (free templates available — search "OG image")
- Save it as `public/og-image.png`
- Update `index.html`: replace both `og:image` and `twitter:image` content URLs with `https://convertanyfile.co/og-image.png`

#### 6. Update meta title and description (optional, ~5 min)
- `index.html` — already has decent meta tags but feel free to tweak

### After launch (do over the next 2-4 weeks)

- Write 3-5 blog posts (deferred per our discussion)
- Build out a /blog or /guides section
- Apply for AdSense once you have content and ~1000 visitors
- Get feedback from real users
- Iterate based on what they say

---

## Deployment Quick Guide

Recommended: **Vercel** or **Netlify** (both free for small sites).

### Vercel (5 minutes)
1. Push your project to GitHub
2. Go to vercel.com → New Project → Import your repo
3. Vite is auto-detected, click Deploy
4. Add custom domain in Settings → Domains

### Netlify (5 minutes)
1. Push your project to GitHub
2. Go to netlify.com → Add new site → Import existing project
3. Build command: `bun run build` (or `npm run build`)
4. Publish directory: `dist`
5. Add custom domain in Domain settings

### Cloudflare Pages (also great)
Similar flow, slight performance edge for Indian traffic.

---

## Things Already Working

- All file conversions (PDF→Images/Text, DOCX→HTML/Text/PDF, Image conversions, XLSX→CSV, ZIP extract)
- The DOCX→HTML route with the "Print to PDF" button (your best DOCX→PDF path)
- Cookie consent banner (GDPR/DPDP compliant)
- AdSense placeholder integration (will work the moment you set env vars + get AdSense approval)
- ads.txt template
- robots.txt with sitemap reference
- Privacy policy with honest advertising disclosure
- All routes (`/`, `/convert`, `/about`, `/privacy`, `/contact`, `/terms`)

---

## Things Intentionally Deferred (don't add yet)

These were discussed and explicitly deferred:

- Batch upload — add only if users request
- Conversion history — adds storage complexity
- Dark/light mode toggle — site is already dark, add later
- PPTX support — no reliable client-side library exists yet
- OCR — Tesseract.js is heavy (10MB+), niche use case
- File compression — research project
- Blog section — write content over the next month, then enable
- Real AdSense activation — needs traffic + content first

If a user later asks for any of these, you'll have validation it's worth building.

---

## Verification Checklist (After `bun dev`)

Test these on both desktop AND mobile (use Chrome DevTools mobile mode at minimum):

- [ ] Home page loads with hero + features + CTA
- [ ] On mobile, hamburger menu opens and closes
- [ ] Footer appears at bottom of every page
- [ ] Consent banner appears on first visit; compact on mobile
- [ ] Click "Accept All" → banner hides → refresh page → still hidden
- [ ] Convert page: upload a DOCX → see 3 options + amber warning on PDF
- [ ] Drag and drop a file onto upload widget — works
- [ ] About page renders, with founder section
- [ ] Contact page renders with your email visible
- [ ] Terms page renders with bracketed sections clearly marked
- [ ] Privacy page renders with the Revoke Consent button
- [ ] 404 page works (visit `/random-path`)
- [ ] No console errors (F12 → Console)

---

## Honest Reality Check

This is a real product that's ready to ship. The remaining work is content (your words) and personalization (your contact details, your social links). The code is in good shape.

After launch, **resist the urge to keep building features in isolation**. Wait for actual users to tell you what they need. Then build that.

Good luck.

— Neo
