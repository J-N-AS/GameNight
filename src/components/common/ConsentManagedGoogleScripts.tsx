'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import {
  ADSENSE_SCRIPT_FAILED_EVENT,
  ADSENSE_SCRIPT_LOADED_EVENT,
  COOKIE_CONSENT_UPDATED_EVENT,
  GOOGLE_ADSENSE_CLIENT_ID,
  GOOGLE_ANALYTICS_ID,
  hasCookieConsent,
} from '@/lib/consent';

export function ConsentManagedGoogleScripts() {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    const syncConsent = () => {
      setHasConsent(hasCookieConsent());
    };

    syncConsent();
    window.addEventListener(COOKIE_CONSENT_UPDATED_EVENT, syncConsent);

    return () => {
      window.removeEventListener(COOKIE_CONSENT_UPDATED_EVENT, syncConsent);
    };
  }, []);

  if (!hasConsent) {
    return null;
  }

  return (
    <>
      <Script
        id="google-adsense"
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${GOOGLE_ADSENSE_CLIENT_ID}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
        onLoad={() => window.dispatchEvent(new Event(ADSENSE_SCRIPT_LOADED_EVENT))}
        onError={() => window.dispatchEvent(new Event(ADSENSE_SCRIPT_FAILED_EVENT))}
      />
      <Script
        id="google-analytics"
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics-config" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = window.gtag || gtag;
          gtag('js', new Date());
          gtag('config', '${GOOGLE_ANALYTICS_ID}');
        `}
      </Script>
    </>
  );
}
