'use client';

import type { GameWarning } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface GameConsentScreenProps {
  warning: GameWarning;
  onConfirm: () => void;
}

export function GameConsentScreen({
  warning,
  onConfirm,
}: GameConsentScreenProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-destructive text-destructive-foreground p-4 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-2xl">
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2, duration: 0.5 }}
        >
            <AlertTriangle className="h-16 w-16 mx-auto mb-6" />
        </motion.div>

        <motion.h1 
            className="text-4xl font-bold mb-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
        >
            {warning.title}
        </motion.h1>

        <div className="space-y-4 text-base text-destructive-foreground/80 mb-8">
          {warning.description.map((line, index) => (
            <motion.p
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              {line}
            </motion.p>
          ))}
        </div>

        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
        >
            <Button
              onClick={onConfirm}
              size="lg"
              variant="outline"
              className="bg-destructive-foreground text-destructive hover:bg-destructive-foreground/90 h-14 text-lg transform transition-transform duration-200 hover:scale-105"
            >
              {warning.buttonText}
            </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
