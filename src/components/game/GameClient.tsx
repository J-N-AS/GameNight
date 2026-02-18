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
import { GameConsentScreen } from './GameConsentScreen';

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function GameClient({ game }: { game: Game }) {
  const { players, isLoaded } = usePlayers();
  const router = useRouter();
  const { toast } = useToast();

  const [tasks, setTasks] = useState<GameTask[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);

  // Versus mode state
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);

  const isVersusMode = game.gameType === 'versus' && !!game.teams;

  const setupGame = useCallback(() => {
    const gameTasks =
      game.shuffle === false ? game.items : shuffleArray(game.items);
    setTasks(gameTasks);
    setCurrentIndex(0);
    setIsFinished(false);
    setTeam1Score(0);
    setTeam2Score(0);
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
  }, [
    game,
    isLoaded,
    players.length,
    game.requiresPlayers,
    router,
    toast,
    setupGame,
  ]);

  const handleNextTask = () => {
    if (currentIndex < tasks.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleVote = (winner: 'team1' | 'team2') => {
    if (winner === 'team1') {
      setTeam1Score(prev => prev + 1);
    } else {
      setTeam2Score(prev => prev + 1);
    }
    handleNextTask();
  };

  const handleRestart = () => {
    if (isLoaded) {
      if (game.warning) {
        setConsentGiven(false);
      }
      setupGame();
    }
  };

  const currentTask = useMemo(
    () => (tasks.length > 0 ? tasks[currentIndex] : null),
    [currentIndex, tasks]
  );

  const processedContent = useMemo(() => {
    if (!currentTask || !isLoaded) return '';
    const { type, text } = currentTask;

    const isNameForbidden = type === 'never_have_i_ever' || type === 'pointing';
    let content: React.ReactNode = text;
    const placeholderRegex = /(\{team1\}|\{team2\}|\{player\}|\{player2\}|\{all\})/g;

    if (placeholderRegex.test(text)) {
      let availablePlayers = [...players];
      const player1Index = players.length > 0 ? Math.floor(Math.random() * availablePlayers.length) : -1;
      const player1 = player1Index !== -1 ? availablePlayers[player1Index].name : 'Noen';
      if (player1Index !== -1) availablePlayers.splice(player1Index, 1);
      const player2Index = players.length > 1 ? Math.floor(Math.random() * availablePlayers.length) : -1;
      const player2 = player2Index !== -1 ? availablePlayers[player2Index].name : 'En annen';

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
  }, [currentTask, players, isLoaded, game.teams]);


  const cardVariants = {
    enter: { opacity: 0 },
    center: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const showLoading = !isLoaded || tasks.length === 0;

  const progressValue =
    tasks.length > 0 ? ((currentIndex + 1) / tasks.length) * 100 : 0;

  const showConsent = game.warning && !consentGiven;
  
  const extractHslValues = (hslString?: string) => {
    if (!hslString) return '';
    const match = hslString.match(/(\d+\s* \d+%\s* \d+%)/);
    return match ? match[1] : '';
  };

  const cssVars = {
    '--team1-color-hsl': extractHslValues(game.teams?.team1Color),
    '--team2-color-hsl': extractHslValues(game.teams?.team2Color),
  } as React.CSSProperties;


  if (showConsent) {
    return (
      <GameConsentScreen
        warning={game.warning!}
        onConfirm={() => setConsentGiven(true)}
      />
    );
  }

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
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleRestart}
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
        <GameMenu context="in-game" onRestart={handleRestart} />
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
