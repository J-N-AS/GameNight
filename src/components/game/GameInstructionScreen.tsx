'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface GameInstructionScreenProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  onConfirm: () => void;
}

export function GameInstructionScreen({ icon, title, description, buttonText, onConfirm }: GameInstructionScreenProps) {
  return (
    <motion.div
      className="flex min-h-screen flex-col items-center justify-center p-4 text-center bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-md">
        <motion.div
          className="mb-6 flex justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2, duration: 0.5 }}
        >
          {icon}
        </motion.div>
        
        <motion.h1
          className="text-4xl font-bold mb-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {title}
        </motion.h1>
        
        <motion.p
          className="text-muted-foreground text-lg mb-10"
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
            className="h-14 text-lg transform transition-transform duration-200 hover:scale-105"
          >
            {buttonText}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
