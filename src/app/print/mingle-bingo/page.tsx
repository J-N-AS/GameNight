'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Printer, Heart } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const bingoItems = [
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

// Helper to shuffle the array for the second board, keeping the free spot in the middle
const shuffleArray = (array: string[]) => {
    const freeSpotValue = 'GRATIS RUTE ✨';
    const itemsToShuffle = array.filter(item => item !== freeSpotValue);

    for (let i = itemsToShuffle.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [itemsToShuffle[i], itemsToShuffle[j]] = [itemsToShuffle[j], itemsToShuffle[i]];
    }

    itemsToShuffle.splice(12, 0, freeSpotValue);
    return itemsToShuffle;
};

// A self-contained Bingo Board component
function BingoBoard({ items }: { items: string[] }) {
    return (
        <div className="bingo-board flex flex-col border-4 border-primary rounded-lg p-2 bg-card print:border-2 print:border-black print:bg-white print:text-black print:p-0 print:shadow-none">
             <div className="hidden print:block text-center p-2 border-b-2 border-black">
                <h2 className="text-xl font-bold">Mingle-Bingo</h2>
                <p className="text-xs">Finn én person for hver rute. Førstemann til 5 på rad vinner!</p>
            </div>
             <div className="grid grid-cols-5 grid-rows-5 gap-2 flex-grow print:gap-0 print:border-t-2 print:border-black">
                {items.map((item, index) => (
                    <div key={index} className={`flex items-center justify-center text-center text-xs sm:text-sm font-semibold p-2 aspect-square rounded-md print:rounded-none print:border print:border-black print:aspect-auto print:p-1 print:text-[10px] print:leading-tight ${item.includes('GRATIS') ? 'bg-primary text-primary-foreground print:bg-gray-200 print:text-black print:text-sm' : 'bg-background print:bg-white print:text-black'}`}>
                        {item}
                    </div>
                ))}
            </div>
            <div className="hidden print:flex justify-between items-center text-xs text-gray-600 p-1 border-t-2 border-black">
                <span className="flex items-center gap-1">Laget med <Heart className="inline h-3 w-3" /> på <strong>GameNight.no</strong></span>
                <span>Finn flere gratis spill!</span>
            </div>
        </div>
    );
}

export default function MingleBingoPrintPage() {
    const [layout, setLayout] = useState<'single' | 'double'>('single');
    const shuffledBingoItems = useMemo(() => shuffleArray(bingoItems), []);

    return (
        <div className="bg-background text-foreground min-h-screen p-4 sm:p-8 print:p-0 print:bg-white">
            <header className="text-center mb-8 max-w-lg mx-auto print:hidden">
                <h1 className="text-3xl font-bold font-headline">Utskriftsvennlig Mingle-Bingo</h1>
                <p className="text-muted-foreground mt-2">Velg utskriftsformat nedenfor, og trykk 'Skriv ut'. Optimalisert for A4-ark.</p>
                
                <Tabs defaultValue="single" onValueChange={(value) => setLayout(value as 'single' | 'double')} className="mt-6">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="single">Ett brett per side</TabsTrigger>
                        <TabsTrigger value="double">To brett per side</TabsTrigger>
                    </TabsList>
                </Tabs>
                
                <Button onClick={() => window.print()} className="mt-6">
                    <Printer className="mr-2 h-5 w-5" />
                    Skriv ut eller lagre som PDF
                </Button>
            </header>

            {/* This is the main content area, styled for both screen and print */}
            <main id="print-area" className={layout}>
                 <BingoBoard items={bingoItems} />
                {/* The second board is only rendered if layout is double */}
                {layout === 'double' && <BingoBoard items={shuffledBingoItems} />}
            </main>

            <footer className="text-center mt-8 print:hidden">
                <Button variant="link" onClick={() => window.close()}>Lukk vindu</Button>
            </footer>
        </div>
    );
}
