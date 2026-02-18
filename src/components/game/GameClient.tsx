'use client';

import type { Game, GameTask } from '@/lib/games';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { TaskCard } from './TaskCard';
import { Button } from '@/components/ui/button';
import { Repeat, Home, PartyPopper } from 'lucide-react';
import Link from 'next/link';
import { usePlayers } from '@/hooks/usePlayers';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { GameMenu } from './GameMenu';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  const [tasks, setTasks] = useState<GameTask[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [direction, setDirection] = useState(1);

  const setupGame = useCallback(() => {
    const gameTasks = game.shuffle === false ? game.items : shuffleArray(game.items);
    setTasks(gameTasks);
    setCurrentIndex(0);
    setIsFinished(false);
  }, [game]);

  useEffect(() => {
    if (isLoaded) {
      if (game.requiresPlayers && players.length === 0) {
        toast({
          title: 'Spillere mangler',
          description: `Dette spillet krever spillere. Legg til noen for å starte.`,
          variant: 'destructive',
        });
        router.push('/');
        return;
      }
      setupGame();
    }
  }, [game, isLoaded, players.length, game.requiresPlayers, router, toast, setupGame]);

  const handleNextTask = () => {
    setDirection(1);
    if (currentIndex < tasks.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsFinished(true);
    }
  };
  
  const handleRestart = () => {
    if (isLoaded) {
      setupGame();
    }
  }

  const currentTask = useMemo(
    () => (tasks.length > 0 ? tasks[currentIndex] : null),
    [currentIndex, tasks]
  );
  
  const processedContent = useMemo(() => {
    if (!currentTask || !isLoaded) return '';
    const { type, text } = currentTask;

    const hasPlaceholders = /\{player|player2|all\}/.test(text);
    const canProcessPlaceholders = (type === 'challenge' || type === 'prompt') && hasPlaceholders && players.length > 0;
    
    const isNameForbidden = type === 'never_have_i_ever' || type === 'pointing';

    if (canProcessPlaceholders && !isNameForbidden) {
        return processPlaceholders(text, players);
    }
    return text;
  }, [currentTask, players, isLoaded]);

  const variants = {
    enter: {
      x: 300,
      opacity: 0,
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: {
      zIndex: 0,
      x: -300,
      opacity: 0,
    },
  };

  const showLoading = !isLoaded || tasks.length === 0;

  if (isFinished) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center min-h-screen text-center p-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', duration: 0.5 }}
      >
          <PartyPopper className="h-16 w-16 text-primary mb-6" />
          <h2 className="text-4xl font-bold mb-4">Spillet er ferdig!</h2>
          <p className="text-muted-foreground mb-8">Bra spilt! Hva vil dere gjøre nå?</p>
          <div className="flex flex-col sm:flex-row gap-4">
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
      </motion.div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen p-4 md:p-8 justify-center items-center">
      <div className="absolute top-4 left-4 z-10">
         <Button variant="ghost" size="sm" asChild>
            <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Lobby
            </Link>
         </Button>
      </div>

      <div className="absolute top-4 right-4 z-10">
          <GameMenu context="in-game" onRestart={handleRestart} />
      </div>

      {/* Game Stage */}
      <div className="w-full max-w-3xl flex-grow flex flex-col justify-center text-center">
        <div className="relative flex-grow flex items-center justify-center overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 },
                    }}
                    className="w-full"
                >
                    {showLoading ? (
                        <p>Laster spill...</p>
                    ) : (
                        currentTask && <TaskCard type={currentTask.type} content={processedContent} />
                    )}
                </motion.div>
            </AnimatePresence>
        </div>

        {!showLoading && (
             <motion.div 
              className="mt-8 mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
                <Button 
                    onClick={handleNextTask} 
                    size="lg" 
                    className="w-full max-w-xs mx-auto h-14 text-lg">
                    Neste
                </Button>
             </motion.div>
        )}
      </div>

      <div className="text-center text-muted-foreground/60 text-sm h-6">
        {tasks.length > 0 && `${currentIndex + 1} / ${tasks.length}`}
      </div>
    </div>
  );
}
