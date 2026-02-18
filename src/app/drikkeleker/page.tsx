
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from '@/components/ui/accordion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import drikkeleker from '@/data/drikkeleker.json';
import { ArrowLeft, Beer, Crown, Dice5, HelpCircle, Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = {
    title: 'Flere Drikkeleker | GameNight',
    description: 'Regler for klassiske drikkeleker og kortspill som Ring of Fire, Beer Pong og mer.',
};

type GameArticle = {
    title: string;
    description: string;
    whatYouNeed: string[];
    rules: string[];
    cardRules?: { [key: string]: string };
}

export default function DrikkelekerPage() {
    const games: GameArticle[] = drikkeleker;
  return (
    <div className="container mx-auto px-4 py-8 md:py-16 max-w-3xl">
        <div className="mb-8">
            <Button variant="ghost" asChild>
            <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Tilbake til forsiden
            </Link>
            </Button>
        </div>
        <header className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tighter">
            Klassiske Drikkeleker
            </h1>
            <p className="text-muted-foreground mt-3 text-lg max-w-2xl mx-auto">
            Trenger dere en pause fra appen? Her er reglene til noen tidløse klassikere som kun krever kort, kopper eller bare godt humør.
            </p>
        </header>

        <Accordion type="single" collapsible className="w-full">
            {games.map((game, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger className="text-xl hover:no-underline font-semibold">
                        {game.title}
                    </AccordionTrigger>
                    <AccordionContent className="pt-2">
                        <div className='space-y-6 text-muted-foreground'>
                            <p className='text-base'>{game.description}</p>
                            
                            <div>
                                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2"> <Dice5 className='h-5 w-5' />Dette trenger dere:</h3>
                                <ul className="list-disc list-inside space-y-1">
                                    {game.whatYouNeed.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                            
                            <div>
                                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2"><HelpCircle className='h-5 w-5' />Slik spiller dere:</h3>
                                <ol className="list-decimal list-inside space-y-2">
                                    {game.rules.map((rule, i) => (
                                        <li key={i}>{rule}</li>
                                    ))}
                                </ol>
                            </div>

                            {game.cardRules && (
                                <div>
                                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2"><Crown className='h-5 w-5' />Kortregler for Ring of Fire:</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                        {Object.entries(game.cardRules).map(([card, rule]) => (
                                            <div key={card} className="rounded-md border border-border/50 p-3 bg-card/40">
                                                <p className="font-bold text-foreground">{card}</p>
                                                <p>{rule}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    </div>
  )
}
