import { getGames } from '@/lib/games';
import { AllGamesClient } from '@/components/game/AllGamesClient';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { GameMenu } from '@/components/game/GameMenu';
import { buildBreadcrumbJsonLd, buildPageMetadata } from '@/lib/seo';
import { getThemes } from '@/lib/themes';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = buildPageMetadata({
  title: 'Alle Spill | GameNight',
  description:
    'Utforsk alle partyspillene. Sorter etter stemning og intensitet for å finne det perfekte spillet for kvelden.',
  path: '/alle-spill',
});

export default async function AllGamesPage() {
  const games = await getGames();
  const themes = await getThemes();
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Forside', path: '/' },
    { name: 'Alle spill', path: '/alle-spill' },
  ]);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <JsonLd id="all-games-breadcrumb-jsonld" data={breadcrumbJsonLd} />
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
          Alle GameNight-spill
        </h1>
        <p className="text-muted-foreground mt-3 text-lg max-w-2xl mx-auto">
          Sorter etter stemning og intensitet for å finne det perfekte spillet for kvelden.
        </p>
      </header>

      <section aria-labelledby="alle-spill-temaer" className="mb-10">
        <h2
          id="alle-spill-temaer"
          className="text-xl md:text-2xl font-bold font-headline text-center mb-4"
        >
          Utforsk etter stemning
        </h2>
        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
          {themes.map((theme) => (
            <Button key={theme.slug} asChild variant="outline" size="sm">
              <Link href={`/tema/${theme.slug}`}>
                <span className="mr-1.5">{theme.emoji}</span>
                {theme.title}
              </Link>
            </Button>
          ))}
        </div>
      </section>

      <AllGamesClient games={games} />
    </div>
  );
}
