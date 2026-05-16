import { useState } from "react";
import { Link } from "react-router-dom";
import { useConsent } from "@/hooks/useConsent";
import { Button } from "@/components/ui/button";
import { Shield, ChevronUp } from "lucide-react";

/**
 * ConsentBanner
 * Bottom-anchored cookie consent banner. Only renders when consent is "pending".
 * - Mobile: compact one-line strip that can be expanded for details
 * - Desktop: full card with description visible
 */
export const ConsentBanner = () => {
  const { consent, setConsent, isLoaded } = useConsent();
  const [expanded, setExpanded] = useState(false);

  if (!isLoaded) return null;
  if (consent !== "pending") return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 p-2 sm:p-4 pointer-events-none"
      role="dialog"
      aria-labelledby="consent-banner-title"
    >
      <div className="max-w-4xl mx-auto pointer-events-auto">
        <div className="bg-card border border-border rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-5 md:p-6">
          {/* Mobile: collapsed view */}
          <div className="sm:hidden">
            {!expanded ? (
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setExpanded(true)}
                  className="flex items-center gap-2 flex-1 text-left min-h-[44px]"
                >
                  <Shield className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-xs font-medium">
                    Cookies & Ads — Your choice
                  </span>
                  <ChevronUp className="h-3 w-3 text-muted-foreground" />
                </button>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs px-3 min-h-[40px]"
                    onClick={() => setConsent("rejected")}
                  >
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    className="text-xs px-3 min-h-[40px] bg-primary hover:bg-primary/90"
                    onClick={() => setConsent("accepted")}
                  >
                    Accept
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 id="consent-banner-title" className="font-semibold text-sm mb-1">
                      Your files stay private. Your choice matters.
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Files are processed on your device only. To keep this tool free, we display
                      ads via Google AdSense, which uses cookies.{" "}
                      <Link to="/privacy" className="underline text-primary">
                        Privacy Policy
                      </Link>
                      .
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    className="min-h-[40px]"
                    onClick={() => setConsent("rejected")}
                  >
                    Reject All
                  </Button>
                  <Button
                    size="sm"
                    className="min-h-[40px] bg-primary hover:bg-primary/90"
                    onClick={() => setConsent("accepted")}
                  >
                    Accept All
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Desktop: full view */}
          <div className="hidden sm:flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="shrink-0 p-2 rounded-full bg-primary/10 text-primary">
                <Shield className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-foreground">
                  Your files stay private. Your choice matters.
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Files are always processed on your device and never uploaded.
                  To keep this tool free, we display ads via Google AdSense, which uses cookies.
                  You can accept, reject, or read more in our{" "}
                  <Link to="/privacy" className="underline text-primary hover:text-primary/80">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConsent("rejected")}
              >
                Reject All
              </Button>
              <Button
                size="sm"
                onClick={() => setConsent("accepted")}
                className="bg-primary hover:bg-primary/90"
              >
                Accept All
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
