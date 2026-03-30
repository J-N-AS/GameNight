'use client';

import type { ThemeWithGames } from '@/lib/themes';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowLeft, Gamepad2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { GameMenu } from '@/components/game/GameMenu';
import { AdBanner } from '../ads/AdBanner';
import { getPlayerRequirementLabel } from '@/lib/player-requirements';
import { useGameStart } from '@/hooks/useGameStart';
import { intensityStyles } from '@/lib/game-ui';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function ThemePageClient({ theme }: { theme: ThemeWithGames }) {
  const { startGame } = useGameStart();
  const [introParagraph, ...extraParagraphs] = theme.content;
  
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="absolute top-4 left-4 z-10">
        <Button variant="ghost" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Tilbake til forsiden
          </Link>
        </Button>
      </div>
      <div className="absolute top-4 right-4 z-10">
        <GameMenu context="lobby" />
      </div>

      <header className="text-center my-10 md:my-12 pt-8">
          <div className="text-5xl md:text-6xl mb-4">{theme.emoji}</div>
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tighter">
          {theme.title}
        </h1>
        {introParagraph && (
          <p className="mx-auto mt-6 max-w-3xl text-lg text-muted-foreground">
            {introParagraph}
          </p>
        )}
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {theme.games.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
          >
            <Link
              href={`/spill/${game.id}`}
              onClick={(e) => startGame(game, e)}
              className="group block h-full"
            >
              <Card className="h-full flex flex-col transition-all duration-300 bg-card/80 backdrop-blur-sm border-border hover:border-primary hover:scale-105 hover:shadow-2xl hover:shadow-primary/10">
                <CardHeader className="flex-row items-start gap-4 pb-4">
                  <div className="text-4xl mt-1">{game.emoji}</div>
                  <div>
                    <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                      {game.title}
                      {game.audience === '18+' && <span className="ml-2 text-xs font-medium bg-destructive/80 text-destructive-foreground px-2 py-0.5 rounded-full">18+</span>}
                    </CardTitle>
                    <CardDescription className="mt-1 text-muted-foreground/80">
                      {game.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                <div className="mt-auto flex items-center justify-between gap-4 px-6 pb-6">
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
        ))}
      </div>

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

      <motion.div
        className="mt-16 flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <AdBanner />
      </motion.div>

      {extraParagraphs.length > 0 && (
        <motion.div
          className="mx-auto mt-12 max-w-4xl rounded-[1.75rem] border border-border/70 bg-card/40 px-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <Accordion type="single" collapsible>
            <AccordionItem value="theme-guide" className="border-none">
              <AccordionTrigger className="py-4 text-left text-base font-semibold text-foreground hover:no-underline">
                Les mer om denne stemningen
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pb-5 text-base text-muted-foreground">
                {extraParagraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
      )}
    </div>
  );
}
