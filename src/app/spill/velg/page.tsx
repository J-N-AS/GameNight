import { getGames } from '@/lib/games';
import { GameSelector } from '@/components/game/GameSelector';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { GameMenu } from '@/components/game/GameMenu';
import { motion } from 'framer-motion';

export const metadata = {
  title: 'Velg spill | GameNight',
  description: 'Hva har dere lyst til å spille i kveld?',
};

export default async function ChooseGamePage() {
  const games = await getGames();

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="absolute top-4 left-4 z-10">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Lobby
          </Link>
        </Button>
      </div>
      <div className="absolute top-4 right-4 z-10">
        <GameMenu context="lobby" />
      </div>
      <motion.header
        className="text-center mb-10 md:mb-16"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tighter">
          Velg et spill
        </h1>
        <p className="text-muted-foreground mt-3 text-lg max-w-2xl mx-auto">
          Her er noen forslag for å få i gang festen. Velg et spill for å
          starte!
        </p>
      </motion.header>
      <GameSelector games={games} />
    </div>
  );
}
