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
      <Card className="flex h-full flex-col border-border/70 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-lg">
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
  const gamesById = new Map(theme.games.map((game) => [game.id, game]));
  const inlineAdAfterBlockIndex = theme.articleBlocks.findIndex(
    (block) => block.type === 'promo'
  );
  const hasHeroGames = theme.games.length > 0;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mx-auto mb-10 flex max-w-5xl items-center justify-between gap-3">
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

      <article className="mx-auto max-w-2xl space-y-10 md:space-y-12">
        <header className="space-y-8 border-b border-border/70 pb-10">
          <div className="space-y-4">
            <div className="text-4xl md:text-5xl" aria-hidden="true">
              {theme.emoji}
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <span>{theme.games.length} spill som passer anledningen</span>
              <span className="hidden h-1 w-1 rounded-full bg-border sm:block" />
              <span>Lett å lese, lett å starte på mobil</span>
            </div>
          </div>

          <h1 className="text-4xl font-bold font-headline tracking-tight md:text-5xl">
            {theme.title}
          </h1>

          <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
            {theme.metaDescription}
          </p>

          {hasHeroGames && (
            <div className="flex flex-wrap gap-2">
              {theme.games.map((game) => (
                <span
                  key={game.id}
                  className="rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-semibold text-foreground/80"
                >
                  {game.emoji} {game.title}
                </span>
              ))}
            </div>
          )}
        </header>

        {theme.articleBlocks.map((block, index) => {
          const promoGame =
            block.type === 'promo' ? gamesById.get(block.deckId) : undefined;

          return (
            <Fragment key={`${theme.slug}-block-${index}`}>
              {block.type === 'section' ? (
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
                    {block.heading}
                  </h2>

                  <div className="space-y-4">
                    {block.paragraphs.map((paragraph, paragraphIndex) => (
                      <p
                        key={`${theme.slug}-section-${index}-paragraph-${paragraphIndex}`}
                        className="text-[1.0625rem] leading-relaxed text-foreground/90 md:text-lg"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </motion.section>
              ) : promoGame ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.08 * index }}
                >
                  <InlineGamePromo
                    deckId={promoGame.id}
                    title={promoGame.title}
                    description={promoGame.description}
                    ctaLabel={block.ctaLabel}
                    emoji={promoGame.emoji}
                    audience={promoGame.audience}
                    intensity={promoGame.intensity}
                    requiresPlayers={promoGame.requiresPlayers}
                    minPlayers={promoGame.minPlayers}
                    gameType={promoGame.gameType}
                    onStart={(event) => startGame(promoGame, event)}
                  />
                </motion.div>
              ) : null}

              {index === inlineAdAfterBlockIndex && (
                <ArticleAdSlot
                  slotId={`${theme.slug}-inline-ad`}
                  className="my-12 md:my-14"
                />
              )}
            </Fragment>
          );
        })}
      </article>

      <section
        aria-labelledby="theme-deck-grid-heading"
        className="mx-auto mt-20 max-w-5xl border-t border-border/70 pt-12"
      >
        <div className="mx-auto max-w-2xl">
          <h2
            id="theme-deck-grid-heading"
            className="text-3xl font-bold font-headline tracking-tight md:text-4xl"
          >
            Flere spill som passer til temaet
          </h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground md:text-lg">
            Vil dere holde samme stemning i gang litt lenger, finner dere flere
            spill her. Velg det som passer gruppa best og trykk dere rett inn.
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
