'use client';

import type { Game } from '@/lib/types';
import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getPlayerRequirementLabel } from '@/lib/player-requirements';
import { useGameStart } from '@/hooks/useGameStart';
import { Badge } from '@/components/ui/badge';
import { getGameTier, isCoreGame } from '@/lib/game-library';
import { GameStartDialog } from './GameStartDialog';
import { intensityStyles } from '@/lib/game-ui';

type GameFromGetGames = Omit<Game, 'items' | 'language' | 'shuffle'>;
const gameGridClassName = 'grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 md:gap-5';

export function AllGamesClient({ games }: { games: GameFromGetGames[] }) {
  const { startGame, gameStartDialogProps } = useGameStart();

  const [activeTag, setActiveTag] = useState('Alle');

  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>();

    games.forEach((game) => {
      [...(game.category ?? []), ...(game.tags ?? [])].forEach((tag) => {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      });
    });

    return Array.from(counts.entries()).sort(
      (a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'nb')
    );
  }, [games]);

  const allTags = useMemo(
    () => ['Alle', ...tagCounts.map(([tag]) => tag)],
    [tagCounts]
  );

  useEffect(() => {
    const initialCategory =
      typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('kategori')
        : null;

    if (
      initialCategory &&
      tagCounts.some(([tag]) => tag === initialCategory)
    ) {
      setActiveTag(initialCategory);
    }
  }, [tagCounts]);

  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const gameTags = new Set([...(game.category ?? []), ...(game.tags ?? [])]);
      const matchesTag = activeTag === 'Alle' ? true : gameTags.has(activeTag);

      return matchesTag;
    });
  }, [games, activeTag]);

  const coreGames = useMemo(
    () => filteredGames.filter((game) => getGameTier(game.id) === 1),
    [filteredGames]
  );

  const supportingGames = useMemo(
    () => filteredGames.filter((game) => getGameTier(game.id) !== 1),
    [filteredGames]
  );

  const isDefaultBrowse = activeTag === 'Alle';

  const renderGameCard = (game: GameFromGetGames) => (
    <motion.div
      key={game.id}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <Link
        href={`/spill/${game.id}`}
        onClick={(e) => startGame(game, e)}
        className="group block h-full"
      >
        <Card className="flex h-full flex-col border-border/70 bg-card/80 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-xl hover:shadow-primary/10">
          <CardHeader className="flex-row items-start gap-4">
            <div className="text-4xl mt-1">{game.emoji}</div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                  {game.title}
                  {game.audience === '18+' && (
                    <span className="ml-2 text-xs font-medium bg-destructive/80 text-destructive-foreground px-2 py-0.5 rounded-full">
                      18+
                    </span>
                  )}
                </CardTitle>
                {isCoreGame(game.id) && (
                  <Badge
                    variant="secondary"
                    className="border-primary/25 bg-primary/15 text-primary"
                  >
                    Kjernevalg
                  </Badge>
                )}
              </div>
              <CardDescription className="mt-1 text-muted-foreground/80">
                {game.description}
              </CardDescription>
            </div>
          </CardHeader>
          <div className="mt-auto flex items-end justify-between gap-4 p-6 pt-0">
            <div className="min-w-0">
              {getPlayerRequirementLabel(game) && (
                <span className="text-xs font-semibold text-foreground/80 bg-primary/15 px-2 py-0.5 rounded-full">
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
              ></span>
              {intensityStyles[game.intensity].label}
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="relative mb-6 md:mb-8">
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-background via-background/92 to-transparent sm:w-16" />
        <div className="scrollbar-hide -mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
          <div className="flex min-w-max gap-2 pr-8">
            {allTags.map((tag) => (
              <Button
                key={tag}
                size="sm"
                variant="ghost"
                onClick={() => setActiveTag(tag)}
                className={cn(
                  'h-10 shrink-0 rounded-full border px-4 text-sm font-medium backdrop-blur-sm transition-all duration-200',
                  activeTag === tag
                    ? 'border-primary/30 bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 hover:text-primary-foreground'
                    : 'border-border/70 bg-card/65 text-muted-foreground hover:border-border hover:bg-card hover:text-foreground'
                )}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {isDefaultBrowse ? (
        <div className="space-y-10 md:space-y-12">
          {coreGames.length > 0 && (
            <section aria-labelledby="kjernebibliotek">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 id="kjernebibliotek" className="text-2xl font-bold font-headline">
                  Kjernebibliotek
                </h2>
                <span className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                  {coreGames.length} spill
                </span>
              </div>

              <motion.div layout className={gameGridClassName}>
                {coreGames.map(renderGameCard)}
              </motion.div>
            </section>
          )}

          {supportingGames.length > 0 && (
            <section aria-labelledby="flere-spill">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 id="flere-spill" className="text-2xl font-bold font-headline">
                  Flere spill
                </h2>
                <span className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                  {supportingGames.length} spill
                </span>
              </div>

              <motion.div layout className={gameGridClassName}>
                {supportingGames.map(renderGameCard)}
              </motion.div>
            </section>
          )}
        </div>
      ) : (
        <motion.div layout className={gameGridClassName}>
          {filteredGames.map(renderGameCard)}
        </motion.div>
      )}

      {filteredGames.length === 0 && (
        <motion.div
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-3xl border border-dashed border-border/70 bg-card/40 px-6 py-14 text-center text-muted-foreground"
        >
          <p className="text-lg font-medium text-foreground">Ingen spill passer dette filteret.</p>
          <p className="mt-2">Sveip videre eller velg en annen kategori.</p>
        </motion.div>
      )}
      <GameStartDialog {...gameStartDialogProps} />
    </div>
  );
}
