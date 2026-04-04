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

export function TaskCard({
  game,
  task,
  content,
  onVote,
  teams,
  rule,
  penalty,
  timerState,
}: TaskCardProps) {
  const presentation = getTaskPresentation(task, game);
  const details = toneDetails[presentation.tone];
  const Icon = details.icon;
  const subtitle = rule?.description ?? presentation.hint;
  const showTimer = Boolean(
    timerState && timerState.durationSeconds > 0
  );
  const showPenalty = Boolean(penalty?.trim());
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

  return (
    <article
      className={cn(
        'relative isolate w-full overflow-hidden rounded-[3rem] px-5 pb-7 pt-6 text-center shadow-none md:px-10 md:pb-10 md:pt-8',
        details.surfaceClass
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent_35%)]" />

      <div className="relative z-10 flex min-h-[24rem] flex-col md:min-h-[32rem]">
        <div className="flex justify-center">
          <span
            className={cn(
              'inline-flex items-center gap-2 rounded-full px-5 py-2 text-[0.95rem] font-semibold tracking-[-0.02em] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]',
              details.badgeClass
            )}
          >
            <Icon className="h-4 w-4" />
            {presentation.badge}
          </span>
        </div>

        <div className="mt-auto flex flex-1 flex-col items-center justify-center py-6 md:py-10">
          <motion.div
            className={cn(
              'max-w-[13ch] text-balance px-1 text-[clamp(2.35rem,9vw,4.4rem)] font-bold leading-[0.96] tracking-[-0.04em] sm:max-w-[14ch]',
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
                'mt-6 max-w-[20ch] text-balance text-[clamp(1rem,3.8vw,1.5rem)] font-medium leading-snug',
                details.subtitleClass
              )}
            >
              {subtitle}
            </p>
          )}

          {(showTimer || showPenalty) && (
            <motion.div
              className="mt-7 w-full max-w-[28rem] rounded-[2rem] border border-white/16 bg-black/15 p-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              {showTimer && timerState && (
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-white/82">
                      <TimerStatusIcon className="h-4 w-4" />
                      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em]">
                        Nedtelling
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-white/72">
                      {timerState.durationSeconds} sek
                    </p>
                  </div>

                  <div className="mt-3 flex items-end justify-between gap-4">
                    <p className="text-[clamp(2.3rem,10vw,4rem)] font-black leading-none tracking-[-0.06em] text-white tabular-nums">
                      {formatTimerLabel(timerState.remainingSeconds)}
                    </p>
                    <p className="pb-1 text-right text-sm font-medium text-white/76">
                      {timerLabel}
                    </p>
                  </div>

                  <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/16">
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
                    className="mt-4 h-12 rounded-[1.2rem] bg-white px-5 font-semibold text-black hover:bg-white/92"
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
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-white/62">
                    Straff
                  </p>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-white/88">
                    {penalty}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {task.type === 'versus' && onVote && teams && (
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button
              onClick={() => onVote('team1')}
              size="lg"
              className="h-[4.25rem] flex-1 rounded-[1.5rem] border-2 border-white/20 bg-white/12 text-base font-semibold text-white backdrop-blur-sm transition-transform duration-150 hover:bg-white/16 active:translate-y-px active:scale-[0.99]"
            >
              {teams.team1} vinner
            </Button>
            <Button
              onClick={() => onVote('team2')}
              size="lg"
              className="h-[4.25rem] flex-1 rounded-[1.5rem] border-2 border-white/20 bg-white/12 text-base font-semibold text-white backdrop-blur-sm transition-transform duration-150 hover:bg-white/16 active:translate-y-px active:scale-[0.99]"
            >
              {teams.team2} vinner
            </Button>
          </div>
        )}
      </div>
    </article>
  );
}
