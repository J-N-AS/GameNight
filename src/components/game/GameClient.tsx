'use client';

import type { Game, GameRule, GameTask, Player } from '@/lib/types';
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { TaskCard, type TaskCardTimerState } from './TaskCard';
import { getTaskPresentation, type GameplayTone } from '@/lib/gameplay';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  Home,
  PartyPopper,
  Trophy,
  X,
} from 'lucide-react';
import { useSession } from '@/hooks/usePlayers';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

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

const RECENT_SELECTION_LIMIT = 4;

const gameplayShellGradients: Record<GameplayTone, string> = {
  challenge: 'linear-gradient(180deg,#9f42ef 0%,#4730b7 100%)',
  never: 'linear-gradient(180deg,#ff1a1f 0%,#ff5a00 100%)',
  question: 'linear-gradient(180deg,#1496ff 0%,#0e5fd6 100%)',
  pointing: 'linear-gradient(180deg,#10b8d9 0%,#1273a7 100%)',
  versus: 'linear-gradient(180deg,#4f46e5 0%,#2537c8 100%)',
  truth: 'linear-gradient(180deg,#ff9f1c 0%,#ff5a00 100%)',
  rule: 'linear-gradient(180deg,#8f3ff2 0%,#3c32b2 100%)',
  chaos: 'linear-gradient(180deg,#ff3b30 0%,#ff7a00 100%)',
  secret: 'linear-gradient(180deg,#0fb981 0%,#0d8e8b 100%)',
};

function getFairSelectionWeight(
  playerId: string,
  candidates: Player[],
  selectionCounts: Record<string, number>,
  recentSelections: string[]
): number {
  const candidateCounts = candidates.map(
    (candidate) => selectionCounts[candidate.id] ?? 0
  );
  const minimumSelectionCount = Math.min(...candidateCounts);
  const playerSelectionCount = selectionCounts[playerId] ?? 0;
  const selectionGap = playerSelectionCount - minimumSelectionCount;

  let weight = 1 / (1 + selectionGap * 0.75);

  const recentDistance =
    recentSelections.length - 1 - recentSelections.lastIndexOf(playerId);

  if (recentDistance === 0) {
    weight *= 0.18;
  } else if (recentDistance === 1) {
    weight *= 0.34;
  } else if (recentDistance === 2) {
    weight *= 0.6;
  }

  return Math.max(weight, 0.05);
}

function pickFairPlayer(
  candidates: Player[],
  selectionCounts: Record<string, number>,
  recentSelections: string[]
): Player | null {
  if (candidates.length === 0) {
    return null;
  }

  const weights = candidates.map((candidate) =>
    getFairSelectionWeight(
      candidate.id,
      candidates,
      selectionCounts,
      recentSelections
    )
  );
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);

  let threshold = Math.random() * totalWeight;

  for (let index = 0; index < candidates.length; index += 1) {
    threshold -= weights[index];

    if (threshold <= 0) {
      return candidates[index];
    }
  }

  return candidates[candidates.length - 1];
}

interface GameClientProps {
  game: Game;
  gameMode?: 'virtual' | 'physical' | null;
  onFinishedChange?: (isFinished: boolean) => void;
}

type CardTimerStatus = 'idle' | 'running' | 'finished';
type TaskPlayersAssignment = {
  player1: Player | null;
  player2: Player | null;
} | null;

