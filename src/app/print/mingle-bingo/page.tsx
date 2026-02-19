'use client';

import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

// Static list of items for the bingo board
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

export default function MingleBingoPrintPage() {
    return (
        <div className="bg-background text-foreground min-h-screen p-4 sm:p-8 print:p-2 print:bg-white">
            <div className="max-w-2xl mx-auto">
                <header className="text-center mb-8 print:hidden">
                    <h1 className="text-3xl font-bold font-headline">Mingle-Bingo for Fadderuka</h1>
                    <p className="text-muted-foreground mt-2">Finn én person for hver rute. Førstemann til å få 5 på rad vinner!</p>
                    <Button onClick={() => window.print()} className="mt-6">
                        <Printer className="mr-2 h-5 w-5" />
                        Skriv ut eller lagre som PDF
                    </Button>
                </header>

                <main id="bingo-board" className="border-4 border-primary rounded-lg p-2 bg-card print:border-black print:bg-white print:text-black print:rounded-none print:p-0">
                    <div className="hidden print:block text-center p-4">
                        <h2 className="text-2xl font-bold">Mingle-Bingo</h2>
                        <p className="text-sm">Finn én person for hver rute. Førstemann til 5 på rad vinner!</p>
                    </div>
                     <div className="grid grid-cols-5 grid-rows-5 gap-2 print:gap-0">
                        {bingoItems.map((item, index) => (
                            <div key={index} className={`flex items-center justify-center text-center text-xs sm:text-sm font-medium p-2 aspect-square rounded-md print:rounded-none print:border print:border-gray-300 print:aspect-auto print:h-24 ${item.includes('GRATIS') ? 'bg-primary text-primary-foreground text-base print:bg-gray-200' : 'bg-background print:bg-white'}`}>
                                {item}
                            </div>
                        ))}
                    </div>
                </main>

                 <footer className="text-center mt-8 print:hidden">
                    <Button variant="link" onClick={() => window.close()}>Lukk vindu</Button>
                </footer>
            </div>
        </div>
    );
}
