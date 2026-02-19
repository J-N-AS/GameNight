import { getGame } from '@/lib/games';
import { GameFlow } from '@/components/game/GameFlow';
import { notFound } from 'next/navigation';

type GamePageProps = {
  params: {
    gameId: string;
  };
};

export async function generateMetadata({ params }: GamePageProps) {
  const { gameId } = params;
  try {
    const game = await getGame(gameId);
    return {
      title: `${game.title} | GameNight`,
      description: game.description,
    };
  } catch (e) {
    return {
      title: 'Spill ikke funnet | GameNight'
    }
  }
}

export default async function GamePage({ params }: GamePageProps) {
  const game = await getGame(params.gameId);

  if (!game) {
    notFound();
  }

  return <GameFlow game={game} />;
}
