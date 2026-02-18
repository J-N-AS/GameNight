'use client';

import React, { useState, useEffect } from 'react';
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
import { usePlayers, type Player } from '@/hooks/usePlayers';
import { UserPlus, X, Trash2, Edit, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PlayerSetupProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSetupComplete: () => void;
}

export function PlayerSetup({
  children,
  open,
  onOpenChange,
  onSetupComplete,
}: PlayerSetupProps) {
  const { players, addPlayer, removePlayer, updatePlayerName, isLoaded } =
    usePlayers();
  const [newPlayerName, setNewPlayerName] = useState('');
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [editingPlayerName, setEditingPlayerName] = useState('');

  useEffect(() => {
    // Reset editing state when dialog closes
    if (!open) {
      setEditingPlayerId(null);
    }
  }, [open]);

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

  const handleStartEdit = (player: Player) => {
    setEditingPlayerId(player.id);
    setEditingPlayerName(player.name);
  };

  const handleCancelEdit = () => {
    setEditingPlayerId(null);
    setEditingPlayerName('');
  };

  const handleSaveEdit = () => {
    if (editingPlayerId && editingPlayerName.trim()) {
      updatePlayerName(editingPlayerId, editingPlayerName);
    }
    handleCancelEdit();
  };

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    }
    if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const handleSetupAndClose = () => {
    if (editingPlayerId) {
      handleSaveEdit();
    }
    onSetupComplete();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Hvem spiller?</DialogTitle>
          <DialogDescription>
            Legg til spillere for å starte. Trykk på et navn for å endre det.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 py-4">
          <Input
            value={newPlayerName}
            onChange={e => setNewPlayerName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Navn på spiller..."
            disabled={!isLoaded || !!editingPlayerId}
          />
          <Button
            onClick={handleAddPlayer}
            disabled={!newPlayerName.trim() || !isLoaded || !!editingPlayerId}
          >
            <UserPlus className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          <AnimatePresence>
            {players.map(player => (
              <motion.div
                key={player.id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                className="flex items-center justify-between bg-muted/50 p-2 rounded-md"
              >
                {editingPlayerId === player.id ? (
                  <>
                    <Input
                      value={editingPlayerName}
                      onChange={e => setEditingPlayerName(e.target.value)}
                      onKeyDown={handleEditKeyDown}
                      className="h-8"
                      autoFocus
                    />
                    <div className="flex">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleSaveEdit}
                        className="h-8 w-8"
                      >
                        <Check className="h-4 w-4 text-green-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCancelEdit}
                        className="h-8 w-8"
                      >
                        <X className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <span
                      className="flex-1 cursor-pointer"
                      onClick={() => handleStartEdit(player)}
                    >
                      {player.name}
                    </span>
                    <div className="flex">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleStartEdit(player)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removePlayer(player.id)}
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoaded && players.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Ingen spillere lagt til ennå.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            onClick={handleSetupAndClose}
            disabled={
              players.length < 1 &&
              gameRequiresPlayers(players, onSetupComplete)
            }
            className="w-full"
            size="lg"
          >
            {players.length > 0 ? 'Fortsett' : 'Spill uten spillere'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Helper function to determine if the next step requires players
// This is a bit of a hack, but works for this flow.
// A better solution would involve passing the selected game's `requiresPlayers` prop.
function gameRequiresPlayers(
  players: Player[],
  onSetupComplete: () => void
): boolean {
  if (typeof window !== 'undefined') {
    // onSetupComplete pushes to /spill/velg, so we are in the main lobby
    // and no game is selected yet. We can allow continuing.
    if (onSetupComplete.toString().includes('/spill/velg')) {
      return false;
    }
  }
  return players.length < 2;
}
