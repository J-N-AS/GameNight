import fs from 'fs/promises';
import path from 'path';
import { notFound } from 'next/navigation';

export interface GameTask {
  type: 'challenge' | 'never_have_i_ever' | 'prompt';
  text: string;
}

export interface Game {
  id: string;
  title: string;
  description: string;
  language: string;
  items: GameTask[];
  shuffle?: boolean;
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
          return {
            id: gameData.id,
            title: gameData.title,
            description: gameData.description,
          };
        })
    );
    return games;
  } catch (error) {
    console.error("Failed to read games directory:", error);
    return [];
  }
}

export async function getGame(id: string): Promise<Game> {
  const filePath = path.join(gamesDirectory, `${id}.json`);
  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    const gameData: Game = JSON.parse(fileContents);
    return gameData;
  } catch (error) {
    console.error(`Failed to read game file for id: ${id}`, error);
    notFound();
  }
}
