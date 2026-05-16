import { useEffect, useRef } from "react";
import { useConsent } from "@/hooks/useConsent";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdSlotProps {
  /** AdSense ad slot ID (from your AdSense dashboard) */
  slot: string;
  /** Layout key for in-feed / in-article ads (optional) */
  layout?: string;
  /** Ad format: 'auto' is fluid responsive */
  format?: "auto" | "rectangle" | "vertical" | "horizontal";
  /** Whether ad should be full-width responsive */
  responsive?: boolean;
  /** Optional className for the outer wrapper */
  className?: string;
  /** Optional inline style */
  style?: React.CSSProperties;
}

/**
 * AdSlot
 * Renders a Google AdSense ad unit.
 *
 * Behavior:
 *  - Renders NOTHING unless VITE_ADSENSE_CLIENT env var is set
 *  - Renders NOTHING unless user has given consent
 *  - Renders NOTHING in development mode (avoids invalid traffic flags)
 *
 * To activate:
 *  1. Set VITE_ADSENSE_CLIENT in .env (e.g. ca-pub-1234567890123456)
 *  2. Set the slot prop to your ad unit ID
 *  3. Add the AdSense script to index.html (done automatically)
 */
export const AdSlot = ({
  slot,
  layout,
  format = "auto",
  responsive = true,
  className = "",
  style,
}: AdSlotProps) => {
  const { consent } = useConsent();
  const insRef = useRef<HTMLModElement | null>(null);
  const hasInitialized = useRef(false);

  const clientId = import.meta.env.VITE_ADSENSE_CLIENT as string | undefined;
  const isProduction = import.meta.env.PROD;

  useEffect(() => {
    if (!clientId) return;
    if (consent !== "accepted") return;
    if (!isProduction) return;
    if (hasInitialized.current) return;
    if (!insRef.current) return;

    try {
      // Push to adsbygoogle queue. Script tag in index.html will pick it up.
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      hasInitialized.current = true;
    } catch (err) {
      console.warn("[AdSlot] adsbygoogle push failed:", err);
    }
  }, [clientId, consent, isProduction]);

  // Don't render anything if we shouldn't show ads
  if (!clientId) {
    return null;
  }
  if (consent !== "accepted") {
    return null;
  }
  if (!isProduction) {
    // In dev mode, render a clearly-marked placeholder so you can see
    // where ads WILL appear without triggering "invalid traffic" flags
    return (
      <div
        className={`flex items-center justify-center bg-muted/30 border border-dashed border-muted-foreground/30 rounded-lg text-xs text-muted-foreground py-3 px-4 ${className}`}
        style={style}
      >
        Ad placeholder (slot: {slot}) — only visible in production
      </div>
    );
  }

  return (
    <div className={className} style={style}>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-layout={layout}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
};
