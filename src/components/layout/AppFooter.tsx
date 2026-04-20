'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const FOOTER_LINKS = [
  { href: '/info/om-oss', label: 'Om oss' },
  { href: '/info/personvern', label: 'Personvern' },
  { href: '/info/redaksjonell-policy', label: 'Redaksjonell policy' },
  { href: '/changelog', label: 'Oppdateringer' },
  { href: '/info/kontakt-oss', label: 'Kontakt' },
] as const;

export function AppFooter() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer
      className="w-full flex-shrink-0 border-t border-border/60 bg-background/70 px-4 py-8 backdrop-blur print:hidden"
      data-hide-during-gameplay="true"
    >
      <div className="container mx-auto max-w-5xl">
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-4 text-center text-xs text-muted-foreground/90">
          {year ? <p>&copy; {year} GameNight</p> : <p>GameNight</p>}
        </div>
      </div>
    </footer>
  );
}
