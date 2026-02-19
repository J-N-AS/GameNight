'use client';

import { useState, useRef } from 'react';
import type { Game } from '@/lib/types';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useSession } from '@/hooks/usePlayers';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Mail, QrCode, Download, Share2, Loader2, Instagram, Copy, Check, Gamepad2 } from 'lucide-react';
import QRCode from 'react-qr-code';
import * as htmlToImage from 'html-to-image';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import { AdBanner } from '../ads/AdBanner';


type ListedGame = Omit<Game, 'items' | 'language' | 'shuffle'>;

interface RussetidenClientProps {
    standardGames: ListedGame[];
    customGames: ListedGame[];
}

const PromoGenerator = ({ game, open, onOpenChange }: { game: ListedGame | null; open: boolean; onOpenChange: (open: boolean) => void; }) => {
    const storyRef = useRef<HTMLDivElement>(null);
    const qrOnlyRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState<'story' | 'qr' | null>(null);
    const [isCopied, setIsCopied] = useState(false);
    const { toast } = useToast();

    if (!game) return null;

    const gameUrl = `https://gamenight.no/spill/${game.id}`;
    
    const storyPromoStyle = {
      background: `linear-gradient(to bottom right, ${game.color?.replace('hsl', 'hsla').replace(')', '/ 0.35)') || 'hsl(var(--primary))'}, #111010)`
    }

    const handleDownload = async (type: 'story' | 'qr') => {
        const element = type === 'story' ? storyRef.current : qrOnlyRef.current;
        if (!element) return;
        
        setIsLoading(type);
        try {
            const dataUrl = await htmlToImage.toPng(element, { pixelRatio: 2 });
            const link = document.createElement('a');
            link.download = `gamenight-${game.id}-${type}.png`;
            link.href = dataUrl;
            link.click();
        } catch (error) {
            console.error(`Could not generate ${type} image:`, error);
            toast({
                title: "Noe gikk galt",
                description: `Kunne ikke generere ${type}-bildet. Prøv igjen.`,
                variant: "destructive"
            });
        } finally {
            setIsLoading(null);
        }
    };
    
    const handleCopyLink = () => {
        navigator.clipboard.writeText(gameUrl).then(() => {
            toast({
                title: "Lenke kopiert!",
                description: "Du kan nå lime den inn hvor du vil.",
            });
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2500);
        }).catch(err => {
            toast({
                title: "Kunne ikke kopiere",
                description: "En feil oppstod. Prøv å kopiere manuelt.",
                variant: "destructive"
            });
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Del spillet: {game.title}</DialogTitle>
                    <DialogDescription>
                        Del en direkte lenke, eller last ned materiell for å dele spillet med gjengen.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="game-link">Direkte lenke til spillet</Label>
                        <div className="flex items-center gap-2">
                            <Input id="game-link" readOnly value={gameUrl} />
                            <Button onClick={handleCopyLink} variant="outline" size="icon" className="shrink-0">
                                {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                <span className="sr-only">Kopier lenke</span>
                            </Button>
                        </div>
                    </div>
                     <p className="text-sm font-semibold text-center text-muted-foreground pt-4">Eller lag en story</p>
                     <div className="w-full max-w-[250px] mx-auto aspect-[9/16] rounded-lg overflow-hidden border">
                        <div 
                            ref={storyRef}
                            className="w-full h-full p-6 flex flex-col items-center justify-between text-white"
                            style={storyPromoStyle}
                        >
                            <div className="text-center">
                                <div className="text-4xl mb-4">{game.emoji}</div>
                                <h3 className="text-2xl font-bold leading-tight">{game.title}</h3>
                            </div>
                            <div className="flex flex-col items-center gap-4">
                                <p className="font-semibold text-center text-sm">Spill vårt vorspiel-spill gratis!</p>
                                <div className="bg-white p-2 rounded-lg">
                                    <QRCode value={gameUrl} size={100} />
                                </div>
                                <p className="font-bold text-lg">GameNight.no</p>
                            </div>
                        </div>
                     </div>
                </div>

                <DialogFooter className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Button onClick={() => handleDownload('story')} disabled={!!isLoading}>
                        {isLoading === 'story' ? <Loader2 className="animate-spin" /> : <Download className="mr-2" />}
                        Last ned Story
                    </Button>
                    <Button onClick={() => handleDownload('qr')} variant="secondary" disabled={!!isLoading}>
                        {isLoading === 'qr' ? <Loader2 className="animate-spin" /> : <QrCode className="mr-2" />}
                        Kun QR-kode
                    </Button>
                </DialogFooter>
            </DialogContent>
            
            <div className="fixed -z-10 -left-[9999px] top-0">
                 <div ref={qrOnlyRef} className="p-4 bg-white inline-block">
                    <QRCode value={gameUrl} size={512} />
                </div>
            </div>
        </Dialog>
    );
};


const CustomGameCard = ({ game, onPromoClick }: { game: ListedGame, onPromoClick: () => void }) => {
    const { players } = useSession();
    const { toast } = useToast();
    const router = useRouter();

    const handleGameSelect = (e: React.MouseEvent) => {
        if (game.requiresPlayers && players.length === 0) {
            e.preventDefault();
            toast({
                title: 'Spillere mangler',
                description: `"${game.title}" krever at du legger til spillere først. Gå til forsiden for å legge til spillere.`,
                variant: 'destructive',
            });
        } else {
            router.push(`/spill/${game.id}`);
        }
    };
    
    return (
        <Card 
            className="h-full flex flex-col transition-all duration-300 backdrop-blur-sm border-border hover:border-primary hover:shadow-2xl hover:shadow-primary/10"
        >
            <div onClick={handleGameSelect} className="cursor-pointer group h-full flex flex-col">
                <CardHeader className="flex-row items-start gap-4">
                    <div 
                        className="w-16 h-16 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: game.color ? game.color.replace('hsl','hsla').replace(')',' / 0.2)') : 'hsl(var(--primary) / 0.2)' }}
                    >
                        <span className="text-3xl">{game.emoji}</span>
                    </div>
                    <div>
                        <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">{game.title}</CardTitle>
                        <CardDescription className="mt-1 text-muted-foreground/80">{game.description}</CardDescription>
                        <div className="text-xs mt-2 text-muted-foreground font-semibold">{game.region} / {game.kommune}</div>
                    </div>
                </CardHeader>
            </div>
            <CardFooter className="mt-auto pt-4 grid grid-cols-2 gap-2">
                <Button onClick={onPromoClick} variant="secondary">
                    <Share2 className="mr-2" />
                    Del
                </Button>
                 {game.instagram && (
                    <Button asChild variant="outline">
                        <Link href={game.instagram} target="_blank">
                            <Instagram className="mr-2"/>
                            Instagram
                        </Link>
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}

export function RussetidenClient({ standardGames, customGames }: RussetidenClientProps) {
    const { players } = useSession();
    const { toast } = useToast();
    const [promoGame, setPromoGame] = useState<ListedGame | null>(null);

    const handleGameSelect = (e: React.MouseEvent, game: ListedGame) => {
        if (game.requiresPlayers && players.length === 0) {
            e.preventDefault();
            toast({
                title: 'Spillere mangler',
                description: `"${game.title}" krever at du legger til spillere først. Gå til forsiden for å legge til spillere.`,
                variant: 'destructive',
            });
        }
    };
    
    return (
        <>
            <div className="space-y-12">
                <section>
                    <h2 className="text-3xl font-bold font-headline tracking-tighter text-center mb-6">Til Rullingen & Nachet</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                        {standardGames.map((game) => (
                            <motion.div key={game.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                                <Link href={`/spill/${game.id}`} onClick={(e) => handleGameSelect(e, game)} className="group block h-full">
                                    <Card className="h-full flex flex-col transition-all duration-300 bg-card/80 backdrop-blur-sm border-border hover:border-primary hover:scale-105 hover:shadow-2xl hover:shadow-primary/10">
                                        <CardHeader className="flex-row items-start gap-4">
                                            <div className="text-4xl mt-1">{game.emoji}</div>
                                            <div>
                                                <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">{game.title}</CardTitle>
                                                <CardDescription className="mt-1 text-muted-foreground/80">{game.description}</CardDescription>
                                            </div>
                                        </CardHeader>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </section>
                
                <section>
                    <h2 className="text-3xl font-bold font-headline tracking-tighter text-center mb-6">Eksklusive Gruppespill</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                        {customGames.map((game) => (
                           <motion.div key={game.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                               <CustomGameCard game={game} onPromoClick={() => setPromoGame(game)} />
                           </motion.div>
                        ))}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                            <Card className="h-full flex flex-col items-center justify-center text-center p-6 bg-card/80 border-2 border-dashed border-primary/50">
                                 <CardTitle className="text-xl font-bold mb-2">Bygg et eget spill for deres gruppe!</CardTitle>
                                 <CardDescription className="mb-4">Få en skreddersydd kortstokk med interne vitser og unike utfordringer for deres buss eller van.</CardDescription>
                                 <Button asChild>
                                     <Link href="/info/kontakt-oss">
                                         <Mail className="mr-2" />
                                         Ta kontakt
                                     </Link>
                                 </Button>
                            </Card>
                        </motion.div>
                    </div>
                </section>
            </div>

            <div className="my-16 text-center">
                <Button asChild size="lg" variant="outline">
                    <Link href="/alle-spill">
                        <Gamepad2 className="mr-2 h-5 w-5" />
                        Se alle spill
                    </Link>
                </Button>
            </div>

            <article className="prose prose-invert lg:prose-lg max-w-4xl mx-auto mt-24 mb-16 px-4">
              <h2>Den ultimate guiden: Slik holder russegruppa stemningen på topp</h2>
              <p>Russetiden er et maraton, ikke en sprint. Uansett om dere er en konseptgruppe, ruller i van, er vandruss eller bare samles til et episk vorspiel før russekroa, er det viktig å holde koken. Her er våre beste tips for en legendarisk kveld – pluss tre geniale leker som ikke krever noe utstyr.</p>
              
              <h3>1. Husk vann-regelen (Pace dere selv!)</h3>
              <p>Det høres kanskje kjedelig ut når musikken pumper, men det absolutt viktigste tipset for å overleve mai er å drikke vann. Et genialt triks er å bygge inn 'vann-skåler' i selskapslekene deres. Å ta et glass vann mellom slagene holder energien oppe, forhindrer at kvelden peaker for tidlig, og sikrer at hele gruppa faktisk husker hvor gøy dere hadde det dagen etter.</p>
              
              <h3>2. Unngå dødtid i gruppa</h3>
              <p>Enten dere venter på at alle skal ankomme vorspielet eller står i kø utenfor kroa, er 'dødtid' stemningens største fiende. Ha alltid et par raske leker i bakhånd for å unngå at alle blir sittende og scrolle på mobilen.</p>
              
              <h3>👀 Lek: Morderen på Vorspielet (Wink Murder)</h3>
              <p>En perfekt lek for alle typer grupper! Alle sitter i en ring. Én person velges hemmelig til å være 'Morderen' (for eksempel ved at alle lukker øynene og en leder tapper morderen på skulderen). Morderen eliminerer andre ved å blunke diskret til dem. Den som blir blunket til må vente noen sekunder før de dramatisk 'dør'. Resten av gruppa må prøve å avsløre morderen før det er for sent!</p>
              
              <h3>3. Bryt isen på tvers av klikker</h3>
              <p>Selv i sammensveisede russegrupper har folk en tendens til å prate med de samme tre personene hele kvelden. Felles leker som krever at alle følger med, er den beste måten å samle hele gruppa på.</p>
              
              <h3>⏱️ Lek: Tikk-Takk-Kaos (Tick Tock)</h3>
              <p>En intens konsentrasjonslek som alltid kollapser i latter! Dere trenger to små gjenstander (f.eks. en snusboks og en nøkkel). Lederen sender snusboksen til høyre og sier: 'Dette er en Tikk'. Personen til høyre må spørre 'En hva?', lederen svarer 'En Tikk', og gjenstanden sendes videre. Samtidig sendes den andre gjenstanden til venstre som 'En Takk'. Når disse to gjenstandene krysser hverandre i sirkelen, kortslutter hjernen til folk fullstendig!</p>
              
              <h3>4. Ha GameNight klar på mobilen</h3>
              <p>Når de fysiske lekene er spilt ut, er det ingenting som slår en runde med 'Kaosrunden' eller 'Pekefest'. Dra opp GameNight, la skjermen styre utfordringene, og la straffene (og vann-skålene) rulle!</p>
            </article>

            <motion.div
              className="mt-16 flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <AdBanner />
            </motion.div>

            <PromoGenerator game={promoGame} open={!!promoGame} onOpenChange={() => setPromoGame(null)} />
        </>
    );
}
