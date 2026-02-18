import fs from 'fs/promises';
import path from 'path';
import { notFound } from 'next/navigation';

export interface GameTask {
  type: 'challenge' | 'never_have_i_ever' | 'prompt' | 'pointing';
  text: string;
}

export interface Game {
  id: string;
  title: string;
  description: string;
  language: string;
  items: GameTask[];
  shuffle?: boolean;
  requiresPlayers?: boolean;
  emoji?: string;
  color?: string;
  hidden?: boolean;
}

const gamesDirectory = path.join(process.cwd(), 'src/data');

export async function getGames(): Promise<Omit<Game, 'items' | 'language' | 'shuffle'>[]> {
  try {
    const filenames = await fs.readdir(gamesDirectory);
    const games = await Promise.all(
      filenames
        .filter((filename) => filename.endsWith('.json'))
        .map(async (filename) => {
          const filePath = path.join(gamesDirectory, filename);
          const fileContents = await fs.readFile(filePath, 'utf8');
          const gameData: Game = JSON.parse(fileContents);
          
          if (!gameData.items || gameData.items.length === 0 || gameData.hidden) {
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
  } catch (error) {
    console.error("Failed to read games directory:", error);
    return [];
  }
}

export async function getGame(id: string): Promise<Game> {
  const filenames = await fs.readdir(gamesDirectory);
  
  // Create a normalized ID for case-insensitive matching
  const normalizedId = id.toLowerCase();

  // First, try to find a file that is named {normalizedId}.json
  let filePath = path.join(gamesDirectory, `${normalizedId}.json`);
  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    const gameData: Game = JSON.parse(fileContents);
    // Check if the ID inside the file also matches, case-insensitively
    if (gameData.id.toLowerCase() === normalizedId) {
      return gameData;
    }
  } catch (error) {
    // If {id}.json not found or id mismatch, search all files
    for (const filename of filenames) {
        if (filename.endsWith('.json')) {
            const loopFilePath = path.join(gamesDirectory, filename);
            const fileContents = await fs.readFile(loopFilePath, 'utf8');
            const gameData: Game = JSON.parse(fileContents);
            if (gameData.id.toLowerCase() === normalizedId) {
                return gameData;
            }
        }
    }
    // If no game is found after checking all files, throw a notFound error
    notFound();
  }
  // This part should be unreachable, but just in case
  notFound();
}
