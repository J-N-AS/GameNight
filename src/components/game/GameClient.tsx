'use client';

import type { Game, GameTask } from '@/lib/games';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { TaskCard } from './TaskCard';
import { ScenarioCard } from './ScenarioCard';
import { Button } from '@/components/ui/button';
import { Repeat, Home } from 'lucide-react';
import Link from 'next/link';
import { usePlayers } from '@/hooks/usePlayers';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { GameMenu } from './GameMenu';
import { useToast } from '@/hooks/use-toast';
import { getScenario, type ScenarioOutput } from '@/ai/flows/scenario-flow';

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
  
  // State for card-based games
  const [tasks, setTasks] = useState<GameTask[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // State for AI-based games
  const [aiTask, setAiTask] = useState<ScenarioOutput | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [taskCount, setTaskCount] = useState(0);

  const [isFinished, setIsFinished] = useState(false);
  const [direction, setDirection] = useState(1);

  const fetchNextAiTask = useCallback(async () => {
    setIsLoadingAi(true);
    try {
        const scenario = await getScenario();
        setAiTask(scenario);
        setTaskCount(prev => prev + 1);
    } catch (error) {
        console.error("Failed to fetch AI scenario", error);
        toast({ title: "AI-en er litt sjenert", description: "Kunne ikke hente et nytt scenario. Prøv igjen.", variant: "destructive" });
        setAiTask({
            scenario: "AI-en tok en liten pause, og det burde kanskje du også gjøre. Ta en slurk!",
            question: "Hva er favorittfargen din?",
            playerPrompt: "{player}, fortell oss!"
        });
        setTaskCount(prev => prev + 1);
    } finally {
        setIsLoadingAi(false);
    }
  }, [toast]);

  const setupGame = useCallback(() => {
    if (game.engine === 'ai-scenario') {
      fetchNextAiTask();
    } else {
      const gameTasks = game.shuffle === false ? game.items : shuffleArray(game.items);
      setTasks(gameTasks);
      setCurrentIndex(0);
    }
    setIsFinished(false);
  }, [game, fetchNextAiTask]);

  useEffect(() => {
    if (isLoaded) {
      if (game.requiresPlayers && players.length === 0) {
        toast({
          title: 'Spillere mangler',
          description: `Dette spillet krever spillere. Legg til noen for å starte.`,
          variant: 'destructive',
        });
        router.push('/spill/velg');
        return;
      }
      setupGame();
    }
  }, [game, isLoaded, players.length, game.requiresPlayers, router, toast, setupGame]);


  const handleNextTask = () => {
    setDirection(1);
    if (game.engine === 'ai-scenario') {
      fetchNextAiTask();
    } else {
      if (currentIndex < tasks.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setIsFinished(true);
      }
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

  const processedAiContent = useMemo(() => {
    if (!aiTask || !isLoaded) return null;

    return {
        scenario: aiTask.scenario,
        question: aiTask.question,
        playerPrompt: players.length > 0 ? processPlaceholders(aiTask.playerPrompt, players) : aiTask.playerPrompt.replace('{player}', 'Du')
    };
  }, [aiTask, players, isLoaded]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  const showLoading = !isLoaded || (game.engine === 'ai-scenario' ? !aiTask && !isLoadingAi : !currentTask);

  if (showLoading) {
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

  return (
    <div
      className="flex flex-col min-h-screen p-4 md:p-8 overflow-hidden"
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

      <div className="absolute top-2.5 right-2.5 z-10" onClick={(e) => e.stopPropagation()}>
          <GameMenu context="in-game" onRestart={handleRestart} />
      </div>

      <div className="flex-grow flex items-center justify-center cursor-pointer">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={game.engine === 'ai-scenario' ? taskCount : currentIndex}
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
            {game.engine === 'ai-scenario' ? (
              <ScenarioCard
                isLoading={isLoadingAi && taskCount === 0}
                scenario={processedAiContent?.scenario}
                question={processedAiContent?.question}
                playerPrompt={processedAiContent?.playerPrompt}
              />
            ) : (
              currentTask && <TaskCard type={currentTask.type} content={processedContent} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="text-center text-muted-foreground mt-4">
        {game.engine === 'ai-scenario'
          ? 'Trykk hvor som helst for neste scenario'
          : `Trykk hvor som helst for neste kort (${currentIndex + 1} / ${tasks.length})`
        }
      </div>
    </div>
  );
}
