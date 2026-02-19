import '../globals.css';
import { poppins } from '../fonts';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Utskrivbar Mingle-Bingo | GameNight',
};

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
