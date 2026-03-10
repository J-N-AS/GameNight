'use client';

import type { Game, GameTask, Player } from '@/lib/types';
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
} from 'lucide-react';
import Link from 'next/link';
import { useSession } from '@/hooks/usePlayers';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { GameMenu } from './GameMenu';
import { ActiveRulesPanel } from './ActiveRulesPanel';
import { ImpactMomentReveal } from './ImpactMomentReveal';
import {
  removeActiveRule,
  resolveNextActiveRules,
  setAllActiveRulesPaused,
  toggleActiveRulePause,
  type ActiveGameRule,
  type ResolvedGameRule,
} from '@/lib/game-rules';
import {
  getGameplayMoment,
  getTaskPresentation,
  type GameplayTone,
} from '@/lib/gameplay';
import { cn } from '@/lib/utils';

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

const toneShellStyles: Record<
  GameplayTone,
  {
    pillClass: string;
    progressClass: string;
    buttonClass: string;
    auraPrimaryClass: string;
    auraSecondaryClass: string;
  }
> = {
  challenge: {
    pillClass: 'border-fuchsia-200/18 bg-fuchsia-400/10 text-fuchsia-50',
    progressClass: 'from-fuchsia-300 via-pink-300 to-violet-300',
    buttonClass:
      'from-fuchsia-500 via-violet-500 to-fuchsia-400 shadow-[0_30px_90px_-38px_rgba(192,38,211,0.95)]',
    auraPrimaryClass: 'bg-fuchsia-500/18',
    auraSecondaryClass: 'bg-violet-500/16',
  },
  never: {
    pillClass: 'border-orange-200/18 bg-orange-400/10 text-orange-50',
    progressClass: 'from-orange-300 via-rose-300 to-red-300',
    buttonClass:
      'from-orange-500 via-rose-500 to-red-400 shadow-[0_30px_90px_-38px_rgba(249,115,22,0.95)]',
    auraPrimaryClass: 'bg-orange-500/18',
    auraSecondaryClass: 'bg-rose-500/16',
  },
  question: {
    pillClass: 'border-sky-200/18 bg-sky-400/10 text-sky-50',
    progressClass: 'from-sky-300 via-cyan-300 to-teal-300',
    buttonClass:
      'from-sky-500 via-cyan-500 to-teal-400 shadow-[0_30px_90px_-38px_rgba(14,165,233,0.95)]',
    auraPrimaryClass: 'bg-sky-500/16',
    auraSecondaryClass: 'bg-cyan-500/14',
  },
  pointing: {
    pillClass: 'border-cyan-200/18 bg-cyan-400/10 text-cyan-50',
    progressClass: 'from-cyan-300 via-sky-300 to-lime-300',
    buttonClass:
      'from-cyan-500 via-sky-500 to-lime-400 shadow-[0_30px_90px_-38px_rgba(34,211,238,0.95)]',
    auraPrimaryClass: 'bg-cyan-500/16',
    auraSecondaryClass: 'bg-lime-400/12',
  },
  versus: {
    pillClass: 'border-indigo-200/18 bg-indigo-400/10 text-indigo-50',
    progressClass: 'from-indigo-300 via-blue-300 to-sky-300',
    buttonClass:
      'from-indigo-500 via-blue-500 to-sky-400 shadow-[0_30px_90px_-38px_rgba(99,102,241,0.95)]',
    auraPrimaryClass: 'bg-indigo-500/16',
    auraSecondaryClass: 'bg-blue-500/14',
  },
  truth: {
    pillClass: 'border-amber-200/18 bg-amber-400/10 text-amber-50',
    progressClass: 'from-amber-300 via-orange-300 to-rose-300',
    buttonClass:
      'from-amber-500 via-orange-500 to-rose-400 shadow-[0_30px_90px_-38px_rgba(245,158,11,0.95)]',
    auraPrimaryClass: 'bg-amber-500/16',
    auraSecondaryClass: 'bg-rose-500/12',
  },
  rule: {
    pillClass: 'border-blue-200/18 bg-blue-400/10 text-blue-50',
    progressClass: 'from-blue-300 via-indigo-300 to-sky-300',
    buttonClass:
      'from-blue-500 via-indigo-500 to-sky-400 shadow-[0_30px_90px_-38px_rgba(59,130,246,0.95)]',
    auraPrimaryClass: 'bg-blue-500/16',
    auraSecondaryClass: 'bg-indigo-500/14',
  },
  chaos: {
    pillClass: 'border-red-200/18 bg-red-400/10 text-red-50',
    progressClass: 'from-red-300 via-orange-300 to-amber-300',
    buttonClass:
      'from-red-500 via-orange-500 to-amber-400 shadow-[0_30px_90px_-38px_rgba(239,68,68,0.95)]',
    auraPrimaryClass: 'bg-red-500/18',
    auraSecondaryClass: 'bg-amber-500/14',
  },
  secret: {
    pillClass: 'border-emerald-200/18 bg-emerald-400/10 text-emerald-50',
    progressClass: 'from-emerald-300 via-cyan-300 to-sky-300',
    buttonClass:
      'from-emerald-500 via-cyan-500 to-sky-400 shadow-[0_30px_90px_-38px_rgba(16,185,129,0.95)]',
    auraPrimaryClass: 'bg-emerald-500/16',
    auraSecondaryClass: 'bg-sky-500/12',
  },
};

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
  const [displayPhase, setDisplayPhase] = useState<'intro' | 'card'>('card');
  const [taskPlayers, setTaskPlayers] = useState<{
    player1: Player | null;
    player2: Player | null;
  } | null>(null);
  const processedIndexRef = useRef<number | null>(null);
  const revealedMomentKeyRef = useRef<string | null>(null);
  const [activeRules, setActiveRules] = useState<ActiveGameRule[]>([]);
  const [areRulesExpanded, setAreRulesExpanded] = useState(false);
  const previousActiveRuleCountRef = useRef(0);

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
    setDisplayPhase('card');
    setTeam1Score(0);
    setTeam2Score(0);
    setShowSpinResult(false);
    setIsSpinning(false);
    setBottleRotation(0);
    setTaskPlayers(null);
    setActiveRules([]);
    setAreRulesExpanded(false);
    processedIndexRef.current = null;
    revealedMomentKeyRef.current = null;
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

  useEffect(() => {
    const previousRuleCount = previousActiveRuleCountRef.current;

    if (previousRuleCount === 0 && activeRules.length > 0) {
      setAreRulesExpanded(true);
    }

    if (activeRules.length === 0) {
      setAreRulesExpanded(false);
    }

    previousActiveRuleCountRef.current = activeRules.length;
  }, [activeRules.length]);

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

  const currentTaskRule = useMemo<ResolvedGameRule | null>(() => {
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
      source: resolveTaskTextToPlain(currentTask.text, currentTask.type),
    };
  }, [currentTask, resolveTaskTextToPlain]);

  const currentPresentation = useMemo(
    () =>
      currentTask
        ? getTaskPresentation(currentTask, game)
        : getTaskPresentation({ type: 'challenge', text: '...' }, game),
    [currentTask, game]
  );

  const currentMoment = useMemo(() => {
    return currentTask ? getGameplayMoment(currentTask, game) : null;
  }, [currentTask, game]);

  const currentTone = currentMoment?.tone ?? currentPresentation.tone;
  const toneStyle = toneShellStyles[currentTone];

  const isCardVisible =
    !showLoading && (!isSpinTheBottleMode || gameMode !== 'virtual' || showSpinResult);

  useEffect(() => {
    if (!currentTask || !isCardVisible) {
      setDisplayPhase('card');
      return;
    }

    if (!currentMoment) {
      setDisplayPhase('card');
      return;
    }

    const momentKey = `${currentIndex}:${currentMoment.label}`;

    if (revealedMomentKeyRef.current === momentKey) {
      setDisplayPhase('card');
      return;
    }

    setDisplayPhase('intro');

    const timeout = window.setTimeout(() => {
      revealedMomentKeyRef.current = momentKey;
      setDisplayPhase('card');
    }, currentMoment.durationMs);

    return () => window.clearTimeout(timeout);
  }, [currentIndex, currentMoment, currentTask, isCardVisible]);

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
    setActiveRules((previousRules) =>
      resolveNextActiveRules(previousRules, currentTaskRule)
    );

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
    currentTaskRule,
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
    enter: { opacity: 0, x: 84, scale: 0.98, rotate: 2, filter: 'blur(7px)' },
    center: { opacity: 1, x: 0, scale: 1, rotate: 0, filter: 'blur(0px)' },
    exit: { opacity: 0, x: -84, scale: 0.96, rotate: -2, filter: 'blur(4px)' },
  };

  const progressValue =
    tasks.length > 0 ? ((currentIndex + 1) / tasks.length) * 100 : 0;

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
        <div className="flex min-h-[25rem] items-center justify-center rounded-[2.5rem] border border-white/10 bg-black/20 text-sm text-white/70 backdrop-blur-xl md:min-h-[32rem]">
          Laster spill...
        </div>
      );
    }

    if (!currentTask) {
      return null;
    }

    if (displayPhase === 'intro' && currentMoment) {
      return <ImpactMomentReveal moment={currentMoment} />;
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
    <div className="sticky top-[calc(env(safe-area-inset-top)+0.15rem)] z-30 mb-4 flex items-center justify-between gap-3">
      <Button
        variant="ghost"
        size="sm"
        asChild
        className="h-11 rounded-full border border-white/12 bg-black/25 px-4 text-white backdrop-blur-xl hover:bg-white/10 hover:text-white"
      >
        <Link href="/">
          <Home className="h-4 w-4" />
          <span className="hidden sm:inline">Lobby</span>
        </Link>
      </Button>

      <div
        className={cn(
          'flex min-w-0 items-center justify-center gap-2 rounded-full border px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] backdrop-blur-xl',
          toneStyle.pillClass
        )}
      >
        <span aria-hidden>{game.emoji ?? '🎮'}</span>
        <span className="max-w-[10rem] truncate sm:max-w-[14rem]">{game.title}</span>
      </div>

      <GameMenu context="in-game" onRestart={setupGame} />
    </div>
  );

  const stageStatus = !showLoading && tasks.length > 0 && (
    <div className="mx-auto mb-4 w-full max-w-xl">
      <div className="flex items-center justify-between gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-white/62">
        <span>Kort {currentIndex + 1} / {tasks.length}</span>
        <span>{currentMoment?.label ?? currentPresentation.badge}</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className={cn('h-full rounded-full bg-gradient-to-r', toneStyle.progressClass)}
          animate={{ width: `${progressValue}%` }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        {isVersusMode && game.teams ? (
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5">
              <span className="player-highlight">{game.teams.team1}: {team1Score}</span>
            </span>
            <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5">
              <span className="player-highlight-2">{game.teams.team2}: {team2Score}</span>
            </span>
          </div>
        ) : (
          <span className="text-xs text-white/48">
            {activeRules.length > 0
              ? `${activeRules.length} aktive regler`
              : 'Focus mode er på'}
          </span>
        )}
        <span className="text-xs text-white/48">
          {displayPhase === 'intro' ? 'Reveal...' : 'Klar for neste trekk'}
        </span>
      </div>
    </div>
  );

  const rulesPanel = (
    <ActiveRulesPanel
      activeRules={activeRules}
      isExpanded={areRulesExpanded}
      onExpandedChange={setAreRulesExpanded}
      onToggleAllPaused={() => {
        const nextPausedState = !activeRules.every((rule) => rule.paused);
        setActiveRules((previousRules) =>
          setAllActiveRulesPaused(previousRules, nextPausedState)
        );
      }}
      onToggleRulePaused={(ruleId) => {
        setActiveRules((previousRules) =>
          toggleActiveRulePause(previousRules, ruleId)
        );
      }}
      onRemoveRule={(ruleId) => {
        setActiveRules((previousRules) =>
          removeActiveRule(previousRules, ruleId)
        );
      }}
    />
  );

  const renderActionButton = (
    label: string,
    onClick: () => void,
    icon: React.ComponentType<{ className?: string }> = ArrowRight
  ) => {
    const Icon = icon;

    return (
      <Button
        onClick={onClick}
        size="lg"
        className={cn(
          'group relative mx-auto h-[4.5rem] w-full max-w-[26rem] overflow-hidden rounded-[1.9rem] border border-white/16 bg-gradient-to-b px-6 text-white backdrop-blur-xl transition-all duration-150 hover:brightness-105 active:translate-y-[2px] active:scale-[0.985]',
          toneStyle.buttonClass
        )}
      >
        <span className="absolute inset-x-4 top-0 h-px bg-white/45" />
        <span className="relative flex w-full items-center justify-between gap-3 text-left">
          <span className="flex flex-col">
            <span className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-white/70">
              Fortsett spillet
            </span>
            <span className="mt-1 text-lg font-black tracking-[-0.03em]">
              {label}
            </span>
          </span>
          <span className="rounded-full border border-white/18 bg-white/12 p-2.5">
            <Icon className="h-5 w-5" />
          </span>
        </span>
      </Button>
    );
  };

  const shellBackground = (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className={cn(
          'absolute left-[-10%] top-[-10%] h-[34rem] w-[34rem] rounded-full blur-3xl transition-colors duration-500',
          toneStyle.auraPrimaryClass
        )}
      />
      <div
        className={cn(
          'absolute bottom-[-12rem] right-[-8%] h-[28rem] w-[28rem] rounded-full blur-3xl transition-colors duration-500',
          toneStyle.auraSecondaryClass
        )}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_40%,rgba(0,0,0,0.26))]" />
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
        <div className="relative z-10 w-full max-w-2xl rounded-[2.5rem] border border-white/10 bg-black/24 px-6 py-8 shadow-[0_40px_120px_-48px_rgba(0,0,0,0.9)] backdrop-blur-xl md:px-10 md:py-10">
          <div className="mb-6 flex justify-center">
            <div
              className={cn(
                'flex h-20 w-20 items-center justify-center rounded-full border border-white/12 bg-white/10 text-white',
                toneStyle.pillClass
              )}
            >
              {isVersusMode ? (
                <Trophy className="h-10 w-10" />
              ) : (
                <PartyPopper className="h-10 w-10" />
              )}
            </div>
          </div>

          <h2 className="text-4xl font-black tracking-[-0.05em] text-white md:text-5xl">
            Spillet er ferdig
          </h2>
          <p className="mt-4 text-white/70">
            Kortene er brukt opp. Velg om dere vil ta samme runde igjen eller hoppe
            rett til neste spill.
          </p>

          {isVersusMode && game.teams && (
            <div className="mt-8 rounded-[1.9rem] border border-white/10 bg-white/6 p-5">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-white/62">
                Resultat
              </p>
              <div className="mt-4 flex flex-col gap-3 text-lg font-semibold sm:flex-row sm:justify-center">
                <span className="rounded-full border border-white/10 bg-white/6 px-4 py-2">
                  <span className="player-highlight">
                    {game.teams.team1}: {team1Score}
                  </span>
                </span>
                <span className="rounded-full border border-white/10 bg-white/6 px-4 py-2">
                  <span className="player-highlight-2">
                    {game.teams.team2}: {team2Score}
                  </span>
                </span>
              </div>
              <p className="mt-5 text-2xl font-black tracking-[-0.04em] text-white">
                {winner ? `Vinner: ${winner}` : 'Det ble uavgjort'}
              </p>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3">
            {renderActionButton('Spill igjen', setupGame, Repeat)}
            <Button
              variant="ghost"
              size="lg"
              className="h-14 rounded-[1.4rem] border border-white/12 bg-white/6 text-white hover:bg-white/10 hover:text-white"
              onClick={() => router.push('/')}
            >
              <Home className="mr-2 h-4 w-4" />
              Velg nytt spill
            </Button>
            {players.length > 0 && (
              <Button
                variant="ghost"
                size="lg"
                className="h-14 rounded-[1.4rem] border border-white/12 bg-white/6 text-white hover:bg-white/10 hover:text-white"
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
          {stageStatus}
          {rulesPanel}

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
                    key={`${currentIndex}-${displayPhase}`}
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

            {showSpinResult && displayPhase === 'card' && (
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
          {stageStatus}
          {rulesPanel}

          <div className="mx-auto flex w-full max-w-[820px] flex-1 flex-col justify-center">
            <div className="mb-4 flex justify-center">
              <p className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-center text-xs font-medium text-white/62 md:text-sm">
                {instructionText}
              </p>
            </div>

            <div className="relative flex flex-1 items-center justify-center overflow-hidden">
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={`${currentIndex}-${displayPhase}`}
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

            {!showLoading && displayPhase === 'card' && currentTask?.type !== 'versus' && (
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
        {stageStatus}
        {rulesPanel}

        <div className="mx-auto flex w-full max-w-[820px] flex-1 flex-col justify-center">
          <div className="relative flex flex-1 items-center justify-center overflow-hidden">
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={`${currentIndex}-${displayPhase}`}
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

          {!showLoading && displayPhase === 'card' && currentTask?.type !== 'versus' && (
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
