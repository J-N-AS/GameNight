import '../globals.css';
import { poppins } from '../fonts';
import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Utskrivbar Mingle-Bingo | GameNight',
  description:
    'Generer et utskrivbart Mingle-Bingo-brett til fadderuke, vorspiel eller bli-kjent-kveld.',
  path: '/print/mingle-bingo',
  noindex: true,
});

export default function PrintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="no" className={`${poppins.variable} dark`} suppressHydrationWarning>
      <head />
      <body className="font-body antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
