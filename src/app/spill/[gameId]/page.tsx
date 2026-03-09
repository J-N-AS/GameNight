import { getGame } from '@/lib/games';
import { getGames } from '@/lib/games';
import { GameFlow } from '@/components/game/GameFlow';
import { notFound } from 'next/navigation';

type GamePageProps = {
  params: Promise<{
    gameId: string;
  }>;
};

export async function generateMetadata({ params }: GamePageProps) {
  const { gameId } = await params;
  try {
    const game = await getGame(gameId);
    return {
      title: `${game.title} | GameNight`,
      description: game.description,
    };
  } catch (e) {
    return {
      title: 'Spill ikke funnet | GameNight',
    };
  }
}

export async function generateStaticParams() {
  const games = await getGames({ includeHidden: true });
  return games.map((game) => ({ gameId: game.id }));
}

export default async function GamePage({ params }: GamePageProps) {
  const { gameId } = await params;
  const game = await getGame(gameId);

  if (!game) {
    notFound();
  }

  return <GameFlow game={game} />;
}
