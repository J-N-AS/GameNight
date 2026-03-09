import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { InfoPageClient } from '@/components/info/InfoPageClient';
import {
  INFO_PAGE_META,
  INFO_PAGE_SLUGS,
  isInfoPageSlug,
} from '@/lib/info-pages';
import { buildBreadcrumbJsonLd, buildPageMetadata } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';

type InfoPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return INFO_PAGE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: InfoPageProps): Promise<Metadata> {
  const { slug } = await params;

  if (!isInfoPageSlug(slug)) {
    return buildPageMetadata({
      title: 'Side ikke funnet | GameNight',
      description: 'Siden du leter etter finnes ikke.',
      path: '/info/om-oss',
      noindex: true,
    });
  }

  const pageMeta = INFO_PAGE_META[slug];

  return buildPageMetadata({
    title: `${pageMeta.title} | GameNight`,
    description: pageMeta.description,
    path: `/info/${slug}`,
  });
}

export default async function InfoPage({ params }: InfoPageProps) {
  const { slug } = await params;

  if (!isInfoPageSlug(slug)) {
    notFound();
  }

  const pageMeta = INFO_PAGE_META[slug];
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Forside', path: '/' },
    { name: pageMeta.title, path: `/info/${slug}` },
  ]);

  return (
    <>
      <JsonLd id="info-breadcrumb-jsonld" data={breadcrumbJsonLd} />
      <InfoPageClient slug={slug} />
    </>
  );
}
