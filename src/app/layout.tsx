import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AppFooter } from '@/components/layout/AppFooter';
import { CookieConsent } from '@/components/common/CookieConsent';
import { AppProviders } from './providers';
import { poppins } from './fonts';

export const metadata: Metadata = {
  title: 'GameNight - Gratis Partyspill & Drikkeleker',
  description: 'Start festen med de beste gratis partyspillene og drikkelekene, rett i nettleseren. Ingen installasjon, bare moro!',
  manifest: '/manifest.json',
  themeColor: '#1A1412',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="no" className={`${poppins.variable} dark`} suppressHydrationWarning>
      <head />
      <body className="font-body antialiased bg-background text-foreground animated-background">
        <AppProviders>
          <div className="relative flex min-h-screen flex-col">
            <main className="flex-1">{children}</main>
            <AppFooter />
          </div>
          <Toaster />
          <CookieConsent />
        </AppProviders>
      </body>
    </html>
  );
}
