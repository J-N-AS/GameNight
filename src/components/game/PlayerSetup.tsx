'use client';

import React, { useState, useEffect, useRef } from 'react';
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
import { useSession, type Player } from '@/hooks/usePlayers';
import { UserPlus, X, Trash2, Edit, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPlayerCount } from '@/lib/player-requirements';

interface PlayerSetupProps {
  children?: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSetupComplete: () => void;
  requiredPlayers?: number;
  pendingGameTitle?: string | null;
}

export function PlayerSetup({
  children,
  open,
  onOpenChange,
  onSetupComplete,
  requiredPlayers = 0,
  pendingGameTitle = null,
}: PlayerSetupProps) {
  const { players, addPlayer, removePlayer, updatePlayerName, isLoaded } =
    useSession();
  const [newPlayerName, setNewPlayerName] = useState('');
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [editingPlayerName, setEditingPlayerName] = useState('');
  const addPlayerInputRef = useRef<HTMLInputElement>(null);
  const editPlayerInputRef = useRef<HTMLInputElement>(null);
  const missingPlayers = Math.max(0, requiredPlayers - players.length);
  const canContinue = requiredPlayers === 0 || players.length >= requiredPlayers;

  useEffect(() => {
    if (!open) {
      setEditingPlayerId(null);
    } else {
      setTimeout(() => {
        addPlayerInputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  useEffect(() => {
    if (editingPlayerId) {
      setTimeout(() => {
        editPlayerInputRef.current?.focus();
      }, 100)
    }
  }, [editingPlayerId]);

  const handleAddPlayer = () => {
    if (newPlayerName.trim() && players.length < 20) {
      addPlayer(newPlayerName);
      setNewPlayerName('');
      addPlayerInputRef.current?.focus();
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
    if (!canContinue) {
      return;
    }

    if (editingPlayerId) {
      handleSaveEdit();
    }
    onSetupComplete();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px] max-h-[85svh] overflow-hidden p-0">
        <DialogHeader>
          <div className="border-b border-border/60 px-6 pt-6 pb-4">
            <DialogTitle>Hvem spiller?</DialogTitle>
            <DialogDescription className="mt-2">
              {requiredPlayers > 0 && pendingGameTitle ? (
                <>
                  <span className="font-medium text-foreground">
                    {pendingGameTitle}
                  </span>{' '}
                  starter når minst {formatPlayerCount(requiredPlayers)} er lagt
                  til.
                </>
              ) : (
                'Legg til opptil 20 spillere. Trykk på et navn for å endre det.'
              )}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="px-6 pb-4">
          {requiredPlayers > 0 && (
            <div className="mb-4 rounded-lg border border-primary/20 bg-primary/10 px-4 py-3 text-sm">
              <p className="font-medium text-foreground">
                {players.length} / {requiredPlayers} klare
              </p>
              <p className="mt-1 text-muted-foreground">
                {canContinue
                  ? 'Dere har nok spillere til å starte.'
                  : `Legg til ${formatPlayerCount(missingPlayers)} til for å fortsette.`}
              </p>
            </div>
          )}

          <div className="flex gap-2 py-1">
          <Input
            ref={addPlayerInputRef}
            value={newPlayerName}
            onChange={e => setNewPlayerName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Navn på spiller..."
            disabled={!isLoaded || !!editingPlayerId || players.length >= 20}
            maxLength={20}
          />
          <Button
            onClick={handleAddPlayer}
            disabled={!newPlayerName.trim() || !isLoaded || !!editingPlayerId || players.length >= 20}
          >
            <UserPlus className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2 max-h-[40svh] overflow-y-auto pr-2 pb-2">
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
                      ref={editPlayerInputRef}
                      value={editingPlayerName}
                      onChange={e => setEditingPlayerName(e.target.value)}
                      onKeyDown={handleEditKeyDown}
                      className="h-8"
                      maxLength={20}
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
                      className="flex-1 cursor-pointer truncate pr-2"
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
        </div>

        <DialogFooter className="border-t border-border/60 bg-card/70 px-6 py-4">
          <Button
            type="button"
            onClick={handleSetupAndClose}
            className="w-full"
            size="lg"
            disabled={!canContinue}
          >
            {requiredPlayers > 0
              ? canContinue
                ? pendingGameTitle
                  ? `Fortsett til ${pendingGameTitle}`
                  : 'Fortsett'
                : `Legg til ${formatPlayerCount(missingPlayers)} til`
              : players.length > 0
                ? `Fortsett med ${players.length} spillere`
                : 'Lukk'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
