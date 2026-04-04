import type { Game, GameRule, GameTask } from '@/lib/types';
import { cn } from '@/lib/utils';
import { getTaskPresentation, type GameplayTone } from '@/lib/gameplay';
import {
  CheckCircle2,
  Clock3,
  Crown,
  Flame,
  Hand,
  HelpCircle,
  MessageSquareQuote,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Swords,
  Zap,
} from 'lucide-react';
import React from 'react';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';

type ToneDetails = {
  icon: React.ComponentType<{ className?: string }>;
  surfaceClass: string;
  badgeClass: string;
  contentClass: string;
  subtitleClass: string;
};

const toneDetails: Record<GameplayTone, ToneDetails> = {
  challenge: {
    icon: Flame,
    surfaceClass: 'bg-[linear-gradient(180deg,#9f42ef_0%,#4730b7_100%)]',
    badgeClass: 'bg-black/20 text-white',
    contentClass: 'text-white',
    subtitleClass: 'text-white/68',
  },
  never: {
    icon: MessageSquareQuote,
    surfaceClass: 'bg-[linear-gradient(180deg,#ff1a1f_0%,#ff5a00_100%)]',
    badgeClass: 'bg-black/22 text-white',
    contentClass: 'text-white',
    subtitleClass: 'text-white/70',
  },
  question: {
    icon: HelpCircle,
    surfaceClass: 'bg-[linear-gradient(180deg,#1496ff_0%,#0e5fd6_100%)]',
    badgeClass: 'bg-black/20 text-white',
    contentClass: 'text-white',
    subtitleClass: 'text-white/68',
  },
  pointing: {
    icon: Hand,
    surfaceClass: 'bg-[linear-gradient(180deg,#10b8d9_0%,#1273a7_100%)]',
    badgeClass: 'bg-black/20 text-white',
    contentClass: 'text-white',
    subtitleClass: 'text-white/68',
  },
  versus: {
    icon: Swords,
    surfaceClass: 'bg-[linear-gradient(180deg,#4f46e5_0%,#2537c8_100%)]',
    badgeClass: 'bg-black/20 text-white',
    contentClass: 'text-white',
    subtitleClass: 'text-white/68',
  },
  truth: {
    icon: ShieldAlert,
    surfaceClass: 'bg-[linear-gradient(180deg,#ff9f1c_0%,#ff5a00_100%)]',
    badgeClass: 'bg-black/20 text-white',
    contentClass: 'text-white',
    subtitleClass: 'text-white/68',
  },
  rule: {
    icon: Sparkles,
    surfaceClass: 'bg-[linear-gradient(180deg,#8f3ff2_0%,#3c32b2_100%)]',
    badgeClass: 'bg-black/20 text-white',
    contentClass: 'text-white',
    subtitleClass: 'text-white/68',
  },
  chaos: {
    icon: Zap,
    surfaceClass: 'bg-[linear-gradient(180deg,#ff3b30_0%,#ff7a00_100%)]',
    badgeClass: 'bg-black/22 text-white',
    contentClass: 'text-white',
    subtitleClass: 'text-white/70',
  },
  secret: {
    icon: Crown,
    surfaceClass: 'bg-[linear-gradient(180deg,#0fb981_0%,#0d8e8b_100%)]',
    badgeClass: 'bg-black/20 text-white',
    contentClass: 'text-white',
    subtitleClass: 'text-white/68',
  },
};

type TaskCardProps = {
  game: Pick<Game, 'id' | 'category'>;
  task: GameTask;
  content: React.ReactNode;
  onVote?: (winner: 'team1' | 'team2') => void;
  teams?: Game['teams'];
  rule?: GameRule | null;
  penalty?: string | null;
  timerState?: TaskCardTimerState | null;
  variant?: 'default' | 'immersive';
};

export type TaskCardTimerState = {
  durationSeconds: number;
  remainingSeconds: number;
  status: 'idle' | 'running' | 'finished';
  onStart: () => void;
  onRestart: () => void;
};

