'use client';

import { useContext } from 'react';
import {
  PlayersContext,
  type Player,
  type PlayersContextType,
} from '@/app/providers';

export type { Player };

export function usePlayers(): PlayersContextType {
  const context = useContext(PlayersContext);
  if (context === undefined) {
    throw new Error('usePlayers must be used within a PlayersProvider');
  }
  return context;
}
