'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  defaultGameplayPreferences,
  GAMEPLAY_PREFERENCES_STORAGE_KEY,
  type GameplayDisplayMode,
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

  const setDisplayMode = useCallback((displayMode: GameplayDisplayMode) => {
    setPreferences((currentPreferences) =>
      currentPreferences.displayMode === displayMode
        ? currentPreferences
        : { ...currentPreferences, displayMode }
    );
  }, []);

  const setSoundEnabled = useCallback((soundEnabled: boolean) => {
    setPreferences((currentPreferences) =>
      currentPreferences.soundEnabled === soundEnabled
        ? currentPreferences
        : { ...currentPreferences, soundEnabled }
    );
  }, []);

  return {
    preferences,
    hasHydrated,
    setDisplayMode,
    setSoundEnabled,
  };
}
