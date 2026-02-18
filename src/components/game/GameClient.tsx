'use client';

import type { Game, GameTask } from '@/lib/games';
import React, { useState, useEffect, useMemo } from 'react';
import { TaskCard } from './TaskCard';
import { Button } from '@/components/ui/button';
import { Home, Repeat } from 'lucide-react';
import Link from 'next/link';
import { usePlayers } from '@/hooks/usePlayers';
import { useRouter } from 'next/navigation';

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function processPlaceholders(text: string, players: { id: string; name: string }[]): React.ReactNode {
    if (players.length < 1) {
        return text.replace(/\{player\d?\}|\{player\}|{all}/g, 'Noen').replace('{all}', 'Alle');
    }
    if (players.length < 2) {
      const player1 = players[0].name;
      return text.replace(/\{player\d?\}|\{player\}/g, player1).replace('{all}', 'Alle');
    }

    let availablePlayers = [...players];
    
    const player1Index = Math.floor(Math.random() * availablePlayers.length);
    const player1 = availablePlayers[player1Index].name;
    availablePlayers.splice(player1Index, 1);

    const player2Index = Math.floor(Math.random() * availablePlayers.length);
    const player2 = availablePlayers[player2Index].name;

    const parts = text.split(/(\{player\}|\{player2\}|\{all\})/g);

    return (
        <React.Fragment>
            {parts.map((part, index) => {
                if (part === '{player}') {
                    return <span key={index} className="player-highlight">{player1}</span>;
                }
                if (part === '{player2}') {
                    return <span key={index} className="player-highlight-2">{player2}</span>;
                }
                if (part === '{all}') {
                    return <strong key={index} className="text-prompt font-semibold">Alle</strong>;
                }
                return part;
            })}
        </React.Fragment>
    );
}


export function GameClient({ game }: { game: Game }) {
  const { players, isLoaded } = usePlayers();
  const router = useRouter();
  const [tasks, setTasks] = useState<GameTask[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      if (players.length === 0) {
        // Redirect to home if no players are set up.
        router.push('/');
      } else {
        const gameTasks = game.shuffle === false ? game.items : shuffleArray(game.items);
        setTasks(gameTasks);
        setCurrentIndex(0);
        setIsFinished(false);
      }
    }
  }, [game, isLoaded, players, router]);

  const handleNextTask = () => {
    if (currentIndex < tasks.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsFinished(true);
    }
  };
  
  const handleRestart = () => {
    if (isLoaded) {
      setTasks(game.shuffle === false ? game.items : shuffleArray(game.items));
      setCurrentIndex(0);
      setIsFinished(false);
    }
  }

  const currentTask = useMemo(
    () => (tasks.length > 0 ? tasks[currentIndex] : null),
    [currentIndex, tasks]
  );
  
  const processedContent = useMemo(() => {
    if (!currentTask || !isLoaded || players.length === 0) return '';
    return processPlaceholders(currentTask.text, players);
  }, [currentTask, players, isLoaded]);


  if (!isLoaded || (isLoaded && players.length === 0)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Laster spill...</p>
      </div>
    )
  }

  if (isFinished) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
            <h2 className="text-4xl font-bold mb-4">Spillet er ferdig!</h2>
            <p className="text-muted-foreground mb-8">Hva vil dere gjøre nå?</p>
            <div className="flex gap-4">
                <Button onClick={handleRestart} size="lg">
                    <Repeat className="mr-2 h-5 w-5" />
                    Spill igjen
                </Button>
                <Button variant="outline" size="lg" asChild>
                    <Link href="/spill/velg">
                        <Home className="mr-2 h-5 w-5" />
                        Velg nytt spill
                    </Link>
                </Button>
            </div>
        </div>
    )
  }

  if (!currentTask) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Laster spill...</p>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col min-h-screen p-4 md:p-8 cursor-pointer"
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
        <TaskCard type={currentTask.type} content={processedContent} key={currentIndex} />
      </div>

      <div className="text-center text-muted-foreground mt-4">
        Trykk hvor som helst for neste kort ({currentIndex + 1} / {tasks.length})
      </div>
    </div>
  );
}
