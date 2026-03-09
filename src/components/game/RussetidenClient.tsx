'use client';

import { useState, useRef, useEffect } from 'react';
import type { Game } from '@/lib/types';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Mail, QrCode, Download, Share2, Loader2, Instagram, Copy, Check, Gamepad2 } from 'lucide-react';
import QRCode from 'react-qr-code';
import * as htmlToImage from 'html-to-image';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { AdBanner } from '../ads/AdBanner';
import { withBasePath } from '@/lib/base-path';
import { getPlayerRequirementLabel } from '@/lib/player-requirements';
import { useGameStart } from '@/hooks/useGameStart';


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
    const [origin, setOrigin] = useState('');
    const { toast } = useToast();

    useEffect(() => {
      if (typeof window !== 'undefined') {
        setOrigin(window.location.origin);
      }
    }, []);

    if (!game) return null;

    const gamePath = withBasePath(`/spill/${game.id}`);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '');
    const gameUrl = siteUrl ? `${siteUrl}${gamePath}` : `${origin}${gamePath}`;
    
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
        }).catch(() => {
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
    const { startGame } = useGameStart();

    const handleGameSelect = (e: React.MouseEvent) => {
        startGame(game, e);
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
                        {getPlayerRequirementLabel(game) && (
                            <p className="mt-2 text-xs font-semibold text-foreground/80">
                                {getPlayerRequirementLabel(game)}
                            </p>
                        )}
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
    const [promoGame, setPromoGame] = useState<ListedGame | null>(null);
    const { startGame } = useGameStart();
    
    return (
        <>
            <div className="space-y-12">
                <section>
                    <h2 className="text-3xl font-bold font-headline tracking-tighter text-center mb-6">Til Rullingen & Nachet</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                        {standardGames.map((game) => (
                            <motion.div key={game.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                                <Link href={`/spill/${game.id}`} onClick={(e) => startGame(game, e)} className="group block h-full">
                                    <Card className="h-full flex flex-col transition-all duration-300 bg-card/80 backdrop-blur-sm border-border hover:border-primary hover:scale-105 hover:shadow-2xl hover:shadow-primary/10">
                                        <CardHeader className="flex-row items-start gap-4">
                                            <div className="text-4xl mt-1">{game.emoji}</div>
                                            <div>
                                                <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">{game.title}</CardTitle>
                                                <CardDescription className="mt-1 text-muted-foreground/80">{game.description}</CardDescription>
                                                {getPlayerRequirementLabel(game) && (
                                                    <p className="mt-3 text-xs font-semibold text-foreground/80">
                                                        {getPlayerRequirementLabel(game)}
                                                    </p>
                                                )}
                                            </div>
                                        </CardHeader>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </section>
                
                <div className="my-12 text-center">
                    <Button asChild size="lg" variant="outline">
                        <Link href="/alle-spill">
                            <Gamepad2 className="mr-2 h-5 w-5" />
                            Se flere spill
                        </Link>
                    </Button>
                </div>
                
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
              
              <h3>5. Samtykke er Alt: ‘Nei er Nei’</h3>
              <p>Dette er det absolutt viktigste punktet. Russetiden handler om å ha det gøy, men det MÅ skje på en trygg måte. Husk at alle selskapsleker og all interaksjon, spesielt de som er flørtende eller utfordrende, krever tydelig og entusiastisk samtykke fra alle involverte. ‘Nei er nei’-kampanjen gjelder overalt, også i leken. Respekter hverandres grenser, og sørg for at alle er komfortable til enhver tid. En god fest er en trygg fest for alle.</p>
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
