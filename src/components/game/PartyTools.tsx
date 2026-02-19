'use client';

import { useState } from 'react';
import { useSession } from '@/hooks/usePlayers';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Martini, Music, Pizza, GlassWater, Dices } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const tools = [
  { id: 'drink', label: 'Hente drikke', icon: Martini },
  { id: 'dj', label: 'Være DJ', icon: Music },
  { id: 'pizza', label: 'Bestille pizza', icon: Pizza },
  { id: 'water', label: 'Drikke vann', icon: GlassWater },
];

export function PartyTools() {
  const { players, isLoaded } = useSession();
  const { toast } = useToast();
  const [isRolling, setIsRolling] = useState(false);

  const handleSelectPlayer = (tool: (typeof tools)[0]) => {
    if (players.length < 2) {
      toast({
        title: 'For få spillere',
        description: 'Du må ha minst 2 spillere for å bruke verktøyene.',
        variant: 'destructive',
      });
      return;
    }
    setIsRolling(true);

    // Quick animation
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * players.length);
      const player = players[randomIndex];
      toast({
        title: `🎲 ${tool.label}!`,
        description: `${player.name} ble valgt!`,
      });
      setIsRolling(false);
    }, 500);
  };

  return (
    <Card className="bg-card/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Dices className="h-6 w-6 text-primary" />
          Fest-verktøy
        </CardTitle>
        <CardDescription>
          Små verktøy for å hjelpe festen på vei. Velger en tilfeldig spiller.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {tools.map(tool => (
            <Button
              key={tool.id}
              variant="secondary"
              onClick={() => handleSelectPlayer(tool)}
              disabled={isRolling || (isLoaded && players.length < 2)}
              className="h-12"
            >
              <tool.icon className="mr-2 h-5 w-5" />
              <span>{tool.label}</span>
            </Button>
          ))}
        </div>
        {isLoaded && players.length < 2 && (
          <p className="text-xs text-muted-foreground mt-4 text-center">
            Legg til minst 2 spillere for å aktivere verktøyene.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
