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
    console.error(`Failed to load game data for id: ${id}`, error);
    return null;
  }
}

// Hardcoded lists of game IDs.
// This is more maintainable than reading the file system in a serverless environment.
const officialGameIds = [
  'after-dark', 'afterparty', 'dating-fails', 'fyllevalg', 'girl-power', 'girls-vs-boys', 'gutta', 'hemmeligheter', 'jeg-har-aldri', 'kaosrunden', 'kjapp-party-runde', 'party-klassikere', 'pekefest', 'pest-eller-kolera', 'rolig-sosial', 'sannhet-eller-shot', 'sexy-action', 'sexy-dares', 'sexy-vibes', 'singles-body', 'singles-night', 'spinn-flasken', 'spinn-flasken-action', 'spinn-flasken-sannhet', 'snusboksen', 'snusboksen-utfordring', 'snusboksen-sannhet', 'vorspiel-mix'
];

const customGameIds = [
  'rt-2025-dummy',
  'hemmelig-bonus', // Treating this as custom for now to test the UI
];

// Combine and create a master list of all known game IDs
const allGameIds = [...customGameIds, ...officialGameIds];

export const getGames = cache(async (): Promise<Omit<Game, 'items' | 'language' | 'shuffle'>[]> => {
  const games = await Promise.all(
    allGameIds.map(async (id) => {
      const gameData = await loadGameData(id);
      if (!gameData || !gameData.items || gameData.items.length === 0 || gameData.hidden) {
        return null;
      }
      
      const isCustom = customGameIds.includes(id);

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
        custom: gameData.custom || isCustom,
        tags: gameData.tags,
        logo: gameData.logo,
        instagram: gameData.instagram,
      };
    })
  );

  // Filter out any null values from games that failed to load or were filtered out
  return games.filter(Boolean) as Omit<Game, 'items' | 'language' | 'shuffle'>[];
});

export const getGame = cache(async (id: string): Promise<Game> => {
  const normalizedId = id.toLowerCase();
  
  if (allGameIds.includes(normalizedId)) {
    const gameData = await loadGameData(normalizedId);
    if (gameData) {
       // Check if it's in the custom list to ensure the flag is set
       if (customGameIds.includes(normalizedId)) {
        gameData.custom = true;
      }
      return gameData;
    }
  }

  // Fallback search for cases where slug might not match filename exactly
  for (const gameId of allGameIds) {
    const data = await loadGameData(gameId);
    if (data && data.id.toLowerCase() === normalizedId) {
       if (customGameIds.includes(gameId)) {
        data.custom = true;
      }
      return data;
    }
  }

  notFound();
});
