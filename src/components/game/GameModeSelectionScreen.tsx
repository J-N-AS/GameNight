'use client';

import type { ReactNode } from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface GameModeSelectionScreenProps {
  title: string;
  description: string;
  options: {
    id: string;
    icon: ReactNode;
    title: string;
    description: string;
  }[];
  onModeSelect: (modeId: string) => void;
}

export function GameModeSelectionScreen({ title, description, options, onModeSelect }: GameModeSelectionScreenProps) {
  return (
    <motion.div
      className="flex min-h-screen flex-col items-center justify-center px-4 py-8 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-2xl">
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
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          {options.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <Card
                className="h-full cursor-pointer bg-card/60 text-left transition-all hover:border-primary hover:scale-[1.02] hover:shadow-lg"
                onClick={() => onModeSelect(option.id)}
              >
                <CardHeader className="flex-row items-start gap-4 p-5">
                    {option.icon}
                  <div>
                    <CardTitle>{option.title}</CardTitle>
                    <CardDescription className="mt-2">{option.description}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
