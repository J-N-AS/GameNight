import { getGames } from '@/lib/games';
import { LobbyClient } from '@/components/game/LobbyClient';
import type { Game } from '@/lib/types';

const RECOMMENDED_GAME_IDS = ['vorspiel-mix', 'party-klassikere', 'pekefest-klassisk'];

export default async function Home() {
  const allGames = await getGames();
  const recommendedGames = allGames.filter(g => RECOMMENDED_GAME_IDS.includes(g.id));
  
  return <LobbyClient recommendedGames={recommendedGames} />;
}
