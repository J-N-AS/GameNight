import { getGame } from '@/lib/games';
import { GameClient } from '@/components/game/GameClient';
import { notFound } from 'next/navigation';

type GamePageProps = {
  params: {
    gameId: string;
  };
};

export async function generateMetadata({ params }: GamePageProps) {
  try {
    const game = await getGame(params.gameId);
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

  return <GameClient game={game} />;
}
