import { getGames } from '@/lib/games';
import { LobbyClient } from '@/components/game/LobbyClient';
import {
  getHomeRecommendedOrder,
  isHomeRecommendedGame,
} from '@/lib/game-library';

export default async function Home() {
  const allGames = await getGames({
    includeHidden: true,
    includeHiddenFromMain: true,
  });
  const publicGames = allGames.filter(
    (game) => !game.hidden && !game.isHiddenFromMain
  );

  const recommendedGames = publicGames
    .filter((game) => isHomeRecommendedGame(game.id))
    .sort((a, b) => getHomeRecommendedOrder(a.id) - getHomeRecommendedOrder(b.id));

  return <LobbyClient allGames={allGames} recommendedGames={recommendedGames} />;
}
