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
import { MoreVertical, Users, Repeat, LogOut } from 'lucide-react';
import { PlayerSetup } from './PlayerSetup';
import { useRouter } from 'next/navigation';

interface GameMenuProps {
  context: 'lobby' | 'in-game';
  onRestart?: () => void;
}

export function GameMenu({ context, onRestart }: GameMenuProps) {
  const [isPlayerSetupOpen, setIsPlayerSetupOpen] = useState(false);
  const router = useRouter();

  const handleLeaveGame = () => {
    router.push('/');
  };
  
  const handlePlayerSetupComplete = () => {
    setIsPlayerSetupOpen(false);
    if(context === 'lobby') {
        router.push('/spill/velg');
    }
  }

  return (
    <>
      <PlayerSetup
        open={isPlayerSetupOpen}
        onOpenChange={setIsPlayerSetupOpen}
        onSetupComplete={handlePlayerSetupComplete}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9 active:scale-95 transition-transform">
            <MoreVertical className="h-5 w-5" />
            <span className="sr-only">Spillmeny</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setIsPlayerSetupOpen(true)}>
            <Users className="mr-2 h-4 w-4" />
            <span>Endre spillere</span>
          </DropdownMenuItem>
          {context === 'in-game' && (
            <>
              <DropdownMenuItem onSelect={onRestart}>
                <Repeat className="mr-2 h-4 w-4" />
                <span>Spill igjen</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={handleLeaveGame}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Avslutt spill</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
