'use client';

import type { Game, GameRule, GameTask, Player } from '@/lib/types';
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { TaskCard } from './TaskCard';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Home,
  PartyPopper,
  Repeat,
  Sparkles,
  Trophy,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useSession } from '@/hooks/usePlayers';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { GameMenu } from './GameMenu';

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

const isNameHiddenType = (type: GameTask['type']) =>
  type === 'never_have_i_ever' || type === 'pointing';

interface GameClientProps {
  game: Game;
  gameMode?: 'virtual' | 'physical' | null;
}

export function GameClient({ game, gameMode }: GameClientProps) {
  const { players, isLoaded, updatePlayerStat } = useSession();
  const router = useRouter();

  const [tasks, setTasks] = useState<GameTask[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [taskPlayers, setTaskPlayers] = useState<{
    player1: Player | null;
    player2: Player | null;
  } | null>(null);
  const processedIndexRef = useRef<number | null>(null);

  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);

  const [bottleRotation, setBottleRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showSpinResult, setShowSpinResult] = useState(false);

  const isVersusMode = game.gameType === 'versus';
  const isSpinTheBottleMode = game.gameType === 'spin-the-bottle';
  const isPhysicalItemGame = game.gameType === 'physical-item';
  const showLoading = !isLoaded || tasks.length === 0;

  const setupGame = useCallback(() => {
    const gameTasks = game.shuffle === false ? game.items : shuffleArray(game.items);
    setTasks(gameTasks);
    setCurrentIndex(0);
    setIsFinished(false);
    setTeam1Score(0);
    setTeam2Score(0);
    setShowSpinResult(false);
    setIsSpinning(false);
    setBottleRotation(0);
    setTaskPlayers(null);
    processedIndexRef.current = null;
  }, [game]);

  useEffect(() => {
    if (isLoaded) {
      setupGame();
    }
  }, [isLoaded, setupGame]);

  const currentTask = useMemo(
    () => (tasks.length > 0 ? tasks[currentIndex] : null),
    [currentIndex, tasks]
  );

  useEffect(() => {
    if (processedIndexRef.current === currentIndex) {
      return;
    }

    if (!isLoaded || !currentTask || players.length === 0) {
      setTaskPlayers(null);
      processedIndexRef.current = currentIndex;
      return;
    }

    if (isSpinTheBottleMode || isPhysicalItemGame) {
      setTaskPlayers(null);
      processedIndexRef.current = currentIndex;
      return;
    }

    const hasNamedPlaceholders =
      (currentTask.text.includes('{player}') ||
        currentTask.text.includes('{player2}')) &&
      !isNameHiddenType(currentTask.type);

    if (!hasNamedPlaceholders) {
      setTaskPlayers(null);
      processedIndexRef.current = currentIndex;
      return;
    }

    const availablePlayers = [...players];
    const player1Index = Math.floor(Math.random() * availablePlayers.length);
    const player1 = availablePlayers[player1Index];
    availablePlayers.splice(player1Index, 1);

    const player2Index =
      availablePlayers.length > 0
        ? Math.floor(Math.random() * availablePlayers.length)
        : -1;
    const player2 = player2Index !== -1 ? availablePlayers[player2Index] : null;

    setTaskPlayers({ player1, player2 });
    processedIndexRef.current = currentIndex;
  }, [
    currentIndex,
    isLoaded,
    players,
    currentTask,
    isSpinTheBottleMode,
    isPhysicalItemGame,
  ]);

  const getTaskTextValues = useCallback(
    (taskType: GameTask['type']) => {
      const hideNames = isNameHiddenType(taskType);

      return {
        '{team1}': game.teams?.team1 || 'Lag 1',
        '{team2}': game.teams?.team2 || 'Lag 2',
        '{player}': hideNames ? 'Noen' : taskPlayers?.player1?.name || 'Noen',
        '{player2}': hideNames
          ? 'En annen'
          : taskPlayers?.player2?.name || 'En annen',
        '{all}': 'Alle',
      };
    },
    [game.teams, taskPlayers]
  );

  const resolveTaskTextToPlain = useCallback(
    (text: string, taskType: GameTask['type']) => {
      const values = getTaskTextValues(taskType);

      return text.replace(
        /(\{team1\}|\{team2\}|\{player\}|\{player2\}|\{all\})/g,
        (match) => values[match as keyof typeof values] ?? match
      );
    },
    [getTaskTextValues]
  );

  const currentTaskRule = useMemo<GameRule | null>(() => {
    if (!currentTask?.rule) {
      return null;
    }

    return {
      ...currentTask.rule,
      title: resolveTaskTextToPlain(currentTask.rule.title, currentTask.type),
      description: resolveTaskTextToPlain(
        currentTask.rule.description,
        currentTask.type
      ),
    };
  }, [currentTask, resolveTaskTextToPlain]);

  const commitStatsForCurrentTask = useCallback(() => {
    if (!currentTask || !isLoaded || players.length === 0) {
      return;
    }

    if (isSpinTheBottleMode || isPhysicalItemGame || currentTask.type === 'versus') {
      return;
    }

    if (isNameHiddenType(currentTask.type)) {
      return;
    }

    const targetedIds = new Set<string>();

    if (currentTask.text.includes('{player}') && taskPlayers?.player1) {
      targetedIds.add(taskPlayers.player1.id);
    }

    if (currentTask.text.includes('{player2}') && taskPlayers?.player2) {
      targetedIds.add(taskPlayers.player2.id);
    }

    if (targetedIds.size === 0) {
      return;
    }

    targetedIds.forEach((playerId) => {
      updatePlayerStat(playerId, 'timesTargeted');
    });

    if (
      currentTask.type === 'challenge' ||
      currentTask.type === 'prompt' ||
      currentTask.type === 'truth_or_shot'
    ) {
      targetedIds.forEach((playerId) => {
        updatePlayerStat(playerId, 'tasksCompleted');
      });
    }
  }, [
    currentTask,
    isLoaded,
    players.length,
    isSpinTheBottleMode,
    isPhysicalItemGame,
    taskPlayers,
    updatePlayerStat,
  ]);

  const handleNextTask = useCallback(() => {
    if (!currentTask) {
      return;
    }

    commitStatsForCurrentTask();

    if (isSpinTheBottleMode) {
      setShowSpinResult(false);
    }

    if (currentIndex < tasks.length - 1) {
      setCurrentIndex((previousIndex) => previousIndex + 1);
    } else {
      setIsFinished(true);
    }
  }, [
    commitStatsForCurrentTask,
    currentIndex,
    currentTask,
    isSpinTheBottleMode,
    tasks.length,
  ]);

  const handleSpinBottle = useCallback(() => {
    if (isSpinning) {
      return;
    }

    setIsSpinning(true);
    setShowSpinResult(false);

    const randomExtraRotation = Math.random() * 360;
    const fullSpins = 5 + Math.floor(Math.random() * 5);
    const newRotation = bottleRotation + fullSpins * 360 + randomExtraRotation;

    setBottleRotation(newRotation);

    window.setTimeout(() => {
      setIsSpinning(false);
      setShowSpinResult(true);
    }, 4000);
  }, [bottleRotation, isSpinning]);

  const handleVote = (winner: 'team1' | 'team2') => {
    if (winner === 'team1') {
      setTeam1Score((previous) => previous + 1);
    } else {
      setTeam2Score((previous) => previous + 1);
    }
    handleNextTask();
  };

  const processedContent = useMemo(() => {
    if (!currentTask || !isLoaded) {
      return '';
    }

    let { text } = currentTask;

    if (isSpinTheBottleMode || isPhysicalItemGame) {
      return text;
    }

    const { type } = currentTask;
    const isNameForbidden = isNameHiddenType(type);
    let content: React.ReactNode = text;
    const placeholderRegex =
      /(\{team1\}|\{team2\}|\{player\}|\{player2\}|\{all\})/g;

    if (placeholderRegex.test(text)) {
      const values = getTaskTextValues(type);
      const parts = text.split(placeholderRegex);

      content = (
        <React.Fragment>
          {parts.map((part, index) => {
            switch (part) {
              case '{team1}':
                return (
                  <span key={index} className="player-highlight">
                    {values['{team1}']}
                  </span>
                );
              case '{team2}':
                return (
                  <span key={index} className="player-highlight-2">
                    {values['{team2}']}
                  </span>
                );
              case '{player}':
                return isNameForbidden ? (
                  'Noen'
                ) : (
                  <span key={index} className="player-highlight">
                    {values['{player}']}
                  </span>
                );
              case '{player2}':
                return isNameForbidden ? (
                  'En annen'
                ) : (
                  <span key={index} className="player-highlight-2">
                    {values['{player2}']}
                  </span>
                );
              case '{all}':
                return (
                  <strong key={index} className="font-semibold text-white">
                    Alle
                  </strong>
                );
              default:
                return part;
            }
          })}
        </React.Fragment>
      );
    }

    return content;
  }, [
    currentTask,
    getTaskTextValues,
    isLoaded,
    isPhysicalItemGame,
    isSpinTheBottleMode,
  ]);

  const cardVariants = {
    enter: { opacity: 0, x: 40, scale: 0.985 },
    center: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: -40, scale: 0.985 },
  };

  const extractHslValues = (hslString?: string) => {
    if (!hslString) {
      return '';
    }

    const match = hslString.match(/(\d+\s* \d+%\s* \d+%)/);
    return match ? match[1] : '';
  };

  const cssVars = {
    '--team1-color-hsl': extractHslValues(game.teams?.team1Color),
    '--team2-color-hsl': extractHslValues(game.teams?.team2Color),
  } as React.CSSProperties;

  const renderStageCard = () => {
    if (showLoading) {
      return (
        <div className="flex min-h-[22rem] items-center justify-center rounded-[1.9rem] border border-border/70 bg-card/90 px-6 text-sm text-muted-foreground shadow-sm md:min-h-[28rem]">
          Laster spill...
        </div>
      );
    }

    if (!currentTask) {
      return null;
    }

    return (
      <TaskCard
        game={game}
        task={currentTask}
        content={processedContent}
        rule={currentTaskRule}
        onVote={isVersusMode ? handleVote : undefined}
        teams={isVersusMode ? game.teams : undefined}
      />
    );
  };

  const topBar = (
    <div className="sticky top-[calc(env(safe-area-inset-top)+0.15rem)] z-30 mb-5 flex items-start justify-between gap-3">
      <Button
        variant="ghost"
        size="icon"
        asChild
        className="h-12 w-12 rounded-full border-0 bg-white/10 text-white shadow-none backdrop-blur-sm hover:bg-white/14 hover:text-white"
      >
        <Link href="/">
          <X className="h-6 w-6" />
          <span className="sr-only">Avslutt spill</span>
        </Link>
      </Button>

      <div className="min-w-0 flex-1 px-2 pt-1 text-center">
        <p className="truncate text-[0.7rem] font-semibold uppercase tracking-[0.26em] text-white/72">
          {game.title}
        </p>
        {!showLoading && (
          <p className="mt-1 text-lg font-medium tracking-[0.06em] text-white/50">
            {currentIndex + 1} / {tasks.length}
          </p>
        )}
      </div>

      <GameMenu context="in-game" onRestart={setupGame} />
    </div>
  );

  const renderActionButton = (
    label: string,
    onClick: () => void,
    icon: React.ComponentType<{ className?: string }> = ArrowRight
  ) => {
    const Icon = icon;
    const showIcon = icon !== ArrowRight;

    return (
      <Button
        onClick={onClick}
        size="lg"
        className="mx-auto h-[5rem] w-full max-w-[26rem] rounded-[1.8rem] border-2 border-[#1f6ed4] bg-[#f1f1f1] px-5 text-base font-black uppercase tracking-[-0.03em] text-black shadow-[0_14px_0_0_rgba(255,255,255,0.12)] transition-transform duration-150 hover:bg-white active:translate-y-[3px] active:shadow-[0_9px_0_0_rgba(255,255,255,0.1)]"
      >
        <span className="relative block w-full">
          <span className="block w-full text-center text-[1.55rem] font-black leading-none sm:text-[2rem]">
            {label}
          </span>
          {showIcon && (
            <span className="absolute right-0 top-1/2 -translate-y-1/2">
              <Icon className="h-5 w-5" />
            </span>
          )}
        </span>
      </Button>
    );
  };

  const shellBackground = (
    <div className="pointer-events-none absolute inset-0 bg-black" />
  );

  if (isFinished) {
    const winner =
      team1Score > team2Score
        ? game.teams?.team1
        : team2Score > team1Score
          ? game.teams?.team2
          : null;

    return (
      <motion.div
        className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-8 text-center"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        style={cssVars}
      >
        {shellBackground}
        <div className="relative z-10 w-full max-w-2xl rounded-[1.9rem] border border-border/70 bg-card/92 px-6 py-8 shadow-xl backdrop-blur-sm md:px-10 md:py-10">
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary">
              {isVersusMode ? (
                <Trophy className="h-10 w-10" />
              ) : (
                <PartyPopper className="h-10 w-10" />
              )}
            </div>
          </div>

          <h2 className="text-4xl font-black tracking-[-0.05em] text-foreground md:text-5xl">
            Spillet er ferdig
          </h2>
          <p className="mt-4 text-muted-foreground">
            Kortene er brukt opp. Velg om dere vil ta samme runde igjen eller hoppe
            rett til neste spill.
          </p>

          {isVersusMode && game.teams && (
            <div className="mt-8 rounded-[1.5rem] border border-border/70 bg-background/35 p-5">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Resultat
              </p>
              <div className="mt-4 flex flex-col gap-3 text-lg font-semibold sm:flex-row sm:justify-center">
                <span className="rounded-full border border-border/70 bg-card/70 px-4 py-2">
                  <span className="player-highlight">
                    {game.teams.team1}: {team1Score}
                  </span>
                </span>
                <span className="rounded-full border border-border/70 bg-card/70 px-4 py-2">
                  <span className="player-highlight-2">
                    {game.teams.team2}: {team2Score}
                  </span>
                </span>
              </div>
              <p className="mt-5 text-2xl font-black tracking-[-0.04em] text-foreground">
                {winner ? `Vinner: ${winner}` : 'Det ble uavgjort'}
              </p>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3">
            {renderActionButton('Spill igjen', setupGame, Repeat)}
            <Button
              variant="ghost"
              size="lg"
              className="h-14 rounded-[1.3rem] border border-border/70 bg-card/75 text-foreground hover:bg-card hover:text-foreground"
              onClick={() => router.push('/')}
            >
              <Home className="mr-2 h-4 w-4" />
              Velg nytt spill
            </Button>
            {players.length > 0 && (
              <Button
                variant="ghost"
                size="lg"
                className="h-14 rounded-[1.3rem] border border-border/70 bg-card/75 text-foreground hover:bg-card hover:text-foreground"
                onClick={() => router.push('/oppsummering')}
              >
                <Trophy className="mr-2 h-4 w-4" />
                Se oppsummering
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  if (isSpinTheBottleMode && gameMode === 'virtual') {
    return (
      <div
        className="relative isolate flex min-h-screen flex-col overflow-hidden px-4 pb-5 pt-[calc(env(safe-area-inset-top)+0.75rem)] md:px-8 md:pb-8 md:pt-8"
        style={cssVars}
      >
        {shellBackground}
        <div className="relative z-10 flex flex-1 flex-col">
          {topBar}

          <div className="mx-auto flex w-full max-w-[820px] flex-1 flex-col justify-center">
            <div className="relative flex flex-1 items-center justify-center overflow-hidden">
              {!showSpinResult && (
                <div className="flex flex-col items-center justify-center">
                  <motion.div
                    style={{ rotate: bottleRotation }}
                    animate={{ rotate: bottleRotation }}
                    transition={{ duration: 4, ease: 'easeOut' }}
                    className="select-none text-[7rem] md:text-[8rem]"
                  >
                    🍾
                  </motion.div>
                  <p className="mt-4 text-sm font-medium uppercase tracking-[0.22em] text-white/48">
                    {isSpinning ? 'Spinner...' : 'Klar for neste spinn'}
                  </p>
                </div>
              )}

              {showSpinResult && (
                <AnimatePresence initial={false} mode="wait">
                  <motion.div
                    key={currentIndex}
                    variants={cardVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full"
                  >
                    {renderStageCard()}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>

            {!isSpinning && !showSpinResult && (
              <motion.div
                className="sticky bottom-0 mt-6 bg-gradient-to-t from-background via-background/94 to-transparent px-2 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-4"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.24 }}
              >
                {renderActionButton('Spinn flasken', handleSpinBottle, Sparkles)}
              </motion.div>
            )}

            {showSpinResult && (
              <motion.div
                className="sticky bottom-0 mt-6 bg-gradient-to-t from-background via-background/94 to-transparent px-2 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-4"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.24 }}
              >
                {renderActionButton('Neste spinn', handleNextTask)}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if ((isSpinTheBottleMode && gameMode === 'physical') || isPhysicalItemGame) {
    const instructionText = isPhysicalItemGame
      ? "Les oppgaven høyt, kast gjenstanden trygt videre, og la den som får den trykke 'Neste oppgave'."
      : 'Spinn den ekte flasken først. Personen flasken peker på tar kortet som vises.';

    return (
      <div
        className="relative isolate flex min-h-screen flex-col overflow-hidden px-4 pb-5 pt-[calc(env(safe-area-inset-top)+0.75rem)] md:px-8 md:pb-8 md:pt-8"
        style={cssVars}
      >
        {shellBackground}
        <div className="relative z-10 flex flex-1 flex-col">
          {topBar}

          <div className="mx-auto flex w-full max-w-[820px] flex-1 flex-col justify-center">
            <div className="mb-4 flex justify-center">
              <p className="rounded-full border border-border/70 bg-card/80 px-4 py-2 text-center text-xs font-medium text-muted-foreground md:text-sm">
                {instructionText}
              </p>
            </div>

            <div className="relative flex flex-1 items-center justify-center overflow-hidden">
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={currentIndex}
                  variants={cardVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full"
                >
                  {renderStageCard()}
                </motion.div>
              </AnimatePresence>
            </div>

            {!showLoading && currentTask?.type !== 'versus' && (
              <motion.div
                className="sticky bottom-0 mt-6 bg-gradient-to-t from-background via-background/94 to-transparent px-2 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-4"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.24 }}
              >
                {renderActionButton('Neste oppgave', handleNextTask)}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative isolate flex min-h-screen flex-col overflow-hidden px-4 pb-5 pt-[calc(env(safe-area-inset-top)+0.75rem)] md:px-8 md:pb-8 md:pt-8"
      style={cssVars}
    >
      {shellBackground}
      <div className="relative z-10 flex flex-1 flex-col">
        {topBar}

        <div className="mx-auto flex w-full max-w-[820px] flex-1 flex-col justify-center">
          <div className="relative flex flex-1 items-center justify-center overflow-hidden">
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={currentIndex}
                variants={cardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                className="w-full"
              >
                {renderStageCard()}
              </motion.div>
            </AnimatePresence>
          </div>

          {!showLoading && currentTask?.type !== 'versus' && (
            <motion.div
              className="sticky bottom-0 mt-6 bg-gradient-to-t from-background via-background/94 to-transparent px-2 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.24 }}
            >
              {renderActionButton('Neste kort', handleNextTask)}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
