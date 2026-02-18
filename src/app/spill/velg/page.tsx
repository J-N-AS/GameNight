import { getGames } from '@/lib/games';
import { ChooseGameClient } from '@/components/game/ChooseGameClient';

export const metadata = {
  title: 'Velg spill | GameNight',
  description: 'Hva har dere lyst til å spille i kveld?',
};

export default async function ChooseGamePage() {
  const games = await getGames();

  return <ChooseGameClient games={games} />;
}
