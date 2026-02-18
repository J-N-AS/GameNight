'use client';

import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical, Users, Repeat, LogOut, Trash2 } from 'lucide-react';
import { PlayerSetup } from './PlayerSetup';
import { useRouter } from 'next/navigation';
import { usePlayers } from '@/hooks/usePlayers';
import { useToast } from '@/hooks/use-toast';

interface GameMenuProps {
  context: 'lobby' | 'in-game';
  onRestart?: () => void;
}

export function GameMenu({ context, onRestart }: GameMenuProps) {
  const [isPlayerSetupOpen, setIsPlayerSetupOpen] = useState(false);
  const router = useRouter();
  const { players, removeAllPlayers } = usePlayers();
  const { toast } = useToast();

  const handleLeaveGame = () => {
    router.push('/');
  };

  const handlePlayerSetupComplete = () => {
    setIsPlayerSetupOpen(false);
    // No need to push, as player setup is now a global modal
  };

  const handleRemoveAllPlayers = () => {
    removeAllPlayers();
    toast({
        title: 'Alle spillere fjernet',
        description: 'Spillerlisten er nå tom.'
    })
  };

  const showDestructiveSeparator = context === 'in-game' || players.length > 0;

  return (
    <>
      <PlayerSetup
        open={isPlayerSetupOpen}
        onOpenChange={setIsPlayerSetupOpen}
        onSetupComplete={handlePlayerSetupComplete}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 active:scale-95 transition-transform"
          >
            <MoreVertical className="h-5 w-5" />
            <span className="sr-only">Spillmeny</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setIsPlayerSetupOpen(true)}>
            <Users className="mr-2 h-4 w-4" />
            <span>Endre spillere</span>
          </DropdownMenuItem>
          {context === 'in-game' && onRestart && (
            <DropdownMenuItem onSelect={onRestart}>
              <Repeat className="mr-2 h-4 w-4" />
              <span>Spill igjen</span>
            </DropdownMenuItem>
          )}

          {showDestructiveSeparator && <DropdownMenuSeparator />}

          {players.length > 0 && (
            <DropdownMenuItem
              onSelect={handleRemoveAllPlayers}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Fjern alle spillere</span>
            </DropdownMenuItem>
          )}
          
          {context === 'in-game' && (
            <DropdownMenuItem
              onSelect={handleLeaveGame}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Avslutt spill</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
