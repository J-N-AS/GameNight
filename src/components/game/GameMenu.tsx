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
import { MoreVertical, Users, Repeat, LogOut, Trash2, Trophy } from 'lucide-react';
import { PlayerSetup } from './PlayerSetup';
import { useRouter } from 'next/navigation';
import { useSession } from '@/hooks/usePlayers';
import { useToast } from '@/hooks/use-toast';
import { GlobalSessionSummary } from '../session/GlobalSessionSummary';

interface GameMenuProps {
  context: 'lobby' | 'in-game';
  onRestart?: () => void;
}

export function GameMenu({ context, onRestart }: GameMenuProps) {
  const [isPlayerSetupOpen, setIsPlayerSetupOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const router = useRouter();
  const { players, removeAllPlayers } = useSession();
  const { toast } = useToast();

  const handleLeaveGame = () => {
    router.push('/');
  };

  const handlePlayerSetupComplete = () => {
    setIsPlayerSetupOpen(false);
  };

  const handleRemoveAllPlayers = () => {
    removeAllPlayers();
    toast({
        title: 'Alle spillere fjernet',
        description: 'Spillerlisten og all statistikk er nå nullstilt.'
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
      <GlobalSessionSummary 
        open={isSummaryOpen}
        onOpenChange={setIsSummaryOpen}
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

          {players.length > 0 && (
            <DropdownMenuItem onSelect={() => setIsSummaryOpen(true)}>
              <Trophy className="mr-2 h-4 w-4" />
              <span>Avslutt & Se Oppsummering</span>
            </DropdownMenuItem>
          )}

          {showDestructiveSeparator && <DropdownMenuSeparator />}

          {players.length > 0 && (
            <DropdownMenuItem
              onSelect={handleRemoveAllPlayers}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Start ny kveld</span>
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
