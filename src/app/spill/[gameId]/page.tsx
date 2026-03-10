import type { Metadata } from 'next';
import Link from 'next/link';
import { AdBanner } from '@/components/ads/AdBanner';
import { GameFlow } from '@/components/game/GameFlow';
import { JsonLd } from '@/components/seo/JsonLd';
import { getGame, getGames } from '@/lib/games';
import { getThemes } from '@/lib/themes';
import type { Game } from '@/lib/types';
import { buildBreadcrumbJsonLd, buildPageMetadata } from '@/lib/seo';

type GamePageProps = {
  params: Promise<{
    gameId: string;
  }>;
};

type ListedGame = Omit<Game, 'items' | 'language' | 'shuffle'>;

const MAX_RELATED_GAMES = 4;

function getRelatedGames(game: Game, allGames: ListedGame[]): ListedGame[] {
  const sourceTopics = new Set([...(game.category ?? []), ...(game.tags ?? [])]);

  const primaryMatches = allGames.filter((candidate) => {
    if (candidate.id === game.id) {
      return false;
    }

    const candidateTopics = [...(candidate.category ?? []), ...(candidate.tags ?? [])];
    return candidateTopics.some((topic) => sourceTopics.has(topic));
  });

  if (primaryMatches.length >= MAX_RELATED_GAMES) {
    return primaryMatches.slice(0, MAX_RELATED_GAMES);
  }

  const primaryIds = new Set(primaryMatches.map((candidate) => candidate.id));
  const fallbackMatches = allGames.filter((candidate) => {
    return candidate.id !== game.id && !primaryIds.has(candidate.id);
  });

  return [...primaryMatches, ...fallbackMatches].slice(0, MAX_RELATED_GAMES);
}

export async function generateMetadata({
  params,
}: GamePageProps): Promise<Metadata> {
  const { gameId } = await params;

  try {
    const game = await getGame(gameId);

    return buildPageMetadata({
      title: `${game.title} | GameNight`,
      description: game.description,
      path: `/spill/${game.id}`,
      noindex: Boolean(game.hidden || game.isHiddenFromMain),
    });
  } catch {
    return buildPageMetadata({
      title: 'Spill ikke funnet | GameNight',
      description: 'Spillet du leter etter finnes ikke.',
      path: '/alle-spill',
      noindex: true,
    });
  }
}

export async function generateStaticParams() {
  const games = await getGames({ includeHidden: true, includeHiddenFromMain: true });
  return games.map((game) => ({ gameId: game.id }));
}

export default async function GamePage({ params }: GamePageProps) {
  const { gameId } = await params;

  const [game, allGames, themes] = await Promise.all([
    getGame(gameId),
    getGames(),
    getThemes(),
  ]);

  const relatedGames = getRelatedGames(game, allGames);
  const relatedThemes = themes.filter((theme) => theme.gameIds.includes(game.id)).slice(0, 3);

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Forside', path: '/' },
    { name: 'Alle spill', path: '/alle-spill' },
    { name: game.title, path: `/spill/${game.id}` },
  ]);

  return (
    <>
      <JsonLd id="game-breadcrumb-jsonld" data={breadcrumbJsonLd} />
      <h1 className="sr-only">{game.title}</h1>
      <GameFlow game={game} />

      <section className="container mx-auto max-w-5xl px-4 pb-6 pt-4">
        <AdBanner className="mx-auto max-w-md" />
      </section>

      <section
        className="container mx-auto max-w-5xl px-4 py-10"
        data-hide-during-gameplay="true"
      >
        <h2 className="text-2xl md:text-3xl font-bold font-headline text-center">
          Flere spill i samme stemning
        </h2>
        <p className="text-center text-muted-foreground mt-3 max-w-2xl mx-auto">
          Liker dere {game.title}? Her er flere forslag dere kan gå videre til.
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-3">Relaterte spill</h3>
            <ul className="space-y-2">
              {relatedGames.map((relatedGame) => (
                <li key={relatedGame.id}>
                  <Link href={`/spill/${relatedGame.id}`} className="text-primary hover:underline">
                    {relatedGame.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/alle-spill" className="text-primary hover:underline">
                  Se alle spill
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Temaer dette spillet inngår i</h3>
            {relatedThemes.length > 0 ? (
              <ul className="space-y-2">
                {relatedThemes.map((theme) => (
                  <li key={theme.slug}>
                    <Link href={`/tema/${theme.slug}`} className="text-primary hover:underline">
                      {theme.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">
                Spillet er ikke knyttet til en egen temaside ennå. Utforsk flere
                kategorier fra{' '}
                <Link href="/alle-spill" className="text-primary hover:underline">
                  alle spill
                </Link>
                .
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
