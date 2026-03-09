import { getGames } from '@/lib/games';
import { getThemes } from '@/lib/themes';
import { LobbyClient } from '@/components/game/LobbyClient';

const RECOMMENDED_GAME_IDS = ['vorspiel-mix', 'party-klassikere', 'pekefest'];

export default async function Home() {
  const publicGames = await getGames({ includeHidden: true });
  const themes = await getThemes();

  const recommendedGames = publicGames.filter(g => RECOMMENDED_GAME_IDS.includes(g.id));
  
  return <LobbyClient allGames={publicGames} recommendedGames={recommendedGames} themes={themes} />;
}
