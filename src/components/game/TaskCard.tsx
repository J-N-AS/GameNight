import type { Game, GameTask } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  Hand,
  MessageSquareQuote,
  Flame,
  HelpCircle,
  Swords,
} from 'lucide-react';
import React from 'react';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';

type TaskVisualDetails = {
  title: string;
  label: string;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
  emoji: string;
  surfaceClass: string;
  badgeClass: string;
  titleClass: string;
};

const taskTypeDetails: Record<GameTask['type'], TaskVisualDetails> = {
  challenge: {
    title: 'Utfordring',
    label: 'Action',
    hint: 'Nå skal noe gjøres',
    icon: Flame,
    emoji: '🔥',
    surfaceClass:
      'border-rose-400/40 bg-gradient-to-br from-rose-500/20 via-orange-500/10 to-card shadow-[0_20px_50px_-25px_rgba(251,113,133,0.6)]',
    badgeClass: 'border-rose-300/40 bg-rose-500/20 text-rose-100',
    titleClass: 'text-rose-100',
  },
  never_have_i_ever: {
    title: 'Jeg har aldri...',
    label: 'Bekjennelse',
    hint: 'De som kjenner seg igjen, reagerer',
    icon: MessageSquareQuote,
    emoji: '🤫',
    surfaceClass:
      'border-fuchsia-400/40 bg-gradient-to-br from-fuchsia-500/20 via-violet-500/10 to-card shadow-[0_20px_50px_-25px_rgba(217,70,239,0.55)]',
    badgeClass: 'border-fuchsia-300/40 bg-fuchsia-500/20 text-fuchsia-100',
    titleClass: 'text-fuchsia-100',
  },
  prompt: {
    title: 'Spørsmål',
    label: 'Prompt',
    hint: 'Svar ærlig og kort',
    icon: HelpCircle,
    emoji: '🤔',
    surfaceClass:
      'border-amber-400/40 bg-gradient-to-br from-amber-500/20 via-yellow-500/10 to-card shadow-[0_20px_50px_-25px_rgba(245,158,11,0.55)]',
    badgeClass: 'border-amber-300/40 bg-amber-500/20 text-amber-100',
    titleClass: 'text-amber-100',
  },
  pointing: {
    title: 'Pekelek',
    label: 'Pek ut',
    hint: 'Ta en rask avgjørelse',
    icon: Hand,
    emoji: '👉',
    surfaceClass:
      'border-cyan-400/40 bg-gradient-to-br from-cyan-500/20 via-sky-500/10 to-card shadow-[0_20px_50px_-25px_rgba(34,211,238,0.55)]',
    badgeClass: 'border-cyan-300/40 bg-cyan-500/20 text-cyan-100',
    titleClass: 'text-cyan-100',
  },
  versus: {
    title: 'VS-duell',
    label: 'Stem frem vinner',
    hint: 'Trykk på laget som vant runden',
    icon: Swords,
    emoji: '⚔️',
    surfaceClass:
      'border-indigo-400/45 bg-gradient-to-br from-indigo-500/20 via-blue-500/10 to-card shadow-[0_20px_50px_-25px_rgba(99,102,241,0.6)]',
    badgeClass: 'border-indigo-300/40 bg-indigo-500/20 text-indigo-100',
    titleClass: 'text-indigo-100',
  },
};

type TaskCardProps = {
  type: GameTask['type'];
  content: React.ReactNode;
  onVote?: (winner: 'team1' | 'team2') => void;
  teams?: Game['teams'];
};

export function TaskCard({ type, content, onVote, teams }: TaskCardProps) {
  const details = taskTypeDetails[type] || taskTypeDetails.prompt;
  const Icon = details.icon;

  return (
    <Card
      className={cn(
        'w-full max-w-3xl text-center border backdrop-blur-sm transition-all duration-300',
        details.surfaceClass
      )}
    >
      <CardHeader className="space-y-3 px-5 pt-5 md:px-6 md:pt-6">
        <div className="flex justify-center">
          <span
            className={cn(
              'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide',
              details.badgeClass
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {details.label}
          </span>
        </div>

        <CardTitle
          className={cn(
            'flex items-center justify-center gap-3 text-2xl md:text-3xl font-semibold tracking-tight',
            details.titleClass
          )}
        >
          <span className="text-3xl" aria-hidden>
            {details.emoji}
          </span>
          {details.title}
        </CardTitle>

        <p className="text-sm text-muted-foreground">{details.hint}</p>
      </CardHeader>

      <CardContent className="px-5 pb-6 md:px-6 md:pb-7">
        <motion.p
          className="px-1 text-[1.85rem] font-bold leading-tight sm:px-4 sm:text-3xl md:text-5xl md:leading-tight"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {content}
        </motion.p>

        {type === 'versus' && onVote && teams && (
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button
              onClick={() => onVote('team1')}
              size="lg"
              className="h-14 text-lg border-2 bg-transparent text-[hsl(var(--team1-color-hsl,var(--accent)))] border-[hsl(var(--team1-color-hsl,var(--accent)))] hover:bg-[hsl(var(--team1-color-hsl,var(--accent)))/10] hover:text-[hsl(var(--team1-color-hsl,var(--accent)))]"
            >
              {teams.team1} vinner!
            </Button>
            <Button
              onClick={() => onVote('team2')}
              size="lg"
              className="h-14 text-lg border-2 bg-transparent text-[hsl(var(--team2-color-hsl,var(--primary)))] border-[hsl(var(--team2-color-hsl,var(--primary)))] hover:bg-[hsl(var(--team2-color-hsl,var(--primary)))/10] hover:text-[hsl(var(--team2-color-hsl,var(--primary)))]"
            >
              {teams.team2} vinner!
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
