'use client';

import { Fragment } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';
import { ArrowLeft, Music } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import type { MusicGameCategory } from '@/lib/types';
import { AdBanner } from '../ads/AdBanner';
import { SeoLandingCta } from '@/components/seo/SeoLandingCta';

export function MusikklekerClient({ categories }: { categories: MusicGameCategory[] }) {
  const ctaInsertAfterIndex = Math.max(0, Math.ceil(categories.length / 2) - 1);

  return (
    <div className="container mx-auto px-4 py-8 md:py-16 max-w-4xl">
      <nav className="mb-8" aria-label="Tilbake til forsiden">
        <Button variant="ghost" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Tilbake til forsiden
          </Link>
        </Button>
      </nav>

      <article className="space-y-12">
        <header className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tighter flex items-center justify-center gap-3">
            <Music className="h-10 w-10" />
            Musikkeleker
          </h1>
          <p className="text-muted-foreground mt-3 text-lg max-w-2xl mx-auto">
            Musikkeleker er laget for kvelder der allsang, nostalgi og litt kaos
            er halve opplevelsen. Her finner dere sangbaserte partyspill og
            regler som gjør det enkelt å gå fra første låt til fullt vorspiel
            uten å miste flyten.
          </p>
        </header>

        <section aria-label="Musikkelek-kategorier" className="space-y-16">
          {categories.map((category, categoryIndex) => {
            const headingId = `musikkleker-kategori-${categoryIndex}`;

            return (
              <Fragment key={category.title}>
                <motion.section
                  aria-labelledby={headingId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2
                    id={headingId}
                    className="mb-6 text-center text-2xl font-bold font-headline tracking-tight md:text-3xl"
                  >
                    {category.title}
                  </h2>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {category.games.map((game, index) => (
                      <motion.div
                        key={game.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <Card className="h-full flex flex-col transition-all duration-300 bg-card/80 backdrop-blur-sm border-border hover:border-primary hover:scale-105 hover:shadow-2xl hover:shadow-primary/10">
                          <CardHeader>
                            <h3 className="text-xl font-bold leading-none tracking-tight">
                              {game.title}
                            </h3>
                            <CardDescription className="text-muted-foreground/80">
                              {game.artist}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="flex-grow">
                            <p className="text-muted-foreground">{game.rules}</p>
                          </CardContent>
                          <CardFooter>
                            <Button asChild className="w-full">
                              <a
                                href={game.spotifyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Music className="mr-2 h-4 w-4" />
                                Åpne på Spotify
                              </a>
                            </Button>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>

                {categoryIndex === ctaInsertAfterIndex && (
                  <SeoLandingCta
                    headingId="musikkleker-cta-heading"
                    title="Vil dere heller spille på mobilen?"
                    description="Når dere vil gå fra manuelle musikkleker til en komplett spillflyt, lar GameNight dere starte ferdige runder, temaer og regler på sekunder. Det er den raskeste veien fra spilleliste til faktisk spillkveld."
                  />
                )}
              </Fragment>
            );
          })}
        </section>
      </article>

      <motion.aside
        className="mt-16 flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        aria-label="Annonse"
      >
        <AdBanner />
      </motion.aside>
    </div>
  );
}