function formatTimerLabel(totalSeconds: number) {
  const safeSeconds = Math.max(0, totalSeconds);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

type TaskBurstParticle = {
  id: number;
  x: number;
  y: number;
  size: number;
  rotate: number;
  delay: number;
  color: string;
  shape: 'square' | 'star';
};

const burstPalette = [
  '#f8fafc',
  '#fde68a',
  '#f9a8d4',
  '#93c5fd',
  '#86efac',
  '#c4b5fd',
];

function createTaskBurstParticles(seedSource: string): TaskBurstParticle[] {
  let seed =
    seedSource.split('').reduce((total, character) => {
      return total + character.charCodeAt(0);
    }, 0) || 1;

  const nextRandom = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  return Array.from({ length: 18 }, (_, index) => {
    const angle = nextRandom() * Math.PI * 2;
    const distance = 56 + nextRandom() * 130;
    const drift = 0.68 + nextRandom() * 0.28;

    return {
      id: index,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance * drift,
      size: 8 + nextRandom() * 10,
      rotate: -160 + nextRandom() * 320,
      delay: nextRandom() * 0.16,
      color: burstPalette[index % burstPalette.length],
      shape: nextRandom() > 0.72 ? 'star' : 'square',
    };
  });
}

export function TaskCard({
  game,
  task,
  content,
  onVote,
  teams,
  rule,
  penalty,
  timerState,
  variant = 'default',
}: TaskCardProps) {
  const presentation = getTaskPresentation(task, game);
  const details = toneDetails[presentation.tone];
  const Icon = details.icon;
  const isImmersive = variant === 'immersive';
  const subtitle = isImmersive ? null : rule?.description ?? presentation.hint;
  const showTimer = Boolean(
    timerState && timerState.durationSeconds > 0
  );
  const showPenalty = !isImmersive && Boolean(penalty?.trim());
  const isVersusCard = task.type === 'versus';
  const estimatedTextLength =
    task.text.length + (subtitle?.length ?? 0) + (penalty?.length ?? 0);
  const isLongTextCard =
    estimatedTextLength > 140 || (subtitle?.length ?? 0) > 90;
  const isCompactCard = isLongTextCard || showTimer || showPenalty || isVersusCard;
  const isUltraCompactCard =
    estimatedTextLength > 220 || (showTimer && showPenalty);
  const textDensity = isUltraCompactCard
    ? 'ultra'
    : isCompactCard
      ? 'compact'
      : 'default';
  const timerProgress = showTimer && timerState
    ? Math.max(
        0,
        Math.min(
          100,
          (timerState.remainingSeconds / timerState.durationSeconds) * 100
        )
      )
    : 0;
  const timerLabel =
    timerState?.status === 'finished'
      ? 'Tiden er ute'
      : timerState?.status === 'running'
        ? 'Timeren går'
        : 'Klar når dere er det';
  const timerActionLabel =
    timerState?.status === 'idle'
      ? 'Start timer'
      : timerState?.status === 'running'
        ? 'Start på nytt'
        : 'Kjør igjen';
  const TimerStatusIcon =
    timerState?.status === 'finished' ? CheckCircle2 : Clock3;
  const taskBurstParticles = React.useMemo(
    () => createTaskBurstParticles(task.text),
    [task.text]
  );
  const showImmersiveInlineTimer =
    isImmersive && showTimer && timerState?.status === 'idle';
  const immersiveTimerActionLabel =
    timerState?.status === 'idle' ? 'Start' : timerActionLabel;

  if (isImmersive) {
    return (
      <article
        className={cn(
          'immersive-task-card relative isolate flex h-full w-full flex-col overflow-hidden text-center',
          details.surfaceClass
        )}
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),transparent_28%),radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_44%)]" />

        <div className="relative z-10 flex h-full min-h-0 flex-col px-[clamp(1.35rem,5vw,2.4rem)] pb-[calc(env(safe-area-inset-bottom)+3.4rem)] pt-[calc(env(safe-area-inset-top)+4.5rem)]">
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center">
            <div className="relative flex items-center justify-center">
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                {taskBurstParticles.map((particle) => (
                  <motion.span
                    key={particle.id}
                    aria-hidden
                    className="absolute block mix-blend-screen shadow-[0_0_18px_rgba(255,255,255,0.35)]"
                    initial={{ opacity: 0, x: 0, y: 0, rotate: 0, scale: 0.35 }}
                    animate={{
                      opacity: [0, 0.95, 0],
                      x: particle.x,
                      y: particle.y,
                      rotate: particle.rotate,
                      scale: [0.35, 1, 0.58],
                    }}
                    transition={{
                      duration: 0.96,
                      delay: particle.delay,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{
                      width: particle.size,
                      height: particle.size,
                      backgroundColor: particle.color,
                      borderRadius: particle.shape === 'square' ? '0.28rem' : undefined,
                      clipPath:
                        particle.shape === 'star'
                          ? 'polygon(50% 0%,61% 36%,98% 36%,68% 57%,79% 92%,50% 70%,21% 92%,32% 57%,2% 36%,39% 36%)'
                          : undefined,
                    }}
                  />
                ))}
              </div>

              <motion.div
                className={cn(
                  'immersive-task-card__content relative z-10 max-w-[14.5ch] px-2 text-balance font-black [text-shadow:0_18px_45px_rgba(0,0,0,0.26)] sm:max-w-[16.5ch]',
                  textDensity === 'compact' && 'max-w-[15.75ch] sm:max-w-[17.5ch]',
                  textDensity === 'ultra' && 'max-w-[17ch] sm:max-w-[18.5ch]',
                  details.contentClass
                )}
                data-density={textDensity}
                initial={{ opacity: 0, y: 22, scale: 0.985, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
              >
                {content}
              </motion.div>
            </div>

            {showImmersiveInlineTimer && timerState && (
              <motion.div
                className="mt-[clamp(1rem,3vh,1.85rem)] flex flex-col items-center gap-3"
                initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.35, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                onClick={(event) => event.stopPropagation()}
                onKeyDown={(event) => event.stopPropagation()}
              >
                <p className="immersive-task-card__timer font-semibold text-white/92 tabular-nums">
                  {formatTimerLabel(timerState.remainingSeconds)}
                </p>
                <Button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();

                    if (timerState.status === 'idle') {
                      timerState.onStart();
                      return;
                    }

                    timerState.onRestart();
                  }}
                  onKeyDown={(event) => event.stopPropagation()}
                  className="h-11 rounded-full border border-white/24 bg-white/12 px-5 text-sm font-semibold tracking-[0.08em] text-white shadow-none backdrop-blur-sm hover:bg-white/18"
                >
                  {immersiveTimerActionLabel}
                </Button>
              </motion.div>
            )}
          </div>

          {task.type === 'versus' && onVote && teams && (
            <div
              className="mt-6 grid shrink-0 grid-cols-2 gap-3"
              onClick={(event) => event.stopPropagation()}
              onKeyDown={(event) => event.stopPropagation()}
            >
              <Button
                onClick={(event) => {
                  event.stopPropagation();
                  onVote('team1');
                }}
                size="lg"
                className="h-14 min-w-0 rounded-[1.25rem] border border-white/22 bg-white/12 px-3 text-sm font-semibold text-white backdrop-blur-sm transition-transform duration-150 hover:bg-white/18 active:translate-y-px active:scale-[0.99] md:h-16 md:text-base"
              >
                <span className="text-center leading-tight">{teams.team1} vinner</span>
              </Button>
              <Button
                onClick={(event) => {
                  event.stopPropagation();
                  onVote('team2');
                }}
                size="lg"
                className="h-14 min-w-0 rounded-[1.25rem] border border-white/22 bg-white/12 px-3 text-sm font-semibold text-white backdrop-blur-sm transition-transform duration-150 hover:bg-white/18 active:translate-y-px active:scale-[0.99] md:h-16 md:text-base"
              >
                <span className="text-center leading-tight">{teams.team2} vinner</span>
              </Button>
            </div>
          )}
        </div>
      </article>
    );
  }

  return (
    <article
      className={cn(
        'relative isolate flex h-full min-h-0 w-full max-h-full flex-col overflow-hidden rounded-[2.4rem] px-[clamp(1rem,4vw,1.35rem)] pb-[clamp(1rem,3vw,1.4rem)] pt-[clamp(1rem,3vw,1.25rem)] text-center shadow-none md:rounded-[3rem] md:px-10 md:pb-10 md:pt-8',
        isCompactCard &&
          'rounded-[2.1rem] [@media(max-height:820px)]:rounded-[2rem]',
        details.surfaceClass
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent_35%)]" />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <div className="flex justify-center">
          <span
            className={cn(
              'inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[0.8rem] font-semibold tracking-[-0.02em] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] md:px-5 md:py-2 md:text-[0.95rem]',
              isCompactCard &&
                'px-3.5 py-1.5 text-[0.72rem] [@media(max-height:760px)]:text-[0.68rem]',
              details.badgeClass
            )}
          >
            <Icon className="h-4 w-4" />
            {presentation.badge}
          </span>
        </div>

        <div
          className={cn(
            'mt-auto flex min-h-0 flex-1 flex-col items-center justify-center py-[clamp(0.85rem,3vh,1.5rem)] md:py-10',
            isCompactCard && 'py-[clamp(0.7rem,2vh,1.1rem)]'
          )}
        >
          <motion.div
            className={cn(
              'max-w-[15ch] text-balance px-1 text-[clamp(1.95rem,7.2vw,4rem)] font-bold leading-[0.94] tracking-[-0.045em] sm:max-w-[16ch]',
              isCompactCard &&
                'max-w-[16.5ch] text-[clamp(1.7rem,6.4vw,3.25rem)]',
              isUltraCompactCard &&
                'max-w-[18ch] text-[clamp(1.45rem,5.6vw,2.75rem)] leading-[0.98]',
              details.contentClass
            )}
            initial={{ opacity: 0, y: 12, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            {content}
          </motion.div>
          {subtitle && (
            <p
              className={cn(
                'mt-[clamp(0.7rem,2.5vh,1.35rem)] max-w-[30ch] text-balance text-[clamp(0.92rem,3.15vw,1.2rem)] font-medium leading-[1.3]',
                isCompactCard &&
                  'max-w-[32ch] text-[clamp(0.84rem,2.85vw,1.02rem)] leading-[1.25]',
                isUltraCompactCard &&
                  'text-[clamp(0.78rem,2.55vw,0.95rem)] leading-[1.22]',
                details.subtitleClass
              )}
            >
              {subtitle}
            </p>
          )}

          {(showTimer || showPenalty) && (
            <motion.div
              className={cn(
                'mt-[clamp(0.85rem,2.8vh,1.4rem)] w-full max-w-[28rem] rounded-[1.6rem] border border-white/16 bg-black/15 p-[clamp(0.8rem,3vw,1rem)] text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-sm',
                isCompactCard && 'rounded-[1.35rem]'
              )}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              {showTimer && timerState && (
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-white/82">
                      <TimerStatusIcon className="h-4 w-4" />
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] sm:text-[0.72rem]">
                        Nedtelling
                      </p>
                    </div>
                    <p className="text-xs font-semibold text-white/72 sm:text-sm">
                      {timerState.durationSeconds} sek
                    </p>
                  </div>

                  <div className="mt-3 flex items-end justify-between gap-4">
                    <p
                      className={cn(
                        'text-[clamp(2.05rem,9vw,3.5rem)] font-black leading-none tracking-[-0.06em] text-white tabular-nums',
                        isUltraCompactCard && 'text-[clamp(1.8rem,8vw,2.75rem)]'
                      )}
                    >
                      {formatTimerLabel(timerState.remainingSeconds)}
                    </p>
                    <p className="pb-0.5 text-right text-xs font-medium leading-tight text-white/76 sm:text-sm">
                      {timerLabel}
                    </p>
                  </div>

                  <div className="mt-3.5 h-2.5 overflow-hidden rounded-full bg-white/16">
                    <motion.div
                      className={cn(
                        'h-full rounded-full',
                        timerState.status === 'finished'
                          ? 'bg-white/55'
                          : 'bg-white'
                      )}
                      animate={{ width: `${timerProgress}%` }}
                      transition={{ duration: 0.18, ease: 'linear' }}
                    />
                  </div>

                  <Button
                    type="button"
                    onClick={
                      timerState.status === 'idle'
                        ? timerState.onStart
                        : timerState.onRestart
                    }
                    className="mt-3.5 h-11 rounded-[1.05rem] bg-white px-4 text-sm font-semibold text-black hover:bg-white/92 md:h-12 md:px-5"
                  >
                    {timerState.status === 'idle' ? (
                      <Clock3 className="mr-2 h-4 w-4" />
                    ) : (
                      <RotateCcw className="mr-2 h-4 w-4" />
                    )}
                    {timerActionLabel}
                  </Button>
                </div>
              )}

              {showPenalty && (
                <div className={cn(showTimer && 'mt-4 border-t border-white/12 pt-4')}>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-white/62 sm:text-[0.72rem]">
                    Straff
                  </p>
                  <p className="mt-2 text-[0.85rem] font-medium leading-relaxed text-white/88 sm:text-sm">
                    {penalty}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {task.type === 'versus' && onVote && teams && (
          <div className="mt-[clamp(0.8rem,2.4vh,1.3rem)] grid shrink-0 grid-cols-2 gap-2.5 sm:gap-3">
            <Button
              onClick={() => onVote('team1')}
              size="lg"
              className="h-[3.45rem] min-w-0 rounded-[1.15rem] border-2 border-white/20 bg-white/12 px-3 text-sm font-semibold text-white backdrop-blur-sm transition-transform duration-150 hover:bg-white/16 active:translate-y-px active:scale-[0.99] [@media(max-height:760px)]:h-[3.2rem] md:h-[4.25rem] md:rounded-[1.5rem] md:text-base"
            >
              <span className="text-center leading-tight">{teams.team1} vinner</span>
            </Button>
            <Button
              onClick={() => onVote('team2')}
              size="lg"
              className="h-[3.45rem] min-w-0 rounded-[1.15rem] border-2 border-white/20 bg-white/12 px-3 text-sm font-semibold text-white backdrop-blur-sm transition-transform duration-150 hover:bg-white/16 active:translate-y-px active:scale-[0.99] [@media(max-height:760px)]:h-[3.2rem] md:h-[4.25rem] md:rounded-[1.5rem] md:text-base"
            >
              <span className="text-center leading-tight">{teams.team2} vinner</span>
            </Button>
          </div>
        )}
      </div>
    </article>
  );
}
