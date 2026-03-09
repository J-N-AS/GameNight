import { getGames } from '@/lib/games';
import type { Game } from '@/lib/types';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { GameMenu } from '@/components/game/GameMenu';
import { RussetidenClient } from '@/components/game/RussetidenClient';
import { buildBreadcrumbJsonLd, buildPageMetadata } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = buildPageMetadata({
  title: 'Russetid 2026: Gjør rullingen legendarisk | GameNight',
  description:
    'GameNight er rigget for russekro, rulling og nachspiel. Finn spillene som holder liv i gjengen, eller få deres helt eget buss-spill.',
  path: '/russetiden',
});

export default async function RussetidenPage() {
    const allGames = await getGames({ includeHidden: true, includeHiddenFromMain: true });
    const breadcrumbJsonLd = buildBreadcrumbJsonLd([
      { name: 'Forside', path: '/' },
      { name: 'Russetiden', path: '/russetiden' },
    ]);
  
    const standardGameIds = ['gutta', 'girl-power', 'kaosrunden', 'hemmeligheter'];
    const standardGames = standardGameIds.map(id => allGames.find(g => g.id === id)).filter(Boolean) as Omit<Game, 'items' | 'language' | 'shuffle'>[];
    
    const customGames = allGames.filter(
      (game) => game.isHiddenFromMain && game.custom && !game.hidden
    );
    
    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <JsonLd id="russetiden-breadcrumb-jsonld" data={breadcrumbJsonLd} />
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
        </div>
    );
}
