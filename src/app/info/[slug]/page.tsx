import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { InfoPageClient } from '@/components/info/InfoPageClient';
import {
  INFO_PAGE_META,
  INFO_PAGE_SLUGS,
  isInfoPageSlug,
} from '@/lib/info-pages';

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
    return {
      title: 'Side ikke funnet | GameNight',
    };
  }

  const pageMeta = INFO_PAGE_META[slug];

  return {
    title: `${pageMeta.title} | GameNight`,
    description: pageMeta.description,
  };
}

export default async function InfoPage({ params }: InfoPageProps) {
  const { slug } = await params;

  if (!isInfoPageSlug(slug)) {
    notFound();
  }

  return <InfoPageClient slug={slug} />;
}
