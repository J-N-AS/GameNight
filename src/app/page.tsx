import { getGames } from '@/lib/games';
import { getThemes } from '@/lib/themes';
import { LobbyClient } from '@/components/game/LobbyClient';

const RECOMMENDED_GAME_IDS = ['vorspiel-mix', 'party-klassikere', 'pekefest'];

export default async function Home() {
  const allGames = await getGames({
    includeHidden: true,
    includeHiddenFromMain: true,
  });
  const themes = await getThemes();
  const publicGames = allGames.filter(
    (game) => !game.hidden && !game.isHiddenFromMain
  );

  const recommendedGames = publicGames.filter(g => RECOMMENDED_GAME_IDS.includes(g.id));
  
  return <LobbyClient allGames={allGames} recommendedGames={recommendedGames} themes={themes} />;
}
