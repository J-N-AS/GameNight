'use server';

import { notFound } from 'next/navigation';
import type { Game } from './types';

// Helper function to dynamically import game data
async function loadGameData(id: string): Promise<Game | null> {
  try {
    const gameModule = await import(`@/data/${id}.json`);
    return gameModule.default as Game;
  } catch (error) {
    return null;
  }
}

// Helper function to get all game IDs (filenames without .json).
// This list must contain the filenames to ensure they are found.
const allGameIds = [
  'afterparty',
  'dating-fails',
  'fyllevalg',
  'hemmelig-bonus',
  'hemmeligheter',
  'jeg-har-aldri',
  'kaosrunden',
  'kjapp-party-runde',
  'party-klassikere',
  'pekefest',
  'rolig-sosial',
  'sannhet-eller-shot',
  'sexy-vibes',
  'vorspiel-mix',
  // Note: 'utfordringer' is intentionally not included as it's empty/deprecated.
];

export async function getGames(): Promise<Omit<Game, 'items' | 'language' | 'shuffle'>[]> {
  const games = await Promise.all(
    allGameIds.map(async (id) => {
      const gameData = await loadGameData(id);
      if (!gameData || !gameData.items || gameData.items.length === 0 || gameData.hidden) {
        return null;
      }
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
      };
    })
  );
  return games.filter(Boolean) as Omit<Game, 'items' | 'language' | 'shuffle'>[];
}

export async function getGame(id: string): Promise<Game> {
  const normalizedId = id.toLowerCase();
  
  // First, try to load by the ID directly, assuming it might match the filename
  const gameData = await loadGameData(normalizedId);
  if (gameData && gameData.id.toLowerCase() === normalizedId) {
    return gameData;
  }

  // Fallback search for cases where filename and game.id differ
  // (e.g. filename is 'jeg-har-aldri' but internal id is 'jeg-har-aldri-klassisk')
  for (const gameFile of allGameIds) {
    const data = await loadGameData(gameFile);
    if (data && data.id.toLowerCase() === normalizedId) {
      return data;
    }
  }

  notFound();
}
