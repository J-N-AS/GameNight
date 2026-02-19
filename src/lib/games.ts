'use server';

import { notFound } from 'next/navigation';
import type { Game } from './types';
import { cache } from 'react';

// Helper function to dynamically import game data
async function loadGameData(id: string): Promise<Game | null> {
  try {
    const gameModule = await import(`@/data/${id}.json`);
    return gameModule.default as Game;
  } catch (error) {
    // We don't log here anymore as it can be noisy for files that are expected to not exist
    // (e.g. if a game is removed from the list but the file isn't deleted yet)
    return null;
  }
}

// Hardcoded lists of game IDs.
// This is more maintainable than reading the file system in a serverless environment.
const allGameIds = [
  'after-dark', 'afterparty', 'bursdags-roast', 'dating-fails', 'fyllevalg', 'girl-power', 'girls-vs-boys', 'gutta', 'hemmelig-bonus', 'hemmeligheter', 'hyttekos-afterski', 'icebreakeren', 'jeg-har-aldri', 'julebord', 'kaosrunden', 'kjapp-party-runde', 'party-klassikere', 'pekefest', 'pest-eller-kolera', 'rolig-sosial', 'rt-2025-dummy', 'sannhet-eller-shot', 'sexy-action', 'sexy-dares', 'sexy-vibes', 'singles-body', 'singles-night', 'spinn-flasken', 'spinn-flasken-action', 'spinn-flasken-sannhet', 'spinn-flasken-ekte', 'spinn-flasken-virtuell', 'snusboksen', 'snusboksen-utfordring', 'snusboksen-sannhet', 'vorspiel-mix'
];


export const getGames = cache(async (options: { includeHidden?: boolean } = {}): Promise<Omit<Game, 'items' | 'language' | 'shuffle'>[]> => {
  const games = await Promise.all(
    allGameIds.map(async (id) => {
      const gameData = await loadGameData(id);
      
      // Filter out games that don't load or have no items.
      if (!gameData || !gameData.items || gameData.items.length === 0) {
        return null;
      }
      
      // Special handling for hidden games, mainly for theme pages.
      if (gameData.hidden && !options.includeHidden) {
          return null;
      }
      
      // Return a stripped-down version of the game data for lobby/listing pages
      return {
        id: gameData.id,
        title: gameData.title,
        description: gameData.description,
        requiresPlayers: gameData.requiresPlayers,
        emoji: gameData.emoji,
        color: gameData.color,
        intensity: gameData.intensity,
        audience: gameData.audience,
        category: gameData.category,
        gameType: gameData.gameType,
        teams: gameData.teams,
        custom: gameData.custom,
        tags: gameData.tags,
        logo: gameData.logo,
        instagram: gameData.instagram,
      };
    })
  );

  const validGames = games.filter(Boolean) as Omit<Game, 'items' | 'language' | 'shuffle'>[];

  // Sort the games to place "spicy" ones lower in the list
  const intensityOrder = { low: 1, medium: 2, high: 3 };
  const audienceOrder = { all: 1, '18+': 2 };

  validGames.sort((a, b) => {
    const audienceComparison = audienceOrder[a.audience] - audienceOrder[b.audience];
    if (audienceComparison !== 0) return audienceComparison;

    const intensityComparison = intensityOrder[a.intensity] - intensityOrder[b.intensity];
    if (intensityComparison !== 0) return intensityComparison;

    return a.title.localeCompare(b.title);
  });

  return validGames;
});

export const getGame = cache(async (id: string): Promise<Game> => {
  const normalizedId = id.toLowerCase();
  
  // Check against the master list first for security and performance
  if (allGameIds.includes(normalizedId)) {
    const gameData = await loadGameData(normalizedId);
    if (gameData) {
      return gameData;
    }
  }

  // If we reach here, the game ID is not valid or the file is missing.
  notFound();
});
