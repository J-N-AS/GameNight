'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
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

export function PwaInstallPrompt() {
  const [installPromptEvent, setInstallPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setInstallPromptEvent(e as BeforeInstallPromptEvent);
      // Show the install button
      setIsVisible(true);
      console.log('beforeinstallprompt event fired');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPromptEvent) {
      return;
    }

    // Show the install prompt
    await installPromptEvent.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await installPromptEvent.userChoice;
    
    console.log(`User response to the install prompt: ${outcome}`);

    // We've used the prompt, and can't use it again, so clear it
    setInstallPromptEvent(null);
    setIsVisible(false);
  };
  
  if (!isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: '0%' }}
        exit={{ y: '100%' }}
        transition={{ type: 'tween', ease: 'easeInOut', delay: 2 }} // Delay to not be too aggressive
        className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 sm:bottom-6"
      >
        <Button onClick={handleInstallClick} size="lg" className="h-12 shadow-2xl shadow-primary/30 transform transition-transform duration-200 hover:scale-105">
          <Download className="mr-2 h-5 w-5" />
          Installer GameNight
        </Button>
      </motion.div>
    </AnimatePresence>
  );
}
