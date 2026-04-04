'use client';

import { Fragment, type MouseEvent } from 'react';
import type { ThemeWithGames } from '@/lib/themes';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { ArrowLeft, Gamepad2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { GameMenu } from '@/components/game/GameMenu';
import { GameStartDialog } from '@/components/game/GameStartDialog';
import { AdBanner } from '../ads/AdBanner';
import { getPlayerRequirementLabel } from '@/lib/player-requirements';
import { useGameStart } from '@/hooks/useGameStart';
import { intensityStyles } from '@/lib/game-ui';
import { cn } from '@/lib/utils';
import { InlineGamePromo } from '@/components/seo/InlineGamePromo';
import { ArticleAdSlot } from '@/components/seo/ArticleAdSlot';

const articleSectionHeadings = [
  'Hvorfor denne stemningen fungerer',
  'Slik holder dere flyten gjennom kvelden',
  'Decks som passer perfekt videre',
  'Slik gjør dere kvelden komplett',
] as const;

type ThemeGame = ThemeWithGames['games'][number];

function ThemeDeckCard({
  game,
  onStart,
}: {
  game: ThemeGame;
  onStart: (game: ThemeGame, event?: MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <Link
      href={`/spill/${game.id}`}
      onClick={(event) => onStart(game, event)}
      className="group block h-full"
    >
      <Card className="flex h-full flex-col border-border/70 bg-card/80 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-xl hover:shadow-primary/10">
        <CardHeader className="gap-4 pb-4">
          <div className="flex items-start gap-4">
            <div className="mt-1 text-4xl">{game.emoji}</div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl font-bold tracking-tight transition-colors group-hover:text-primary">
                  {game.title}
                </h3>
                {game.audience === '18+' && (
                  <span className="rounded-full bg-destructive/80 px-2 py-0.5 text-xs font-medium text-destructive-foreground">
                    18+
                  </span>
                )}
              </div>
              <CardDescription className="mt-2 text-muted-foreground/85">
                {game.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardFooter className="mt-auto flex items-center justify-between gap-4 pt-0">
          <div className="min-w-0">
            {getPlayerRequirementLabel(game) && (
              <span className="rounded-full bg-primary/15 px-2.5 py-1 text-xs font-semibold text-foreground/80">
                {getPlayerRequirementLabel(game)}
              </span>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2 text-sm font-medium text-muted-foreground">
            <span
              className={cn(
                'h-2.5 w-2.5 rounded-full',
                intensityStyles[game.intensity].dotClass
              )}
            />
            {intensityStyles[game.intensity].label}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

export function ThemePageClient({ theme }: { theme: ThemeWithGames }) {
  const { startGame, gameStartDialogProps } = useGameStart();
  const articleSections = theme.content.map((paragraph, index) => ({
    heading:
      articleSectionHeadings[index] ?? `Del ${index + 1}`,
    paragraph,
  }));

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mx-auto mb-8 flex max-w-5xl items-center justify-between gap-3">
        <nav aria-label="Tilbake til forsiden">
          <Button variant="ghost" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Tilbake til forsiden
            </Link>
          </Button>
        </nav>

        <GameMenu context="lobby" />
      </div>

      <article className="mx-auto max-w-3xl space-y-10 md:space-y-12">
        <header className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Temaside fra GameNight
          </p>
          <div className="mb-4 mt-4 text-5xl md:text-6xl">{theme.emoji}</div>
          <h1 className="text-4xl font-bold font-headline tracking-tighter md:text-5xl">
            {theme.title}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            {theme.metaDescription}
          </p>
        </header>

        <figure className="overflow-hidden rounded-[2rem] border border-border/70 bg-gradient-to-br from-card via-card to-primary/10 shadow-xl shadow-black/10">
          <div className="relative p-6 md:p-8">
            <div className="absolute -right-10 top-0 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-28 w-28 rounded-full bg-accent/15 blur-3xl" />

            <figcaption className="relative space-y-5">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] border border-primary/15 bg-background/70 text-4xl shadow-inner shadow-black/10">
                  {theme.emoji}
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground/70">
                    Kurert leseguide
                  </p>
                  <p className="mt-2 text-base leading-7 text-muted-foreground">
                    Les deg inn på stemningen først, og hopp rett inn i deckene
                    som matcher anledningen når dere er klare.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {theme.games.map((game) => (
                  <span
                    key={game.id}
                    className="rounded-full border border-primary/15 bg-background/70 px-3 py-1 text-xs font-semibold text-foreground/80"
                  >
                    {game.emoji} {game.title}
                  </span>
                ))}
              </div>
            </figcaption>
          </div>
        </figure>

        {articleSections.map((section, index) => {
          const promoGame = theme.games[index];
          const isLastSection = index === articleSections.length - 1;

          return (
            <Fragment key={`${theme.slug}-section-${index}`}>
              <motion.section
                aria-labelledby={`${theme.slug}-section-heading-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.08 * index }}
                className="space-y-4"
              >
                <h2
                  id={`${theme.slug}-section-heading-${index}`}
                  className="text-2xl font-bold font-headline tracking-tight md:text-3xl"
                >
                  {section.heading}
                </h2>
                <p className="text-[1.0625rem] leading-8 text-foreground/90 md:text-lg">
                  {section.paragraph}
                </p>
              </motion.section>

              {!isLastSection && promoGame && (
                <InlineGamePromo
                  deckId={promoGame.id}
                  title={promoGame.title}
                  description={promoGame.description}
                  emoji={promoGame.emoji}
                  audience={promoGame.audience}
                  intensity={promoGame.intensity}
                  requiresPlayers={promoGame.requiresPlayers}
                  minPlayers={promoGame.minPlayers}
                  gameType={promoGame.gameType}
                  onStart={(event) => startGame(promoGame, event)}
                />
              )}

              {!isLastSection && (
                <ArticleAdSlot slotId={`${theme.slug}-inline-ad-${index + 1}`} />
              )}
            </Fragment>
          );
        })}
      </article>

      <section
        aria-labelledby="theme-deck-grid-heading"
        className="mx-auto mt-16 max-w-5xl"
      >
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="theme-deck-grid-heading"
            className="text-3xl font-bold font-headline tracking-tight md:text-4xl"
          >
            Spill deckene som matcher denne stemningen
          </h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground md:text-lg">
            Her er GameNight-deckene som passer best til temaet. Hver runde tar
            dere rett inn i appflyten med den aktuelle decken klar.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {theme.games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
            >
              <ThemeDeckCard game={game} onStart={startGame} />
            </motion.div>
          ))}
        </div>
      </section>

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

      <motion.aside
        className="mx-auto mt-16 max-w-5xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        aria-label="Annonse"
      >
        <AdBanner className="mx-auto max-w-md" />
      </motion.aside>

      <GameStartDialog {...gameStartDialogProps} />
    </div>
  );
}
