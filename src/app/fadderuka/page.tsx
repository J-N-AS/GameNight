import { getGames } from '@/lib/games';
import type { Game } from '@/lib/types';
import type { Metadata } from 'next';
import { FadderukaClient } from '@/components/fadderuka/FadderukaClient';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { GameMenu } from '@/components/game/GameMenu';


export const metadata: Metadata = {
  title: 'Fadderuka: Den ultimate verktøykassen for faddere | GameNight',
  description: 'Gjør vorspielet episk, inkluderende og gøy. Bli-kjent-leker, lagkonkurranser og klassiske selskapsleker – alt samlet på ett sted, 100 % gratis.',
};


export default async function FadderukaHubPage() {
    const allGames = await getGames({ includeHidden: true });
  
    const gameIds = {
        day1: ['icebreakeren', 'rolig-sosial'],
        day3: ['vorspiel-mix', 'pekefest'],
        day5: ['fadderkampen', 'kaosrunden'],
    };

    const findGames = (ids: string[]) => ids.map(id => allGames.find(g => g.id === id)).filter(Boolean) as Omit<Game, 'items' | 'language' | 'shuffle'>[];

    const day1Games = findGames(gameIds.day1);
    const day3Games = findGames(gameIds.day3);
    const day5Games = findGames(gameIds.day5);
    
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
                <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tighter">
                    Fadderuka: Den ultimate verktøykassen for faddere
                </h1>
                <p className="text-muted-foreground mt-3 text-lg max-w-2xl mx-auto">
                    Gjør vorspielet episk, inkluderende og gøy. Bli-kjent-leker, lagkonkurranser og klassiske selskapsleker – alt samlet på ett sted, 100 % gratis.
                </p>
            </header>

            <FadderukaClient 
                day1Games={day1Games}
                day3Games={day3Games}
                day5Games={day5Games}
            />
        </div>
    );
}
