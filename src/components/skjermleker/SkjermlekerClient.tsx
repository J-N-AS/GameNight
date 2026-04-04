'use client';

import { Fragment } from 'react';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { ArrowLeft, Clapperboard } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import type { ScreenGameCategory } from '@/lib/types';
import { AdBanner } from '../ads/AdBanner';
import { SeoLandingCta } from '@/components/seo/SeoLandingCta';

export function SkjermlekerClient({ categories }: { categories: ScreenGameCategory[] }) {
  const ctaInsertAfterIndex = Math.max(0, Math.ceil(categories.length / 2) - 1);

  return (
    <div className="container mx-auto px-4 py-8 md:py-16 max-w-4xl">
      <nav className="mb-10" aria-label="Tilbake til forsiden">
        <Button variant="ghost" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Tilbake til forsiden
          </Link>
        </Button>
      </nav>

      <article className="space-y-10 md:space-y-12">
        <header className="border-b border-border/70 pb-10 text-center">
          <div className="mx-auto max-w-2xl space-y-4">
            <div className="flex justify-center text-foreground/80" aria-hidden="true">
              <Clapperboard className="h-10 w-10 md:h-12 md:w-12" />
            </div>
            <h1 className="text-4xl font-bold font-headline tracking-tight md:text-5xl">
              Skjermleker
            </h1>
            <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
              Her finner dere skjermleker som gjør det enklere å velge noe som
              passer filmkveld, reality, sport eller TV-maraton. Reglene ligger
              klare, så dere kan bruke mindre tid på å forklare og mer tid på å
              reagere, le og følge med sammen.
            </p>
          </div>
        </header>

        <section aria-label="Skjermlek-kategorier" className="space-y-16">
          {categories.map((category, categoryIndex) => {
            const headingId = `skjermleker-kategori-${categoryIndex}`;

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
                        <Card className="h-full flex flex-col transition-all duration-300 bg-card/80 backdrop-blur-sm border-border hover:border-primary hover:shadow-2xl hover:shadow-primary/10">
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
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>

                {categoryIndex === ctaInsertAfterIndex && (
                  <SeoLandingCta
                    headingId="skjermleker-cta-heading"
                    title="Vil dere heller spille på mobilen?"
                    description="Når dere vil bytte ut manuelle regler med en ferdig runde som holder tempoet oppe, kan dere starte GameNight direkte i nettleseren."
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
