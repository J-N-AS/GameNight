import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AppFooter } from '@/components/layout/AppFooter';
import { CookieConsent } from '@/components/common/CookieConsent';
import { AppProviders } from './providers';
import { poppins } from './fonts';
import { PwaInstallPrompt } from '@/components/common/PwaInstallPrompt';
import { withBasePath } from '@/lib/base-path';
import {
  buildPageMetadata,
  getMetadataBase,
  getOrganizationJsonLd,
  getWebsiteJsonLd,
} from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';

const manifestPath = withBasePath('/manifest.json');
const appleTouchIconPath = withBasePath('/icon-192x192.png');
const organizationJsonLd = getOrganizationJsonLd();
const websiteJsonLd = getWebsiteJsonLd();

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: 'GameNight - Gratis Selskapsleker, Partyspill & Drikkeleker',
    description:
      'Start festen med de beste gratis selskapslekene, partyspillene og drikkelekene, rett i nettleseren. Perfekt for vorspiel, fadderuke og russetid.',
    path: '/',
  }),
  metadataBase: getMetadataBase(),
  manifest: manifestPath,
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
        <link rel="manifest" href={manifestPath} />
        <link rel="apple-touch-icon" href={appleTouchIconPath}></link>
        <JsonLd id="organization-jsonld" data={organizationJsonLd} />
        <JsonLd id="website-jsonld" data={websiteJsonLd} />
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
