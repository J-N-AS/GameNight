export type GameplayDrinkingIntensity = 'low' | 'medium' | 'high';

export interface GameplayPreferences {
  drinkingIntensity: GameplayDrinkingIntensity;
}

export const GAMEPLAY_PREFERENCES_STORAGE_KEY =
  'gamenight:gameplay-preferences';

export const defaultGameplayPreferences: GameplayPreferences = {
  drinkingIntensity: 'medium',
};

export const gameplayDrinkingIntensityOptions: Record<
  GameplayDrinkingIntensity,
  {
    label: string;
    description: string;
  }
> = {
  low: {
    label: 'Rolig',
    description: 'Trekker fra 1 slurk på kort som har nivåstyrt straff.',
  },
  medium: {
    label: 'Normal',
    description: 'Bruker standardnivået som er satt i kortet.',
  },
  high: {
    label: 'Høy',
    description: 'Legger til 1 slurk på kort som har nivåstyrt straff.',
  },
};

export function sanitizeGameplayPreferences(
  value: unknown
): GameplayPreferences {
  if (!value || typeof value !== 'object') {
    return defaultGameplayPreferences;
  }

  const candidate = value as Partial<Record<keyof GameplayPreferences, unknown>>;

  return {
    drinkingIntensity:
      candidate.drinkingIntensity === 'low' ||
      candidate.drinkingIntensity === 'high'
        ? candidate.drinkingIntensity
        : 'medium',
  };
}

export function scaleSipAmount(
  sipAmount: number,
  drinkingIntensity: GameplayDrinkingIntensity
): number {
  const safeSipAmount = Math.max(1, Math.round(sipAmount));
  const modifier =
    drinkingIntensity === 'low' ? -1 : drinkingIntensity === 'high' ? 1 : 0;

  return Math.max(1, safeSipAmount + modifier);
}

export function formatSipAmount(sipAmount: number): string {
  return `${sipAmount} ${sipAmount === 1 ? 'slurk' : 'slurker'}`;
}
