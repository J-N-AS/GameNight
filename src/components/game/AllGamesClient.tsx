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
import { useState, useMemo } from 'react';
import { usePlayers } from '@/hooks/usePlayers';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type GameFromGetGames = Omit<Game, 'items' | 'language' | 'shuffle'>;

const intensityMap = {
  low: { label: 'Rolig', color: 'bg-green-500' },
  medium: { label: 'Medium', color: 'bg-yellow-500' },
  high: { label: 'Høy', color: 'bg-red-500' },
};

const categories = [
  { id: 'alle', label: 'Alle', emoji: '🎉' },
  { id: 'Vorspiel', label: 'Vorspiel', emoji: '🍻' },
  { id: 'Party', label: 'Party', emoji: '🥳' },
  { id: 'Rolig', label: 'Rolig', emoji: '🤔' },
  { id: 'Kaos', label: 'Kaos', emoji: '💥' },
  { id: '18+', label: '18+', emoji: '😈' },
];

export function AllGamesClient({ games }: { games: GameFromGetGames[] }) {
  const searchParams = useSearchParams();
  const { players } = usePlayers();
  const { toast } = useToast();

  const initialCategory = searchParams.get('kategori') || 'alle';
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  const handleGameSelect = (e: React.MouseEvent, game: GameFromGetGames) => {
    if (game.requiresPlayers && players.length === 0) {
      e.preventDefault();
      toast({
        title: 'Spillere mangler',
        description: `"${game.title}" krever at du legger til spillere først. Gå til forsiden for å legge til spillere.`,
        variant: 'destructive',
      });
    }
  };

  const filteredGames = useMemo(() => {
    const sorted = [...games].sort((a, b) => {
      const intensityOrder = { low: 0, medium: 1, high: 2 };
      return intensityOrder[a.intensity] - intensityOrder[b.intensity];
    });

    if (activeCategory === 'alle') {
      return sorted;
    }
    return sorted.filter(game => game.category.includes(activeCategory));
  }, [games, activeCategory]);

  return (
    <div className="w-full max-w-5xl mx-auto">
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-10">
            {categories.map(category => (
                <Button
                    key={category.id}
                    variant={activeCategory === category.id ? 'default' : 'outline'}
                    onClick={() => setActiveCategory(category.id)}
                    className={cn("transition-all duration-200", activeCategory === category.id && "shadow-lg shadow-primary/20")}
                >
                    <span className="mr-2 text-base">{category.emoji}</span>
                    {category.label}
                </Button>
            ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {filteredGames.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Link
              href={`/spill/${game.id}`}
              onClick={e => handleGameSelect(e, game)}
              className="group block h-full"
            >
              <Card className="h-full flex flex-col transition-all duration-300 bg-card/80 backdrop-blur-sm border-border hover:border-primary hover:scale-[1.03] hover:shadow-2xl hover:shadow-primary/10">
                <CardHeader className="flex-row items-start gap-4">
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
                <div className="p-6 pt-0 mt-auto flex justify-end">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <span className={cn("h-2.5 w-2.5 rounded-full", intensityMap[game.intensity].color)}></span>
                        {intensityMap[game.intensity].label}
                    </div>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
        </div>
    </div>
  );
}
