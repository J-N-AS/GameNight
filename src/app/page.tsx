'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Rocket, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlayerSetup } from '@/components/game/PlayerSetup';
import Link from 'next/link';
import Image from 'next/image';
import { GameMenu } from '@/components/game/GameMenu';
import { motion } from 'framer-motion';
import { usePlayers } from '@/hooks/usePlayers';
import { AdBanner } from '@/components/ads/AdBanner';

export default function Home() {
  const [isPlayerSetupOpen, setIsPlayerSetupOpen] = useState(false);
  const router = useRouter();
  const { players, isLoaded } = usePlayers();

  const handleSetupComplete = () => {
    setIsPlayerSetupOpen(false);
    router.push('/spill/velg');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      className="container mx-auto px-4 flex flex-col items-center justify-center min-h-screen text-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="absolute top-4 right-4 z-10">
        <GameMenu context="lobby" />
      </div>

      <motion.header className="mb-12" variants={itemVariants}>
        <Image
          src="/GameNight-logo-small.webp"
          alt="GameNight Logo"
          width={400}
          height={100}
          priority
          className="w-auto h-auto mx-auto max-w-[300px] md:max-w-[400px] drop-shadow-[0_5px_15px_rgba(0,0,0,0.2)]"
        />
        <p className="text-muted-foreground mt-4 text-lg md:text-xl">
          Start festen med et spill!
        </p>
      </motion.header>

      <motion.div
        className="flex flex-col items-center gap-4"
        variants={itemVariants}
      >
        <PlayerSetup
          open={isPlayerSetupOpen}
          onOpenChange={setIsPlayerSetupOpen}
          onSetupComplete={handleSetupComplete}
        >
          <Button
            size="lg"
            className="h-16 text-xl px-10 transform transition-transform duration-200 hover:scale-105 hover:shadow-primary/40 shadow-lg"
            onClick={() => setIsPlayerSetupOpen(true)}
          >
            <Rocket className="mr-3 h-6 w-6 animate-pulse" />
            Start en runde
          </Button>
        </PlayerSetup>
        
        {isLoaded && players.length > 0 ? (
          <Button variant="outline" asChild>
            <Link href="/spill/velg">
              <History className="mr-2 h-4 w-4" />
              Fortsett med {players.length} spillere
            </Link>
          </Button>
        ) : (
          <Button variant="link" asChild>
            <Link href="/spill/velg">Eller se alle spillene</Link>
          </Button>
        )}

      </motion.div>
    </motion.div>
  );
}
