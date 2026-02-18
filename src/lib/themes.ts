'use server';

import type { Theme } from './types';
import type { Game } from './types';
import themesData from '@/data/themes.json';
import { getGames } from './games';
import { cache } from 'react';

export type ThemeWithGames = Theme & {
  games: Omit<Game, 'items' | 'language' | 'shuffle'>[];
};

export const getThemes = cache(async (): Promise<Theme[]> => {
  // For now, we just return the imported JSON.
  // This function can be expanded later if we need to process the themes.
  return themesData as Theme[];
});

export const getTheme = cache(async (slug: string): Promise<ThemeWithGames | undefined> => {
  const themes = await getThemes();
  const theme = themes.find(t => t.slug === slug);

  if (!theme) {
    return undefined;
  }

  // Fetch all games, then filter by the IDs in the theme
  const allGames = await getGames();
  
  // We should also respect the order from gameIds
  const orderedGames = theme.gameIds
    .map(id => allGames.find(game => game.id === id))
    .filter(Boolean) as Omit<Game, 'items' | 'language' | 'shuffle'>[];

  return {
    ...theme,
    games: orderedGames,
  };
});
