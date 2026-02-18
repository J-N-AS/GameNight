import { getGames } from '@/lib/games';
import { GameSelector } from '@/components/game/GameSelector';

export const metadata = {
  title: 'Velg spill | GameNight',
  description: 'Velg et spill å starte.',
};

export default async function ChooseGamePage() {
  const games = await getGames();

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tighter">
          Velg et spill
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Hva har dere lyst til å spille i kveld?
        </p>
      </header>
      <GameSelector games={games} />
    </div>
  );
}
