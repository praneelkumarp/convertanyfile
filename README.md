# ConvertAnyFile

Privacy-first universal file conversion platform. Convert PDFs, images, documents, and more — entirely in your browser. No uploads, no servers, no tracking of your files.

🌐 **Live site:** https://convertanyfile.co

## Features

- 🔒 **100% client-side** — files never leave your browser
- ⚡ **Fast** — no upload waits, conversion starts immediately
- 🎯 **Smart detection** — automatically detects file type via magic bytes
- 📦 **Batch ZIP** — multi-file results auto-bundled into ZIP downloads
- 🛡 **GDPR/DPDP compliant** — consent-gated advertising

## Supported Conversions

| From | To |
|------|-----|
| PDF | PNG / JPG / TXT |
| PNG | JPG / WEBP / PDF |
| JPG | PNG / WEBP / PDF |
| WEBP | PNG / JPG / PDF |
| DOCX | HTML / TXT / PDF |
| XLSX | CSV |
| ZIP | Extracted files |

## Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** TailwindCSS + ShadCN UI
- **Conversion libraries:** pdfjs-dist, pdf-lib, mammoth, docx-preview, html2canvas, xlsx, jszip
- **Monetization:** Google AdSense (consent-gated)

## Local Development

Requires Node.js 18+ or Bun.

```bash
# Install dependencies
bun install
# or: npm install

# Start dev server
bun dev
# or: npm run dev

# Build for production
bun run build
# or: npm run build

# Preview production build
bun preview
# or: npm run preview
```

The dev server runs at http://localhost:8080

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required for AdSense (optional in dev mode):

- `VITE_ADSENSE_CLIENT` — your AdSense publisher ID (e.g. `ca-pub-1234567890123456`)
- `VITE_ADSENSE_SLOT_HEADER` — ad slot ID for header ad unit

Ads are disabled in development mode and only load in production builds after user consent.

## Project Structure

```
src/
├── components/
│   ├── ads/                    # AdSense + consent banner
│   ├── ui/                     # ShadCN UI primitives
│   ├── ConversionOptions.tsx   # Conversion picker
│   ├── FileUploadWidget.tsx    # Drag-and-drop upload
│   └── ...
├── engines/                    # Pure client-side conversion engines
│   ├── pdfToImages.ts
│   ├── pdfToText.ts
│   ├── docxToPdf.ts
│   ├── docxToHtml.ts
│   ├── docxToText.ts
│   ├── imageToPdf.ts
│   ├── xlsxToCsv.ts
│   └── zipExtract.ts
├── hooks/
│   ├── useConsent.ts           # Cookie/ad consent state
│   └── ...
├── pages/                      # Route-level page components
├── utils/
│   ├── fileDetection.ts        # Magic-byte file type detection
│   ├── conversionMap.ts        # source → target conversion options
│   ├── clientConversions.ts    # Image conversion + ZIP download
│   └── download.ts
└── App.tsx                     # Root with router + consent + ads
```

## Privacy & Compliance

- Files are processed in the browser only
- AdSense scripts are NOT loaded until user clicks "Accept All" on consent banner
- See `/privacy` route for full disclosure
- Compliant with GDPR (EU) and DPDP Act 2023 (India)

## Deployment

This is a static SPA. Deploy to any static host: Vercel, Netlify, Cloudflare Pages, etc.

After deploying:
1. Verify `https://convertanyfile.co/ads.txt` is accessible
2. Verify `https://convertanyfile.co/sitemap.xml` is accessible
3. Submit your site to Google Search Console
4. Apply for AdSense once you have content

## License

Private project. © Praneel Kumar Peruru.
