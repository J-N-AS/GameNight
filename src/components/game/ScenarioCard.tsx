'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ScenarioCardProps {
  isLoading: boolean;
  scenario?: React.ReactNode;
  question?: React.ReactNode;
  playerPrompt?: React.ReactNode;
}

export function ScenarioCard({ isLoading, scenario, question, playerPrompt }: ScenarioCardProps) {
  if (isLoading || !scenario) {
    return (
      <Card className="w-full max-w-2xl border-0 bg-transparent shadow-none text-center">
        <CardHeader className="pb-8">
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-6 w-1/2 mx-auto mt-4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-16 w-full mx-auto" />
          <Skeleton className="h-10 w-1/3 mx-auto mt-8" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl border-0 bg-transparent shadow-none text-center">
      <CardHeader className="pb-8">
        <motion.p
          className="text-2xl md:text-3xl text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {scenario}
        </motion.p>
      </CardHeader>
      <CardContent>
        <motion.h2
          className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
        >
          {question}
        </motion.h2>
        <motion.div
          className="text-2xl md:text-3xl font-semibold"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          {playerPrompt}
        </motion.div>
      </CardContent>
    </Card>
  );
}
