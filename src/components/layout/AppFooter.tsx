'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export function AppFooter() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="w-full flex-shrink-0 py-6 px-4 md:px-6">
      <div className="container mx-auto flex flex-col items-center justify-center gap-4 text-center text-sm text-muted-foreground">
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4">
          {year && <span>&copy; {year} GameNight</span>}
          <div className="flex gap-4 flex-wrap justify-center">
            <Link href="/info/om-oss" className="hover:text-foreground transition-colors">
              Om oss
            </Link>
            <Link href="/alle-spill" className="hover:text-foreground transition-colors">
              Alle Spill
            </Link>
            <Link href="/drikkeleker" className="hover:text-foreground transition-colors">
              Klassiske Drikkeleker
            </Link>
            <Link href="/musikkleker" className="hover:text-foreground transition-colors">
              Musikkeleker
            </Link>
            <Link href="/info/personvern" className="hover:text-foreground transition-colors">
              Personvern
            </Link>
            <Link href="/info/kontakt-oss" className="hover:text-foreground transition-colors">
              Kontakt
            </Link>
          </div>
        </div>
        <div className="text-xs text-muted-foreground/80">
          <p>Drikk ansvarsfullt. Spillet har en veiledende aldersgrense på 18 år.</p>
        </div>
      </div>
    </footer>
  );
}
