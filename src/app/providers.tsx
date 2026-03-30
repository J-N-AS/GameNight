'use client';

import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  createContext,
  type ReactNode,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Player, PlayerStats } from '@/lib/types';
import { withBasePath } from '@/lib/base-path';

export interface SessionContextType {
  players: Player[];
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  updatePlayerName: (id: string, newName: string) => void;
  removeAllPlayers: () => void;
  updatePlayerStat: (playerId: string, stat: keyof PlayerStats, amount?: number) => void;
  isLoaded: boolean;
}

export const SessionContext = createContext<SessionContextType | undefined>(
  undefined
);

const STORAGE_KEY = 'gamenight_players';

function createDefaultPlayerStats(): PlayerStats {
  return {
    timesTargeted: 0,
    tasksCompleted: 0,
    penalties: 0,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function normalizeStoredPlayers(raw: string): Player[] | null {
  const parsed = JSON.parse(raw) as unknown;

  if (!Array.isArray(parsed)) {
    return null;
  }

  return parsed.flatMap((entry) => {
    if (!isRecord(entry)) {
      return [];
    }

    const id = typeof entry.id === 'string' ? entry.id : '';
    const name = typeof entry.name === 'string' ? entry.name.trim() : '';
    const rawStats = isRecord(entry.stats) ? entry.stats : {};

    if (!id || !name) {
      return [];
    }

    return [
      {
        id,
        name,
        stats: {
          timesTargeted:
            typeof rawStats.timesTargeted === 'number'
              ? rawStats.timesTargeted
              : 0,
          tasksCompleted:
            typeof rawStats.tasksCompleted === 'number'
              ? rawStats.tasksCompleted
              : 0,
          penalties:
            typeof rawStats.penalties === 'number' ? rawStats.penalties : 0,
        },
      },
    ];
  });
}

function SessionProvider({ children }: { children: ReactNode }) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedPlayers = localStorage.getItem(STORAGE_KEY);
      if (storedPlayers) {
        const parsedPlayers = normalizeStoredPlayers(storedPlayers);

        if (parsedPlayers) {
          setPlayers(parsedPlayers);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error('Failed to load players from localStorage', error);
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
      } catch (error) {
        console.error('Failed to save players to localStorage', error);
      }
    }
  }, [players, isLoaded]);

  const addPlayer = useCallback((name: string) => {
    const trimmedName = name.trim();

    if (trimmedName) {
      const newPlayer: Player = { 
        id: uuidv4(), 
        name: trimmedName,
        stats: createDefaultPlayerStats(),
      };
      setPlayers(prevPlayers => [...prevPlayers, newPlayer]);
    }
  }, []);

  const removePlayer = useCallback((id: string) => {
    setPlayers(prevPlayers => prevPlayers.filter(p => p.id !== id));
  }, []);

  const updatePlayerName = useCallback((id: string, newName: string) => {
    const trimmedName = newName.trim();

    if (!trimmedName) {
      return;
    }

    setPlayers(prevPlayers =>
      prevPlayers.map(p =>
        p.id === id
          ? {
              ...p,
              name: trimmedName,
              stats: p.stats ?? createDefaultPlayerStats(),
            }
          : p
      )
    );
  }, []);

  const removeAllPlayers = useCallback(() => {
    setPlayers([]);
  }, []);

  const updatePlayerStat = useCallback((playerId: string, stat: keyof PlayerStats, amount = 1) => {
    setPlayers(prevPlayers =>
      prevPlayers.map(p =>
        p.id === playerId
          ? {
              ...p,
              stats: {
                ...createDefaultPlayerStats(),
                ...p.stats,
                [stat]: (p.stats?.[stat] ?? 0) + amount,
              },
            }
          : p
      )
    );
  }, []);


  const value: SessionContextType = useMemo(
    () => ({
      players,
      addPlayer,
      removePlayer,
      updatePlayerName,
      removeAllPlayers,
      updatePlayerStat,
      isLoaded,
    }),
    [
      players,
      addPlayer,
      removePlayer,
      updatePlayerName,
      removeAllPlayers,
      updatePlayerStat,
      isLoaded,
    ]
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function AppProviders({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      return;
    }

    let isCancelled = false;

    const registerServiceWorker = () => {
      if (isCancelled) {
        return;
      }

      navigator.serviceWorker.register(withBasePath('/sw.js')).catch(() => {
        // In a real app, you might want to log this to an error reporting service
      });
    };

    if (document.readyState !== 'loading') {
      registerServiceWorker();
      return;
    }

    window.addEventListener('load', registerServiceWorker, { once: true });

    return () => {
      isCancelled = true;
      window.removeEventListener('load', registerServiceWorker);
    };
  }, []);
  
  return <SessionProvider>{children}</SessionProvider>;
}
