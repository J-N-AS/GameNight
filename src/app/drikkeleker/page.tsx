import { getArticles } from '@/lib/articles';
import { DrikkelekerClient } from '@/components/drikkeleker/DrikkelekerClient';
import type { Metadata } from 'next';
import { buildBreadcrumbJsonLd, buildPageMetadata } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = buildPageMetadata({
  title: 'Klassiske Drikkeleker | GameNight',
  description:
    'Finn reglene til tidløse klassikere som Beer Pong, Ring of Fire og mye mer. Alt du trenger for en vellykket fest.',
  path: '/drikkeleker',
});

export default async function DrikkelekerPage() {
  const games = await getArticles();
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Forside', path: '/' },
    { name: 'Klassiske drikkeleker', path: '/drikkeleker' },
  ]);

  return (
    <>
      <JsonLd id="drikkeleker-breadcrumb-jsonld" data={breadcrumbJsonLd} />
      <DrikkelekerClient games={games} />
    </>
  );
}
