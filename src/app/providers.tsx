'use client';

import {
  useState,
  useEffect,
  useCallback,
  createContext,
  type ReactNode,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Player, PlayerStats } from '@/lib/types';

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

function SessionProvider({ children }: { children: ReactNode }) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedPlayers = localStorage.getItem(STORAGE_KEY);
      if (storedPlayers) {
        // Hydrate stats if they don't exist from older versions
        const parsedPlayers = JSON.parse(storedPlayers).map((p: any) => ({
          ...p,
          stats: p.stats || { timesTargeted: 0, tasksCompleted: 0, penalties: 0 },
        }));
        setPlayers(parsedPlayers);
      }
    } catch (error) {
      console.error('Failed to load players from localStorage', error);
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
    if (name.trim()) {
      const newPlayer: Player = { 
        id: uuidv4(), 
        name: name.trim(),
        stats: { timesTargeted: 0, tasksCompleted: 0, penalties: 0 },
      };
      setPlayers(prevPlayers => [...prevPlayers, newPlayer]);
    }
  }, []);

  const removePlayer = useCallback((id: string) => {
    setPlayers(prevPlayers => prevPlayers.filter(p => p.id !== id));
  }, []);

  const updatePlayerName = useCallback((id: string, newName: string) => {
    setPlayers(prevPlayers =>
      prevPlayers.map(p =>
        p.id === id ? { ...p, name: newName.trim(), stats: p.stats || { timesTargeted: 0, tasksCompleted: 0, penalties: 0 } } : p
      )
    );
  }, []);

  const removeAllPlayers = useCallback(() => {
    setPlayers([]);
  }, []);

  const updatePlayerStat = useCallback((playerId: string, stat: keyof PlayerStats, amount = 1) => {
    setPlayers(prevPlayers =>
      prevPlayers.map(p =>
        p.id === playerId ? { ...p, stats: { ...p.stats, [stat]: p.stats[stat] + amount } } : p
      )
    );
  }, []);


  const value: SessionContextType = {
    players,
    addPlayer,
    removePlayer,
    updatePlayerName,
    removeAllPlayers,
    updatePlayerStat,
    isLoaded,
  };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function AppProviders({ children }: { children: ReactNode }) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(registrationError => {
          // In a real app, you might want to log this to an error reporting service
        });
      });
    }
  }, []);
  
  return <SessionProvider>{children}</SessionProvider>;
}
