import type { GameTask } from '@/lib/games';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Beer, Hand, MessageSquareQuote } from 'lucide-react';
import React from 'react';

const taskTypeDetails = {
  challenge: {
    title: 'Utfordring',
    icon: Beer,
    color: 'text-primary',
  },
  never_have_i_ever: {
    title: 'Jeg har aldri...',
    icon: MessageSquareQuote,
    color: 'text-accent',
  },
  prompt: {
    title: 'Pekefest',
    icon: Hand,
    color: 'text-prompt',
  },
};

type TaskCardProps = {
    type: GameTask['type'];
    content: React.ReactNode;
}

export function TaskCard({ type, content }: TaskCardProps) {
  const details = taskTypeDetails[type];
  const Icon = details.icon;

  return (
    <Card className="w-full max-w-2xl border-0 bg-transparent shadow-none text-center animate-in fade-in-50 zoom-in-95 duration-500">
      <CardHeader>
        <CardTitle
          className={cn(
            'flex items-center justify-center gap-3 text-2xl md:text-3xl font-semibold tracking-wide uppercase',
            details.color
          )}
        >
          <Icon className="h-8 w-8" />
          {details.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl md:text-5xl font-bold leading-tight md:leading-tight">
          {content}
        </p>
      </CardContent>
    </Card>
  );
}
