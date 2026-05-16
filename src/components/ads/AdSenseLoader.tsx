import { useEffect } from "react";
import { useConsent } from "@/hooks/useConsent";

const SCRIPT_ID = "adsbygoogle-js";

/**
 * AdSenseLoader
 * Dynamically loads the Google AdSense script ONLY after user consent.
 * Renders nothing visible.
 *
 * This is preferred over hardcoding the script in index.html because:
 *  - No cookies are set before consent (GDPR/DPDP compliant)
 *  - No tracking until user opts in
 *  - The script is only loaded once
 */
export const AdSenseLoader = () => {
  const { consent } = useConsent();
  const clientId = import.meta.env.VITE_ADSENSE_CLIENT as string | undefined;
  const isProduction = import.meta.env.PROD;

  useEffect(() => {
    if (!clientId) return;
    if (consent !== "accepted") return;
    if (!isProduction) return;

    // Don't load twice
    if (document.getElementById(SCRIPT_ID)) return;

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
    document.head.appendChild(script);
  }, [clientId, consent, isProduction]);

  return null;
};
