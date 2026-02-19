'use client';

import type { Game, GameTask } from '@/lib/games';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { TaskCard } from './TaskCard';
import { Button } from '@/components/ui/button';
import { Repeat, Home, PartyPopper, Trophy } from 'lucide-react';
import Link from 'next/link';
import { usePlayers } from '@/hooks/usePlayers';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { GameMenu } from './GameMenu';
import { useToast } from '@/hooks/use-toast';
import { AdBanner } from '../ads/AdBanner';
import { Progress } from '@/components/ui/progress';
import { SessionSummary } from './SessionSummary';

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

interface GameClientProps {
  game: Game;
  onRestart: () => void;
  gameMode?: 'virtual' | 'physical' | null;
}

export function GameClient({ game, onRestart, gameMode }: GameClientProps) {
  const { players, isLoaded } = usePlayers();
  const router = useRouter();
  const { toast } = useToast();

  const [tasks, setTasks] = useState<GameTask[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  
  const [taskPlayers, setTaskPlayers] = useState<{player1: string; player2: string} | null>(null);

  // Versus mode state
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);

  // Spin the bottle state
  const [bottleRotation, setBottleRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showSpinResult, setShowSpinResult] = useState(false);

  const isVersusMode = game.gameType === 'versus';
  const isSpinTheBottleMode = game.gameType === 'spin-the-bottle';
  const isPhysicalItemGame = game.gameType === 'physical-item';

  const setupGame = useCallback(() => {
    const gameTasks = game.shuffle === false ? game.items : shuffleArray(game.items);
    setTasks(gameTasks);
    setCurrentIndex(0);
    setIsFinished(false);
    setTeam1Score(0);
    setTeam2Score(0);
    setShowSpinResult(false);
    setIsSpinning(false);
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

  const currentTask = useMemo(
    () => (tasks.length > 0 ? tasks[currentIndex] : null),
    [currentIndex, tasks]
  );
  
  useEffect(() => {
    if (currentTask && players.length > 0) {
      let availablePlayers = [...players];
      const player1Index = Math.floor(Math.random() * availablePlayers.length);
      const player1 = availablePlayers[player1Index]?.name || 'Noen';
      availablePlayers.splice(player1Index, 1);

      const player2Index = availablePlayers.length > 0 ? Math.floor(Math.random() * availablePlayers.length) : -1;
      const player2 = player2Index !== -1 ? availablePlayers[player2Index]?.name : 'En annen';
      
      setTaskPlayers({ player1, player2 });
    }
  }, [currentIndex, players, currentTask]);


  const handleNextTask = () => {
    if (isSpinTheBottleMode) {
      setShowSpinResult(false);
    }
    if (currentIndex < tasks.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsFinished(true);
    }
  };
  
  const handleSpinBottle = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setShowSpinResult(false);

    const randomExtraRotation = Math.random() * 360;
    const fullSpins = 5 + Math.floor(Math.random() * 5); // 5 to 9 full spins
    const newRotation = bottleRotation + fullSpins * 360 + randomExtraRotation;

    setBottleRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setShowSpinResult(true);
    }, 4000); // Animation duration should match transition duration in motion.div
  };


  const handleVote = (winner: 'team1' | 'team2') => {
    if (winner === 'team1') {
      setTeam1Score(prev => prev + 1);
    } else {
      setTeam2Score(prev => prev + 1);
    }
    handleNextTask();
  };

  const processedContent = useMemo(() => {
    if (!currentTask || !isLoaded) return '';
    let { text } = currentTask;
    
    // For spin the bottle or physical item games, we don't process player names.
    if (isSpinTheBottleMode || isPhysicalItemGame) {
        return text;
    }

    const { type } = currentTask;
    const isNameForbidden = type === 'never_have_i_ever' || type === 'pointing';
    let content: React.ReactNode = text;
    const placeholderRegex = /(\{team1\}|\{team2\}|\{player\}|\{player2\}|\{all\})/g;

    if (placeholderRegex.test(text) && taskPlayers) {
      const { player1, player2 } = taskPlayers;
      const parts = text.split(placeholderRegex);
      content = (
        <React.Fragment>
          {parts.map((part, index) => {
            switch (part) {
              case '{team1}':
                return <span key={index} className="player-highlight">{game.teams?.team1 || 'Lag 1'}</span>;
              case '{team2}':
                return <span key={index} className="player-highlight-2">{game.teams?.team2 || 'Lag 2'}</span>;
              case '{player}':
                return isNameForbidden ? 'Noen' : <span key={index} className="player-highlight">{player1}</span>;
              case '{player2}':
                return isNameForbidden ? 'En annen' : <span key={index} className="player-highlight-2">{player2}</span>;
              case '{all}':
                return <strong key={index} className="text-prompt font-semibold">Alle</strong>;
              default:
                return part;
            }
          })}
        </React.Fragment>
      );
    }
    return content;
  }, [currentTask, isLoaded, game.teams, isSpinTheBottleMode, isPhysicalItemGame, taskPlayers]);


  const cardVariants = {
    enter: { opacity: 0 },
    center: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const showLoading = !isLoaded || tasks.length === 0;

  const progressValue =
    tasks.length > 0 ? ((currentIndex + 1) / tasks.length) * 100 : 0;
  
  const extractHslValues = (hslString?: string) => {
    if (!hslString) return '';
    const match = hslString.match(/(\d+\s* \d+%\s* \d+%)/);
    return match ? match[1] : '';
  };

  const cssVars = {
    '--team1-color-hsl': extractHslValues(game.teams?.team1Color),
    '--team2-color-hsl': extractHslValues(game.teams?.team2Color),
  } as React.CSSProperties;

  if (isFinished) {
    const winner = team1Score > team2Score ? game.teams!.team1 : (team2Score > team1Score ? game.teams!.team2 : null);

    return (
      <motion.div
        className="flex flex-col items-center justify-center min-h-screen text-center p-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', duration: 0.5, delay: 0.2 }}
        style={cssVars}
      >
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', delay: 0.4, duration: 0.5 }}
        >
          {isVersusMode ? <Trophy className="h-16 w-16 text-primary mb-6" /> : <PartyPopper className="h-16 w-16 text-primary mb-6" />}
        </motion.div>
        <h2 className="text-4xl font-bold mb-4">Spillet er ferdig!</h2>

        {isVersusMode && game.teams && (
          <div className="mb-8 text-lg">
            <p className="font-semibold text-2xl mb-4">Resultat:</p>
            <div className="flex justify-center gap-8 text-xl">
              <p><span className="player-highlight">{game.teams.team1}: {team1Score} poeng</span></p>
              <p><span className="player-highlight-2">{game.teams.team2}: {team2Score} poeng</span></p>
            </div>
            {winner ? (
              <p className="mt-6 text-3xl font-bold">Vinneren er <span className={team1Score > team2Score ? "player-highlight" : "player-highlight-2"}>{winner}!</span></p>
            ) : (
              <p className="mt-6 text-3xl font-bold">Det ble uavgjort!</p>
            )}
          </div>
        )}

        <p className="text-muted-foreground mb-8">
          Bra spilt! Hva vil dere gjøre nå?
        </p>

        {players.length > 0 && <SessionSummary />}

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button
            onClick={onRestart}
            size="lg"
            className="transform transition-transform duration-200 hover:scale-105"
          >
            <Repeat className="mr-2 h-5 w-5" />
            Spill igjen
          </Button>
          <Button
            variant="outline"
            size="lg"
            asChild
            className="transform transition-transform duration-200 hover:scale-105"
          >
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Velg nytt spill
            </Link>
          </Button>
        </div>
        <motion.div
          className="mt-12 w-full flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <AdBanner />
        </motion.div>
      </motion.div>
    );
  }

  if (isSpinTheBottleMode && gameMode === 'virtual') {
    return (
      <div className="flex flex-col min-h-screen p-4 md:p-8 overflow-hidden">
        <div className="absolute top-4 left-4 z-10">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Lobby
            </Link>
          </Button>
        </div>
        <div className="absolute top-4 right-4 z-10">
          <GameMenu context="in-game" onRestart={onRestart} />
        </div>
  
        <div className="w-full max-w-[800px] mx-auto flex-grow flex flex-col justify-center text-center">
          <div className="relative flex-grow flex items-center justify-center overflow-hidden flex-col">
            <motion.div
              style={{ rotate: bottleRotation }}
              animate={{ rotate: bottleRotation }}
              transition={{ duration: 4, ease: 'easeOut' }}
              className="text-8xl md:text-9xl my-8 select-none"
            >
              🍾
            </motion.div>
  
            {isSpinning && <p className="text-lg text-muted-foreground absolute bottom-1/4">Spinner...</p>}
  
            <div className="absolute bottom-0 w-full mb-8">
            <AnimatePresence>
              {showSpinResult && currentTask && (
                <motion.div
                  className="w-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <TaskCard
                    type={currentTask.type}
                    content={processedContent}
                  />
                  <Button onClick={handleNextTask} size="lg" className="mt-8">
                    Neste Spinn
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
            </div>

          </div>
  
          {!isSpinning && !showSpinResult && (
            <motion.div
              className="mb-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                onClick={handleSpinBottle}
                size="lg"
                className="w-full max-w-xs mx-auto h-14 text-lg transform transition-transform duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-primary/30"
              >
                Spinn flasken
              </Button>
            </motion.div>
          )}
        </div>
  
        <footer className="w-full flex-shrink-0 mt-4">
          <div className="flex justify-center">
            <AdBanner className="h-16" />
          </div>
        </footer>
      </div>
    );
  }

  if ((isSpinTheBottleMode && gameMode === 'physical') || isPhysicalItemGame) {
    const instructionText = isPhysicalItemGame
      ? "Les oppgaven høyt, og kast gjenstanden til den personen som passer best. Den som fanger, trykker 'Neste Oppgave' for sin tur."
      : 'Spinn den ekte flasken. Den flasken peker på må gjøre oppgaven som vises.';

    return (
      <div className="flex flex-col min-h-screen p-4 md:p-8">
        <div className="absolute top-4 left-4 z-10">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Lobby
            </Link>
          </Button>
        </div>

        <div className="absolute top-4 right-4 z-10">
          <GameMenu context="in-game" onRestart={onRestart} />
        </div>
        
        <div className="w-full max-w-[800px] mx-auto flex-grow flex flex-col justify-center text-center">
            <div className="h-20 mb-4 flex items-center justify-center">
                {!showLoading && (
                    <p className="text-muted-foreground text-center px-4">
                        {instructionText}
                    </p>
                )}
            </div>

            <div className="relative flex-grow flex items-center justify-center overflow-hidden">
                <AnimatePresence initial={false} mode="wait">
                    <motion.div
                      key={currentIndex}
                      variants={cardVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="w-full"
                    >
                    {showLoading ? (
                        <p>Laster spill...</p>
                    ) : (
                        currentTask && (
                        <TaskCard
                            type={currentTask.type}
                            content={processedContent}
                        />
                        )
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
                  className="w-full max-w-xs mx-auto h-14 text-lg transform transition-transform duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-primary/30"
                >
                  Neste Oppgave
                </Button>
            </motion.div>
            )}
        </div>

        <footer className="w-full flex-shrink-0 mt-4">
          {!showLoading && (
            <div className="flex justify-center">
              <AdBanner className="h-16" />
            </div>
          )}
        </footer>
      </div>
    )
}

  return (
    <div className="flex flex-col min-h-screen p-4 md:p-8" style={cssVars}>
      <div className="absolute top-4 left-4 z-10">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Lobby
          </Link>
        </Button>
      </div>

      <div className="absolute top-4 right-4 z-10">
        <GameMenu context="in-game" onRestart={onRestart} />
      </div>

      {/* Game Stage */}
      <div className="w-full max-w-[800px] mx-auto flex-grow flex flex-col justify-center text-center">
        <div className="h-20 mb-4 flex items-center justify-center">
          {!showLoading && tasks.length > 0 && (
            <div className="w-full max-w-sm mx-auto">
               {isVersusMode && game.teams && (
                 <div className="flex justify-between text-lg font-bold mb-2">
                    <span className="player-highlight">{game.teams.team1}: {team1Score}</span>
                    <span className="player-highlight-2">{game.teams.team2}: {team2Score}</span>
                 </div>
              )}
              <Progress value={progressValue} className="h-2" />
              <p className="text-center text-muted-foreground/60 text-sm mt-2">
                {currentIndex + 1} / {tasks.length}
              </p>
            </div>
          )}
        </div>

        <div className="relative flex-grow flex items-center justify-center overflow-hidden">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={currentIndex}
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="w-full"
            >
              {showLoading ? (
                <p>Laster spill...</p>
              ) : (
                currentTask && (
                  <TaskCard
                    type={currentTask.type}
                    content={processedContent}
                    onVote={isVersusMode ? handleVote : undefined}
                    teams={isVersusMode ? game.teams : undefined}
                  />
                )
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {!showLoading && currentTask?.type !== 'versus' && (
          <motion.div
            className="mt-8 mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <Button
              onClick={handleNextTask}
              size="lg"
              className="w-full max-w-xs mx-auto h-14 text-lg transform transition-transform duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-primary/30"
            >
              Neste
            </Button>
          </motion.div>
        )}
      </div>

      <footer className="w-full flex-shrink-0 mt-4">
        {!showLoading && (
          <div className="flex justify-center">
            <AdBanner className="h-16" />
          </div>
        )}
      </footer>
    </div>
  );
}
