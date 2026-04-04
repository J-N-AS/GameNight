'use client';

import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  MoreVertical,
  Users,
  Repeat,
  LogOut,
  Trash2,
  Trophy,
  Wine,
} from 'lucide-react';
import { PlayerSetup } from './PlayerSetup';
import { useRouter } from 'next/navigation';
import { useSession } from '@/hooks/usePlayers';
import { useToast } from '@/hooks/use-toast';
import {
  gameplayDrinkingIntensityOptions,
  type GameplayDrinkingIntensity,
} from '@/lib/gameplay-preferences';
import { cn } from '@/lib/utils';

interface GameplayMenuPreferences {
  drinkingIntensity: GameplayDrinkingIntensity;
  onDrinkingIntensityChange: (drinkingIntensity: GameplayDrinkingIntensity) => void;
}

interface GameMenuProps {
  context: 'lobby' | 'in-game';
  onRestart?: () => void;
  gameplayPreferences?: GameplayMenuPreferences;
}

export function GameMenu({
  context,
  onRestart,
  gameplayPreferences,
}: GameMenuProps) {
  const [isPlayerSetupOpen, setIsPlayerSetupOpen] = useState(false);
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

  const handleShowSummary = () => {
      router.push('/oppsummering');
  }

  const showDestructiveSeparator = context === 'in-game' || players.length > 0;
  const showGameplayPreferences =
    context === 'in-game' && gameplayPreferences !== undefined;

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
            className={cn(
              'active:scale-95 transition-transform',
              context === 'in-game'
                ? 'h-11 w-11 rounded-full border-0 bg-white/10 text-white shadow-none backdrop-blur-sm hover:bg-white/14 hover:text-white'
                : 'h-9 w-9'
            )}
          >
            <MoreVertical className="h-5 w-5" />
            <span className="sr-only">Spillmeny</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {showGameplayPreferences && gameplayPreferences && (
            <>
              <DropdownMenuLabel>Drikkenivå</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={gameplayPreferences.drinkingIntensity}
                onValueChange={(value) =>
                  gameplayPreferences.onDrinkingIntensityChange(
                    value as GameplayDrinkingIntensity
                  )
                }
              >
                {(
                  Object.entries(
                    gameplayDrinkingIntensityOptions
                  ) as Array<
                    [
                      GameplayDrinkingIntensity,
                      (typeof gameplayDrinkingIntensityOptions)[GameplayDrinkingIntensity],
                    ]
                  >
                ).map(([level, option]) => (
                  <DropdownMenuRadioItem key={level} value={level}>
                    <Wine className="mr-2 h-4 w-4" />
                    <span>{option.label}</span>
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
            </>
          )}

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
            <DropdownMenuItem onSelect={handleShowSummary}>
              <Trophy className="mr-2 h-4 w-4" />
              <span>Se Oppsummering</span>
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
