'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export function AppFooter() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="w-full flex-shrink-0 py-6 px-4 md:px-6 z-10 print:hidden">
      <div className="container mx-auto flex flex-col items-center justify-center gap-4 text-center text-sm text-muted-foreground">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          {year && <span>&copy; {year} GameNight</span>}
          <Link href="/info/om-oss" className="hover:text-foreground transition-colors">
            Om oss
          </Link>
           <Link href="/fadderuka" className="hover:text-foreground transition-colors">
            Fadderuka
          </Link>
          <Link href="/russetiden" className="hover:text-foreground transition-colors font-semibold text-primary">
            🚌 Russetiden
          </Link>
          <Link href="/alle-spill" className="hover:text-foreground transition-colors">
            Alle Spill
          </Link>
          <Link href="/drikkeleker" className="hover:text-foreground transition-colors">
            Klassiske Drikkeleker
          </Link>
          <Link href="/faq" className="hover:text-foreground transition-colors">
            FAQ
          </Link>
          <Link href="/changelog" className="hover:text-foreground transition-colors">
            Changelog
          </Link>
          <Link href="/vilkar" className="hover:text-foreground transition-colors">
            Vilkår
          </Link>
          <Link href="/musikkleker" className="hover:text-foreground transition-colors">
            Musikkeleker
          </Link>
          <Link href="/skjermleker" className="hover:text-foreground transition-colors">
            Skjermleker
          </Link>
          <Link href="/info/personvern" className="hover:text-foreground transition-colors">
            Personvern
          </Link>
          <Link href="/info/om-oss#mobil-tv-guide" className="hover:text-foreground transition-colors">
            Mobil + TV-guide
          </Link>
          <Link href="/info/kontakt-oss" className="hover:text-foreground transition-colors">
            Kontakt
          </Link>
        </div>
        <div className="mt-4 pt-4 border-t border-border/50 text-center text-xs text-muted-foreground/90 w-full max-w-lg">
          <p>
            GameNight er ment for underholdning. Vennligst drikk ansvarlig, respekter hverandres grenser og følg lokale lover. Innholdet er ikke en oppfordring til overdreven drikking, og de fleste spillene har en anbefalt aldersgrense på 18 år.
          </p>
          <p className="mt-2">
            Utgiver: GameNight · Kontakt:{' '}
            <a href="mailto:hei@gamenight.no" className="hover:text-foreground underline">
              hei@gamenight.no
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
