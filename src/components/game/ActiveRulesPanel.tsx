'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import type { ActiveGameRule } from '@/lib/game-rules';
import { ChevronDown, Pause, Play, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const categoryLabels: Record<string, string> = {
  buddy: 'Drikkevenn',
  campus: 'Campusregel',
  custom: 'Husregel',
  gesture: 'Geste',
  holiday: 'Julebord',
  house: 'Husregel',
  name: 'Navn',
  nickname: 'Kallenavn',
  role: 'Rolle',
  thumb: 'Tommelregel',
  word: 'Ordforbud',
};

function getRoundsLabel(roundsRemaining: number | null): string {
  if (roundsRemaining === null) {
    return 'Til dere opphever den';
  }

  return roundsRemaining === 1
    ? '1 runde igjen'
    : `${roundsRemaining} runder igjen`;
}

export function ActiveRulesPanel({
  activeRules,
  isExpanded,
  onExpandedChange,
  onToggleAllPaused,
  onToggleRulePaused,
  onRemoveRule,
}: {
  activeRules: ActiveGameRule[];
  isExpanded: boolean;
  onExpandedChange: (nextOpen: boolean) => void;
  onToggleAllPaused: () => void;
  onToggleRulePaused: (ruleId: string) => void;
  onRemoveRule: (ruleId: string) => void;
}) {
  if (activeRules.length === 0) {
    return null;
  }

  const allRulesPaused = activeRules.every((rule) => rule.paused);

  return (
    <Collapsible open={isExpanded} onOpenChange={onExpandedChange}>
      <div className="w-full max-w-2xl mx-auto mb-4">
        <div className="rounded-2xl border border-primary/20 bg-card/90 backdrop-blur-sm shadow-lg shadow-primary/5">
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/90">
                Aktive regler
              </p>
              <p className="text-sm text-muted-foreground">
                {activeRules.length === 1
                  ? '1 regel er i spill'
                  : `${activeRules.length} regler er i spill`}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-8 px-3 text-xs"
                onClick={onToggleAllPaused}
              >
                {allRulesPaused ? (
                  <Play className="mr-1.5 h-3.5 w-3.5" />
                ) : (
                  <Pause className="mr-1.5 h-3.5 w-3.5" />
                )}
                {allRulesPaused ? 'Fortsett' : 'Pause'}
              </Button>

              <CollapsibleTrigger asChild>
                <Button type="button" size="sm" variant="secondary" className="h-8 px-3 text-xs">
                  Vis
                  <ChevronDown
                    className={cn(
                      'ml-1.5 h-3.5 w-3.5 transition-transform duration-200',
                      isExpanded && 'rotate-180'
                    )}
                  />
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>

          <CollapsibleContent className="border-t border-border/70 px-4 py-3">
            <div className="space-y-3">
              {activeRules.map((rule) => (
                <div
                  key={rule.id}
                  className="rounded-xl border border-border/80 bg-background/60 p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-foreground">{rule.title}</p>
                        {rule.category && (
                          <Badge variant="outline" className="border-primary/20 text-primary/90">
                            {categoryLabels[rule.category] ?? rule.category}
                          </Badge>
                        )}
                        <Badge variant="secondary" className="bg-secondary/70 text-secondary-foreground">
                          {getRoundsLabel(rule.roundsRemaining)}
                        </Badge>
                        {rule.paused && (
                          <Badge variant="outline" className="border-amber-400/30 text-amber-200">
                            På pause
                          </Badge>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{rule.description}</p>
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-8 px-2.5 text-xs"
                        onClick={() => onToggleRulePaused(rule.id)}
                      >
                        {rule.paused ? 'Fortsett' : 'Pause'}
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => onRemoveRule(rule.id)}
                        aria-label={`Opphev ${rule.title}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </div>
      </div>
    </Collapsible>
  );
}
