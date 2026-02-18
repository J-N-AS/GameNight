import type { GameTask } from '@/lib/games';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Beer, Hand, MessageSquareQuote, Flame, HelpCircle } from 'lucide-react';
import React from 'react';

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
};

type TaskCardProps = {
    type: GameTask['type'];
    content: React.ReactNode;
}

export function TaskCard({ type, content }: TaskCardProps) {
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
      </CardContent>
    </Card>
  );
}
