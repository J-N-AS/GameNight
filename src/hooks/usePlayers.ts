'use client';

import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type Player = {
  id: string;
  name: string;
};

const STORAGE_KEY = 'gamenight_players';

function saveToStorage(players: Player[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
  } catch (error) {
    console.error('Failed to save players to localStorage', error);
  }
}

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

  const addPlayer = useCallback((name: string) => {
    if (name.trim()) {
      const newPlayer = { id: uuidv4(), name: name.trim() };
      setPlayers(prevPlayers => {
        const newPlayers = [...prevPlayers, newPlayer];
        saveToStorage(newPlayers);
        return newPlayers;
      });
    }
  }, []);

  const removePlayer = useCallback((id: string) => {
    setPlayers(prevPlayers => {
      const newPlayers = prevPlayers.filter(p => p.id !== id);
      saveToStorage(newPlayers);
      return newPlayers;
    });
  }, []);

  const updatePlayerName = useCallback((id: string, newName: string) => {
    setPlayers(prevPlayers => {
      const newPlayers = prevPlayers.map(p =>
        p.id === id ? { ...p, name: newName.trim() } : p
      );
      saveToStorage(newPlayers);
      return newPlayers;
    });
  }, []);

  const removeAllPlayers = useCallback(() => {
    setPlayers([]);
    saveToStorage([]);
  }, []);

  return {
    players,
    addPlayer,
    removePlayer,
    updatePlayerName,
    removeAllPlayers,
    isLoaded,
  };
}
