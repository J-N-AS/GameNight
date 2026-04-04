'use client';

import type { MouseEventHandler } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getPlayerRequirementLabel } from '@/lib/player-requirements';
import { intensityStyles } from '@/lib/game-ui';
import type { Game } from '@/lib/types';

type InlineGamePromoProps = {
  deckId: string;
  title: string;
  description: string;
  ctaLabel?: string;
  emoji?: string;
  audience?: Game['audience'];
  intensity?: Game['intensity'];
  requiresPlayers?: boolean;
  minPlayers?: number;
  gameType?: Game['gameType'];
  onStart?: MouseEventHandler<HTMLAnchorElement>;
};

export function InlineGamePromo({
  deckId,
  title,
  description,
  ctaLabel,
  emoji,
  audience,
  intensity,
  requiresPlayers,
  minPlayers,
  gameType,
  onStart,
}: InlineGamePromoProps) {
  const playerLabel = getPlayerRequirementLabel({
    id: deckId,
    title,
    requiresPlayers,
    minPlayers,
    gameType,
  });

  const intensityDetails = intensity ? intensityStyles[intensity] : null;

  return (
    <aside
      aria-labelledby={`${deckId}-promo-heading`}
      data-deck-id={deckId}
      className="w-full"
    >
      <Card className="border-border/70 bg-card shadow-none">
        <CardContent className="p-5 md:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-border/70 bg-background text-3xl">
                {emoji ?? '🎲'}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3
                    id={`${deckId}-promo-heading`}
                    className="text-xl font-bold tracking-tight text-foreground md:text-2xl"
                  >
                    {title}
                  </h3>
                  {audience === '18+' && (
                    <span className="rounded-full bg-destructive/80 px-2 py-0.5 text-xs font-medium text-destructive-foreground">
                      18+
                    </span>
                  )}
                </div>

                <p className="mt-2 text-sm leading-7 text-muted-foreground md:text-base">
                  {description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {playerLabel && (
                    <span className="rounded-full border border-border/70 bg-background px-3 py-1 text-xs font-semibold text-foreground/80">
                      {playerLabel}
                    </span>
                  )}
                  {intensityDetails && (
                    <span className="inline-flex items-center rounded-full border border-border/70 bg-background px-3 py-1 text-xs font-semibold text-foreground/80">
                      <span
                        className={`mr-2 h-2.5 w-2.5 rounded-full ${intensityDetails.dotClass}`}
                      />
                      {intensityDetails.label}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <Button
              asChild
              className="h-11 shrink-0 rounded-full px-5 text-sm font-semibold"
            >
              <Link href={`/spill/${deckId}`} onClick={onStart}>
                {ctaLabel ?? 'Spill nå'}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}
