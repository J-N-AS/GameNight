'use client';

import type { Game } from '@/lib/types';
import { useSession } from '@/hooks/usePlayers';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { AdBanner } from '@/components/ads/AdBanner';
import { Separator } from '@/components/ui/separator';

type ListedGame = Omit<Game, 'items' | 'language' | 'shuffle'>;

interface FadderukaClientProps {
    day1Games: ListedGame[];
    day3Games: ListedGame[];
    day5Games: ListedGame[];
}

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
        <>
            <div className="space-y-12">
                {renderGameSection("Dag 1: Bryt isen (Null drikkepress)", day1Games)}
                {renderGameSection("Dag 3: Vorspielet tar fyr", day3Games)}
                {renderGameSection("Dag 5: Faddergruppenes Kamp", day5Games)}
            </div>
            
            <motion.div
                className="mt-16 flex justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
            >
                <AdBanner />
            </motion.div>

            <div className="container mx-auto px-4 pb-12">
                <IcebreakerArticles />
            </div>
        </>
    );
}
