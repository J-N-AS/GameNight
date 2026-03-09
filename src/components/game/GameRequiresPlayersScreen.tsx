'use client';

import type { Game } from '@/lib/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSession } from '@/hooks/usePlayers';
import {
  formatPlayerCount,
  getMinimumPlayers,
  getMissingPlayers,
  getPlayerSetupHref,
} from '@/lib/player-requirements';

export function GameRequiresPlayersScreen({ game }: { game: Game }) {
  const { players } = useSession();
  const minimumPlayers = getMinimumPlayers(game);
  const missingPlayers = getMissingPlayers(game, players.length);

  return (
    <motion.div
      className="flex min-h-screen flex-col items-center justify-center p-4 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card/90 p-8 shadow-xl backdrop-blur-sm">
        <Users className="mx-auto mb-4 h-12 w-12 text-primary" />
        <h1 className="text-3xl font-bold">Gjør spillerne klare først</h1>
        <p className="mt-3 text-muted-foreground">
          <span className="font-semibold text-foreground">{game.title}</span>{' '}
          fungerer best med minst {formatPlayerCount(minimumPlayers)}.
        </p>
        <p className="mt-2 text-sm text-muted-foreground/90">
          {missingPlayers > 0
            ? `Dere mangler ${formatPlayerCount(missingPlayers)} for å starte. Legg til navn i spilleroppsettet, så sender vi dere rett tilbake.`
            : 'Legg til navn i spilleroppsettet, så kan dere fortsette med én gang.'}
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Button asChild size="lg" className="h-12 text-base">
            <Link href={getPlayerSetupHref(game.id)}>
              {missingPlayers > 0
                ? `Legg til ${formatPlayerCount(missingPlayers)} til`
                : 'Legg til spillere og fortsett'}
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
