import { getGames } from '@/lib/games';
import type { Game } from '@/lib/types';
import type { Metadata } from 'next';
import { FadderukaClient } from '@/components/fadderuka/FadderukaClient';

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
        <FadderukaClient 
            day1Games={day1Games}
            day3Games={day3Games}
            day5Games={day5Games}
        />
    );
}
