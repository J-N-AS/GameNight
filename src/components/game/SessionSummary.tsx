'use client';

import React, { useRef, useState, useCallback, useMemo, useEffect } from 'react';
import { usePlayers } from '@/hooks/usePlayers';
import { Button } from '@/components/ui/button';
import { Share2, Download, Crosshair, Droplet, Flame, Loader2 } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function SessionSummary() {
  const { players } = usePlayers();
  const summaryRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isShareSupported, setIsShareSupported] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (navigator.share && navigator.canShare) {
      setIsShareSupported(true);
    }
  }, []);

  const shuffledPlayers = useMemo(() => {
    if (!players || players.length === 0) return [];
    return [...players].sort(() => Math.random() - 0.5);
  }, [players]);

  const getPlayerName = (index: number): string => {
      if (shuffledPlayers.length === 0) return 'En ukjent helt';
      // Loop through players if there are more awards than players
      return shuffledPlayers[index % shuffledPlayers.length]?.name || 'En mystisk gjest';
  };

  const awards = [
    { icon: Crosshair, title: 'Kveldens Skyteskive', subtitle: 'Mest utsatt', player: getPlayerName(0) },
    { icon: Droplet, title: 'Hydreringssjefen', subtitle: 'Trengte vann', player: getPlayerName(1) },
    { icon: Flame, title: 'Kveldens Grensesprenger', subtitle: 'Drøyest', player: getPlayerName(2) },
  ];

  const generateImageAnd = useCallback(async (action: 'share' | 'download') => {
    if (!summaryRef.current) return;

    setIsGenerating(true);
    try {
      // Use a higher pixel density for better quality
      const dataUrl = await htmlToImage.toPng(summaryRef.current, { 
          pixelRatio: 2,
          // Set canvas dimensions to match the element for consistency
          canvasWidth: summaryRef.current.clientWidth * 2,
          canvasHeight: summaryRef.current.clientHeight * 2,
      });

      if (action === 'share') {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], "gamenight-oppsummering.png", { type: "image/png" });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'Kveldens oppsummering!',
            text: 'Sjekk ut oppsummeringen fra kveldens GameNight!',
            files: [file],
          });
        } else {
          // Fallback for devices that support share but not file sharing
          toast({
            title: "Deling av filer er ikke støttet",
            description: "Prøv å laste ned bildet i stedet.",
            variant: "destructive"
          });
        }
      } else { // download
        const link = document.createElement('a');
        link.download = 'gamenight-oppsummering.png';
        link.href = dataUrl;
        link.click();
      }
    } catch (error) {
      console.error('Oops, something went wrong!', error);
      toast({
        title: "Noe gikk galt",
        description: "Kunne ikke generere bildet. Prøv igjen.",
        variant: "destructive"
      })
    } finally {
      setIsGenerating(false);
    }
  }, [toast]);

  return (
    <motion.div 
        className="w-full flex flex-col items-center gap-4 my-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
    >
      {/* This is the component that will be converted to an image */}
      <div 
        ref={summaryRef} 
        className="aspect-[9/16] w-full max-w-[280px] bg-background rounded-2xl p-6 flex flex-col text-center shadow-2xl border-2 border-primary/20"
        >
        <h3 className="text-3xl font-bold font-headline tracking-tighter text-foreground">Kveldens Dom</h3>
        <p className="text-lg text-primary font-semibold">⚖️</p>
        
        <div className="flex-grow flex flex-col justify-center gap-6 my-6">
          {awards.map((award, index) => (
            <div key={index} className="flex flex-col items-center">
              <award.icon className="w-8 h-8 text-muted-foreground mb-2" />
              <p className="text-sm font-semibold text-muted-foreground">{award.title}</p>
              <p className="text-xs text-muted-foreground/70">{award.subtitle}</p>
              <p className="text-xl font-bold text-accent mt-1 truncate max-w-full">{award.player}</p>
            </div>
          ))}
        </div>

        <div className="mt-auto flex justify-center">
            <Image 
                src="/GameNight-logo-small.webp"
                alt="GameNight Logo"
                width={150}
                height={37}
                className="opacity-70"
            />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {isShareSupported ? (
          <Button onClick={() => generateImageAnd('share')} disabled={isGenerating} size="lg">
            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Share2 className="mr-2 h-4 w-4" />}
            Del oppsummering
          </Button>
        ) : (
          <Button onClick={() => generateImageAnd('download')} disabled={isGenerating} size="lg">
            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            Last ned
          </Button>
        )}
      </div>
       <p className="text-xs text-muted-foreground max-w-xs text-center mt-2">
            Del kveldens høydepunkter på Instagram eller Snapchat!
        </p>
    </motion.div>
  );
}
