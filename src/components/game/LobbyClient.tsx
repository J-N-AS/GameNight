'use client';

import { useState } from 'react';
import { Rocket, Beer, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlayerSetup } from '@/components/game/PlayerSetup';
import Link from 'next/link';
import Image from 'next/image';
import { GameMenu } from '@/components/game/GameMenu';
import { motion } from 'framer-motion';
import { usePlayers } from '@/hooks/usePlayers';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { GameSelector } from '@/components/game/GameSelector';
import type { Game } from '@/lib/games';
import { AdBanner } from '@/components/ads/AdBanner';

type GameFromGetGames = Omit<Game, 'items' | 'language' | 'shuffle'>;

export function LobbyClient({ games }: { games: GameFromGetGames[] }) {
  const [isPlayerSetupOpen, setIsPlayerSetupOpen] = useState(false);
  const { players, isLoaded } = usePlayers();

  const handleSetupComplete = () => {
    setIsPlayerSetupOpen(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      className="container mx-auto px-4 py-8 md:py-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="absolute top-4 right-4 z-10">
        <GameMenu context="lobby" />
      </div>

      <motion.header
        className="text-center mb-10 md:mb-12"
        variants={itemVariants}
      >
        <Image
          src="/GameNight-logo-small.webp"
          alt="GameNight Logo"
          width={400}
          height={100}
          priority
          className="w-auto h-auto mx-auto max-w-[300px] md:max-w-[400px] drop-shadow-[0_5px_15px_rgba(0,0,0,0.2)]"
        />
        <p className="text-muted-foreground mt-4 text-lg md:text-xl">
          Start festen med et spill!
        </p>
      </motion.header>

      <motion.div
        className="mb-12 w-full max-w-md mx-auto"
        variants={itemVariants}
      >
        <PlayerSetup
          open={isPlayerSetupOpen}
          onOpenChange={setIsPlayerSetupOpen}
          onSetupComplete={handleSetupComplete}
        >
          {isLoaded && players.length === 0 && (
            <Button
              size="lg"
              className="h-16 w-full text-xl px-10 transform transition-transform duration-200 hover:scale-105 hover:shadow-primary/40 shadow-lg"
              onClick={() => setIsPlayerSetupOpen(true)}
            >
              <Rocket className="mr-3 h-6 w-6 animate-pulse" />
              Start en runde
            </Button>
          )}
        </PlayerSetup>

        {isLoaded && players.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Hvem spiller?
                </CardTitle>
                <CardDescription>
                  {players.length} spillere er klare for fest.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {players.map(player => (
                  <motion.div
                    key={player.id}
                    layout
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-muted text-muted-foreground font-medium py-1 px-3 rounded-full text-sm"
                  >
                    {player.name}
                  </motion.div>
                ))}
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsPlayerSetupOpen(true)}
                >
                  Endre spillere
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </motion.div>

      <GameSelector games={games} />

      <motion.div
        className="mt-20 w-full max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-center mb-6 font-headline flex items-center justify-center gap-2">
          <Beer className="h-6 w-6 text-accent" />
          Klassiske Drikkeleker
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="transition-all duration-300 bg-card/60 backdrop-blur-sm border-border hover:border-accent hover:scale-105 hover:shadow-2xl hover:shadow-accent/10">
            <Link href="/drikkeleker" className="block p-6 group">
              <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
                Se alle klassikerne
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Lyst på en pause fra appen? Her finner du reglene for Beer Pong,
                Ring of Fire og mye mer.
              </p>
            </Link>
          </Card>
          <Card className="transition-all duration-300 bg-card/60 backdrop-blur-sm border-border hover:border-primary hover:scale-105 hover:shadow-2xl hover:shadow-primary/10">
            <Link href="/info/om-oss" className="block p-6 group">
              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                Hvorfor er det gratis?
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Les om hvorfor GameNight er gratis, og hvordan du kan støtte
                prosjektet hvis du vil.
              </p>
            </Link>
          </Card>
        </div>
      </motion.div>

      <motion.div
        className="mt-16 flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <AdBanner />
      </motion.div>
    </motion.div>
  );
}
