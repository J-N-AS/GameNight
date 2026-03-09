'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// This is a simplified type, the actual event is more complex
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const INSTALL_PROMPT_DISMISSED_KEY = 'gamenight_install_prompt_dismissed_at';
const INSTALL_PROMPT_COOLDOWN_MS = 1000 * 60 * 60 * 24 * 7;

export function PwaInstallPrompt() {
  const [installPromptEvent, setInstallPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasDismissedRecently = () => {
      const dismissedAt = window.localStorage.getItem(
        INSTALL_PROMPT_DISMISSED_KEY
      );

      if (!dismissedAt) {
        return false;
      }

      return Date.now() - Number(dismissedAt) < INSTALL_PROMPT_COOLDOWN_MS;
    };

    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

    const isMobileSized = window.matchMedia('(max-width: 767px)').matches;
    const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();

      if (isStandalone || hasDismissedRecently() || (!isMobileSized && !hasCoarsePointer)) {
        return;
      }

      setInstallPromptEvent(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    const handleAppInstalled = () => {
      setInstallPromptEvent(null);
      setIsVisible(false);
      window.localStorage.removeItem(INSTALL_PROMPT_DISMISSED_KEY);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleDismiss = () => {
    window.localStorage.setItem(
      INSTALL_PROMPT_DISMISSED_KEY,
      String(Date.now())
    );
    setIsVisible(false);
  };

  const handleInstallClick = async () => {
    if (!installPromptEvent) {
      return;
    }

    await installPromptEvent.prompt();
    const choice = await installPromptEvent.userChoice;

    setInstallPromptEvent(null);
    setIsVisible(false);

    if (choice.outcome === 'dismissed') {
      handleDismiss();
    }
  };
  
  if (!isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: '0%', opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'tween', ease: 'easeInOut', delay: 1.5 }}
        className="fixed inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+0.75rem)] z-50 md:hidden"
      >
        <div className="mx-auto max-w-md rounded-2xl border border-border/70 bg-card/95 p-4 shadow-2xl backdrop-blur">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Valgfritt: legg GameNight på hjemskjermen
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Åpne raskere før vors, hyttetur eller når du skal dele til TV.
              </p>
            </div>

            <button
              type="button"
              onClick={handleDismiss}
              className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Skjul installprompt"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-11 flex-1"
              onClick={handleDismiss}
            >
              Ikke nå
            </Button>
            <Button
              type="button"
              onClick={handleInstallClick}
              className="h-11 flex-1"
            >
              <Download className="mr-2 h-4 w-4" />
              Legg til
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
