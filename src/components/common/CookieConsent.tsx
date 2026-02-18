'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Cookie } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const COOKIE_CONSENT_KEY = 'gamenight_cookie_consent';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // We only want this to run on the client
    if (typeof window !== 'undefined') {
      try {
        const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
        if (consent !== 'true') {
          setIsVisible(true);
        }
      } catch (error) {
        console.error("Could not access localStorage. Showing cookie banner.", error);
        setIsVisible(true);
      }
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    } catch (error) {
      console.error("Could not save cookie consent to localStorage.", error);
    }
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: '0%' }}
          exit={{ y: '100%' }}
          transition={{ type: 'tween', ease: 'easeInOut' }}
          className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-card/80 p-4 shadow-2xl backdrop-blur-lg"
        >
          <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <Cookie className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p>
                Vi bruker informasjonskapsler (cookies) for å forbedre opplevelsen din og vise
                relevante annonser. Ved å fortsette godtar du vår bruk av cookies.
              </p>
            </div>
            <div className="flex flex-shrink-0 gap-2">
              <Button onClick={handleAccept} size="sm">
                Jeg forstår
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/info/personvern">Les mer</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
