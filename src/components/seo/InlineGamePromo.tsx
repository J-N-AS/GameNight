'use client';

import type { MouseEventHandler } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
      className="relative overflow-hidden rounded-[1.85rem] border border-primary/20 bg-gradient-to-br from-card via-card to-primary/10 p-6 shadow-xl shadow-primary/10"
    >
      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-primary via-accent to-primary" />
      <div className="absolute -right-12 top-0 h-28 w-28 rounded-full bg-primary/20 blur-3xl" />

      <div className="relative pl-2">
        <p className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background/60 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-foreground/80">
          <Sparkles className="h-3.5 w-3.5" />
          Anbefalt deck akkurat her
        </p>

        <div className="mt-4 flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-background/70 text-3xl shadow-inner shadow-black/10">
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
                <span className="rounded-full border border-primary/15 bg-background/70 px-3 py-1 text-xs font-semibold text-foreground/80">
                  {playerLabel}
                </span>
              )}
              {intensityDetails && (
                <span className="inline-flex items-center rounded-full border border-primary/15 bg-background/70 px-3 py-1 text-xs font-semibold text-foreground/80">
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
          size="lg"
          className="mt-5 h-12 rounded-full px-6 text-base shadow-lg shadow-primary/30"
        >
          <Link href={`/spill/${deckId}`} onClick={onStart}>
            {ctaLabel ?? `Spill ${title} nå`}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </aside>
  );
}
