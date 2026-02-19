'use client';

import type { ThemeWithGames } from '@/lib/themes';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowLeft, Gamepad2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { AdBanner } from '../ads/AdBanner';
import { useSession } from '@/hooks/usePlayers';
import { useToast } from '@/hooks/use-toast';
import { GameMenu } from '@/components/game/GameMenu';

export function ThemePageClient({ theme }: { theme: ThemeWithGames }) {
  const { players } = useSession();
  const { toast } = useToast();

  const handleGameSelect = (e: React.MouseEvent, game: ThemeWithGames['games'][0]) => {
    if (game.requiresPlayers && players.length === 0) {
      e.preventDefault();
      toast({
        title: 'Spillere mangler',
        description: `"${game.title}" krever at du legger til spillere først. Gå til forsiden for å legge til spillere.`,
        variant: 'destructive',
      });
    }
  };
  
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
          <div className="text-5xl md:text-6xl mb-4">{theme.emoji}</div>
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tighter">
          {theme.title}
        </h1>
        <div className="text-muted-foreground mt-6 text-lg max-w-3xl mx-auto space-y-4">
          {theme.content.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {theme.games.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
          >
            <Link
              href={`/spill/${game.id}`}
              onClick={(e) => handleGameSelect(e, game)}
              className="group block h-full"
            >
              <Card className="h-full flex flex-col transition-all duration-300 bg-card/80 backdrop-blur-sm border-border hover:border-primary hover:scale-105 hover:shadow-2xl hover:shadow-primary/10">
                <CardHeader className="flex-row items-start gap-4">
                  <div className="text-4xl mt-1">{game.emoji}</div>
                  <div>
                    <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                      {game.title}
                      {game.audience === '18+' && <span className="ml-2 text-xs font-medium bg-destructive/80 text-destructive-foreground px-2 py-0.5 rounded-full">18+</span>}
                    </CardTitle>
                    <CardDescription className="mt-1 text-muted-foreground/80">
                      {game.description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Button size="lg" variant="outline" asChild>
          <Link href="/alle-spill">
            <Gamepad2 className="mr-2 h-5 w-5" />
            Se alle spill
          </Link>
        </Button>
      </motion.div>

      <motion.div
        className="mt-16 flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <AdBanner />
      </motion.div>
    </div>
  );
}
