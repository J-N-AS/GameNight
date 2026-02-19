'use client';

import { useState } from 'react';
import { Rocket, Gamepad2, Users, Beer, Music, Wand2, Dices, Clapperboard, Trophy, Star, HardHat, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlayerSetup } from './PlayerSetup';
import Link from 'next/link';
import Image from 'next/image';
import { GameMenu } from './GameMenu';
import { motion } from 'framer-motion';
import { useSession } from '@/hooks/usePlayers';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import type { Game, Theme } from '@/lib/types';
import { AdBanner } from '@/components/ads/AdBanner';
import { PartyTools } from './PartyTools';
import { useToast } from '@/hooks/use-toast';

type GameFromGetGames = Omit<Game, 'items' | 'language' | 'shuffle'>;

export function LobbyClient({ allGames, recommendedGames, themes }: { allGames: GameFromGetGames[], recommendedGames: GameFromGetGames[], themes: Theme[] }) {
  const [isPlayerSetupOpen, setIsPlayerSetupOpen] = useState(false);
  const [isSurpriseMeOpen, setIsSurpriseMeOpen] = useState(false);
  const [surpriseGame, setSurpriseGame] = useState<GameFromGetGames | null>(null);
  const [isDonating, setIsDonating] = useState(false);
  
  const { players, isLoaded } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const handleSetupComplete = () => {
    setIsPlayerSetupOpen(false);
  };
  
  const selectRandomGame = () => {
    if (allGames.length > 0) {
      const randomIndex = Math.floor(Math.random() * allGames.length);
      setSurpriseGame(allGames[randomIndex]);
    }
  };

  const handleSurpriseMeClick = () => {
    selectRandomGame();
    setIsSurpriseMeOpen(true);
  };

  const handleTryAnother = () => {
    selectRandomGame();
  };

  const handleStartSurpriseGame = () => {
    if (surpriseGame) {
      if (surpriseGame.requiresPlayers && players.length === 0) {
        toast({
          title: 'Spillere mangler',
          description: `"${surpriseGame.title}" krever at du legger til spillere først.`,
          variant: 'destructive',
        });
        setIsSurpriseMeOpen(false);
        setTimeout(() => setIsPlayerSetupOpen(true), 100);
        return;
      }
      router.push(`/spill/${surpriseGame.id}`);
    }
  };

  const handleDonate = async () => {
    setIsDonating(true);
    try {
        const response = await fetch('/api/vipps/donate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: 25 })
        });

        const data = await response.json();

        if (data.status === 'not_configured') {
            toast({
                title: 'Tusen takk for tanken! ❤️',
                description: 'Donasjoner er ikke aktivert helt enda, men vi setter utrolig stor pris på at du ville støtte oss!',
            });
        } else if (data.status === 'success' && data.checkoutFrontendUrl) {
            window.location.href = data.checkoutFrontendUrl;
        } else {
            throw new Error(data.message || 'En ukjent feil oppstod');
        }
    } catch (error) {
        console.error("Donation failed:", error);
        toast({
            title: 'Noe gikk galt',
            description: 'Kunne ikke starte donasjonen. Vennligst prøv igjen senere.',
            variant: 'destructive',
        });
    } finally {
        setIsDonating(false);
    }
  };

  return (
    <motion.div
      className="container mx-auto px-4 py-8 md:py-12"
      initial="hidden"
      animate="visible"
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
    >
      <div className="absolute top-4 right-4 z-10">
        <GameMenu context="lobby" />
      </div>

      <motion.header
        className="text-center mb-10 md:mb-12"
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      >
        <Image
          src="/GameNight-logo-small.webp"
          alt="GameNight Logo"
          width={400}
          height={100}
          priority
          className="h-auto mx-auto max-w-[300px] md:max-w-[400px] drop-shadow-[0_5px_15px_rgba(0,0,0,0.2)]"
        />
        <p className="text-muted-foreground mt-4 text-lg md:text-xl">
          Start festen med de beste gratis partyspillene!
        </p>
      </motion.header>
      
      <motion.div 
        className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: 0.1 } } }}
      >
        <Button size="lg" onClick={handleSurpriseMeClick} className="h-14 text-lg transform transition-transform duration-200 hover:scale-105">
          <Dices className="mr-3 h-6 w-6"/>
          Overrask meg!
        </Button>
        <Button size="lg" variant="secondary" asChild className="h-14 text-lg transform transition-transform duration-200 hover:scale-105">
            <Link href="/alle-spill">
                <Gamepad2 className="mr-3 h-6 w-6" />
                Se alle spill
            </Link>
        </Button>
      </motion.div>
      
       {/* Player Setup */}
      <motion.div className="mb-8 w-full max-w-md mx-auto" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: 0.2 } } }}>
          <PlayerSetup open={isPlayerSetupOpen} onOpenChange={setIsPlayerSetupOpen} onSetupComplete={handleSetupComplete}>
             {isLoaded && players.length === 0 && (
                <Button variant="outline" className="w-full h-12" onClick={() => setIsPlayerSetupOpen(true)}>
                    <Users className="mr-2 h-5 w-5" /> Legg til spillere
                </Button>
            )}
          </PlayerSetup>
          {isLoaded && players.length > 0 && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
                  <Card className="bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                      <CardTitle className="text-xl flex items-center gap-2">
                          <Users className="h-5 w-5" /> Hvem spiller?
                      </CardTitle>
                      <CardDescription>{players.length} spillere er klare for fest.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                      {players.map(player => (
                          <motion.div key={player.id} layout initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="bg-muted text-muted-foreground font-medium py-1 px-3 rounded-full text-sm">
                              {player.name}
                          </motion.div>
                      ))}
                  </CardContent>
                  <CardFooter className="grid grid-cols-2 gap-2 pt-4">
                    <Button variant="outline" className="w-full" onClick={() => setIsPlayerSetupOpen(true)}>Endre spillere</Button>
                    <Button asChild>
                      <Link href="/oppsummering">
                          <Trophy className="mr-2 h-5 w-5" />
                          Oppsummering
                      </Link>
                    </Button>
                  </CardFooter>
                  </Card>
              </motion.div>
          )}
      </motion.div>

      <motion.div
        className="mb-16 w-full max-w-md mx-auto"
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: 0.4 } } }}
      >
        <PartyTools />
      </motion.div>

      <motion.div className="mb-20" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: 0.3 } } }}>
          <h2 className="text-2xl font-bold text-center mb-6 font-headline flex items-center justify-center gap-2">
            ⭐ Anbefalt Nå
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {recommendedGames.map((game) => (
                  <Link key={game.id} href={`/spill/${game.id}`} className="group block">
                      <Card className="h-full flex flex-col transition-all duration-300 bg-card/60 backdrop-blur-sm border-border hover:border-primary hover:scale-105 hover:shadow-2xl hover:shadow-primary/10">
                          <CardHeader className="flex-row items-start gap-4">
                              <div className="text-4xl mt-1">{game.emoji}</div>
                              <div>
                                  <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">{game.title}</CardTitle>
                                  <CardDescription className="mt-1 text-muted-foreground/80">{game.description}</CardDescription>
                              </div>
                          </CardHeader>
                      </Card>
                  </Link>
              ))}
          </div>
      </motion.div>

      <motion.div className="mb-20" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: 0.5 } } }}>
        <h2 className="text-2xl font-bold text-center mb-6 font-headline flex items-center justify-center gap-2">
            <Wand2 className="h-6 w-6 text-primary" /> Utforsk temaer
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
            <Link href="/russetiden" className="group block">
                <Card className="text-center p-6 transition-all duration-300 bg-card/60 backdrop-blur-sm border-border hover:border-accent hover:scale-105 hover:shadow-2xl hover:shadow-accent/10">
                    <div className="text-4xl mb-2">🚌</div>
                    <h3 className="font-semibold text-lg group-hover:text-accent transition-colors">Russetiden</h3>
                </Card>
            </Link>
            <Link href="/fadderuka" className="group block">
                <Card className="text-center p-6 transition-all duration-300 bg-card/60 backdrop-blur-sm border-border hover:border-accent hover:scale-105 hover:shadow-2xl hover:shadow-accent/10">
                    <div className="text-4xl mb-2">🎉</div>
                    <h3 className="font-semibold text-lg group-hover:text-accent transition-colors">Fadderuka</h3>
                </Card>
            </Link>
            {themes.map(theme => (
                <Link key={theme.slug} href={`/tema/${theme.slug}`} className="group block">
                    <Card className="text-center p-6 transition-all duration-300 bg-card/60 backdrop-blur-sm border-border hover:border-accent hover:scale-105 hover:shadow-2xl hover:shadow-accent/10">
                        <div className="text-4xl mb-2">{theme.emoji}</div>
                        <h3 className="font-semibold text-lg group-hover:text-accent transition-colors">{theme.title.split(':')[0]}</h3>
                    </Card>
                </Link>
            ))}
        </div>
      </motion.div>

      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: 0.6 } } }}>
          <section className="text-center">
             <h2 className="text-xl font-bold text-center mb-4 font-headline flex items-center justify-center gap-2">
                  <Beer className="h-6 w-6 text-accent" /> Klassiske Drikkeleker
              </h2>
              <p className="text-muted-foreground mb-4">Reglene til tidløse fest-klassikere som Beer Pong & Ring of Fire.</p>
              <Button asChild>
                <Link href="/drikkeleker">Se alle klassikerne</Link>
              </Button>
          </section>
           <section className="text-center">
             <h2 className="text-xl font-bold text-center mb-4 font-headline flex items-center justify-center gap-2">
                  <Music className="h-6 w-6 text-primary" /> Musikkeleker
              </h2>
              <p className="text-muted-foreground mb-4">Partyspill basert på kjente sanger. Koble til anlegget og la reglene styre kvelden.</p>
              <Button asChild>
                <Link href="/musikkleker">Finn en sang</Link>
              </Button>
          </section>
          <section className="text-center">
             <h2 className="text-xl font-bold text-center mb-4 font-headline flex items-center justify-center gap-2">
                  <Clapperboard className="h-6 w-6 text-purple-400" /> Skjermleker
              </h2>
              <p className="text-muted-foreground mb-4">Spill til filmkvelden, reality-showet eller fotballkampen. Perfekt for sofaen.</p>
              <Button asChild>
                <Link href="/skjermleker">Finn et skjermspill</Link>
              </Button>
          </section>
      </motion.div>

      <motion.div className="mt-16 flex justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.5 }}>
        <AdBanner />
      </motion.div>

      <motion.div 
        className="mt-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
          <p className="text-sm text-muted-foreground">Liker du GameNight? Støtt oss med en kaffe (25 kr)! ☕</p>
          <div className="mt-4 flex justify-center items-center min-h-[48px]">
              <div className="w-full max-w-[280px]">
                  <Button
                      onClick={handleDonate}
                      disabled={isDonating}
                      className="w-full h-auto p-0 bg-transparent hover:bg-transparent disabled:opacity-50"
                      aria-label="Doner 25 kr med Vipps"
                  >
                      {isDonating ? (
                          <div className="flex items-center justify-center w-full h-[48px] bg-muted/50 rounded-lg">
                              <Loader2 className="h-6 w-6 animate-spin" />
                          </div>
                      ) : (
                          <Image
                              src="/vipps-button.svg"
                              alt="Doner 25 kr med Vipps"
                              width={280}
                              height={48}
                              className="w-full h-auto rounded-lg"
                              priority
                          />
                      )}
                  </Button>
              </div>
          </div>
      </motion.div>
      
      <Dialog open={isSurpriseMeOpen} onOpenChange={setIsSurpriseMeOpen}>
        <DialogContent>
            <DialogHeader>
            {surpriseGame && (
                <>
                <DialogTitle className="flex items-center gap-4 text-2xl">
                    <span className="text-5xl">{surpriseGame.emoji}</span>
                    {surpriseGame.title}
                </DialogTitle>
                <DialogDescription className="pt-2 text-base">
                    {surpriseGame.description}
                </DialogDescription>
                </>
            )}
            </DialogHeader>
            <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-between gap-2 pt-4">
                <Button variant="secondary" onClick={handleTryAnother}>
                    Prøv et annet
                </Button>
                <Button onClick={handleStartSurpriseGame} disabled={!surpriseGame}>
                    Kjør i gang!
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

    