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
import { Input } from '../ui/input';
import { Search } from 'lucide-react';
import { getPlayerRequirementLabel } from '@/lib/player-requirements';
import { useGameStart } from '@/hooks/useGameStart';
import { Badge } from '@/components/ui/badge';
import { getGameTier, isCoreGame } from '@/lib/game-library';
import { GameStartDialog } from './GameStartDialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { intensityStyles } from '@/lib/game-ui';

type GameFromGetGames = Omit<Game, 'items' | 'language' | 'shuffle'>;

export function AllGamesClient({ games }: { games: GameFromGetGames[] }) {
  const { startGame, gameStartDialogProps } = useGameStart();

  const [searchTerm, setSearchTerm] = useState('');
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

  const mobileQuickTags = useMemo(() => {
    const quickTags = ['Alle', ...tagCounts.slice(0, 5).map(([tag]) => tag)];

    if (
      activeTag !== 'Alle' &&
      allTags.includes(activeTag) &&
      !quickTags.includes(activeTag)
    ) {
      quickTags.push(activeTag);
    }

    return quickTags;
  }, [activeTag, allTags, tagCounts]);

  const additionalMobileTags = useMemo(
    () =>
      allTags.filter(
        (tag) => tag !== 'Alle' && !mobileQuickTags.includes(tag)
      ),
    [allTags, mobileQuickTags]
  );

  const filteredGames = useMemo(() => {
    const lowercasedSearch = searchTerm.toLowerCase();
    
    return games.filter(game => {
      // Search filter
      const matchesSearch = lowercasedSearch
        ? game.title.toLowerCase().includes(lowercasedSearch) ||
          game.description.toLowerCase().includes(lowercasedSearch)
        : true;

      // Tag filter
      const gameTags = new Set([...(game.category || []), ...(game.tags || [])]);
      const matchesTag = activeTag === 'Alle' ? true : gameTags.has(activeTag);

      return matchesSearch && matchesTag;
    });
  }, [games, searchTerm, activeTag]);

  const coreGames = useMemo(
    () => filteredGames.filter((game) => getGameTier(game.id) === 1),
    [filteredGames]
  );

  const supportingGames = useMemo(
    () => filteredGames.filter((game) => getGameTier(game.id) !== 1),
    [filteredGames]
  );

  const isDefaultBrowse = searchTerm.trim() === '' && activeTag === 'Alle';

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
        <Card className="h-full flex flex-col transition-all duration-300 bg-card/80 backdrop-blur-sm border-border hover:border-primary hover:scale-[1.03] hover:shadow-2xl hover:shadow-primary/10">
          <CardHeader className="flex-row items-start gap-4">
            <div className="text-4xl mt-1">{game.emoji}</div>
            <div>
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
              {game.tags && game.tags.length > 0 && (
                <div className="hidden md:flex flex-wrap gap-1 pt-2">
                  {game.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-semibold text-muted-foreground/70 bg-muted/50 px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
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
    <div className="w-full max-w-5xl mx-auto">
        <div className="mb-8 w-full max-w-lg mx-auto">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                    placeholder="Søk etter spill..."
                    className="pl-10 h-12 text-base"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        <div className="mb-10 md:hidden">
          <div className="flex gap-2 overflow-x-auto px-1 pb-2">
            {mobileQuickTags.map((tag) => (
              <Button
                key={tag}
                size="sm"
                variant={activeTag === tag ? 'default' : 'outline'}
                onClick={() => setActiveTag(tag)}
                className={cn(
                  'shrink-0 whitespace-nowrap transition-all duration-200',
                  activeTag === tag && 'shadow-lg shadow-primary/20'
                )}
              >
                {tag}
              </Button>
            ))}
          </div>

          {additionalMobileTags.length > 0 && (
            <Accordion type="single" collapsible className="mt-3 rounded-2xl border border-border/70 bg-card/40 px-4">
              <AccordionItem value="more-filters" className="border-none">
                <AccordionTrigger className="py-3 text-sm font-medium text-muted-foreground hover:no-underline">
                  Flere filtre
                </AccordionTrigger>
                <AccordionContent className="pb-1">
                  <div className="flex flex-wrap gap-2">
                    {additionalMobileTags.map((tag) => (
                      <Button
                        key={tag}
                        size="sm"
                        variant={activeTag === tag ? 'default' : 'outline'}
                        onClick={() => setActiveTag(tag)}
                        className={cn(
                          'transition-all duration-200',
                          activeTag === tag && 'shadow-lg shadow-primary/20'
                        )}
                      >
                        {tag}
                      </Button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </div>

        <div className="hidden md:flex flex-wrap justify-center gap-2 md:gap-3 mb-10">
            {allTags.map(tag => (
                <Button
                    key={tag}
                    variant={activeTag === tag ? 'default' : 'outline'}
                    onClick={() => setActiveTag(tag)}
                    className={cn("transition-all duration-200", activeTag === tag && "shadow-lg shadow-primary/20")}
                >
                    {tag}
                </Button>
            ))}
        </div>

        {isDefaultBrowse ? (
          <div className="space-y-12">
            {coreGames.length > 0 && (
              <section aria-labelledby="kjernebibliotek">
                <div className="mb-5 text-center">
                  <h2 id="kjernebibliotek" className="text-2xl font-bold font-headline">
                    Kjernebibliotek
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Dette er de tryggeste førstevalgene i GameNight: raske å starte,
                    tydelige å lese høyt og sterke i én-skjerm-formatet.
                  </p>
                </div>

                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                >
                  {coreGames.map(renderGameCard)}
                </motion.div>
              </section>
            )}

            {supportingGames.length > 0 && (
              <section aria-labelledby="temaspill">
                <div className="mb-5 text-center">
                  <h2 id="temaspill" className="text-2xl font-bold font-headline">
                    Temaspill og nisjer
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Her ligger de mer situasjonsbestemte spillene: sesong, flørt,
                    fysikk og mer spesifikke stemninger.
                  </p>
                </div>

                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                >
                  {supportingGames.map(renderGameCard)}
                </motion.div>
              </section>
            )}
          </div>
        ) : (
          <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {filteredGames.map(renderGameCard)}
          </motion.div>
        )}

        {filteredGames.length === 0 && (
            <motion.div layout initial={{opacity: 0}} animate={{opacity: 1}} className="text-center py-16 text-muted-foreground">
                <p className="text-lg font-medium">Ingen spill matchet søket ditt.</p>
                <p>Prøv å endre søkeordet eller fjerne filteret.</p>
            </motion.div>
        )}
      <GameStartDialog {...gameStartDialogProps} />
    </div>
  );
}
