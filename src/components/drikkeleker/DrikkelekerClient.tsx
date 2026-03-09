'use client';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import type { GameArticle } from '@/lib/types';
import Image from 'next/image';
import { AdBanner } from '../ads/AdBanner';
import { withBasePathIfAbsolute } from '@/lib/base-path';

type Articles = Omit<GameArticle, 'whatYouNeed' | 'rules' | 'cardRules' | 'variants' | 'attributionHtml'>[];

export function DrikkelekerClient({ games }: { games: Articles }) {
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
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tighter">
          Klassiske Drikkeleker
        </h1>
        <p className="text-muted-foreground mt-3 text-lg max-w-2xl mx-auto">
          Trenger dere en pause fra appen? Her er reglene til noen tidløse
          klassikere som kun krever kort, kopper eller bare godt humør.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game, index) => (
          <motion.div
            key={game.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Link
              href={`/drikkeleker/${game.slug}`}
              className="group block h-full"
            >
              <Card className="h-full flex flex-col transition-all duration-300 bg-card/80 backdrop-blur-sm border-border hover:border-primary hover:scale-105 hover:shadow-2xl hover:shadow-primary/10">
                {game.imageUrl && (
                  <div className="relative aspect-video w-full">
                    <Image
                      src={withBasePathIfAbsolute(game.imageUrl)}
                      alt={game.title}
                      fill
                      className="object-cover rounded-t-lg"
                      data-ai-hint={game.imageHint}
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                    {game.title}
                  </CardTitle>
                  <CardDescription className="mt-1 text-muted-foreground/80">
                    {game.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
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
