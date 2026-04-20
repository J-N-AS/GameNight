'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';
import {
  ADSENSE_SCRIPT_FAILED_EVENT,
  ADSENSE_SCRIPT_LOADED_EVENT,
  COOKIE_CONSENT_UPDATED_EVENT,
  grantCookieConsent,
  hasCookieConsent,
} from '@/lib/consent';

type GateReason = 'consent' | 'adblock' | null;

type TrackingWindow = Window & {
  gtag?: (...args: unknown[]) => void;
};

export function AdAccessGate() {
  const baitRef = useRef<HTMLDivElement | null>(null);
  const [gateReason, setGateReason] = useState<GateReason>(null);
  const [hasConsent, setHasConsent] = useState(false);
  const [adsenseStatus, setAdsenseStatus] = useState<'idle' | 'loaded' | 'failed'>('idle');

  useEffect(() => {
    const syncConsent = () => {
      const consent = hasCookieConsent();
      setHasConsent(consent);
      setGateReason(consent ? null : 'consent');

      if (!consent) {
        setAdsenseStatus('idle');
      }
    };

    const handleAdsenseLoaded = () => setAdsenseStatus('loaded');
    const handleAdsenseFailed = () => setAdsenseStatus('failed');

    syncConsent();
    window.addEventListener(COOKIE_CONSENT_UPDATED_EVENT, syncConsent);
    window.addEventListener(ADSENSE_SCRIPT_LOADED_EVENT, handleAdsenseLoaded);
    window.addEventListener(ADSENSE_SCRIPT_FAILED_EVENT, handleAdsenseFailed);

    return () => {
      window.removeEventListener(COOKIE_CONSENT_UPDATED_EVENT, syncConsent);
      window.removeEventListener(ADSENSE_SCRIPT_LOADED_EVENT, handleAdsenseLoaded);
      window.removeEventListener(ADSENSE_SCRIPT_FAILED_EVENT, handleAdsenseFailed);
    };
  }, []);

  const isBaitBlocked = () => {
    if (!baitRef.current) {
      return false;
    }

    const styles = window.getComputedStyle(baitRef.current);

    return (
      styles.display === 'none' ||
      styles.visibility === 'hidden' ||
      baitRef.current.offsetHeight === 0 ||
      baitRef.current.offsetWidth === 0
    );
  };

  const shouldShowAdblockBanner = () => {
    if (!hasConsent) {
      return false;
    }

    return isBaitBlocked();
  };

  useEffect(() => {
    if (!hasConsent) {
      return;
    }

    let cancelled = false;

    const runCheck = () => {
      if (cancelled) {
        return;
      }

      if (shouldShowAdblockBanner()) {
        setGateReason('adblock');
        return;
      }

      if (
        adsenseStatus === 'loaded' ||
        adsenseStatus === 'failed' ||
        Array.isArray(window.adsbygoogle)
      ) {
        setGateReason(null);
      }
    };

    const timeouts = [1200, 2500, 4000].map((delay) => window.setTimeout(runCheck, delay));

    return () => {
      cancelled = true;
      timeouts.forEach((timeout) => window.clearTimeout(timeout));
    };
  }, [adsenseStatus, hasConsent]);

  const retryAdCheck = () => {
    setAdsenseStatus(Array.isArray(window.adsbygoogle) ? 'loaded' : 'idle');

    window.setTimeout(() => {
      if (shouldShowAdblockBanner()) {
        setGateReason('adblock');
        return;
      }

      setGateReason(null);
    }, 300);
  };

  const trackSoftConsentAccepted = () => {
    if (!hasCookieConsent()) {
      return;
    }

    let tracked = false;
    const sendTracking = () => {
      if (tracked || !hasCookieConsent()) {
        return;
      }

      const trackingWindow = window as TrackingWindow;
      if (typeof trackingWindow.gtag !== 'function') {
        return;
      }

      trackingWindow.gtag('event', 'soft_ad_consent_granted', {
        event_category: 'consent',
        event_label: 'ad_access_gate_banner',
      });
      tracked = true;
    };

    [0, 600, 1600].forEach((delay) => {
      window.setTimeout(sendTracking, delay);
    });
  };

  const handleConsentClick = () => {
    grantCookieConsent();
    trackSoftConsentAccepted();
  };

  const bannerPlacementClass = gateReason === 'consent' ? 'top-0' : 'bottom-0';

  return (
    <>
      {hasConsent ? (
        <div
          ref={baitRef}
          aria-hidden="true"
          className="adsbox ad-banner ad-unit ad-placement pointer-events-none fixed -left-[9999px] top-0 h-12 w-12 opacity-0"
        />
      ) : null}
      {gateReason ? (
        <div
          className={`fixed inset-x-0 ${bannerPlacementClass} z-50 border-border bg-card/95 p-3 shadow-lg backdrop-blur`}
        >
          <div className="mx-auto flex w-full max-w-5xl flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              {gateReason === 'consent' ? (
                <p className="text-sm leading-6 text-muted-foreground">
                  GameNight holdes gratis med annonser. Du kan fortsatt spille uten samtykke,
                  men frivillig samtykke til annonser og måling hjelper oss å holde tjenesten i
                  gang.
                </p>
              ) : (
                <p className="text-sm leading-6 text-muted-foreground">
                  Det ser ut som adblock skjuler annonsene våre. Du kan fortsatt bruke GameNight
                  som normalt, men å tillate annonser støtter videre drift av tjenesten.
                </p>
              )}
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              {gateReason === 'consent' ? (
                <Button onClick={handleConsentClick} size="sm" className="w-full sm:w-auto">
                  Samtykk og støtt GameNight
                </Button>
              ) : (
                <Button onClick={retryAdCheck} size="sm" className="w-full sm:w-auto">
                  Oppdater etter adblock-endring
                </Button>
              )}
              <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
                <Link href="/info/personvern">Les om personvern</Link>
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
