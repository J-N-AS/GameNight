import { getGames } from '@/lib/games';
import type { Game } from '@/lib/types';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Gamepad2 } from 'lucide-react';
import { GameMenu } from '@/components/game/GameMenu';
import { RussetidenClient } from '@/components/game/RussetidenClient';
import { Separator } from '@/components/ui/separator';

export const metadata: Metadata = {
  title: 'Russetid 2026: Gjør rullingen legendarisk | GameNight',
  description: 'GameNight er rigget for russekro, rulling og nachspiel. Finn spillene som holder liv i gjengen, eller få deres helt eget buss-spill.',
};

const SeoArticle = () => (
    <div className="mt-16 md:mt-24 max-w-4xl mx-auto">
        <Separator />
        <div className="text-center py-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline tracking-tighter">
                3 tips for å overleve rullingen
            </h2>
        </div>
        <div className="prose prose-invert mx-auto text-muted-foreground text-lg leading-relaxed">
            <h3>Unngå Dødtid</h3>
            <p>
                Rulling kan innebære mye venting – enten det er i kø, på en parkeringsplass eller mellom stopp. Her er selskapsleker deres beste venn. Spill som ikke krever utstyr, som 'Jeg har aldri' eller 'Pekefest', er perfekte for å holde energien oppe og unngå at folk tyr til mobilen. Planlegg noen leker på forhånd, så har dere alltid noe å falle tilbake på når stemningen daler.
            </p>
            <h3>Inkluder Alle</h3>
            <p>
                På en buss eller van med mange mennesker er det lett for at små grupper danner seg. Felles leker er den beste måten å bryte ned disse barrierene på. Velg spill som får hele gjengen involvert samtidig. Lag-konkurranser, felles skåler og leker der alle må delta, bygger en sterkere felleskapsfølelse og sikrer at ingen føler seg utenfor.
            </p>
            <h3>Hold Tempoet Oppe</h3>
            <p>
                En god fest handler om flyt. For lange pauser mellom sanger eller aktiviteter kan drepe stemningen. Bruk enkle, raske spill for å fylle tomrommene. En kjapp runde 'Kaosrunden' kan umiddelbart heve energinivået. Ha en spilleliste klar, og ikke vær redd for å ta styringen for å starte en ny lek når dere merker at tempoet faller.
            </p>
        </div>
    </div>
);


export default async function RussetidenPage() {
    const allGames = await getGames({ includeHidden: true });
  
    const standardGameIds = ['gutta-stemning-bros-banter', 'girl-power-jenta-stemning', 'kaosrunden', 'hemmeligheter'];
    const standardGames = standardGameIds.map(id => allGames.find(g => g.id === id)).filter(Boolean) as Omit<Game, 'items' | 'language' | 'shuffle'>[];
    
    const customGames = allGames.filter(g => g.isHiddenFromMain);
    
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
                    Russetid 2026: Gjør rullingen legendarisk
                </h1>
                <p className="text-muted-foreground mt-3 text-lg max-w-2xl mx-auto">
                    GameNight er rigget for russekro, rulling og nachspiel. Finn spillene som holder liv i gjengen, eller få deres helt eget buss-spill.
                </p>
            </header>

            <RussetidenClient 
                standardGames={standardGames}
                customGames={customGames}
            />

            <div className="my-16 text-center">
                <Button asChild size="lg" variant="outline">
                    <Link href="/alle-spill">
                        <Gamepad2 className="mr-2 h-5 w-5" />
                        Se alle spill
                    </Link>
                </Button>
            </div>

            <div className="container mx-auto px-4 pb-12">
                <SeoArticle />
            </div>
        </div>
    );
}
