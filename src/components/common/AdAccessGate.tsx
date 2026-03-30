'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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

export function AdAccessGate() {
  const baitRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const [gateReason, setGateReason] = useState<GateReason>(null);
  const [hasConsent, setHasConsent] = useState(false);
  const [adsenseStatus, setAdsenseStatus] = useState<'idle' | 'loaded' | 'failed'>('idle');
  const isAllowedWithoutAds =
    pathname === '/info/personvern' || pathname === '/vilkar';

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

  useEffect(() => {
    if (!hasConsent) {
      return;
    }

    let cancelled = false;

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

    const runCheck = () => {
      if (cancelled) {
        return;
      }

      if (adsenseStatus === 'failed' || isBaitBlocked()) {
        setGateReason('adblock');
        return;
      }

      if (adsenseStatus === 'loaded' && Array.isArray(window.adsbygoogle)) {
        setGateReason(null);
      }
    };

    const timeouts = [1200, 2500, 4000].map((delay) =>
      window.setTimeout(runCheck, delay)
    );

    return () => {
      cancelled = true;
      timeouts.forEach((timeout) => window.clearTimeout(timeout));
    };
  }, [adsenseStatus, hasConsent]);

  const retryAdCheck = () => {
    setAdsenseStatus(Array.isArray(window.adsbygoogle) ? 'loaded' : 'idle');

    window.setTimeout(() => {
      const baitBlocked =
        baitRef.current &&
        (window.getComputedStyle(baitRef.current).display === 'none' ||
          window.getComputedStyle(baitRef.current).visibility === 'hidden' ||
          baitRef.current.offsetHeight === 0 ||
          baitRef.current.offsetWidth === 0);

      if (baitBlocked || !Array.isArray(window.adsbygoogle)) {
        setGateReason('adblock');
        return;
      }

      setGateReason(null);
    }, 300);
  };

  if (!gateReason || isAllowedWithoutAds) {
    return hasConsent ? (
      <div
        ref={baitRef}
        aria-hidden="true"
        className="adsbox ad-banner ad-unit ad-placement pointer-events-none fixed -left-[9999px] top-0 h-12 w-12 opacity-0"
      />
    ) : null;
  }

  return (
    <>
      {hasConsent ? (
        <div
          ref={baitRef}
          aria-hidden="true"
          className="adsbox ad-banner ad-unit ad-placement pointer-events-none fixed -left-[9999px] top-0 h-12 w-12 opacity-0"
        />
      ) : null}
      <div className="fixed inset-0 z-[70] bg-background/96 backdrop-blur-sm">
        <div className="flex min-h-screen items-center justify-center p-6">
          <div className="w-full max-w-xl rounded-3xl border border-border bg-card p-8 text-center shadow-2xl">
            <ShieldAlert className="mx-auto h-12 w-12 text-primary" />
            <h2 className="mt-4 text-3xl font-bold font-headline text-foreground">
              GameNight lever av annonser
            </h2>
            {gateReason === 'consent' ? (
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                For å holde GameNight gratis trenger vi annonseinntekter. Derfor
                må annonser og måling være aktivert for å bruke tjenesten. Når du
                godkjenner, hjelper du oss å holde spillene åpne, gratis og i live.
              </p>
            ) : (
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Det ser ut som en annonseblokker stopper annonsene våre. GameNight
                driftes av reklameinntekter, og uten dem blir det vanskelig å holde
                tjenesten gratis og tilgjengelig for alle.
              </p>
            )}
            <p className="mt-3 text-sm text-muted-foreground">
              Takk for at du hjelper oss å holde GameNight i gang.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              {gateReason === 'consent' ? (
                <Button onClick={grantCookieConsent} size="lg">
                  Godta annonser og fortsett
                </Button>
              ) : (
                <Button onClick={retryAdCheck} size="lg">
                  Jeg har skrudd av adblock
                </Button>
              )}
              <Button variant="outline" size="lg" asChild>
                <Link href="/info/personvern">Les om personvern</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
