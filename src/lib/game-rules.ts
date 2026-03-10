import type { GameRule } from './types';

export interface ActiveGameRule {
  id: string;
  title: string;
  description: string;
  roundsRemaining: number | null;
  category?: string;
  source?: string;
  paused: boolean;
}

export interface ResolvedGameRule extends Omit<GameRule, 'duration'> {
  title: string;
  description: string;
  duration?: number | null;
  source?: string;
}

function buildRuleId(rule: ResolvedGameRule): string {
  return `${rule.category ?? 'rule'}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

export function progressActiveRules(rules: ActiveGameRule[]): ActiveGameRule[] {
  return rules.flatMap((rule) => {
    if (rule.paused || rule.roundsRemaining === null) {
      return [rule];
    }

    const nextRoundsRemaining = rule.roundsRemaining - 1;

    if (nextRoundsRemaining <= 0) {
      return [];
    }

    return [
      {
        ...rule,
        roundsRemaining: nextRoundsRemaining,
      },
    ];
  });
}

export function applyResolvedGameRule(
  rules: ActiveGameRule[],
  rule: ResolvedGameRule | null
): ActiveGameRule[] {
  if (!rule) {
    return rules;
  }

  const categoriesToReplace =
    rule.replacesCategories && rule.replacesCategories.length > 0
      ? rule.replacesCategories
      : rule.category
        ? [rule.category]
        : [];

  if (rule.action === 'clear') {
    if (categoriesToReplace.length === 0) {
      return [];
    }

    return rules.filter((activeRule) => {
      return !categoriesToReplace.includes(activeRule.category ?? '');
    });
  }

  const nextRules =
    categoriesToReplace.length > 0
      ? rules.filter((activeRule) => {
          return !categoriesToReplace.includes(activeRule.category ?? '');
        })
      : rules;

  return [
    ...nextRules,
    {
      id: buildRuleId(rule),
      title: rule.title,
      description: rule.description,
      roundsRemaining:
        typeof rule.duration === 'number' && rule.duration > 0
          ? rule.duration
          : null,
      category: rule.category,
      source: rule.source,
      paused: false,
    },
  ];
}

export function resolveNextActiveRules(
  rules: ActiveGameRule[],
  rule: ResolvedGameRule | null
): ActiveGameRule[] {
  const progressedRules = progressActiveRules(rules);
  return applyResolvedGameRule(progressedRules, rule);
}

export function toggleActiveRulePause(
  rules: ActiveGameRule[],
  ruleId: string
): ActiveGameRule[] {
  return rules.map((rule) =>
    rule.id === ruleId ? { ...rule, paused: !rule.paused } : rule
  );
}

export function setAllActiveRulesPaused(
  rules: ActiveGameRule[],
  paused: boolean
): ActiveGameRule[] {
  return rules.map((rule) => ({ ...rule, paused }));
}

export function removeActiveRule(
  rules: ActiveGameRule[],
  ruleId: string
): ActiveGameRule[] {
  return rules.filter((rule) => rule.id !== ruleId);
}
