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
import { useSession } from '@/hooks/usePlayers';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';

type GameFromGetGames = Omit<Game, 'items' | 'language' | 'shuffle'>;

const intensityMap = {
  low: { label: 'Rolig', color: 'bg-green-500' },
  medium: { label: 'Medium', color: 'bg-yellow-500' },
  high: { label: 'Høy', color: 'bg-red-500' },
};

export function AllGamesClient({ games }: { games: GameFromGetGames[] }) {
  const searchParams = useSearchParams();
  const { players } = useSession();
  const { toast } = useToast();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState('');
  const [allTags, setAllTags] = useState<string[]>([]);
  const [activeTag, setActiveTag] = useState('Alle');
  
  useEffect(() => {
    const uniqueTags = new Set<string>();
    games.forEach(game => {
      game.category?.forEach(cat => uniqueTags.add(cat));
      game.tags?.forEach(tag => uniqueTags.add(tag));
    });
    setAllTags(['Alle', ...Array.from(uniqueTags).sort()]);

    const initialCategory = searchParams.get('kategori');
    if(initialCategory && uniqueTags.has(initialCategory)) {
        setActiveTag(initialCategory);
    }

  }, [games, searchParams]);

  const handleGameSelect = (e: React.MouseEvent, game: GameFromGetGames) => {
    if (game.requiresPlayers && players.length === 0) {
      e.preventDefault();
      toast({
        title: 'Spillere mangler',
        description: `"${game.title}" krever spillere. Vi sender deg til oppsett, så kan du fortsette rett tilbake.`,
        variant: 'destructive',
      });
      router.push(
        `/?setupPlayers=1&returnTo=${encodeURIComponent(`/spill/${game.id}`)}`
      );
    }
  };

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

        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-10">
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

        <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
        {filteredGames.map((game) => (
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
                <div className="p-6 pt-0 mt-auto flex justify-between items-center">
                    <div className="flex flex-wrap gap-1">
                        {game.requiresPlayers && (
                            <span className="text-xs font-semibold text-foreground/80 bg-primary/15 px-2 py-0.5 rounded-full">Krever spillere</span>
                        )}
                        {game.tags?.map(tag => (
                            <span key={tag} className="text-xs font-semibold text-muted-foreground/70 bg-muted/50 px-2 py-0.5 rounded-full">{tag}</span>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <span className={cn("h-2.5 w-2.5 rounded-full", intensityMap[game.intensity].color)}></span>
                        {intensityMap[game.intensity].label}
                    </div>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
        </motion.div>

        {filteredGames.length === 0 && (
            <motion.div layout initial={{opacity: 0}} animate={{opacity: 1}} className="text-center py-16 text-muted-foreground">
                <p className="text-lg font-medium">Ingen spill matchet søket ditt.</p>
                <p>Prøv å endre søkeordet eller fjerne filteret.</p>
            </motion.div>
        )}
    </div>
  );
}
