'use server';

import type { ScreenGameCategory } from './types';
import screenGamesData from '@/data/screen-games.json';

export function getScreenGames(): ScreenGameCategory[] {
  return screenGamesData.categories;
}
