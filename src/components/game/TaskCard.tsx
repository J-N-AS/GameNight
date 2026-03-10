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
  titleClass: string;
  hintClass: string;
  contentClass: string;
  orbPrimaryClass: string;
  orbSecondaryClass: string;
  edgeClass: string;
  footerGlowClass: string;
  ruleChipClass: string;
};

const toneDetails: Record<GameplayTone, ToneDetails> = {
  challenge: {
    icon: Flame,
    surfaceClass:
      'border-fuchsia-200/15 bg-[linear-gradient(145deg,rgba(138,36,255,0.34),rgba(13,9,31,0.96)_52%,rgba(35,14,63,0.92))]',
    badgeClass: 'border-fuchsia-100/20 bg-white/10 text-fuchsia-50',
    titleClass: 'text-white',
    hintClass: 'text-fuchsia-100/75',
    contentClass: 'text-white',
    orbPrimaryClass: 'bg-fuchsia-400/40',
    orbSecondaryClass: 'bg-violet-500/30',
    edgeClass: 'from-fuchsia-200/70 via-white/45 to-transparent',
    footerGlowClass: 'from-fuchsia-500/16',
    ruleChipClass: 'border-fuchsia-200/20 bg-fuchsia-500/14 text-fuchsia-50',
  },
  never: {
    icon: MessageSquareQuote,
    surfaceClass:
      'border-orange-200/15 bg-[linear-gradient(145deg,rgba(255,111,79,0.3),rgba(30,9,12,0.96)_52%,rgba(74,22,19,0.94))]',
    badgeClass: 'border-orange-100/20 bg-white/10 text-orange-50',
    titleClass: 'text-white',
    hintClass: 'text-orange-50/75',
    contentClass: 'text-white',
    orbPrimaryClass: 'bg-orange-400/35',
    orbSecondaryClass: 'bg-rose-500/28',
    edgeClass: 'from-orange-200/70 via-white/45 to-transparent',
    footerGlowClass: 'from-orange-500/16',
    ruleChipClass: 'border-orange-200/20 bg-orange-500/14 text-orange-50',
  },
  question: {
    icon: HelpCircle,
    surfaceClass:
      'border-sky-200/15 bg-[linear-gradient(145deg,rgba(46,164,255,0.26),rgba(8,17,34,0.96)_50%,rgba(16,49,80,0.92))]',
    badgeClass: 'border-sky-100/20 bg-white/10 text-sky-50',
    titleClass: 'text-white',
    hintClass: 'text-sky-50/75',
    contentClass: 'text-white',
    orbPrimaryClass: 'bg-sky-400/32',
    orbSecondaryClass: 'bg-cyan-400/24',
    edgeClass: 'from-sky-200/70 via-white/45 to-transparent',
    footerGlowClass: 'from-sky-500/16',
    ruleChipClass: 'border-sky-200/20 bg-sky-500/14 text-sky-50',
  },
  pointing: {
    icon: Hand,
    surfaceClass:
      'border-cyan-200/15 bg-[linear-gradient(145deg,rgba(34,211,238,0.24),rgba(6,22,28,0.96)_50%,rgba(12,61,74,0.94))]',
    badgeClass: 'border-cyan-100/20 bg-white/10 text-cyan-50',
    titleClass: 'text-white',
    hintClass: 'text-cyan-50/75',
    contentClass: 'text-white',
    orbPrimaryClass: 'bg-cyan-300/32',
    orbSecondaryClass: 'bg-lime-300/22',
    edgeClass: 'from-cyan-100/70 via-white/45 to-transparent',
    footerGlowClass: 'from-cyan-500/16',
    ruleChipClass: 'border-cyan-200/20 bg-cyan-500/14 text-cyan-50',
  },
  versus: {
    icon: Swords,
    surfaceClass:
      'border-indigo-200/15 bg-[linear-gradient(145deg,rgba(94,92,230,0.28),rgba(10,11,34,0.96)_50%,rgba(28,33,92,0.94))]',
    badgeClass: 'border-indigo-100/20 bg-white/10 text-indigo-50',
    titleClass: 'text-white',
    hintClass: 'text-indigo-50/75',
    contentClass: 'text-white',
    orbPrimaryClass: 'bg-indigo-400/32',
    orbSecondaryClass: 'bg-blue-400/24',
    edgeClass: 'from-indigo-100/70 via-white/45 to-transparent',
    footerGlowClass: 'from-indigo-500/16',
    ruleChipClass: 'border-indigo-200/20 bg-indigo-500/14 text-indigo-50',
  },
  truth: {
    icon: ShieldAlert,
    surfaceClass:
      'border-amber-200/15 bg-[linear-gradient(145deg,rgba(255,167,38,0.3),rgba(29,14,8,0.96)_50%,rgba(88,47,18,0.92))]',
    badgeClass: 'border-amber-100/20 bg-white/10 text-amber-50',
    titleClass: 'text-white',
    hintClass: 'text-amber-50/75',
    contentClass: 'text-white',
    orbPrimaryClass: 'bg-amber-300/32',
    orbSecondaryClass: 'bg-rose-400/20',
    edgeClass: 'from-amber-100/70 via-white/45 to-transparent',
    footerGlowClass: 'from-amber-500/16',
    ruleChipClass: 'border-amber-200/20 bg-amber-500/14 text-amber-50',
  },
  rule: {
    icon: Sparkles,
    surfaceClass:
      'border-blue-200/15 bg-[linear-gradient(145deg,rgba(85,127,255,0.28),rgba(10,13,34,0.96)_50%,rgba(17,42,92,0.94))]',
    badgeClass: 'border-blue-100/20 bg-white/10 text-blue-50',
    titleClass: 'text-white',
    hintClass: 'text-blue-50/75',
    contentClass: 'text-white',
    orbPrimaryClass: 'bg-blue-400/32',
    orbSecondaryClass: 'bg-indigo-300/24',
    edgeClass: 'from-blue-100/70 via-white/45 to-transparent',
    footerGlowClass: 'from-blue-500/16',
    ruleChipClass: 'border-blue-200/20 bg-blue-500/14 text-blue-50',
  },
  chaos: {
    icon: Zap,
    surfaceClass:
      'border-red-200/15 bg-[linear-gradient(145deg,rgba(255,86,45,0.34),rgba(38,9,8,0.96)_50%,rgba(96,30,9,0.94))]',
    badgeClass: 'border-red-100/20 bg-white/10 text-red-50',
    titleClass: 'text-white',
    hintClass: 'text-orange-50/75',
    contentClass: 'text-white',
    orbPrimaryClass: 'bg-red-400/38',
    orbSecondaryClass: 'bg-amber-300/26',
    edgeClass: 'from-red-100/70 via-white/45 to-transparent',
    footerGlowClass: 'from-red-500/16',
    ruleChipClass: 'border-red-200/20 bg-red-500/14 text-red-50',
  },
  secret: {
    icon: Crown,
    surfaceClass:
      'border-emerald-200/15 bg-[linear-gradient(145deg,rgba(16,185,129,0.24),rgba(5,25,26,0.96)_50%,rgba(13,71,74,0.94))]',
    badgeClass: 'border-emerald-100/20 bg-white/10 text-emerald-50',
    titleClass: 'text-white',
    hintClass: 'text-emerald-50/75',
    contentClass: 'text-white',
    orbPrimaryClass: 'bg-emerald-400/28',
    orbSecondaryClass: 'bg-sky-300/20',
    edgeClass: 'from-emerald-100/70 via-white/45 to-transparent',
    footerGlowClass: 'from-emerald-500/16',
    ruleChipClass: 'border-emerald-200/20 bg-emerald-500/14 text-emerald-50',
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

  return (
    <article
      className={cn(
        'relative isolate w-full overflow-hidden rounded-[2.5rem] border px-5 pb-6 pt-5 text-center shadow-[0_40px_120px_-48px_rgba(0,0,0,0.85)] backdrop-blur-xl md:px-8 md:pb-8 md:pt-6',
        details.surfaceClass
      )}
    >
      <div className="pointer-events-none absolute inset-0">
        <div
          className={cn(
            'absolute -right-12 -top-16 h-48 w-48 rounded-full blur-3xl',
            details.orbPrimaryClass
          )}
        />
        <div
          className={cn(
            'absolute -bottom-10 -left-8 h-56 w-56 rounded-full blur-3xl',
            details.orbSecondaryClass
          )}
        />
        <div
          className={cn(
            'absolute inset-x-6 top-0 h-px bg-gradient-to-r opacity-90',
            details.edgeClass
          )}
        />
        <div
          className={cn(
            'absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t to-transparent',
            details.footerGlowClass
          )}
        />
      </div>

      <div className="relative z-10 flex min-h-[25rem] flex-col md:min-h-[32rem]">
        <div className="flex items-start justify-between gap-3">
          <span
            className={cn(
              'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.2em] backdrop-blur-xl',
              details.badgeClass
            )}
          >
            <Icon className="h-4 w-4" />
            {presentation.badge}
          </span>

          {rule && (
            <span
              className={cn(
                'inline-flex items-center rounded-full border px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em]',
                details.ruleChipClass
              )}
            >
              {rule.action === 'clear'
                ? 'Opphever regler'
                : typeof rule.duration === 'number' && rule.duration > 0
                  ? `${rule.duration} runder`
                  : 'Til oppheving'}
            </span>
          )}
        </div>

        <div className="mt-6">
          <p className="text-4xl md:text-[2.8rem]" aria-hidden>
            {presentation.emoji}
          </p>
          <h2
            className={cn(
              'mt-3 text-3xl font-black tracking-[-0.04em] md:text-[2.7rem]',
              details.titleClass
            )}
          >
            {presentation.title}
          </h2>
          <p
            className={cn(
              'mx-auto mt-3 max-w-md text-sm font-medium md:text-base',
              details.hintClass
            )}
          >
            {presentation.hint}
          </p>
        </div>

        <div className="mt-auto flex flex-1 items-center justify-center py-8 md:py-12">
          <motion.div
            className={cn(
              'max-w-[16ch] text-balance px-2 text-[2.2rem] font-black leading-[0.94] tracking-[-0.06em] sm:max-w-[18ch] sm:text-[2.7rem] md:max-w-[18ch] md:text-[4.35rem]',
              details.contentClass
            )}
            initial={{ opacity: 0, y: 16, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
          >
            {content}
          </motion.div>
        </div>

        {rule && (
          <div className="rounded-[1.8rem] border border-white/10 bg-black/20 p-4 text-left backdrop-blur-xl md:p-5">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-white/70">
              {rule.action === 'clear' ? 'Rydder bordet' : 'Aktiv regel'}
            </p>
            <p className="mt-2 text-base font-semibold text-white md:text-lg">
              {rule.title}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-white/72 md:text-[0.95rem]">
              {rule.description}
            </p>
          </div>
        )}

        {task.type === 'versus' && onVote && teams && (
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Button
              onClick={() => onVote('team1')}
              size="lg"
              className="h-16 flex-1 rounded-[1.6rem] border border-white/15 bg-white/10 text-base font-semibold text-white shadow-[0_24px_60px_-30px_rgba(245,158,11,0.75)] backdrop-blur-xl transition-all duration-150 hover:bg-white/14 hover:shadow-[0_28px_65px_-28px_rgba(245,158,11,0.85)] active:translate-y-[2px] active:scale-[0.985]"
            >
              {teams.team1} vinner
            </Button>
            <Button
              onClick={() => onVote('team2')}
              size="lg"
              className="h-16 flex-1 rounded-[1.6rem] border border-white/15 bg-white/10 text-base font-semibold text-white shadow-[0_24px_60px_-30px_rgba(96,165,250,0.75)] backdrop-blur-xl transition-all duration-150 hover:bg-white/14 hover:shadow-[0_28px_65px_-28px_rgba(96,165,250,0.85)] active:translate-y-[2px] active:scale-[0.985]"
            >
              {teams.team2} vinner
            </Button>
          </div>
        )}
      </div>
    </article>
  );
}
