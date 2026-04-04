import { getGames } from '@/lib/games';
import { AllGamesClient } from '@/components/game/AllGamesClient';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { GameMenu } from '@/components/game/GameMenu';
import { buildBreadcrumbJsonLd, buildPageMetadata } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = buildPageMetadata({
  title: 'Alle Spill | GameNight',
  description: 'Bla gjennom alle partyspillene og finn riktig spill for kvelden.',
  path: '/alle-spill',
});

export default async function AllGamesPage() {
  const games = await getGames();
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

      <header className="mx-auto mb-6 max-w-6xl pt-12 md:mb-8 md:pt-14">
        <h1 className="text-4xl font-bold font-headline tracking-tighter md:text-5xl">
          Alle spill
        </h1>
      </header>

      <AllGamesClient games={games} />
    </div>
  );
}
