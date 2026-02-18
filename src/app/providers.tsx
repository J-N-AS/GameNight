'use client';

import {
  useState,
  useEffect,
  useCallback,
  createContext,
  type ReactNode,
} from 'react';
import { v4 as uuidv4 } from 'uuid';

export type Player = {
  id: string;
  name: string;
};

export interface PlayersContextType {
  players: Player[];
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  updatePlayerName: (id: string, newName: string) => void;
  removeAllPlayers: () => void;
  isLoaded: boolean;
}

export const PlayersContext = createContext<PlayersContextType | undefined>(
  undefined
);

const STORAGE_KEY = 'gamenight_players';

function PlayersProvider({ children }: { children: ReactNode }) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedPlayers = localStorage.getItem(STORAGE_KEY);
      if (storedPlayers) {
        setPlayers(JSON.parse(storedPlayers));
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
      const newPlayer = { id: uuidv4(), name: name.trim() };
      setPlayers(prevPlayers => [...prevPlayers, newPlayer]);
    }
  }, []);

  const removePlayer = useCallback((id: string) => {
    setPlayers(prevPlayers => prevPlayers.filter(p => p.id !== id));
  }, []);

  const updatePlayerName = useCallback((id: string, newName: string) => {
    setPlayers(prevPlayers =>
      prevPlayers.map(p =>
        p.id === id ? { ...p, name: newName.trim() } : p
      )
    );
  }, []);

  const removeAllPlayers = useCallback(() => {
    setPlayers([]);
  }, []);

  const value: PlayersContextType = {
    players,
    addPlayer,
    removePlayer,
    updatePlayerName,
    removeAllPlayers,
    isLoaded,
  };

  return (
    <PlayersContext.Provider value={value}>{children}</PlayersContext.Provider>
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
  
  return <PlayersProvider>{children}</PlayersProvider>;
}
