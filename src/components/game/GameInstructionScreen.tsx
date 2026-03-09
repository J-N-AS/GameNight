'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface GameInstructionScreenProps {
  icon: ReactNode;
  title: string;
  description: string;
  buttonText: string;
  onConfirm: () => void;
}

export function GameInstructionScreen({ icon, title, description, buttonText, onConfirm }: GameInstructionScreenProps) {
  return (
    <motion.div
      className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-md rounded-2xl border border-border/70 bg-card/70 p-6 shadow-xl backdrop-blur-sm">
        <motion.div
          className="mb-6 flex justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2, duration: 0.5 }}
        >
          {icon}
        </motion.div>
        
        <motion.h1
          className="mb-4 text-3xl font-bold md:text-4xl"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {title}
        </motion.h1>
        
        <motion.p
          className="mb-8 text-base text-muted-foreground md:mb-10 md:text-lg"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {description}
        </motion.p>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            onClick={onConfirm}
            size="lg"
            className="h-14 w-full text-lg transform transition-transform duration-200 hover:scale-[1.02]"
          >
            {buttonText}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
