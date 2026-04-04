'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  defaultGameplayPreferences,
  GAMEPLAY_PREFERENCES_STORAGE_KEY,
  type GameplayDrinkingIntensity,
  sanitizeGameplayPreferences,
} from '@/lib/gameplay-preferences';

export function useGameplayPreferences() {
  const [preferences, setPreferences] = useState(defaultGameplayPreferences);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedPreferences = window.localStorage.getItem(
        GAMEPLAY_PREFERENCES_STORAGE_KEY
      );

      if (storedPreferences) {
        setPreferences(
          sanitizeGameplayPreferences(JSON.parse(storedPreferences))
        );
      }
    } catch (error) {
      console.error(
        'Could not read gameplay preferences from localStorage.',
        error
      );
    } finally {
      setHasHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    try {
      window.localStorage.setItem(
        GAMEPLAY_PREFERENCES_STORAGE_KEY,
        JSON.stringify(preferences)
      );
    } catch (error) {
      console.error('Could not save gameplay preferences to localStorage.', error);
    }
  }, [hasHydrated, preferences]);

  const setDrinkingIntensity = useCallback(
    (drinkingIntensity: GameplayDrinkingIntensity) => {
      setPreferences((currentPreferences) =>
        currentPreferences.drinkingIntensity === drinkingIntensity
          ? currentPreferences
          : { ...currentPreferences, drinkingIntensity }
      );
    },
    []
  );

  return {
    preferences,
    hasHydrated,
    setDrinkingIntensity,
  };
}
