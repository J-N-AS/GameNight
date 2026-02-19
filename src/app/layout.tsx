import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AppFooter } from '@/components/layout/AppFooter';
import { CookieConsent } from '@/components/common/CookieConsent';
import { AppProviders } from './providers';
import { poppins } from './fonts';
import { PwaInstallPrompt } from '@/components/common/PwaInstallPrompt';

export const metadata: Metadata = {
  title: 'GameNight - Gratis Partyspill & Drikkeleker',
  description: 'Start festen med de beste gratis partyspillene og drikkelekene, rett i nettleseren. Ingen installasjon, bare moro!',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#1c1717',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="no" className={`${poppins.variable} dark`} suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192x192.png"></link>
        <script type="module" src="https://checkout.vipps.no/vipps-mobilepay-checkout-web-components/v1/vipps-mobilepay.js" async></script>
      </head>
      <body className="font-body antialiased bg-background text-foreground animated-background">
        <AppProviders>
          <div className="relative flex min-h-screen flex-col">
            <main className="flex-1">{children}</main>
            <AppFooter />
          </div>
          <Toaster />
          <CookieConsent />
          <PwaInstallPrompt />
        </AppProviders>
      </body>
    </html>
  );
}
