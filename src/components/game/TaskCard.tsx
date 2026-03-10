import type { Game, GameRule, GameTask } from '@/lib/types';
import { cn } from '@/lib/utils';
import { getTaskPresentation, type GameplayTone } from '@/lib/gameplay';
import {
  Crown,
  Flame,
  Hand,
  HelpCircle,
  MessageSquareQuote,
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
};

export function TaskCard({
  game,
  task,
  content,
  onVote,
  teams,
  rule,
}: TaskCardProps) {
  const presentation = getTaskPresentation(task, game);
  const details = toneDetails[presentation.tone];
  const Icon = details.icon;
  const subtitle = rule?.description ?? presentation.hint;

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
