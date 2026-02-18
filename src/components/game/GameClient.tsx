'use client';

import type { Game, GameTask } from '@/lib/games';
import { useState, useEffect, useMemo } from 'react';
import { TaskCard } from './TaskCard';
import { Button } from '@/components/ui/button';
import { Home, Repeat } from 'lucide-react';
import Link from 'next/link';

// Helper to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function GameClient({ game }: { game: Game }) {
  const [shuffledTasks, setShuffledTasks] = useState<GameTask[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    setShuffledTasks(shuffleArray(game.items));
    setCurrentIndex(0);
    setIsFinished(false);
  }, [game]);

  const handleNextTask = () => {
    if (currentIndex < shuffledTasks.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsFinished(true);
    }
  };
  
  const handleRestart = () => {
    setShuffledTasks(shuffleArray(game.items));
    setCurrentIndex(0);
    setIsFinished(false);
  }

  const currentTask = useMemo(
    () => (shuffledTasks.length > 0 ? shuffledTasks[currentIndex] : null),
    [currentIndex, shuffledTasks]
  );

  if (isFinished) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center p-4">
            <h2 className="text-4xl font-bold mb-4">Spillet er ferdig!</h2>
            <p className="text-muted-foreground mb-8">Hva vil dere gjøre nå?</p>
            <div className="flex gap-4">
                <Button onClick={handleRestart} size="lg">
                    <Repeat className="mr-2 h-5 w-5" />
                    Spill igjen
                </Button>
                <Button variant="outline" size="lg" asChild>
                    <Link href="/">
                        <Home className="mr-2 h-5 w-5" />
                        Tilbake til lobby
                    </Link>
                </Button>
            </div>
        </div>
    )
  }

  if (!currentTask) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <p>Laster spill...</p>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col min-h-[calc(100vh-4rem)] p-4 md:p-8 cursor-pointer"
      onClick={handleNextTask}
    >
      <div className="absolute top-4 left-4 z-10">
         <Button variant="ghost" size="sm" asChild>
            <Link href="/" onClick={(e) => e.stopPropagation()}>
                <Home className="mr-2 h-4 w-4" />
                Lobby
            </Link>
         </Button>
      </div>

      <div className="flex-grow flex items-center justify-center">
        <TaskCard task={currentTask} key={currentIndex} />
      </div>

      <div className="text-center text-muted-foreground mt-4">
        Trykk hvor som helst for neste kort ({currentIndex + 1} / {shuffledTasks.length})
      </div>
    </div>
  );
}
