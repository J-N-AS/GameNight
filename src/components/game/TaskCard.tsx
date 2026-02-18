import type { GameTask } from '@/lib/games';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Beer, Hand, MessageSquareQuote, Flame, HelpCircle, Swords } from 'lucide-react';
import React from 'react';
import { Button } from '../ui/button';

const taskTypeDetails = {
  challenge: {
    title: 'Utfordring',
    icon: Flame,
    color: 'text-primary',
    emoji: '🔥'
  },
  never_have_i_ever: {
    title: 'Jeg har aldri...',
    icon: MessageSquareQuote,
    color: 'text-accent',
    emoji: '🤫'
  },
  prompt: {
    title: 'Spørsmål',
    icon: HelpCircle,
    color: 'text-prompt',
    emoji: '🤔'
  },
  pointing: {
    title: 'Pekelek',
    icon: Hand,
    color: 'text-yellow-400',
    emoji: '👉'
  },
  versus: {
    title: 'VS',
    icon: Swords,
    color: 'text-purple-400',
    emoji: '⚔️'
  }
};

type TaskCardProps = {
    type: GameTask['type'];
    content: React.ReactNode;
    onVote?: (winner: 'team1' | 'team2') => void;
    teams?: { team1: string; team2: string };
}

export function TaskCard({ type, content, onVote, teams }: TaskCardProps) {
  const details = taskTypeDetails[type] || taskTypeDetails.prompt;
  
  return (
    <Card className="w-full max-w-3xl border-0 bg-transparent shadow-none text-center">
      <CardHeader>
        <CardTitle
          className={cn(
            'flex items-center justify-center gap-3 text-xl md:text-2xl font-semibold tracking-wide uppercase',
            details.color
          )}
        >
          <span className="text-3xl">{details.emoji}</span>
          {details.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl md:text-5xl font-bold leading-tight md:leading-tight px-4">
          {content}
        </p>
        {type === 'versus' && onVote && teams && (
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button
              onClick={() => onVote('team1')}
              size="lg"
              variant="outline"
              className="h-14 text-lg border-2 border-primary hover:bg-primary/10 hover:text-primary-foreground"
            >
              {teams.team1} vinner!
            </Button>
            <Button
              onClick={() => onVote('team2')}
              size="lg"
              variant="outline"
              className="h-14 text-lg border-2 border-accent hover:bg-accent/10 hover:text-accent-foreground"
            >
              {teams.team2} vinner!
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
