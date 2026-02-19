'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dices, Users, Coins, HardHat, UserCheck } from 'lucide-react';
import { useSession } from '@/hooks/usePlayers';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

// --- Internal Component: PlayerPicker ---
function PlayerPicker() {
  const { players, isLoaded } = useSession();
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const handlePickPlayer = () => {
    if (players.length === 0) return;
    setIsSpinning(true);
    setSelectedPlayer(null);

    const spinDuration = 100; // ms per name change
    const totalSpins = 15;
    let spinCount = 0;

    const spinInterval = setInterval(() => {
      spinCount++;
      const randomIndex = Math.floor(Math.random() * players.length);
      setSelectedPlayer(players[randomIndex].name);
      if (spinCount >= totalSpins) {
        clearInterval(spinInterval);
        setIsSpinning(false);
      }
    }, spinDuration);
  };

  if (!isLoaded) {
    return <div className="text-center text-sm text-muted-foreground p-4">Laster spillere...</div>;
  }
  
  if (players.length < 1) {
    return (
      <div className="text-center text-sm text-muted-foreground p-4">
        Du må legge til minst én spiller for å bruke dette verktøyet.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="flex items-center justify-center bg-muted/50 rounded-lg w-full min-h-[6rem] p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedPlayer}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.1 }}
            className="flex flex-col items-center gap-2"
          >
            {selectedPlayer && !isSpinning && <UserCheck className="h-6 w-6 text-primary" />}
            <span className="text-2xl font-bold text-primary truncate max-w-[250px]">
              {selectedPlayer || "Hvem skal...?"}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
      <Button onClick={handlePickPlayer} disabled={isSpinning} className="w-full">
        {isSpinning ? 'Velger...' : 'Velg en tilfeldig spiller'}
      </Button>
    </div>
  );
}

// --- Internal Component: CoinFlip ---
function CoinFlip() {
  const [result, setResult] = useState<'Kron' | 'Mynt' | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);

  const handleFlip = () => {
    setIsFlipping(true);
    setResult(null);
    setTimeout(() => {
      const flipResult = Math.random() < 0.5 ? 'Kron' : 'Mynt';
      setResult(flipResult);
      setIsFlipping(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-full min-h-[6rem] flex items-center justify-center">
            {isFlipping ? (
                 <motion.div
                    className="w-20 h-20 rounded-full bg-yellow-400 border-4 border-yellow-600"
                    animate={{ rotateY: [0, 180, 360, 540, 720] }}
                    transition={{ duration: 1, ease: "linear", repeat: 0 }}
                />
            ) : (
                <div className="text-2xl font-bold text-primary">
                    {result ? (
                        <motion.span initial={{scale:0.5, opacity: 0}} animate={{scale: 1, opacity: 1}}>{result}</motion.span>
                    ) : 'Kast mynten!'}
                </div>
            )}
        </div>
      <Button onClick={handleFlip} disabled={isFlipping} className="w-full">
        {isFlipping ? 'Kaster...' : 'Kast mynten'}
      </Button>
    </div>
  );
}

// --- Internal Component: DiceRoll ---
const diceFaces = [
    <span key={1}>&#9856;</span>, // 1
    <span key={2}>&#9857;</span>, // 2
    <span key={3}>&#9858;</span>, // 3
    <span key={4}>&#9859;</span>, // 4
    <span key={5}>&#9860;</span>, // 5
    <span key={6}>&#9861;</span>, // 6
];

function DiceRoll() {
  const [result, setResult] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  const handleRoll = () => {
    setIsRolling(true);
    setResult(null);
    setTimeout(() => {
      const rollResult = Math.floor(Math.random() * 6) + 1;
      setResult(rollResult);
      setIsRolling(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-full min-h-[6rem] flex items-center justify-center text-7xl text-primary">
            {isRolling ? (
                 <motion.div
                    animate={{ rotate: [0, 180, 360, 540, 720] }}
                    transition={{ duration: 1, ease: "easeInOut", repeat: 0 }}
                >
                    <Dices />
                </motion.div>
            ) : (
                <div>
                    {result ? (
                        <motion.span initial={{scale:0.5, opacity: 0}} animate={{scale: 1, opacity: 1}}>{diceFaces[result - 1]}</motion.span>
                    ) : 'Kast terningen!'}
                </div>
            )}
        </div>
      <Button onClick={handleRoll} disabled={isRolling} className="w-full">
        {isRolling ? 'Kaster...' : 'Kast terningen'}
      </Button>
    </div>
  );
}


// --- Main Component: PartyTools (now Toolbox) ---
export function PartyTools() {
  return (
    <Card className="bg-card/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <HardHat className="h-6 w-6 text-primary" />
          Verktøykasse
        </CardTitle>
        <CardDescription>
          Enkle verktøy for å ta raske avgjørelser på festen.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <Tabs defaultValue="player-picker" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="player-picker"><Users className="h-4 w-4 mr-2" />Velg Spiller</TabsTrigger>
            <TabsTrigger value="coin-flip"><Coins className="h-4 w-4 mr-2" />Myntkast</TabsTrigger>
            <TabsTrigger value="dice-roll"><Dices className="h-4 w-4 mr-2" />Terning</TabsTrigger>
          </TabsList>
          <TabsContent value="player-picker" className="pt-4">
            <PlayerPicker />
          </TabsContent>
          <TabsContent value="coin-flip" className="pt-4">
            <CoinFlip />
          </TabsContent>
          <TabsContent value="dice-roll" className="pt-4">
            <DiceRoll />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

    