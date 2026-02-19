'use client';

import React, { useRef, useState, useCallback, useMemo, useEffect } from 'react';
import { useSession } from '@/hooks/usePlayers';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Share2, Download, Loader2, PartyPopper, Palette } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Confetti from 'react-confetti';


type SummaryTheme = 'dark' | 'light' | 'festive';

const themes: {id: SummaryTheme, name: string, className: string}[] = [
    { id: 'dark', name: 'Mørk', className: 'bg-background text-foreground' },
    { id: 'light', name: 'Lys', className: 'bg-white text-black' },
    { id: 'festive', name: 'Festlig', className: 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white' },
];

function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    if (typeof window !== 'undefined') {
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }
  }, []);
  return { width: size[0], height: size[1] };
}


export function OppsummeringClient() {
  const { players, removeAllPlayers } = useSession();
  const router = useRouter();
  const summaryRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isShareSupported, setIsShareSupported] = useState(false);
  const [isDonating, setIsDonating] = useState(false);
  const [activeTheme, setActiveTheme] = useState<SummaryTheme>('dark');
  const [showConfetti, setShowConfetti] = useState(true);
  const { toast } = useToast();

  const { width, height } = useWindowSize();

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 8000); // Let it rain for 8 seconds
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        if (navigator.share && navigator.canShare) {
            setIsShareSupported(true);
        }
    }
  }, []);

  const awards = useMemo(() => {
    if (!players || players.length < 2) return [];
    
    const mvp = [...players].sort((a, b) => b.stats.tasksCompleted - a.stats.tasksCompleted)[0];
    const skyteskive = [...players].sort((a, b) => b.stats.timesTargeted - a.stats.timesTargeted)[0];
    const teflon = [...players].sort((a, b) => a.stats.penalties - b.stats.penalties)[0];

    const awardPlayers = [mvp, skyteskive, teflon].filter(Boolean);
    const uniqueAwardPlayers = [...new Set(awardPlayers)];
    
    // Fill up with other players if we have duplicates but more players are available
    while (uniqueAwardPlayers.length < 3 && players.length > uniqueAwardPlayers.length) {
      const availablePlayers = players.filter(p => !uniqueAwardPlayers.includes(p));
      if (availablePlayers.length > 0) {
          uniqueAwardPlayers.push(availablePlayers[0]);
      } else {
          break; // Should not happen if players.length > uniqueAwardPlayers.length
      }
    }

    return [
      { emoji: '🏆', title: 'Kveldens MVP', subtitle: 'Fullførte flest oppgaver', player: uniqueAwardPlayers[0] || mvp },
      { emoji: '🎯', title: 'Kveldens Skyteskive', subtitle: 'Mest utsatt for pek og valg', player: uniqueAwardPlayers[1] || skyteskive },
      { emoji: '🛡️', title: 'Teflon-pannen', subtitle: 'Unnslapp flest straffer', player: uniqueAwardPlayers[2] || teflon },
    ].filter(a => a.player);
  }, [players]);

  const generateImageAnd = useCallback(async (action: 'share' | 'download') => {
    if (!summaryRef.current) return;

    setIsGenerating(true);
    try {
      const currentTheme = themes.find(t => t.id === activeTheme);
      const backgroundColor = currentTheme?.id === 'light' ? '#ffffff' : '#1a1a1a'; // Darker background for dark theme image

      const dataUrl = await htmlToImage.toPng(summaryRef.current, { 
          pixelRatio: 2.5,
          cacheBust: true,
          skipAutoScale: true,
          backgroundColor: currentTheme?.id !== 'festive' ? backgroundColor : undefined,
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
      } else {
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
  }, [toast, isShareSupported, activeTheme]);

  const handleStartNewNight = () => {
    removeAllPlayers();
    toast({
        title: "Ny kveld startet!",
        description: "Alle spillere og statistikk er nullstilt."
    });
    router.push('/');
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
        <Card className="w-full max-w-md mt-8 text-center">
            <CardHeader>
                <CardTitle>Ingen spillere</CardTitle>
                <CardDescription>
                    Du må legge til spillere på forsiden for å se en oppsummering.
                </CardDescription>
            </CardHeader>
        </Card>
      )
  }

  const showAwards = players.length >= 2;

  const currentThemeDetails = themes.find(t => t.id === activeTheme);

  return (
    <>
    {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} />}
    <motion.div 
        className="w-full max-w-md flex flex-col items-center gap-6 py-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
    >
        <div className="text-center">
            <h1 className="text-3xl font-bold font-headline">Kveldens Oppsummering</h1>
            <p className="text-muted-foreground mt-2">
                {showAwards ? "Her er kveldens kåringer. Del den med venner!" : "Bra spilt! Klar for en ny kveld?"}
            </p>
        </div>

        {showAwards && (
            <>
                <div 
                    ref={summaryRef} 
                    className={cn(
                        "aspect-[9/16] w-full max-w-sm rounded-2xl p-6 pb-10 flex flex-col text-center shadow-2xl transition-colors duration-300",
                        currentThemeDetails?.className
                    )}
                >
                    <h3 className="text-3xl font-bold font-headline tracking-tighter">Kveldens Dom</h3>
                    <p className="text-xl font-semibold mt-1">⚖️</p>
                    
                    <div className="flex-grow flex flex-col justify-center gap-6 my-2">
                    {awards.map((award, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <p className="text-5xl mb-1">{award.emoji}</p>
                            <p className="text-sm font-semibold opacity-80">{award.title}</p>
                            <p className="text-xs opacity-70">{award.subtitle}</p>
                            <p className={cn(
                                "text-4xl font-extrabold mt-1 truncate max-w-full drop-shadow-lg",
                                activeTheme === 'dark' && "text-accent",
                                activeTheme === 'light' && "text-primary",
                                activeTheme === 'festive' && "text-white"
                            )}>{award.player.name}</p>
                        </div>
                    ))}
                    </div>

                    <p className="mt-auto pt-4 font-medium text-sm opacity-80 text-center">🎲 Opplevd på GameNight.no</p>
                </div>

                <Card className="w-full p-4 bg-card/80">
                    <CardContent className="p-0">
                        <p className="text-sm font-medium mb-3 text-center flex items-center justify-center gap-2"><Palette className="h-4 w-4" /> Velg tema</p>
                        <div className="flex justify-center gap-2">
                            {themes.map(theme => (
                                <Button 
                                    key={theme.id}
                                    variant={activeTheme === theme.id ? 'default' : 'outline'}
                                    onClick={() => setActiveTheme(theme.id)}
                                    size="sm"
                                >
                                    {theme.name}
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <div className="w-full flex items-center gap-3">
                    {isShareSupported ? (
                    <Button onClick={() => generateImageAnd('share')} disabled={isGenerating} size="lg" className="flex-1 h-12">
                        {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Share2 className="mr-2 h-4 w-4" />}
                        Del
                    </Button>
                    ) : (
                    <Button onClick={() => generateImageAnd('download')} disabled={isGenerating} size="lg" className="flex-1 h-12">
                        {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                        Last ned
                    </Button>
                    )}
                </div>
                <p className="text-xs text-muted-foreground text-center px-4">
                    Tips: Hvis deling til Snapchat/Instagram ikke fungerer, last ned bildet og del det manuelt fra kamerarullen.
                </p>
            </>
        )}
        
        <div className="w-full space-y-4 text-center border-t border-border pt-6 mt-4">
            <p className="text-sm text-muted-foreground">Gjorde GameNight kvelden deres bedre? <br/> Spander en kaffe på utviklerne (25 kr) ☕</p>
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

        <Button variant="outline" onClick={handleStartNewNight} className="w-full h-12">
            <PartyPopper className="mr-2 h-4 w-4" /> Start en ny kveld
        </Button>
    </motion.div>
    </>
  );
}
