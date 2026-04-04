'use client';

import { useMemo, useState } from 'react';
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
import Image from 'next/image';
import { AdBanner } from '../ads/AdBanner';
import { withBasePathIfAbsolute } from '@/lib/base-path';
import { intensityStyles } from '@/lib/game-ui';
import {
  drikkelekGroupSizeOptions,
  getArticlePlayerLabel,
  matchesArticleGroupSize,
  type DrikkelekGroupSizeFilter,
  type DrikkelekListItem,
} from '@/lib/drikkelek-metadata';
import { cn } from '@/lib/utils';

export function DrikkelekerClient({ games }: { games: DrikkelekListItem[] }) {
  const [groupSizeFilter, setGroupSizeFilter] =
    useState<DrikkelekGroupSizeFilter>('all');
  const [intensityFilter, setIntensityFilter] = useState<
    'all' | 'low' | 'medium' | 'high'
  >('all');

  const filteredGames = useMemo(
    () =>
      games.filter((game) => {
        const matchesGroupSize = matchesArticleGroupSize(game, groupSizeFilter);
        const matchesIntensity =
          intensityFilter === 'all' ? true : game.intensity === intensityFilter;

        return matchesGroupSize && matchesIntensity;
      }),
    [games, groupSizeFilter, intensityFilter]
  );

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

      <section className="mb-8 rounded-[1.75rem] border border-border/70 bg-card/50 p-5">
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Filtrer klassikerne
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Start med gruppestørrelse og hvor intens dere vil ha leken.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Gruppestørrelse
              </p>
              <div className="flex flex-wrap gap-2">
                {drikkelekGroupSizeOptions.map((option) => (
                  <Button
                    key={option.value}
                    size="sm"
                    variant={
                      groupSizeFilter === option.value ? 'default' : 'outline'
                    }
                    onClick={() => setGroupSizeFilter(option.value)}
                    className={cn(
                      'transition-all duration-200',
                      groupSizeFilter === option.value && 'shadow-lg shadow-primary/20'
                    )}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Intensitet
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={intensityFilter === 'all' ? 'default' : 'outline'}
                  onClick={() => setIntensityFilter('all')}
                  className={cn(
                    'transition-all duration-200',
                    intensityFilter === 'all' && 'shadow-lg shadow-primary/20'
                  )}
                >
                  Alle tempo
                </Button>
                {(
                  Object.entries(intensityStyles) as Array<
                    ['low' | 'medium' | 'high', (typeof intensityStyles)['low']]
                  >
                ).map(([level, details]) => (
                  <Button
                    key={level}
                    size="sm"
                    variant={intensityFilter === level ? 'default' : 'outline'}
                    onClick={() => setIntensityFilter(level)}
                    className={cn(
                      'transition-all duration-200',
                      intensityFilter === level && 'shadow-lg shadow-primary/20'
                    )}
                  >
                    <span className={cn('mr-2 h-2.5 w-2.5 rounded-full', details.dotClass)} />
                    {details.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            Viser {filteredGames.length} av {games.length} drikkeleker.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredGames.map((game, index) => (
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
                  <div className="mb-3 flex flex-wrap gap-2">
                    {game.intensity && (
                      <span className="inline-flex items-center rounded-full border border-border/60 bg-card/70 px-2.5 py-1 text-xs font-semibold text-foreground">
                        <span
                          className={cn(
                            'mr-2 h-2.5 w-2.5 rounded-full',
                            intensityStyles[game.intensity].dotClass
                          )}
                        />
                        {intensityStyles[game.intensity].label}
                      </span>
                    )}
                    {getArticlePlayerLabel(game.players) && (
                      <span className="rounded-full border border-border/60 bg-card/70 px-2.5 py-1 text-xs font-semibold text-foreground">
                        {getArticlePlayerLabel(game.players)}
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                    {game.title}
                  </CardTitle>
                  <CardDescription className="mt-1 text-muted-foreground/80">
                    {game.description}
                  </CardDescription>
                  {game.tags && game.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {game.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </CardHeader>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
      {filteredGames.length === 0 && (
        <div className="rounded-[1.75rem] border border-dashed border-border/70 bg-card/30 px-6 py-12 text-center text-muted-foreground">
          Ingen klassikere matchet filtrene dine. Prøv en større gruppe eller et annet tempo.
        </div>
      )}
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
