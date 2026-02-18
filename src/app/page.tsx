import { getGames } from '@/lib/games';
import { LobbyClient } from '@/components/game/LobbyClient';

export default async function Home() {
  const games = await getGames();
  return <LobbyClient games={games} />;
}
