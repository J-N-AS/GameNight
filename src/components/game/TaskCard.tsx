import type { GameTask } from '@/lib/games';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Beer, Hand, MessageSquareQuote } from 'lucide-react';

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

export function TaskCard({ task }: { task: GameTask }) {
  const details = taskTypeDetails[task.type];
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
          {task.text}
        </p>
      </CardContent>
    </Card>
  );
}
