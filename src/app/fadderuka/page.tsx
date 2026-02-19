import { getGames } from '@/lib/games';
import type { Game } from '@/lib/types';
import type { Metadata } from 'next';
import { FadderukaClient } from '@/components/fadderuka/FadderukaClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { GameMenu } from '@/components/game/GameMenu';


export const metadata: Metadata = {
  title: 'Fadderuka: Den ultimate verktøykassen for faddere | GameNight',
  description: 'Gjør vorspielet episk, inkluderende og gøy. Bli-kjent-leker, lagkonkurranser og klassiske selskapsleker – alt samlet på ett sted, 100 % gratis.',
};

const IcebreakerArticles = () => (
    <div className="mt-16 md:mt-24 max-w-4xl mx-auto">
        <Separator />
        <div className="text-center py-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline tracking-tighter">
                Topp 3 fysiske isbrytere for faddergruppen
            </h2>
            <p className="text-muted-foreground mt-3 text-lg max-w-2xl mx-auto">
                Trenger dere en pause fra kortene? Her er tre enkle og hysterisk morsomme leker som garantert får opp energien og samholdet.
            </p>
        </div>
        <div className="space-y-8">
            <Card className="bg-card/60 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl font-headline">
                        <span className="text-2xl">🏷️</span>
                        Hvem er jeg? (Kjendis-leken)
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground space-y-3 text-base leading-relaxed">
                    <p>En sikker vinner mens folk ankommer vorspielet! Skriv navnet på kjente personer på Post-it lapper, og fest en lapp i panna eller på ryggen til hver deltaker.</p>
                    <p>Deltakerne må mingle og stille hverandre ja/nei-spørsmål for å finne ut hvem de er. Taperne tar en felles skål til slutt!</p>
                </CardContent>
            </Card>
            <Card className="bg-card/60 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl font-headline">
                        <span className="text-2xl">🦖</span>
                        Evolusjonsleken
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground space-y-3 text-base leading-relaxed">
                    <p>Den ultimate energibomben. Alle starter som et 'Egg' ved å vralte rundt og si 'egg, egg, egg'. Når to egg møtes, spiller de stein-saks-papir. Vinneren utvikler seg til en 'Kylling' (flaks med armene), mens taperen forblir et egg.</p>
                    <p>Kyllinger møter kyllinger, og vinnerne blir 'Fugler', og til slutt 'Supermenn' (med armene i været). Det er hysterisk kaos!</p>
                </CardContent>
            </Card>
            <Card className="bg-card/60 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl font-headline">
                        <span className="text-2xl">🪢</span>
                        Menneskeknuten
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground space-y-3 text-base leading-relaxed">
                    <p>Stå i en tett sirkel. Alle lukker øynene og strekker hendene frem, og griper to tilfeldige hender (men ikke fra personen rett ved siden av).</p>
                    <p>Nå åpner dere øynene, og gruppen må samarbeide for å 'vikle ut' knuten uten at noen slipper taket. Den perfekte teambuilderen!</p>
                </CardContent>
            </Card>
        </div>
    </div>
);


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

            <div className="container mx-auto px-4 pb-12">
                <IcebreakerArticles />
            </div>
        </div>
    );
}
