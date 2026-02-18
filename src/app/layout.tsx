import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AppFooter } from '@/components/layout/AppFooter';
import { CookieConsent } from '@/components/common/CookieConsent';
import { AppProviders } from './providers';

export const metadata: Metadata = {
  title: 'GameNight',
  description: 'Gratis partyspill, rett i nettleseren.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="no" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
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
