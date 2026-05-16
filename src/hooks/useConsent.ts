import { useEffect, useState, useCallback } from "react";

export type ConsentStatus = "pending" | "accepted" | "rejected";

const STORAGE_KEY = "convertanyfile_consent_v1";

/**
 * useConsent
 * Manages user's cookie / advertising consent state.
 *
 * - "pending" — user hasn't decided (default on first visit)
 * - "accepted" — user clicked "Accept All" — ads + consent cookies allowed
 * - "rejected" — user clicked "Reject All" — no ads loaded
 *
 * Stored in localStorage so the choice persists across sessions.
 * This is the ONLY thing we store on the user's device. Files themselves
 * still never leave the browser.
 */
export function useConsent() {
  const [consent, setConsentState] = useState<ConsentStatus>("pending");
  const [isLoaded, setIsLoaded] = useState(false);

  // Read initial value from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "accepted" || stored === "rejected") {
        setConsentState(stored);
      }
    } catch {
      // localStorage blocked (private mode, etc.) — leave as pending
    }
    setIsLoaded(true);
  }, []);

  // Listen for consent changes from other tabs
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        if (e.newValue === "accepted" || e.newValue === "rejected") {
          setConsentState(e.newValue);
        } else if (e.newValue === null) {
          setConsentState("pending");
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setConsent = useCallback((value: "accepted" | "rejected") => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // ignore
    }
    setConsentState(value);
  }, []);

  const revokeConsent = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setConsentState("pending");
  }, []);

  return { consent, setConsent, revokeConsent, isLoaded };
}
