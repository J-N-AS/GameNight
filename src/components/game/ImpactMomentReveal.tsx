import type { GameplayMoment, GameplayTone } from '@/lib/gameplay';
import { cn } from '@/lib/utils';
import { Crown, Sparkles, Swords, Users, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const toneStyles: Record<
  GameplayTone,
  {
    surfaceClass: string;
    badgeClass: string;
    glowClass: string;
  }
> = {
  challenge: {
    surfaceClass:
      'border-fuchsia-200/15 bg-[linear-gradient(145deg,rgba(138,36,255,0.26),rgba(11,10,28,0.96)_55%,rgba(36,18,60,0.94))]',
    badgeClass: 'border-fuchsia-100/20 bg-white/10 text-fuchsia-50',
    glowClass: 'bg-fuchsia-400/35',
  },
  never: {
    surfaceClass:
      'border-orange-200/15 bg-[linear-gradient(145deg,rgba(255,111,79,0.26),rgba(32,9,12,0.96)_55%,rgba(80,24,16,0.94))]',
    badgeClass: 'border-orange-100/20 bg-white/10 text-orange-50',
    glowClass: 'bg-orange-400/35',
  },
  question: {
    surfaceClass:
      'border-sky-200/15 bg-[linear-gradient(145deg,rgba(46,164,255,0.24),rgba(8,17,34,0.96)_55%,rgba(18,47,82,0.94))]',
    badgeClass: 'border-sky-100/20 bg-white/10 text-sky-50',
    glowClass: 'bg-sky-400/28',
  },
  pointing: {
    surfaceClass:
      'border-cyan-200/15 bg-[linear-gradient(145deg,rgba(34,211,238,0.22),rgba(7,21,28,0.96)_55%,rgba(12,60,74,0.94))]',
    badgeClass: 'border-cyan-100/20 bg-white/10 text-cyan-50',
    glowClass: 'bg-cyan-300/28',
  },
  versus: {
    surfaceClass:
      'border-indigo-200/15 bg-[linear-gradient(145deg,rgba(94,92,230,0.26),rgba(10,11,34,0.96)_55%,rgba(28,33,92,0.94))]',
    badgeClass: 'border-indigo-100/20 bg-white/10 text-indigo-50',
    glowClass: 'bg-indigo-400/32',
  },
  truth: {
    surfaceClass:
      'border-amber-200/15 bg-[linear-gradient(145deg,rgba(255,167,38,0.28),rgba(29,14,8,0.96)_55%,rgba(88,47,18,0.94))]',
    badgeClass: 'border-amber-100/20 bg-white/10 text-amber-50',
    glowClass: 'bg-amber-300/30',
  },
  rule: {
    surfaceClass:
      'border-blue-200/15 bg-[linear-gradient(145deg,rgba(85,127,255,0.26),rgba(10,13,34,0.96)_55%,rgba(17,42,92,0.94))]',
    badgeClass: 'border-blue-100/20 bg-white/10 text-blue-50',
    glowClass: 'bg-blue-400/30',
  },
  chaos: {
    surfaceClass:
      'border-red-200/15 bg-[linear-gradient(145deg,rgba(255,86,45,0.3),rgba(38,9,8,0.96)_55%,rgba(96,30,9,0.94))]',
    badgeClass: 'border-red-100/20 bg-white/10 text-red-50',
    glowClass: 'bg-red-400/34',
  },
  secret: {
    surfaceClass:
      'border-emerald-200/15 bg-[linear-gradient(145deg,rgba(16,185,129,0.24),rgba(5,25,26,0.96)_55%,rgba(13,71,74,0.94))]',
    badgeClass: 'border-emerald-100/20 bg-white/10 text-emerald-50',
    glowClass: 'bg-emerald-400/28',
  },
};

const momentIcons = {
  impact: Sparkles,
  chaos: Zap,
  secret: Crown,
  group: Users,
  rule: Sparkles,
  duel: Swords,
} as const;

export function ImpactMomentReveal({ moment }: { moment: GameplayMoment }) {
  const Icon = momentIcons[moment.kind];
  const style = toneStyles[moment.tone];

  return (
    <motion.div
      className={cn(
        'relative isolate flex min-h-[25rem] w-full items-center justify-center overflow-hidden rounded-[2.5rem] border px-6 py-8 text-center shadow-[0_40px_120px_-48px_rgba(0,0,0,0.85)] backdrop-blur-xl md:min-h-[32rem] md:px-10',
        style.surfaceClass
      )}
      initial={{ opacity: 0, x: 32, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -32, scale: 0.98 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className={cn(
          'pointer-events-none absolute left-1/2 top-8 h-40 w-40 -translate-x-1/2 rounded-full blur-3xl',
          style.glowClass
        )}
      />
      <div className="relative z-10 max-w-lg">
        <span
          className={cn(
            'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.22em] backdrop-blur-xl',
            style.badgeClass
          )}
        >
          <Icon className="h-4 w-4" />
          {moment.label}
        </span>
        <p className="mt-8 text-5xl md:text-6xl" aria-hidden>
          <Icon className="mx-auto h-14 w-14 md:h-16 md:w-16" />
        </p>
        <h2 className="mt-6 text-balance text-4xl font-black tracking-[-0.06em] text-white md:text-[3.4rem]">
          {moment.intro}
        </h2>
        <p className="mx-auto mt-5 max-w-md text-balance text-sm font-medium text-white/72 md:text-base">
          {moment.hint}
        </p>
      </div>
    </motion.div>
  );
}
