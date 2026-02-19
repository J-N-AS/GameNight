'use client';

import type { Game } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Instagram, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { GameMenu } from './GameMenu';
import Link from 'next/link';

interface CustomGameLobbyProps {
  game: Game;
  onStart: () => void;
}

export function CustomGameLobby({ game, onStart }: CustomGameLobbyProps) {
  
  const extractHslValues = (hslString?: string) => {
    if (!hslString) return '';
    // Extracts "280 75% 55%" from "hsl(280 75% 55%)"
    const match = hslString.match(/hsl\((.*?)\)/);
    return match ? match[1] : '';
  };
  
  const accentColor = extractHslValues(game.color) || '45 93% 47%';
  
  const cssVars = {
    '--custom-accent': accentColor,
  } as React.CSSProperties;

  return (
    <div style={cssVars}>
      <motion.div
        className="relative flex min-h-screen flex-col items-center justify-center p-4 text-center bg-background overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Background Gradient */}
        <div 
          className="absolute inset-0 z-0 opacity-20" 
          style={{
            background: `radial-gradient(circle at top, hsl(var(--custom-accent) / 0.5) 0%, transparent 40%), radial-gradient(circle at bottom, hsl(var(--custom-accent) / 0.3) 0%, transparent 60%)`
          }}
        ></div>

        <div className="absolute top-4 right-4 z-20">
          <GameMenu context="lobby" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center justify-center max-w-md">
          <motion.div
            className="mb-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', delay: 0.2, duration: 0.7 }}
          >
            <div className="text-8xl">{game.emoji}</div>
          </motion.div>
          
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-4 font-headline tracking-tighter"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {game.title}
          </motion.h1>
          
          <motion.p
            className="text-muted-foreground text-lg mb-10"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {game.description}
          </motion.p>
          
          <motion.div
            className="w-full flex flex-col gap-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              onClick={onStart}
              size="lg"
              className="h-14 text-lg w-full transform transition-transform duration-200 hover:scale-105"
              style={{ 
                backgroundColor: 'hsl(var(--custom-accent))', 
                color: 'hsl(var(--accent-foreground))'
              }}
            >
              <Play className="mr-2 h-6 w-6" />
              Start Spillet
            </Button>
            
            {game.instagram && (
                <Button asChild size="lg" variant="outline" className="h-14 text-lg w-full transform transition-transform duration-200 hover:scale-105">
                    <Link href={game.instagram} target="_blank" rel="noopener noreferrer">
                        <Instagram className="mr-3 h-6 w-6" />
                        Følg oss på Instagram
                    </Link>
                </Button>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
