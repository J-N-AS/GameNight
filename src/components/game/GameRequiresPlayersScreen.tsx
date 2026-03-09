'use client';

import type { Game } from '@/lib/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import { motion } from 'framer-motion';

export function GameRequiresPlayersScreen({ game }: { game: Game }) {
  const returnTo = `/spill/${game.id}`;

  return (
    <motion.div
      className="flex min-h-screen flex-col items-center justify-center p-4 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card/80 p-8 shadow-xl backdrop-blur-sm">
        <Users className="mx-auto mb-4 h-12 w-12 text-primary" />
        <h1 className="text-3xl font-bold">Spillere må legges til først</h1>
        <p className="mt-3 text-muted-foreground">
          <span className="font-semibold text-foreground">{game.title}</span> krever
          spillerliste for å fungere riktig. Legg til navn i lobbyen, så kan dere
          fortsette med én gang.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Button asChild size="lg" className="h-12 text-base">
            <Link href={`/?setupPlayers=1&returnTo=${encodeURIComponent(returnTo)}`}>
              Legg til spillere og fortsett
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-12 text-base">
            <Link href="/">Tilbake til forsiden</Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
