'use client';

import { useCallback, type MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useSession } from '@/hooks/usePlayers';
import {
  formatPlayerCount,
  getMinimumPlayers,
  getMissingPlayers,
  getPlayerSetupHref,
  hasEnoughPlayers,
} from '@/lib/player-requirements';
import type { GameplayDrinkingIntensity } from '@/lib/gameplay-preferences';
import type { Game } from '@/lib/types';

type StartableGame = Pick<
  Game,
  'id' | 'title' | 'requiresPlayers' | 'minPlayers' | 'gameType'
>;

export function useGameStart() {
  const router = useRouter();
  const { toast } = useToast();
  const { players } = useSession();

  const handleUnusedDialogOpenChange = useCallback((_open: boolean) => {}, []);
  const handleUnusedDrinkingIntensityChange = useCallback(
    (_drinkingIntensity: GameplayDrinkingIntensity) => {},
    []
  );
  const handleUnusedConfirm = useCallback(() => {}, []);

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
      router.push(`/spill/${game.id}`);
      return true;
    },
    [players.length, router, toast]
  );

  return {
    startGame,
    gameStartDialogProps: {
      game: null,
      open: false,
      drinkingIntensity: 'medium' as const,
      onOpenChange: handleUnusedDialogOpenChange,
      onDrinkingIntensityChange: handleUnusedDrinkingIntensityChange,
      onConfirm: handleUnusedConfirm,
    },
  };
}
