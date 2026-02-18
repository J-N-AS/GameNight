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

// Helper function to get all game IDs (filenames without .json)
// In a real app, you might have a manifest file or a more robust discovery method
const allGameIds = [
  'afterparty',
  'dating-fails',
  'fyllevalg',
  'hemmelig-bonus',
  'hemmeligheter',
  'jeg-har-aldri-klassisk',
  'kaosrunden',
  'kjapp-party-runde',
  'party-klassikere',
  'pekefest-klassisk',
  'rolig-sosial',
  'sannhet-eller-shot',
  'sexy-vibes',
  'utfordringer-deprecated',
  'vorspiel-mix',
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
      };
    })
  );
  return games.filter(Boolean) as Omit<Game, 'items' | 'language' | 'shuffle'>[];
}

export async function getGame(id: string): Promise<Game> {
  const normalizedId = id.toLowerCase();
  const gameData = await loadGameData(normalizedId);
  
  if (gameData && gameData.id.toLowerCase() === normalizedId) {
    return gameData;
  }

  // Fallback search if the filename doesn't directly match the id
  for (const gameId of allGameIds) {
    const data = await loadGameData(gameId);
    if (data && data.id.toLowerCase() === normalizedId) {
      return data;
    }
  }

  notFound();
}
