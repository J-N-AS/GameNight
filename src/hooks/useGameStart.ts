'use client';

import { useCallback, useState, type MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useSession } from '@/hooks/usePlayers';
import { useGameplayPreferences } from '@/hooks/useGameplayPreferences';
import {
  formatPlayerCount,
  getMinimumPlayers,
  getMissingPlayers,
  getPlayerSetupHref,
  hasEnoughPlayers,
} from '@/lib/player-requirements';
import type { Game } from '@/lib/types';

type StartableGame = Pick<
  Game,
  'id' | 'title' | 'requiresPlayers' | 'minPlayers' | 'gameType'
>;

export function useGameStart() {
  const router = useRouter();
  const { toast } = useToast();
  const { players } = useSession();
  const { preferences, setDrinkingIntensity } = useGameplayPreferences();
  const [pendingGame, setPendingGame] = useState<StartableGame | null>(null);
  const [isStartDialogOpen, setIsStartDialogOpen] = useState(false);

  const startGame = useCallback(
    (game: StartableGame, event?: MouseEvent<Element>) => {
      if (!hasEnoughPlayers(game, players.length)) {
        event?.preventDefault();

        const minimumPlayers = getMinimumPlayers(game);
        const missingPlayers = getMissingPlayers(game, players.length);

        toast({
          title:
            players.length === 0
              ? 'Legg til spillere først'
              : 'Legg til flere spillere',
          description:
            missingPlayers > 0
              ? `"${game.title}" trenger minst ${formatPlayerCount(minimumPlayers)}. Vi åpner spilleroppsett nå.`
              : `"${game.title}" trenger minst ${formatPlayerCount(minimumPlayers)}.`,
        });

        router.push(getPlayerSetupHref(game.id));
        return false;
      }

      event?.preventDefault();
      setPendingGame(game);
      setIsStartDialogOpen(true);
      return true;
    },
    [players.length, router, toast]
  );

  const confirmStartGame = useCallback(() => {
    if (!pendingGame) {
      return false;
    }

    setIsStartDialogOpen(false);
    router.push(`/spill/${pendingGame.id}`);
    return true;
  }, [pendingGame, router]);

  const handleStartDialogOpenChange = useCallback((open: boolean) => {
    setIsStartDialogOpen(open);

    if (!open) {
      setPendingGame(null);
    }
  }, []);

  return {
    startGame,
    gameStartDialogProps: {
      game: pendingGame,
      open: isStartDialogOpen,
      drinkingIntensity: preferences.drinkingIntensity,
      onOpenChange: handleStartDialogOpenChange,
      onDrinkingIntensityChange: setDrinkingIntensity,
      onConfirm: confirmStartGame,
    },
  };
}
