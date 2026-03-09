import { getGames } from '@/lib/games';
import { AllGamesClient } from '@/components/game/AllGamesClient';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { GameMenu } from '@/components/game/GameMenu';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Alle Spill | GameNight',
  description: 'Utforsk alle partyspillene. Sorter etter stemning og intensitet for å finne det perfekte spillet for kvelden.',
};

export default async function AllGamesPage() {
  const games = await getGames();
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
       <div className="absolute top-4 left-4 z-10">
        <Button variant="ghost" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Tilbake til forsiden
          </Link>
        </Button>
      </div>
      <div className="absolute top-4 right-4 z-10">
        <GameMenu context="lobby" />
      </div>

      <header className="text-center my-10 md:my-12 pt-8">
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tighter">
          Alle GameNight-spill
        </h1>
        <p className="text-muted-foreground mt-3 text-lg max-w-2xl mx-auto">
          Sorter etter stemning og intensitet for å finne det perfekte spillet for kvelden.
        </p>
      </header>

      <Suspense fallback={<p className="text-center text-muted-foreground">Laster spill...</p>}>
        <AllGamesClient games={games} />
      </Suspense>
    </div>
  );
}
