import type { Metadata } from 'next';
import { MusikklekerClient } from '@/components/musikkleker/MusikklekerClient';
import musikklekerData from '@/data/musikkleker.json';
import type { MusicGameCategory } from '@/lib/types';
import { buildBreadcrumbJsonLd, buildPageMetadata } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = buildPageMetadata({
  title: 'Musikkeleker for Vorspiel | GameNight',
  description:
    'En samling musikkleker og partyspill basert på klassiske sanger. Koble til anlegget, trykk play, og la reglene styre kvelden.',
  path: '/musikkleker',
});

export default function MusikklekerPage() {
  const categories: MusicGameCategory[] = musikklekerData.categories;
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Forside', path: '/' },
    { name: 'Musikkeleker', path: '/musikkleker' },
  ]);

  return (
    <>
      <JsonLd id="musikkleker-breadcrumb-jsonld" data={breadcrumbJsonLd} />
      <MusikklekerClient categories={categories} />
    </>
  );
}
