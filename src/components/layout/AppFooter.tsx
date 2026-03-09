'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const FOOTER_SECTIONS = [
  {
    title: 'Spill',
    links: [
      { href: '/alle-spill', label: 'Alle spill' },
      { href: '/drikkeleker', label: 'Drikkeleker' },
      { href: '/musikkleker', label: 'Musikkeleker' },
      { href: '/skjermleker', label: 'Skjermleker' },
    ],
  },
  {
    title: 'Hjelp',
    links: [
      { href: '/faq', label: 'FAQ' },
      { href: '/info/om-oss#mobil-tv-guide', label: 'Mobil + TV-guide' },
      { href: '/info/kontakt-oss', label: 'Kontakt' },
    ],
  },
  {
    title: 'Om GameNight',
    links: [
      { href: '/info/om-oss', label: 'Om oss' },
      { href: '/changelog', label: 'Oppdateringer' },
      { href: '/info/personvern', label: 'Personvern' },
      { href: '/vilkar', label: 'Vilkår' },
    ],
  },
] as const;

export function AppFooter() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="w-full flex-shrink-0 py-6 px-4 md:px-6 z-10 print:hidden">
      <div className="container mx-auto max-w-5xl text-sm text-muted-foreground">
        <div className="text-center">
          {year && <p>&copy; {year} GameNight</p>}
          <p className="mx-auto mt-2 max-w-2xl text-sm">
            Gratis norsk side for drikkespill, festspill, isbrytere og sosiale
            spill for voksne 18+. Spill på én mobil eller del skjermen til TV.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 text-center sm:grid-cols-3 sm:text-left">
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground/90">
                {section.title}
              </h2>
              <div className="mt-3 flex flex-col gap-2">
                {section.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t border-border/50 pt-4 text-center text-xs text-muted-foreground/90">
          <p>
            GameNight er ment for voksne 18+. Drikk ansvarlig, respekter
            hverandres grenser og husk at spillene også kan brukes uten alkohol.
          </p>
          <p className="mt-2">
            Utgiver: GameNight · Kontakt:{' '}
            <a href="mailto:hei@gamenight.no" className="underline hover:text-foreground">
              hei@gamenight.no
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
