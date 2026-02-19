'use client';

import type { Game } from '@/lib/types';
import { useSession } from '@/hooks/usePlayers';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AdBanner } from '@/components/ads/AdBanner';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PartyPopper } from 'lucide-react';
import { GameMenu } from '@/components/game/GameMenu';

type ListedGame = Omit<Game, 'items' | 'language' | 'shuffle'>;

interface FadderukaClientProps {
    day1Games: ListedGame[];
    day3Games: ListedGame[];
    day5Games: ListedGame[];
}

const SeoArticle = () => (
    <article className="prose prose-invert lg:prose-lg max-w-4xl mx-auto mt-24 mb-16 px-4">
        <h2>Den ultimate guiden til fysiske bli-kjent-leker i Fadderuka</h2>
        <p>Fadderuka er en virvelvind av nye fjes, og som fadder er din viktigste jobb å knuse den kleine stillheten. Å stole utelukkende på at praten går av seg selv fungerer sjelden. Her er fem skuddsikre isbrytere som ikke krever verken apper eller dyrt utstyr, og som garantert får stemningen i taket.</p>

        <h3>1. Hvem er jeg? (Kjendis-leken)</h3>
        <p>En sikker vinner mens folk ankommer vorspielet! Skriv navnet på kjente personer på Post-it lapper, og fest en lapp i panna eller på ryggen til hver deltaker. Deltakerne må mingle og stille hverandre ja/nei-spørsmål for å finne ut hvem de er. Taperne tar en felles skål til slutt!</p>

        <h3>2. Evolusjonsleken</h3>
        <p>Den ultimate energibomben. Alle starter som et 'Egg' ved å vralte rundt og si 'egg, egg, egg'. Når to egg møtes, spiller de stein-saks-papir. Vinneren utvikler seg til en 'Kylling' (flaks med armene), mens taperen forblir et egg. Kyllinger møter kyllinger, og vinnerne blir 'Fugler', og til slutt 'Supermenn' (med armene i været). Det er hysterisk kaos!</p>

        <h3>3. Menneskeknuten</h3>
        <p>Stå i en tett sirkel. Alle lukker øynene og strekker hendene frem, og griper to tilfeldige hender (men ikke fra personen rett ved siden av). Nå åpner dere øynene, og gruppen må samarbeide for å 'vikle ut' knuten uten at noen slipper taket. Den perfekte teambuilderen!</p>
        
        <h3>4. To Sannheter og En Løgn</h3>
        <p>Alle sitter i en sirkel. Hver person forteller tre 'fakta' om seg selv – to som er sanne, og én som er løgn. Gruppen diskuterer og stemmer over hvilken påstand de tror er løgnen. Det er en fantastisk måte å lære overraskende ting om hverandre på.</p>

        <h3>5. Mingle-Bingo</h3>
        <p>Lag et bingobrett med ulike påstander som 'Har samme favorittfilm som deg', 'Har vært i Asia', 'Snakker mer enn to språk'. Målet er å mingle og finne en person som passer til hver rute. Førstemann som får bingo, vinner heder og ære!</p>
        <Button asChild>
            <Link href="/print/mingle-bingo" target="_blank" rel="noopener noreferrer">
                <PartyPopper className="mr-2 h-4 w-4" />
                Lag Mingle-Bingo her
            </Link>
        </Button>
    </article>
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
            
            <div className="space-y-12">
                {renderGameSection("Dag 1: Bryt isen (Null drikkepress)", day1Games)}
                {renderGameSection("Dag 3: Vorspielet tar fyr", day3Games)}
                {renderGameSection("Dag 5: Faddergruppenes Kamp", day5Games)}
            </div>

            <SeoArticle />

            <motion.div
                className="w-full flex justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
            >
                <AdBanner />
            </motion.div>
        </div>
    );
}