export function GameClient({
  game,
  gameMode,
  onFinishedChange,
}: GameClientProps) {
  const { players, isLoaded, updatePlayerStat } = useSession();
  const router = useRouter();

  const [tasks, setTasks] = useState<GameTask[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [taskPlayers, setTaskPlayers] = useState<TaskPlayersAssignment>(null);

  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);

  const [bottleRotation, setBottleRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showSpinResult, setShowSpinResult] = useState(false);
  const spinTimeoutRef = useRef<number | null>(null);
  const selectionCountsRef = useRef<Record<string, number>>({});
  const recentSelectionsRef = useRef<string[]>([]);
  const taskPlayersByIndexRef = useRef<Record<number, TaskPlayersAssignment>>({});
  const committedTaskIndicesRef = useRef<Set<number>>(new Set());
  const timerIntervalRef = useRef<number | null>(null);
  const timerDeadlineRef = useRef<number | null>(null);

  const [timerStatus, setTimerStatus] = useState<CardTimerStatus>('idle');
  const [remainingTimerSeconds, setRemainingTimerSeconds] = useState<number | null>(null);

  const isVersusMode = game.gameType === 'versus';
  const isSpinTheBottleMode = game.gameType === 'spin-the-bottle';
  const isPhysicalItemGame = game.gameType === 'physical-item';
  const showLoading = !isLoaded || tasks.length === 0;

  const clearCardTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, []);

  const syncSelectionState = useCallback((nextPlayers: Player[]) => {
    const nextPlayerIds = new Set(nextPlayers.map((player) => player.id));
    const nextSelectionCounts: Record<string, number> = {};

    nextPlayers.forEach((player) => {
      nextSelectionCounts[player.id] = selectionCountsRef.current[player.id] ?? 0;
    });

    selectionCountsRef.current = nextSelectionCounts;
    recentSelectionsRef.current = recentSelectionsRef.current
      .filter((playerId) => nextPlayerIds.has(playerId))
      .slice(-RECENT_SELECTION_LIMIT);
  }, []);

  const registerSelectedPlayer = useCallback((player: Player | null) => {
    if (!player) {
      return;
    }

    selectionCountsRef.current[player.id] =
      (selectionCountsRef.current[player.id] ?? 0) + 1;
    recentSelectionsRef.current = [
      ...recentSelectionsRef.current,
      player.id,
    ].slice(-RECENT_SELECTION_LIMIT);
  }, []);

  const setupGame = useCallback(() => {
    clearCardTimer();
    timerDeadlineRef.current = null;
    setTimerStatus('idle');
    setRemainingTimerSeconds(null);

    if (spinTimeoutRef.current) {
      clearTimeout(spinTimeoutRef.current);
      spinTimeoutRef.current = null;
    }

    selectionCountsRef.current = {};
    recentSelectionsRef.current = [];
    taskPlayersByIndexRef.current = {};
    committedTaskIndicesRef.current = new Set();

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
  }, [clearCardTimer, game]);

  useEffect(() => {
    if (isLoaded) {
      setupGame();
    }
  }, [isLoaded, setupGame]);

  useEffect(() => {
    return () => {
      clearCardTimer();

      if (spinTimeoutRef.current) {
        clearTimeout(spinTimeoutRef.current);
      }
    };
  }, [clearCardTimer]);

  useEffect(() => {
    onFinishedChange?.(isFinished);
  }, [isFinished, onFinishedChange]);

  const currentTask = useMemo(
    () => (tasks.length > 0 ? tasks[currentIndex] : null),
    [currentIndex, tasks]
  );

  useEffect(() => {
    clearCardTimer();
    timerDeadlineRef.current = null;

    if (typeof currentTask?.timer === 'number' && currentTask.timer > 0) {
      setTimerStatus('idle');
      setRemainingTimerSeconds(currentTask.timer);
      return;
    }

    setTimerStatus('idle');
    setRemainingTimerSeconds(null);
  }, [clearCardTimer, currentTask]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    syncSelectionState(players);
  }, [isLoaded, players, syncSelectionState]);

  const resolveTaskPlayersForIndex = useCallback(
    (index: number, task: GameTask | null): TaskPlayersAssignment => {
      if (!isLoaded || !task || players.length === 0) {
        return null;
      }

      if (index in taskPlayersByIndexRef.current) {
        return taskPlayersByIndexRef.current[index];
      }

      if (isSpinTheBottleMode || isPhysicalItemGame) {
        taskPlayersByIndexRef.current[index] = null;
        return null;
      }

      const hasNamedPlaceholders =
        (task.text.includes('{player}') || task.text.includes('{player2}')) &&
        !isNameHiddenType(task.type);

      if (!hasNamedPlaceholders) {
        taskPlayersByIndexRef.current[index] = null;
        return null;
      }

      syncSelectionState(players);

      const availablePlayers = [...players];
      const hasPlayer1Placeholder = task.text.includes('{player}');
      const hasPlayer2Placeholder = task.text.includes('{player2}');

      let player1: Player | null = null;
      let player2: Player | null = null;

      if (hasPlayer1Placeholder) {
        player1 = pickFairPlayer(
          availablePlayers,
          selectionCountsRef.current,
          recentSelectionsRef.current
        );

        if (player1) {
          const selectedPlayer = player1;

          registerSelectedPlayer(selectedPlayer);

          const player1Index = availablePlayers.findIndex(
            (player) => player.id === selectedPlayer.id
          );

          if (player1Index !== -1) {
            availablePlayers.splice(player1Index, 1);
          }
        }
      }

      if (hasPlayer2Placeholder) {
        player2 = pickFairPlayer(
          availablePlayers,
          selectionCountsRef.current,
          recentSelectionsRef.current
        );

        if (player2) {
          registerSelectedPlayer(player2);
        }
      }

      const nextTaskPlayers = { player1, player2 };
      taskPlayersByIndexRef.current[index] = nextTaskPlayers;
      return nextTaskPlayers;
    },
    [
      isLoaded,
      isPhysicalItemGame,
      isSpinTheBottleMode,
      players,
      registerSelectedPlayer,
      syncSelectionState,
    ]
  );

  useEffect(() => {
    setTaskPlayers(resolveTaskPlayersForIndex(currentIndex, currentTask));
  }, [currentIndex, currentTask, resolveTaskPlayersForIndex]);

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

  const startCardTimer = useCallback(() => {
    const durationSeconds = currentTask?.timer;

    if (typeof durationSeconds !== 'number' || durationSeconds <= 0) {
      return;
    }

    clearCardTimer();

    timerDeadlineRef.current = Date.now() + durationSeconds * 1000;
    setRemainingTimerSeconds(durationSeconds);
    setTimerStatus('running');

    timerIntervalRef.current = window.setInterval(() => {
      const deadline = timerDeadlineRef.current;

      if (!deadline) {
        return;
      }

      const secondsLeft = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));

      setRemainingTimerSeconds(secondsLeft);

      if (secondsLeft <= 0) {
        clearCardTimer();
        timerDeadlineRef.current = null;
        setTimerStatus('finished');
      }
    }, 200);
  }, [clearCardTimer, currentTask?.timer]);

  const currentTaskTimerState = useMemo<TaskCardTimerState | null>(() => {
    if (
      !currentTask ||
      typeof currentTask.timer !== 'number' ||
      currentTask.timer <= 0 ||
      remainingTimerSeconds === null
    ) {
      return null;
    }

    return {
      durationSeconds: currentTask.timer,
      remainingSeconds: remainingTimerSeconds,
      status: timerStatus,
      onStart: startCardTimer,
      onRestart: startCardTimer,
    };
  }, [currentTask, remainingTimerSeconds, startCardTimer, timerStatus]);
  const isTimerOverlayRunning = currentTaskTimerState?.status === 'running';
  const isTimerOverlayFinished = currentTaskTimerState?.status === 'finished';
  const isTimerOverlayVisible = isTimerOverlayRunning || isTimerOverlayFinished;

  const commitStatsForCurrentTask = useCallback(() => {
    if (!currentTask || !isLoaded || players.length === 0) {
      return;
    }

    if (committedTaskIndicesRef.current.has(currentIndex)) {
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

    committedTaskIndicesRef.current.add(currentIndex);
  }, [
    currentIndex,
    currentTask,
    isPhysicalItemGame,
    isLoaded,
    isSpinTheBottleMode,
    players.length,
    taskPlayers,
    updatePlayerStat,
  ]);

  const handleNextTask = useCallback(() => {
    if (!currentTask) {
      return;
    }

    clearCardTimer();
    timerDeadlineRef.current = null;

    commitStatsForCurrentTask();

    if (isSpinTheBottleMode) {
      setShowSpinResult(false);
    }

    if (currentIndex < tasks.length - 1) {
      const nextIndex = currentIndex + 1;
      const nextTask = tasks[nextIndex] ?? null;

      setTaskPlayers(resolveTaskPlayersForIndex(nextIndex, nextTask));
      setCurrentIndex(nextIndex);
    } else {
      setIsFinished(true);
    }
  }, [
    clearCardTimer,
    commitStatsForCurrentTask,
    currentIndex,
    currentTask,
    isSpinTheBottleMode,
    resolveTaskPlayersForIndex,
    tasks,
    tasks.length,
  ]);

  const handlePreviousTask = useCallback(() => {
    if (currentIndex === 0) {
      return;
    }

    clearCardTimer();
    timerDeadlineRef.current = null;

    if (spinTimeoutRef.current) {
      clearTimeout(spinTimeoutRef.current);
      spinTimeoutRef.current = null;
    }

    setIsSpinning(false);

    if (isSpinTheBottleMode && gameMode === 'virtual') {
      setShowSpinResult(true);
    }

    const previousIndex = currentIndex - 1;
    const previousTask = tasks[previousIndex] ?? null;

    setTaskPlayers(resolveTaskPlayersForIndex(previousIndex, previousTask));
    setCurrentIndex(previousIndex);
  }, [
    clearCardTimer,
    currentIndex,
    gameMode,
    isSpinTheBottleMode,
    resolveTaskPlayersForIndex,
    tasks,
  ]);

  const handleExitGame = useCallback(() => {
    router.push('/');
  }, [router]);

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

    if (spinTimeoutRef.current) {
      clearTimeout(spinTimeoutRef.current);
    }

    spinTimeoutRef.current = window.setTimeout(() => {
      setIsSpinning(false);
      setShowSpinResult(true);
      spinTimeoutRef.current = null;
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
    enter: { opacity: 0, scale: 1.015 },
    center: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, scale: 0.99 },
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
  const shellSurfaceStyle = useMemo<React.CSSProperties>(() => {
    const tone = currentTask
      ? getTaskPresentation(currentTask, game).tone
      : 'challenge';

    return {
      backgroundImage: gameplayShellGradients[tone],
    };
  }, [currentTask, game]);

  const renderStageCard = () => {
    if (showLoading) {
      return (
        <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(180deg,#0f172a_0%,#020617_100%)] px-6 text-center text-sm font-medium tracking-[0.12em] text-white/58">
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
        variant="immersive"
        timerState={currentTaskTimerState}
        onVote={isVersusMode ? handleVote : undefined}
        teams={isVersusMode ? game.teams : undefined}
      />
    );
  };

  const canGoBack = currentIndex > 0;
  const progressLabel = !showLoading ? `${currentIndex + 1} / ${tasks.length}` : null;
  const defaultCanTapAdvance =
    !showLoading &&
    currentTask?.type !== 'versus' &&
    currentTaskTimerState?.status !== 'running';

  const renderActionButton = (
    label: string,
    onClick: () => void
  ) => {
    return (
      <Button
        onClick={onClick}
        size="lg"
        className="mx-auto h-[4.35rem] w-full max-w-[26rem] rounded-[1.55rem] border-2 border-[#1f6ed4] bg-[#f1f1f1] px-5 text-base font-black uppercase tracking-[-0.03em] text-black shadow-[0_12px_0_0_rgba(255,255,255,0.12)] transition-transform duration-150 hover:bg-white active:translate-y-[3px] active:shadow-[0_8px_0_0_rgba(255,255,255,0.1)] [@media(max-height:760px)]:h-[4rem]"
      >
        <span className="block w-full text-center text-[clamp(1.2rem,4.8vw,1.7rem)] font-black leading-none">
          {label}
        </span>
      </Button>
    );
  };

  const shellBackground = (
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_32%)]" />
  );

  const renderAnimatedStageCard = () => (
    <div className="relative h-full w-full overflow-hidden">
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={currentIndex}
          variants={cardVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 h-full w-full"
        >
          {renderStageCard()}
        </motion.div>
      </AnimatePresence>
    </div>
  );

  const renderTimerOverlay = () => {
    return (
      <AnimatePresence initial={false} mode="sync">
        {currentTaskTimerState && currentTaskTimerState.status !== 'idle' ? (
          <motion.div
            key={`timer-overlay-${currentIndex}-${currentTaskTimerState.status}`}
            className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-slate-950/42 backdrop-blur-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex h-full w-full items-center justify-center px-6 text-center">
              {isTimerOverlayRunning ? (
                <AnimatePresence initial={false} mode="wait">
                  <motion.p
                    key={currentTaskTimerState.remainingSeconds}
                    className="gameplay-timer-overlay__value text-[clamp(7rem,30vw,22rem)] font-black leading-none tracking-[-0.08em] text-white [text-shadow:0_24px_70px_rgba(0,0,0,0.45)]"
                    initial={{ opacity: 0.3, scale: 0.84, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0.18, scale: 1.08, filter: 'blur(10px)' }}
                    transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {currentTaskTimerState.remainingSeconds}
                  </motion.p>
                </AnimatePresence>
              ) : isTimerOverlayFinished ? (
                <p className="gameplay-timer-overlay__stop text-[clamp(5.25rem,22vw,15rem)] font-black leading-none tracking-[-0.08em] text-[#ff3b30] [text-shadow:0_24px_85px_rgba(255,59,48,0.4)]">
                  STOPP!
                </p>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    );
  };

  const renderGameplayShell = ({
    stage,
    canTapAdvance = defaultCanTapAdvance,
  }: {
    stage: React.ReactNode;
    canTapAdvance?: boolean;
  }) => (
    <div
      className="fixed inset-0 z-50 isolate h-[100svh] w-screen overflow-hidden"
      style={cssVars}
    >
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={`shell-${currentIndex}`}
          className="pointer-events-none absolute inset-0"
          style={shellSurfaceStyle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
        />
      </AnimatePresence>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_28%),radial-gradient(circle_at_center,rgba(255,255,255,0.04),transparent_46%)]" />

      <div
        className={`pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between px-3 pt-[calc(env(safe-area-inset-top)+0.75rem)] transition-opacity duration-200 sm:px-4 ${
          isTimerOverlayVisible ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handlePreviousTask}
          disabled={!canGoBack}
          className="pointer-events-auto h-12 w-12 rounded-full border border-slate-900/12 bg-white text-slate-950 shadow-[0_14px_30px_rgba(15,23,42,0.24)] transition-transform duration-150 hover:scale-[1.02] hover:bg-white active:scale-[0.98] disabled:pointer-events-none disabled:bg-white/58 disabled:text-slate-950/38"
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Forrige kort</span>
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleExitGame}
          className="pointer-events-auto h-12 w-12 rounded-full border border-slate-900/12 bg-white text-slate-950 shadow-[0_14px_30px_rgba(15,23,42,0.24)] transition-transform duration-150 hover:scale-[1.02] hover:bg-white active:scale-[0.98]"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Avslutt spill</span>
        </Button>
      </div>

      {progressLabel && (
        <div
          className={`pointer-events-none absolute inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+0.8rem)] z-20 flex justify-center transition-opacity duration-200 ${
            isTimerOverlayVisible ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <p className="text-[0.72rem] font-medium tracking-[0.18em] text-white/46">
            {progressLabel}
          </p>
        </div>
      )}

      <div
        className="absolute inset-0"
        role={canTapAdvance ? 'button' : undefined}
        tabIndex={canTapAdvance ? 0 : -1}
        onClick={canTapAdvance ? handleNextTask : undefined}
        onKeyDown={
          canTapAdvance
            ? (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  handleNextTask();
                }
              }
            : undefined
        }
        aria-label={canTapAdvance ? 'Trykk for neste kort' : undefined}
      >
        {stage}
      </div>

      {renderTimerOverlay()}
    </div>
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
            {renderActionButton('Spill igjen', setupGame)}
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
    return renderGameplayShell({
      stage: !showSpinResult ? (
        <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_30%),linear-gradient(180deg,#0f172a_0%,#020617_100%)] px-6 text-center">
          <motion.div
            style={{ rotate: bottleRotation }}
            animate={{ rotate: bottleRotation }}
            transition={{ duration: 4, ease: 'easeOut' }}
            className="select-none text-[5.8rem] sm:text-[6.4rem] md:text-[8rem]"
          >
            🍾
          </motion.div>
          <p className="mt-4 text-[0.72rem] font-medium uppercase tracking-[0.2em] text-white/48 sm:text-sm">
            {isSpinning ? 'Spinner...' : 'Klar for neste spinn'}
          </p>
          {!isSpinning && (
            <div
              className="mt-6"
              onClick={(event) => event.stopPropagation()}
              onKeyDown={(event) => event.stopPropagation()}
            >
              {renderActionButton('Spinn flasken', handleSpinBottle)}
            </div>
          )}
        </div>
      ) : (
        renderAnimatedStageCard()
      ),
      canTapAdvance:
        showSpinResult &&
        !showLoading &&
        currentTask?.type !== 'versus' &&
        currentTaskTimerState?.status !== 'running',
    });
  }

  if ((isSpinTheBottleMode && gameMode === 'physical') || isPhysicalItemGame) {
    return renderGameplayShell({
      stage: renderAnimatedStageCard(),
    });
  }

  return renderGameplayShell({
    stage: renderAnimatedStageCard(),
  });
}
