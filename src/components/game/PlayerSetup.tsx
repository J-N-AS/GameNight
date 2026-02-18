'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePlayers } from '@/hooks/usePlayers';
import { UserPlus, X, Trash2 } from 'lucide-react';

interface PlayerSetupProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSetupComplete: () => void;
}

export function PlayerSetup({ children, open, onOpenChange, onSetupComplete }: PlayerSetupProps) {
  const { players, addPlayer, removePlayer, isLoaded } = usePlayers();
  const [newPlayerName, setNewPlayerName] = useState('');

  const handleAddPlayer = () => {
    if (newPlayerName.trim()) {
      addPlayer(newPlayerName);
      setNewPlayerName('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddPlayer();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Hvem spiller?</DialogTitle>
          <DialogDescription>Legg til minst to spillere for å starte.</DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 py-4">
          <Input
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Navn på spiller..."
            disabled={!isLoaded}
          />
          <Button onClick={handleAddPlayer} disabled={!newPlayerName.trim() || !isLoaded}>
            <UserPlus className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {players.map((player) => (
            <div
              key={player.id}
              className="flex items-center justify-between bg-muted/50 p-2 rounded-md animate-in fade-in-0"
            >
              <span>{player.name}</span>
              <Button variant="ghost" size="icon" onClick={() => removePlayer(player.id)} className="h-8 w-8">
                <Trash2 className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          ))}
          {isLoaded && players.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Ingen spillere lagt til ennå.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            onClick={onSetupComplete}
            disabled={players.length < 2}
            className="w-full"
            size="lg"
          >
            Start spill
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
