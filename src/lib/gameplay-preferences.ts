export type GameplayDisplayMode = 'standard' | 'tv';

export interface GameplayPreferences {
  displayMode: GameplayDisplayMode;
  soundEnabled: boolean;
}

export const GAMEPLAY_PREFERENCES_STORAGE_KEY =
  'gamenight:gameplay-preferences';

export const defaultGameplayPreferences: GameplayPreferences = {
  displayMode: 'standard',
  soundEnabled: false,
};

export function sanitizeGameplayPreferences(
  value: unknown
): GameplayPreferences {
  if (!value || typeof value !== 'object') {
    return defaultGameplayPreferences;
  }

  const candidate = value as Partial<Record<keyof GameplayPreferences, unknown>>;

  return {
    displayMode: candidate.displayMode === 'tv' ? 'tv' : 'standard',
    soundEnabled: candidate.soundEnabled === true,
  };
}
