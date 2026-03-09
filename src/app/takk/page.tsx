import type { Metadata } from 'next';
import { TakkPageClient } from '@/components/info/TakkPageClient';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Takk for støtten | GameNight',
  description:
    'Takkeside for frivillig støtte til GameNight. Tilbake til spillene når dere er klare for neste runde.',
  path: '/takk',
  noindex: true,
});

export default function TakkPage() {
  return <TakkPageClient />;
}
