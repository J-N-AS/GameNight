'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlayerSetup } from '@/components/game/PlayerSetup';
import Link from 'next/link';
import Image from 'next/image';
import { GameMenu } from '@/components/game/GameMenu';

export default function Home() {
  const [isPlayerSetupOpen, setIsPlayerSetupOpen] = useState(false);
  const router = useRouter();

  const handleSetupComplete = () => {
    setIsPlayerSetupOpen(false);
    router.push('/spill/velg');
  };

  return (
    <div className="container mx-auto px-4 flex flex-col items-center justify-center min-h-screen text-center">
      <div className="absolute top-4 right-4 z-10">
        <GameMenu context="lobby" />
      </div>

      <header className="mb-12 animate-in fade-in-50 duration-1000">
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
      </header>

      <div className="flex flex-col items-center gap-4 animate-in fade-in-0 slide-in-from-bottom-10 duration-1000 delay-500 fill-mode-both">
        <PlayerSetup
          open={isPlayerSetupOpen}
          onOpenChange={setIsPlayerSetupOpen}
          onSetupComplete={handleSetupComplete}
        >
          <Button
            size="lg"
            className="h-16 text-xl px-10 transform transition-transform duration-200 active:scale-95 hover:scale-105 hover:shadow-primary/40 shadow-lg"
            onClick={() => setIsPlayerSetupOpen(true)}
          >
            <Rocket className="mr-3 h-6 w-6 animate-pulse" />
            Start en runde
          </Button>
        </PlayerSetup>

        <Button variant="link" asChild>
          <Link href="/spill/velg">Eller se alle spillene</Link>
        </Button>
      </div>

      <footer className="absolute bottom-0 left-0 right-0 flex items-center justify-center h-16">
        <p className="text-sm text-muted-foreground/50">Laget med ❤️ for festen</p>
      </footer>
    </div>
  );
}
