'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import type { ActiveGameRule } from '@/lib/game-rules';
import { ChevronDown, Pause, Play, Sparkles, X } from 'lucide-react';
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
  voice: 'Stemme',
  word: 'Ordforbud',
};

function getRoundsLabel(roundsRemaining: number | null): string {
  if (roundsRemaining === null) {
    return 'Til oppheving';
  }

  return roundsRemaining === 1
    ? '1 runde igjen'
    : `${roundsRemaining} runder igjen`;
}

function getRuleAccentClass(category?: string): string {
  switch (category) {
    case 'buddy':
      return 'border-emerald-300/20 bg-emerald-400/10 text-emerald-50';
    case 'word':
    case 'name':
    case 'nickname':
      return 'border-orange-300/20 bg-orange-400/10 text-orange-50';
    case 'thumb':
    case 'gesture':
    case 'voice':
      return 'border-fuchsia-300/20 bg-fuchsia-400/10 text-fuchsia-50';
    case 'house':
    case 'custom':
    case 'campus':
    case 'holiday':
      return 'border-sky-300/20 bg-sky-400/10 text-sky-50';
    default:
      return 'border-white/10 bg-white/6 text-white/90';
  }
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
  const previewRules = activeRules.slice(0, 3);

  return (
    <Collapsible open={isExpanded} onOpenChange={onExpandedChange}>
      <div className="mx-auto mb-5 w-full max-w-3xl">
        <div className="overflow-hidden rounded-[1.8rem] border border-white/10 bg-black/24 shadow-[0_24px_70px_-44px_rgba(0,0,0,0.9)] backdrop-blur-xl">
          <div className="px-4 py-4 md:px-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white/90">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-white/65">
                      Aktive regler
                    </p>
                    <p className="truncate text-sm font-medium text-white/90">
                      {activeRules.length === 1
                        ? '1 regel lever fortsatt'
                        : `${activeRules.length} regler lever fortsatt`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="h-9 rounded-full border border-white/10 bg-white/6 px-3 text-xs text-white/85 hover:bg-white/10 hover:text-white"
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
                  <Button
                    type="button"
                    size="sm"
                    className="h-9 rounded-full border border-white/12 bg-white/12 px-3 text-xs text-white shadow-none hover:bg-white/16"
                  >
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

            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
              {previewRules.map((rule) => (
                <div
                  key={rule.id}
                  className={cn(
                    'min-w-[10rem] rounded-[1.25rem] border px-3 py-2',
                    getRuleAccentClass(rule.category)
                  )}
                >
                  <p className="truncate text-sm font-semibold">{rule.title}</p>
                  <p className="mt-1 text-xs opacity-75">
                    {getRoundsLabel(rule.roundsRemaining)}
                  </p>
                </div>
              ))}
              {activeRules.length > previewRules.length && (
                <div className="flex min-w-[6.5rem] items-center justify-center rounded-[1.25rem] border border-white/10 bg-white/6 px-3 py-2 text-sm font-semibold text-white/78">
                  +{activeRules.length - previewRules.length} til
                </div>
              )}
            </div>
          </div>

          <CollapsibleContent className="border-t border-white/8 px-4 py-4 md:px-5">
            <div className="space-y-3">
              {activeRules.map((rule) => (
                <div
                  key={rule.id}
                  className="rounded-[1.4rem] border border-white/10 bg-white/6 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-white">{rule.title}</p>
                        {rule.category && (
                          <Badge
                            variant="outline"
                            className={cn(
                              'border text-[0.7rem] font-medium',
                              getRuleAccentClass(rule.category)
                            )}
                          >
                            {categoryLabels[rule.category] ?? rule.category}
                          </Badge>
                        )}
                        <Badge
                          variant="secondary"
                          className="bg-white/10 text-[0.7rem] font-medium text-white/82"
                        >
                          {getRoundsLabel(rule.roundsRemaining)}
                        </Badge>
                        {rule.paused && (
                          <Badge
                            variant="outline"
                            className="border-amber-300/25 bg-amber-400/10 text-[0.7rem] font-medium text-amber-50"
                          >
                            På pause
                          </Badge>
                        )}
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-white/72">
                        {rule.description}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-8 rounded-full border border-white/10 bg-white/6 px-3 text-xs text-white/82 hover:bg-white/10 hover:text-white"
                        onClick={() => onToggleRulePaused(rule.id)}
                      >
                        {rule.paused ? 'Fortsett' : 'Pause'}
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-full border border-white/10 bg-white/6 text-white/72 hover:bg-white/10 hover:text-white"
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
