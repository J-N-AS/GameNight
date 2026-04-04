'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  formatSipAmount,
  gameplayDrinkingIntensityOptions,
  scaleSipAmount,
  type GameplayDrinkingIntensity,
} from '@/lib/gameplay-preferences';
import { cn } from '@/lib/utils';
import { Play, Wine } from 'lucide-react';

type StartableGame = {
  id: string;
  title: string;
};

interface GameStartDialogProps {
  game: StartableGame | null;
  open: boolean;
  drinkingIntensity: GameplayDrinkingIntensity;
  onOpenChange: (open: boolean) => void;
  onDrinkingIntensityChange: (drinkingIntensity: GameplayDrinkingIntensity) => void;
  onConfirm: () => void;
}

const levelOrder: GameplayDrinkingIntensity[] = ['low', 'medium', 'high'];

export function GameStartDialog({
  game,
  open,
  drinkingIntensity,
  onOpenChange,
  onDrinkingIntensityChange,
  onConfirm,
}: GameStartDialogProps) {
  if (!game) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="pr-8">Start {game.title}</DialogTitle>
          <DialogDescription>
            Velg eventuelt straffenivå før dere starter. Hvis dere ikke endrer
            noe, brukes standardnivået.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            {levelOrder.map((level) => {
              const option = gameplayDrinkingIntensityOptions[level];
              const isActive = level === drinkingIntensity;

              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => onDrinkingIntensityChange(level)}
                  className={cn(
                    'rounded-2xl border p-4 text-left transition-all',
                    isActive
                      ? 'border-primary bg-primary/10 shadow-sm'
                      : 'border-border/70 bg-card/60 hover:border-primary/50 hover:bg-card'
                  )}
                >
                  <p className="text-sm font-semibold text-foreground">
                    {option.label}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {option.description}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/50 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Wine className="h-4 w-4" />
              Slik skaleres nivåkort
            </div>
            <div className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-3">
              {levelOrder.map((level) => (
                <div key={level} className="rounded-xl bg-background/70 p-3">
                  <p className="font-medium text-foreground">
                    {gameplayDrinkingIntensityOptions[level].label}
                  </p>
                  <p className="mt-1">
                    Et kort med 2 slurker blir{' '}
                    <span className="font-semibold text-foreground">
                      {formatSipAmount(scaleSipAmount(2, level))}
                    </span>
                    .
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Ikke nå
          </Button>
          <Button onClick={onConfirm}>
            <Play className="mr-2 h-4 w-4" />
            Start spillet
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
