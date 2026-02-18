'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Smartphone, GlassWater } from 'lucide-react';

interface GameModeSelectionScreenProps {
  title: string;
  description: string;
  options: {
    id: string;
    icon: React.ReactNode;
    title: string;
    description: string;
  }[];
  onModeSelect: (modeId: string) => void;
}

export function GameModeSelectionScreen({ title, description, options, onModeSelect }: GameModeSelectionScreenProps) {
  return (
    <motion.div
      className="flex min-h-screen flex-col items-center justify-center p-4 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-2xl">
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {options.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <Card
                className="text-left h-full transition-all hover:border-primary hover:scale-105 hover:shadow-lg cursor-pointer bg-card/50"
                onClick={() => onModeSelect(option.id)}
              >
                <CardHeader className="flex-row items-start gap-4">
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
