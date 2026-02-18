'use client';

import type { Game } from '@/lib/games';
import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { usePlayers } from '@/hooks/usePlayers';
import { useRouter } from 'next/navigation';
import { PlayerSetup } from './PlayerSetup';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Users, PartyPopper } from 'lucide-react';

type GameFromGetGames = Omit<Game, 'items' | 'language' | 'shuffle'>;

type GameSelectorProps = {
  games: GameFromGetGames[];
};

export function GameSelector({ games }: GameSelectorProps) {
  const router = useRouter();
  const { players } = usePlayers();
  const { toast } = useToast();
  const [isPlayerSetupOpen, setIsPlayerSetupOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<GameFromGetGames | null>(
    null
  );
  const [code, setCode] = useState('');

  useEffect(() => {
    // This effect runs when the modal is closed AND a game had been selected.
    if (selectedGame && !isPlayerSetupOpen && players.length > 0) {
      router.push(`/spill/${selectedGame.id}`);
      // Reset selectedGame so this doesn't run again unintentionally.
      setSelectedGame(null);
    }
  }, [isPlayerSetupOpen, selectedGame, players, router]);

  const handleGameSelect = (e: React.MouseEvent, game: GameFromGetGames) => {
    if (game.requiresPlayers && players.length === 0) {
      e.preventDefault();
      setSelectedGame(game);
      toast({
        title: 'Spillere mangler',
        description: `"${game.title}" krever at du legger til spillere først.`,
      });
      setIsPlayerSetupOpen(true);
    }
  };

  const handleSetupComplete = () => {
    setIsPlayerSetupOpen(false);
    // Navigation is now handled by the useEffect hook
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      router.push(`/spill/${code.trim().toLowerCase()}`);
    }
  };

  const secretCodeDelay = games.filter(g => g.id).length * 0.05 + 0.2;

  return (
    <>
      <PlayerSetup
        open={isPlayerSetupOpen}
        onOpenChange={setIsPlayerSetupOpen}
        onSetupComplete={handleSetupComplete}
      />
      <div className="w-full max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {games.filter(g => g.id).map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link
                href={`/spill/${game.id}`}
                onClick={e => handleGameSelect(e, game)}
                className="group block h-full"
                style={{ '--accent-color': game.color } as React.CSSProperties}
              >
                <Card className="h-full flex flex-col transition-all duration-300 bg-card/80 backdrop-blur-sm border-border hover:border-[var(--accent-color)] hover:scale-105 hover:shadow-2xl hover:shadow-[var(--accent-color)]/10">
                  <CardHeader className="flex-row items-start gap-4">
                    <div className="text-4xl mt-1">{game.emoji}</div>
                    <div>
                      <CardTitle className="text-xl font-bold group-hover:text-[var(--accent-color)] transition-colors">
                        {game.title}
                      </CardTitle>
                      <CardDescription className="mt-1 flex items-center gap-2 text-muted-foreground/80">
                        {game.requiresPlayers && <Users className="h-4 w-4" />}
                        {game.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.section
          className="mt-20 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: secretCodeDelay }}
        >
          <h2 className="text-2xl font-bold text-center mb-4 font-headline flex items-center justify-center gap-2">
            <PartyPopper className="h-6 w-6 text-primary" />
            Har du en hemmelig kode?
          </h2>
          <form
            onSubmit={handleCodeSubmit}
            className="max-w-sm mx-auto flex gap-2"
          >
            <Input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="🤫 Skriv inn koden..."
              className="text-center tracking-widest uppercase bg-card/80 backdrop-blur-sm h-12 text-base"
            />
            <Button type="submit" variant="secondary" size="lg" className="h-12">
              Bli med
            </Button>
          </form>
        </motion.section>
      </div>
    </>
  );
}
