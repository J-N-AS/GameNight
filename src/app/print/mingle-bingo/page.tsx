'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw, PartyPopper } from 'lucide-react';
import { motion } from 'framer-motion';
import * as htmlToImage from 'html-to-image';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const baseBingoItems = [
    "Har reist alene",
    "Snakker mer enn to språk",
    "Har et kjæledyr som ikke er hund eller katt",
    "Har bursdag samme måned som deg",
    "Spiller et instrument",
    "Er en morgenperson",
    "Har bodd i utlandet",
    "Har samme favorittsjanger på film",
    "Hater koriander",
    "Har hoppet i fallskjerm",
    "Kan et partytriks",
    "Har møtt en kjendis",
    "GRATIS RUTE ✨",
    "Heier på et annet fotballag enn deg",
    "Har aldri brukket et bein",
    "Er venstrehendt",
    "Har lest mer enn 5 bøker i år",
    "Foretrekker te over kaffe",
    "Har et mellomnavn",
    "Har vært på TV",
    "Har samme favoritt-årstid som deg",
    "Har et skjult talent",
    "Har aldri fått en fartsbot",
    "Liker ananas på pizza",
    "Har vært på en festival i utlandet"
];

// Helper to shuffle the array
const shuffleArray = (array: string[]) => {
    const freeSpotValue = 'GRATIS RUTE ✨';
    const itemsToShuffle = array.filter(item => item !== freeSpotValue);

    for (let i = itemsToShuffle.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [itemsToShuffle[i], itemsToShuffle[j]] = [itemsToShuffle[j], itemsToShuffle[i]];
    }

    // Insert free spot back in the middle
    itemsToShuffle.splice(12, 0, freeSpotValue);
    return itemsToShuffle;
};

function BingoBoard({ items }: { items: string[] }) {
    return (
        <div className="bingo-board-image flex flex-col border-4 border-primary rounded-xl p-4 bg-white text-black shadow-2xl shadow-primary/20 aspect-square w-full">
            <div className="text-center pb-3 border-b-2 border-slate-200">
                <h2 className="text-2xl font-bold font-headline text-slate-800">Mingle-Bingo</h2>
                <p className="text-sm text-slate-500">Finn én person for hver rute!</p>
            </div>
            <div className="grid grid-cols-5 grid-rows-5 gap-2 flex-grow pt-3">
                {items.map((item, index) => (
                    <div 
                        key={index} 
                        className={`flex items-center justify-center text-center text-[10px] leading-tight font-semibold p-1 aspect-square rounded-md ${item.includes('GRATIS') ? 'bg-primary text-primary-foreground text-base' : 'bg-slate-100 text-slate-700'}`}
                    >
                        {item}
                    </div>
                ))}
            </div>
            <div className="flex justify-between items-center text-xs text-slate-500 pt-3 border-t-2 border-slate-200 mt-2">
                <span className="flex items-center gap-1.5 font-semibold">Laget med <PartyPopper className="inline h-4 w-4 text-primary" /></span>
                <span className="font-bold text-lg text-slate-800">GameNight.no</span>
            </div>
        </div>
    );
}

export default function MingleBingoGeneratorPage() {
    const [boardItems, setBoardItems] = useState(() => shuffleArray(baseBingoItems));
    const boardRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();
    const [isDownloading, setIsDownloading] = useState(false);

    const generateNewBoard = useCallback(() => {
        setBoardItems(shuffleArray(baseBingoItems));
    }, []);
    
    const handleDownload = useCallback(async () => {
        if (!boardRef.current) {
            toast({ title: "Feil", description: "Kunne ikke finne bingobrettet.", variant: "destructive" });
            return;
        }

        setIsDownloading(true);
        try {
            const dataUrl = await htmlToImage.toPng(boardRef.current, { 
                pixelRatio: 3, // Higher resolution for printing
                backgroundColor: '#ffffff', // Set a white background for the generated image
                style: {
                    margin: '0',
                }
            });
            const link = document.createElement('a');
            link.download = `gamenight-mingle-bingo.png`;
            link.href = dataUrl;
            link.click();
             toast({
                title: "Bildet er lastet ned!",
                description: "Du finner det i nedlastingsmappen din.",
            });
        } catch (error) {
            console.error("Could not generate image:", error);
            toast({
                title: "Noe gikk galt",
                description: "Kunne ikke generere bildet. Prøv igjen.",
                variant: "destructive"
            });
        } finally {
            setIsDownloading(false);
        }
    }, [toast]);

    return (
        <div className="bg-background text-foreground min-h-screen p-4 sm:p-8 flex flex-col items-center">
            <header className="text-center mb-8 max-w-lg mx-auto">
                <h1 className="text-3xl font-bold font-headline">Mingle-Bingo Generator</h1>
                <p className="text-muted-foreground mt-2">Generer og last ned unike bingobrett for å bryte isen. Hvert trykk på "Lag nytt brett" gir en helt ny kombinasjon, perfekt for å dele ut forskjellige versjoner til gruppen.</p>
            </header>

            <motion.div 
                ref={boardRef} 
                className="w-full max-w-md mb-8"
                key={boardItems.join('-')} // Re-trigger animation on change
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                <BingoBoard items={boardItems} />
            </motion.div>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <Button onClick={handleDownload} size="lg" className="flex-1 h-12" disabled={isDownloading}>
                    <Download className="mr-2 h-5 w-5" />
                    {isDownloading ? 'Laster ned...' : 'Last ned bilde'}
                </Button>
                <Button onClick={generateNewBoard} size="lg" variant="outline" className="flex-1 h-12">
                    <RefreshCw className="mr-2 h-5 w-5" />
                    Lag et nytt brett
                </Button>
            </div>

            <footer className="text-center mt-8">
                 <Button variant="link" asChild>
                    <Link href="/fadderuka">Tilbake til Fadderuka-siden</Link>
                </Button>
            </footer>
        </div>
    );
}
