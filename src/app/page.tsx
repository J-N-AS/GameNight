'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PartyPopper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlayerSetup } from '@/components/game/PlayerSetup';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const [isPlayerSetupOpen, setIsPlayerSetupOpen] = useState(false);
  const router = useRouter();

  const handleSetupComplete = () => {
    setIsPlayerSetupOpen(false);
    router.push('/spill/velg');
  };

  return (
    <div className="container mx-auto px-4 flex flex-col items-center justify-center min-h-screen text-center">
      <header className="mb-12 animate-in fade-in-50 duration-1000">
        <h1 className="font-bold font-headline">
          <Image
            src="https://placehold.co/400x100/11221C/FF2E88?text=GameNight&font=poppins"
            alt="GameNight"
            width={400}
            height={100}
            priority
            className="w-auto h-auto mx-auto max-w-[300px] md:max-w-[400px]"
          />
        </h1>
        <p className="text-muted-foreground mt-4 text-lg">
          Gratis partyspill, rett i nettleseren.
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
            className="h-14 text-xl px-10 transform transition-transform duration-200 active:scale-95"
            onClick={() => setIsPlayerSetupOpen(true)}
          >
            <PartyPopper className="mr-3 h-6 w-6" />
            Start en runde
          </Button>
        </PlayerSetup>

        <Button variant="link" asChild>
          <Link href="/spill/velg">Eller bla i spill</Link>
        </Button>
      </div>

       {/* Ad banner placeholder */}
       <footer className="absolute bottom-0 left-0 right-0 flex items-center justify-center h-16 border-t border-border/50">
          <p className="text-sm text-muted-foreground">Annonse</p>
       </footer>
    </div>
  );
}
