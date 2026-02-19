'use client';

import React, { useRef, useState, useCallback, useMemo, useEffect } from 'react';
import { useSession } from '@/hooks/usePlayers';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Share2, Download, Trophy, Shield, Crosshair, Loader2, PartyPopper } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import { useToast } from '@/hooks/use-toast';

interface GlobalSessionSummaryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GlobalSessionSummary({ open, onOpenChange }: GlobalSessionSummaryProps) {
  const { players, removeAllPlayers } = useSession();
  const summaryRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isShareSupported, setIsShareSupported] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const [isDonating, setIsDonating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
        if (navigator.share && navigator.canShare) {
            setIsShareSupported(true);
        }
        setLogoUrl(new URL('/GameNight-logo-small.webp', window.location.origin).href);
    }
  }, []);

  const awards = useMemo(() => {
    if (!players || players.length < 2) return [];
    
    const mvp = [...players].sort((a, b) => b.stats.tasksCompleted - a.stats.tasksCompleted)[0];
    const skyteskive = [...players].sort((a, b) => b.stats.timesTargeted - a.stats.timesTargeted)[0];
    const teflon = [...players].sort((a, b) => a.stats.penalties - b.stats.penalties)[0];

    // Ensure we don't have duplicate players for awards if there are few players
    const awardPlayers = [mvp, skyteskive, teflon];
    const uniqueAwardPlayers = [...new Set(awardPlayers)];
    while (uniqueAwardPlayers.length < 3 && players.length > uniqueAwardPlayers.length) {
      const availablePlayers = players.filter(p => !uniqueAwardPlayers.includes(p));
      if (availablePlayers.length > 0) {
          uniqueAwardPlayers.push(availablePlayers[0]);
      } else {
          break; // Should not happen if players.length > uniqueAwardPlayers.length
      }
    }

    return [
      { icon: Trophy, title: 'Kveldens MVP', subtitle: 'Fullførte flest oppgaver', player: uniqueAwardPlayers[0] || mvp },
      { icon: Crosshair, title: 'Kveldens Skyteskive', subtitle: 'Mest utsatt for pek og valg', player: uniqueAwardPlayers[1] || skyteskive },
      { icon: Shield, title: 'Teflon-pannen', subtitle: 'Unnslapp flest straffer', player: uniqueAwardPlayers[2] || teflon },
    ];
  }, [players]);

  const generateImageAnd = useCallback(async (action: 'share' | 'download') => {
    if (!summaryRef.current) return;

    setIsGenerating(true);
    try {
      const dataUrl = await htmlToImage.toPng(summaryRef.current, { 
          pixelRatio: 2.5, // Increased for better quality
          cacheBust: true,
          skipAutoScale: true,
          fontEmbedCSS: '', // Attempt to fix font issues
          width: summaryRef.current.clientWidth,
          height: summaryRef.current.clientHeight,
       });

      if (action === 'share' && isShareSupported) {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], "gamenight-oppsummering.png", { type: "image/png" });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'Kveldens oppsummering fra GameNight!',
            text: 'Sjekk ut kveldens kåringer!',
            files: [file],
          });
        } else {
           toast({
            title: "Deling av filer støttes ikke av denne appen/nettleseren",
            description: "Bildet lastes ned i stedet. Prøv å dele fra kamerarullen din.",
           });
           const link = document.createElement('a');
           link.download = 'gamenight-oppsummering.png';
           link.href = dataUrl;
           link.click();
        }
      } else { // download
        const link = document.createElement('a');
        link.download = 'gamenight-oppsummering.png';
        link.href = dataUrl;
        link.click();
      }
    } catch (error) {
      console.error('Kunne ikke generere bilde:', error);
      toast({
        title: "Noe gikk galt",
        description: "Kunne ikke generere bildet. Prøv igjen.",
        variant: "destructive"
      })
    } finally {
      setIsGenerating(false);
    }
  }, [toast, isShareSupported]);

  const handleStartNewNight = () => {
    removeAllPlayers();
    onOpenChange(false);
    toast({
        title: "Ny kveld startet!",
        description: "Alle spillere og statistikk er nullstilt."
    })
  }
  
  const handleDonate = async () => {
    setIsDonating(true);
    try {
        const response = await fetch('/api/vipps/donate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: 25 })
        });

        const data = await response.json();

        if (data.status === 'not_configured') {
            toast({
                title: 'Tusen takk for tanken! ❤️',
                description: 'Donasjoner er ikke aktivert helt enda, men vi setter utrolig stor pris på at du ville støtte oss!',
            });
        } else if (data.status === 'success' && data.checkoutFrontendUrl) {
            window.location.href = data.checkoutFrontendUrl;
        } else {
            throw new Error(data.message || 'En ukjent feil oppstod');
        }
    } catch (error) {
        console.error("Donation failed:", error);
        toast({
            title: 'Noe gikk galt',
            description: 'Kunne ikke starte donasjonen. Vennligst prøv igjen senere.',
            variant: 'destructive',
        });
    } finally {
        setIsDonating(false);
    }
  };

  if (!players || players.length === 0) {
      return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Ingen oppsummering</DialogTitle>
                    <DialogDescription>
                        Du må legge til spillere og spille minst ett spill for å se en oppsummering.
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
      )
  }

  const showAwards = players.length >= 2;

  return (
     <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md w-full">
             <DialogHeader>
                <DialogTitle className="text-center text-2xl font-bold">Kvelden er over!</DialogTitle>
                <DialogDescription className="text-center">
                  {showAwards ? "Her er kveldens kåringer. Del den med venner!" : "Bra spilt! Klar for en ny kveld?"}
                </DialogDescription>
            </DialogHeader>

            {showAwards && (
              <div className="flex flex-col items-center gap-6 py-4">
                  {/* This is the component that will be converted to an image */}
                  <div 
                      ref={summaryRef} 
                      className="aspect-[9/16] w-full max-w-sm bg-background rounded-2xl p-8 flex flex-col text-center shadow-2xl border-2 border-primary/20"
                      style={{ backgroundColor: '#1C1717' }} // Hardcoded background for image generation
                  >
                      <h3 className="text-4xl font-bold font-headline tracking-tighter text-foreground">Kveldens Dom</h3>
                      <p className="text-2xl text-primary font-semibold mt-1">⚖️</p>
                      
                      <div className="flex-grow flex flex-col justify-center gap-8 my-8">
                      {awards.map((award, index) => (
                          <div key={index} className="flex flex-col items-center">
                          <award.icon className="w-10 h-10 text-muted-foreground mb-2" />
                          <p className="text-base font-semibold text-muted-foreground">{award.title}</p>
                          <p className="text-sm text-muted-foreground/70">{award.subtitle}</p>
                          <p className="text-2xl font-bold text-accent mt-1 truncate max-w-full">{award.player.name}</p>
                          </div>
                      ))}
                      </div>

                      <div className="mt-auto flex justify-center">
                          {logoUrl && (
                              <img 
                                  src={logoUrl}
                                  alt="GameNight Logo"
                                  width="150"
                                  height="37"
                                  className="opacity-70"
                              />
                          )}
                      </div>
                  </div>

                  <div className="w-full max-w-sm flex items-center gap-3">
                      {isShareSupported ? (
                      <Button onClick={() => generateImageAnd('share')} disabled={isGenerating} size="lg" className="flex-1">
                          {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Share2 className="mr-2 h-4 w-4" />}
                          Del
                      </Button>
                      ) : (
                      <Button onClick={() => generateImageAnd('download')} disabled={isGenerating} size="lg" className="flex-1">
                          {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                          Last ned
                      </Button>
                      )}
                  </div>
                  <p className="text-xs text-muted-foreground max-w-xs text-center px-4">
                      Tips: Hvis deling til Snapchat/Instagram ikke fungerer, last ned bildet og del det manuelt fra kamerarullen.
                  </p>
              </div>
            )}
            
            <div className="w-full max-w-sm mx-auto space-y-4 text-center border-t border-border pt-6">
                <p className="text-sm text-muted-foreground">Gjorde GameNight kvelden deres bedre? <br/> Spander en tier på utviklerne!</p>
                <div className="flex justify-center items-center min-h-[48px]">
                  <div className="w-full max-w-[280px]">
                      <Button
                          onClick={handleDonate}
                          disabled={isDonating}
                          className="w-full h-auto p-0 bg-transparent hover:bg-transparent disabled:opacity-50"
                          aria-label="Doner 25 kr med Vipps"
                      >
                          {isDonating ? (
                              <div className="flex items-center justify-center w-full h-[48px] bg-muted/50 rounded-lg">
                                  <Loader2 className="h-6 w-6 animate-spin" />
                              </div>
                          ) : (
                              <Image
                                  src="/vipps-button.svg"
                                  alt="Doner 25 kr med Vipps"
                                  width={280}
                                  height={48}
                                  className="w-full h-auto rounded-lg"
                                  priority
                              />
                          )}
                      </Button>
                  </div>
                </div>
            </div>

            <DialogFooter className="mt-4">
                <Button variant="outline" onClick={handleStartNewNight} className="w-full">
                    <PartyPopper className="mr-2 h-4 w-4" /> Start en ny kveld
                </Button>
            </DialogFooter>
        </DialogContent>
     </Dialog>
  );
}
