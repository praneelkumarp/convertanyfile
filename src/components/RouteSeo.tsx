import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getPageSeo, canonicalUrl, buildJsonLd, SITE_NAME } from "@/seo/pages";

const JSON_LD_ID = "route-jsonld";

function setMeta(selector: string, attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

/**
 * Keeps <title>, meta description, canonical, social tags and JSON-LD in sync
 * with the current route. The prerendered HTML already has the right tags for
 * the first load; this handles in-app navigation.
 */
export const RouteSeo = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const page = getPageSeo(pathname);
    const robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');

    if (!page) {
      document.title = `Page not found – ${SITE_NAME}`;
      setMeta('meta[name="robots"]', "name", "robots", "noindex");
      document.getElementById(JSON_LD_ID)?.remove();
      return;
    }

    robots?.remove();
    const url = canonicalUrl(page.path);

    document.title = page.title;
    setMeta('meta[name="description"]', "name", "description", page.description);
    setMeta('meta[property="og:title"]', "property", "og:title", page.title);
    setMeta('meta[property="og:description"]', "property", "og:description", page.description);
    setMeta('meta[property="og:url"]', "property", "og:url", url);
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", page.title);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", page.description);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;

    document.getElementById(JSON_LD_ID)?.remove();
    const jsonLd = buildJsonLd(page);
    if (jsonLd.length > 0) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = JSON_LD_ID;
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
  }, [pathname]);

  return null;
};
