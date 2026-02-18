'use client';

import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type Player = {
  id: string;
  name: string;
};

const STORAGE_KEY = 'gamenight_players';

export function usePlayers() {
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

  const savePlayers = useCallback((newPlayers: Player[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPlayers));
      setPlayers(newPlayers);
    } catch (error) {
      console.error('Failed to save players to localStorage', error);
    }
  }, []);

  const addPlayer = (name: string) => {
    if (name.trim()) {
      const newPlayer = { id: uuidv4(), name: name.trim() };
      savePlayers([...players, newPlayer]);
    }
  };

  const removePlayer = (id: string) => {
    const newPlayers = players.filter((p) => p.id !== id);
    savePlayers(newPlayers);
  };
  
  const updatePlayerName = (id: string, newName: string) => {
    const newPlayers = players.map(p => p.id === id ? {...p, name: newName.trim()} : p);
    savePlayers(newPlayers);
  }

  return {
    players,
    addPlayer,
    removePlayer,
    updatePlayerName,
    isLoaded,
  };
}
