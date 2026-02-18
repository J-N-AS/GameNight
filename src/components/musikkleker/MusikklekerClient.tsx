'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Music } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import type { MusicGame } from '@/lib/types';
import { AdBanner } from '../ads/AdBanner';

export function MusikklekerClient({ games }: { games: MusicGame[] }) {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16 max-w-4xl">
      <div className="mb-8">
        <Button variant="ghost" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Tilbake til forsiden
          </Link>
        </Button>
      </div>
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tighter flex items-center justify-center gap-3">
          <Music className="h-10 w-10" />
          Musikkeleker
        </h1>
        <p className="text-muted-foreground mt-3 text-lg max-w-2xl mx-auto">
          En samling drikkeleker basert på klassiske sanger. Koble til anlegget, trykk play, og la reglene styre kvelden.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card className="h-full flex flex-col transition-all duration-300 bg-card/80 backdrop-blur-sm border-border hover:border-primary hover:scale-105 hover:shadow-2xl hover:shadow-primary/10">
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  {game.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground/80">
                  {game.artist}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground">{game.rules}</p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <a href={game.spotifyUrl} target="_blank" rel="noopener noreferrer">
                    <Music className="mr-2 h-4 w-4" />
                    Åpne på Spotify
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
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
