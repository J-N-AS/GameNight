'use client';

import type { Game } from '@/lib/types';
import { useSession } from '@/hooks/usePlayers';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

type ListedGame = Omit<Game, 'items' | 'language' | 'shuffle'>;

interface FadderukaClientProps {
    day1Games: ListedGame[];
    day3Games: ListedGame[];
    day5Games: ListedGame[];
}

export function FadderukaClient({ day1Games, day3Games, day5Games }: FadderukaClientProps) {
    const { players } = useSession();
    const { toast } = useToast();

    const handleGameSelect = (e: React.MouseEvent, game: ListedGame) => {
        if (game.requiresPlayers && players.length === 0) {
            e.preventDefault();
            toast({
                title: 'Spillere mangler',
                description: `"${game.title}" krever at du legger til spillere først. Gå til forsiden for å legge til spillere.`,
                variant: 'destructive',
            });
        }
    };
    
    const renderGameSection = (title: string, games: ListedGame[]) => (
        <div className="mb-16">
            <h2 className="text-3xl font-bold font-headline tracking-tighter text-center mb-6">{title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {games.map((game) => (
                    <motion.div key={game.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <Link href={`/spill/${game.id}`} onClick={(e) => handleGameSelect(e, game)} className="group block h-full">
                            <Card className="h-full flex flex-col transition-all duration-300 bg-card/80 backdrop-blur-sm border-border hover:border-primary hover:scale-105 hover:shadow-2xl hover:shadow-primary/10">
                                <CardHeader className="flex-row items-start gap-4">
                                    <div className="text-4xl mt-1">{game.emoji}</div>
                                    <div>
                                        <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">{game.title}</CardTitle>
                                        <CardDescription className="mt-1 text-muted-foreground/80">{game.description}</CardDescription>
                                    </div>
                                </CardHeader>
                            </Card>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="space-y-12">
            {renderGameSection("Dag 1: Bryt isen (Null drikkepress)", day1Games)}
            {renderGameSection("Dag 3: Vorspielet tar fyr", day3Games)}
            {renderGameSection("Dag 5: Faddergruppenes Kamp", day5Games)}
        </div>
    );
}
