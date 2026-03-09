import type { Game } from '@/lib/types';

type GameWithPlayerRequirements = Pick<
  Game,
  'id' | 'title' | 'requiresPlayers' | 'minPlayers' | 'gameType'
>;

export function getMinimumPlayers(game: GameWithPlayerRequirements): number {
  if (typeof game.minPlayers === 'number' && game.minPlayers > 0) {
    return game.minPlayers;
  }

  if (
    game.gameType === 'spin-the-bottle' ||
    game.gameType === 'physical-item'
  ) {
    return 2;
  }

  if (game.requiresPlayers) {
    return 2;
  }

  return 0;
}

export function hasEnoughPlayers(
  game: GameWithPlayerRequirements,
  playerCount: number
): boolean {
  return playerCount >= getMinimumPlayers(game);
}

export function getMissingPlayers(
  game: GameWithPlayerRequirements,
  playerCount: number
): number {
  return Math.max(0, getMinimumPlayers(game) - playerCount);
}

export function formatPlayerCount(count: number): string {
  return count === 1 ? '1 spiller' : `${count} spillere`;
}

export function getPlayerRequirementLabel(
  game: GameWithPlayerRequirements
): string | null {
  const minimumPlayers = getMinimumPlayers(game);

  if (minimumPlayers === 0) {
    return null;
  }

  return `Fra ${formatPlayerCount(minimumPlayers)}`;
}

export function getPlayerSetupHref(gameId: string): string {
  return `/?setupPlayers=1&returnTo=${encodeURIComponent(`/spill/${gameId}`)}`;
}
