import type { Metadata } from 'next';
import { SkjermlekerClient } from '@/components/skjermleker/SkjermlekerClient';
import type { ScreenGameCategory } from '@/lib/types';
import screenGamesData from '@/data/screen-games.json';
import { buildBreadcrumbJsonLd, buildPageMetadata } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = buildPageMetadata({
  title: 'Skjermleker: Spill til Film, TV og Sport | GameNight',
  description:
    'Gjør filmkvelden, TV-tittingen eller fotballkampen enda mer engasjerende med våre partyspill for skjerm. Enkle regler, garantert god stemning.',
  path: '/skjermleker',
});

export default function SkjermlekerPage() {
  const categories: ScreenGameCategory[] = screenGamesData.categories;
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Forside', path: '/' },
    { name: 'Skjermleker', path: '/skjermleker' },
  ]);

  return (
    <>
      <JsonLd id="skjermleker-breadcrumb-jsonld" data={breadcrumbJsonLd} />
      <SkjermlekerClient categories={categories} />
    </>
  );
}
