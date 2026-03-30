'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Megaphone } from 'lucide-react';
import { COOKIE_CONSENT_KEY, GOOGLE_ADSENSE_CLIENT_ID } from '@/lib/consent';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export function AdBanner({ className }: { className?: string }) {
  const adRef = useRef<HTMLModElement | null>(null);
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    try {
      setHasConsent(window.localStorage.getItem(COOKIE_CONSENT_KEY) === 'true');
    } catch {
      setHasConsent(false);
    }
  }, []);

  useEffect(() => {
    if (!hasConsent || !adRef.current) {
      return;
    }

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('Could not initialize AdSense banner.', error);
    }
  }, [hasConsent]);

  if (!hasConsent) {
    return (
      <div
        className={cn(
          'flex w-full max-w-lg select-none items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 p-4 text-center text-muted-foreground',
          className
        )}
      >
        <div className="flex flex-col items-center gap-2">
          <Megaphone className="h-6 w-6" />
          <p className="text-sm font-semibold uppercase tracking-wider">
            Annonse
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'w-full max-w-lg overflow-hidden rounded-lg border border-border/60 bg-card/40 p-2',
        className
      )}
    >
      <ins
        ref={adRef}
        className="adsbygoogle block w-full"
        style={{ display: 'block' }}
        data-ad-client={GOOGLE_ADSENSE_CLIENT_ID}
        data-ad-slot="7707653172"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
