import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";
import { PAGES, SITE_NAME, canonicalUrl, buildJsonLd, type PageSeo } from "./src/seo/pages";

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * Static markup placed inside #root so crawlers see real content without
 * running JavaScript. React replaces it on load with the same content.
 */
function renderStaticBody(page: PageSeo): string {
  const nav = PAGES.filter((p) => p.guide || p.path === "/")
    .map((p) => `<a href="${p.path}">${escapeHtml(p.guide?.toolName ?? "Home")}</a>`)
    .join(" · ");

  let guide = "";
  if (page.guide) {
    const g = page.guide;
    guide = `
      <h2 class="text-xl font-bold">${escapeHtml(g.howToTitle)}</h2>
      <ol>${g.steps.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ol>
      <h2 class="text-xl font-bold">${escapeHtml(g.featuresTitle)}</h2>
      <ul>${g.features.map((f) => `<li>${escapeHtml(f)}</li>`).join("")}</ul>
      <h2 class="text-xl font-bold">Frequently asked questions</h2>
      ${g.faqs.map((f) => `<h3 class="font-semibold">${escapeHtml(f.q)}</h3><p class="text-muted-foreground">${escapeHtml(f.a)}</p>`).join("")}`;
  }

  return `
    <div class="container mx-auto px-4 py-12 max-w-3xl space-y-4">
      <nav class="text-sm text-muted-foreground">${nav}</nav>
      <h1 class="text-3xl font-bold">${escapeHtml(page.h1)}</h1>
      <p class="text-muted-foreground">${escapeHtml(page.intro)}</p>
      ${guide}
    </div>`;
}

function replaceOnce(html: string, pattern: RegExp, replacement: string): string {
  if (!pattern.test(html)) throw new Error(`[prerender] Pattern not found in index.html: ${pattern}`);
  return html.replace(pattern, replacement);
}

function renderPage(template: string, page: PageSeo): string {
  const title = escapeHtml(page.title);
  const description = escapeHtml(page.description);
  const url = canonicalUrl(page.path);
  let html = template;

  html = replaceOnce(html, /<title>[^<]*<\/title>/, `<title>${title}</title>`);
  html = replaceOnce(html, /(<meta name="description" content=")[^"]*(")/, `$1${description}$2`);
  html = replaceOnce(html, /(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`);
  html = replaceOnce(html, /(<meta property="og:title" content=")[^"]*(")/, `$1${title}$2`);
  html = replaceOnce(html, /(<meta property="og:description" content=")[^"]*(")/, `$1${description}$2`);
  html = replaceOnce(html, /(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`);
  html = replaceOnce(html, /(<meta name="twitter:title" content=")[^"]*(")/, `$1${title}$2`);
  html = replaceOnce(html, /(<meta name="twitter:description" content=")[^"]*(")/, `$1${description}$2`);

  const jsonLd = buildJsonLd(page);
  if (jsonLd.length > 0) {
    const script = `<script type="application/ld+json" id="route-jsonld">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>`;
    html = replaceOnce(html, /<\/head>/, `    ${script}\n  </head>`);
  }

  html = replaceOnce(html, /<div id="root"><\/div>/, `<div id="root">${renderStaticBody(page)}</div>`);
  return html;
}

/**
 * After the build, write one HTML file per route (e.g. dist/split-pdf.html)
 * with that page's title, description, canonical and content. Cloudflare
 * serves /split-pdf from split-pdf.html; other URLs still fall back to
 * index.html via public/_redirects.
 */
function prerenderRoutes(): Plugin {
  let outDir = "dist";
  return {
    name: "prerender-routes",
    apply: "build",
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const indexPath = path.join(outDir, "index.html");
      const template = fs.readFileSync(indexPath, "utf-8");

      for (const page of PAGES) {
        const file = page.path === "/" ? "index.html" : `${page.path.slice(1)}.html`;
        fs.writeFileSync(path.join(outDir, file), renderPage(template, page));
      }
      console.log(`[prerender] Wrote ${PAGES.length} pages for ${SITE_NAME}`);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger(), prerenderRoutes()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
