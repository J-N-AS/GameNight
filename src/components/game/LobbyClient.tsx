'use client';

import { useState } from 'react';
import { Rocket, Gamepad2, Users, Beer, PartyPopper } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import type { Game } from '@/lib/types';
import { AdBanner } from '@/components/ads/AdBanner';

type GameFromGetGames = Omit<Game, 'items' | 'language' | 'shuffle'>;

const moods = [
    { name: 'Vorspiel', emoji: '🍻', link: '/alle-spill?kategori=Vorspiel' },
    { name: 'Party', emoji: '🥳', link: '/alle-spill?kategori=Party' },
    { name: 'Kaos', emoji: '💥', link: '/alle-spill?kategori=Kaos' },
    { name: 'Sexy / 18+', emoji: '😈', link: '/alle-spill?kategori=18+' },
];

export function LobbyClient({ recommendedGames }: { recommendedGames: GameFromGetGames[] }) {
  const [isPlayerSetupOpen, setIsPlayerSetupOpen] = useState(false);
  const { players, isLoaded } = usePlayers();
  const [code, setCode] = useState('');
  const router = useRouter();
  
  const handleSetupComplete = () => {
    setIsPlayerSetupOpen(false);
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      router.push(`/spill/${code.trim().toLowerCase()}`);
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
          className="w-auto h-auto mx-auto max-w-[300px] md:max-w-[400px] drop-shadow-[0_5px_15px_rgba(0,0,0,0.2)]"
        />
        <p className="text-muted-foreground mt-4 text-lg md:text-xl">
          Start festen med de beste gratis partyspillene!
        </p>
      </motion.header>
      
      {/* Hero CTA */}
      <motion.div 
        className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: 0.1 } } }}
      >
        <Button size="lg" asChild className="h-14 text-lg transform transition-transform duration-200 hover:scale-105">
            <Link href={`/spill/${recommendedGames[0]?.id || 'vorspiel-mix'}`}>
                <Rocket className="mr-3 h-6 w-6"/>
                Start anbefalt spill
            </Link>
        </Button>
        <Button size="lg" variant="secondary" asChild className="h-14 text-lg transform transition-transform duration-200 hover:scale-105">
            <Link href="/alle-spill">
                <Gamepad2 className="mr-3 h-6 w-6" />
                Velg spill selv
            </Link>
        </Button>
      </motion.div>
      
       {/* Player Setup */}
      <motion.div className="mb-16 w-full max-w-md mx-auto" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: 0.2 } } }}>
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
                  <CardFooter>
                      <Button variant="outline" className="w-full" onClick={() => setIsPlayerSetupOpen(true)}>Endre spillere</Button>
                  </CardFooter>
                  </Card>
              </motion.div>
          )}
      </motion.div>

      {/* Recommended Games */}
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

      {/* Moods */}
      <motion.div className="mb-20" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: 0.4 } } }}>
        <h2 className="text-2xl font-bold text-center mb-6 font-headline flex items-center justify-center gap-2">
            🎉 Hva slags kveld er dette?
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {moods.map(mood => (
                <Link key={mood.name} href={mood.link} className="group block">
                    <Card className="text-center p-6 transition-all duration-300 bg-card/60 backdrop-blur-sm border-border hover:border-accent hover:scale-105 hover:shadow-2xl hover:shadow-accent/10">
                        <div className="text-4xl mb-2">{mood.emoji}</div>
                        <h3 className="font-semibold text-lg group-hover:text-accent transition-colors">{mood.name}</h3>
                    </Card>
                </Link>
            ))}
        </div>
        <div className="text-center mt-8">
            <Button variant="secondary" asChild>
                <Link href="/alle-spill">
                    <Gamepad2 className="mr-2 h-5 w-5" />
                    Se alle spill
                </Link>
            </Button>
        </div>
      </motion.div>
      
      {/* Secret Code & Classic Games */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: 0.5 } } }}>
          <section className="text-center">
              <h2 className="text-xl font-bold text-center mb-4 font-headline flex items-center justify-center gap-2">
                  <PartyPopper className="h-6 w-6 text-primary" /> Har du en hemmelig kode?
              </h2>
              <form onSubmit={handleCodeSubmit} className="max-w-sm mx-auto flex gap-2">
                  <Input type="text" value={code} onChange={e => setCode(e.target.value)} placeholder="🤫 Skriv inn koden..." className="text-center tracking-widest uppercase bg-card/80 backdrop-blur-sm h-12 text-base"/>
                  <Button type="submit" variant="secondary" size="lg" className="h-12">Bli med</Button>
              </form>
          </section>
          <section className="text-center">
             <h2 className="text-xl font-bold text-center mb-4 font-headline flex items-center justify-center gap-2">
                  <Beer className="h-6 w-6 text-accent" /> Klassiske Drikkeleker
              </h2>
              <p className="text-muted-foreground mb-4">Regler for spill som Beer Pong & Ring of Fire – uten skjerm.</p>
              <Button asChild>
                <Link href="/drikkeleker">Se alle klassikerne</Link>
              </Button>
          </section>
      </motion.div>

      <motion.div className="mt-16 flex justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.5 }}>
        <AdBanner />
      </motion.div>
    </motion.div>
  );
}
