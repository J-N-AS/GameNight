import { getTheme } from '@/lib/themes';
import { ThemePageClient } from '@/components/themes/ThemePageClient';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getThemes } from '@/lib/themes';
import { buildBreadcrumbJsonLd, buildPageMetadata } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';

type ThemePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const themes = await getThemes();
  return themes.map(theme => ({
    slug: theme.slug,
  }));
}

export async function generateMetadata({ params }: ThemePageProps): Promise<Metadata> {
  const { slug } = await params;
  const theme = await getTheme(slug);

  if (!theme) {
    return buildPageMetadata({
      title: 'Tema ikke funnet | GameNight',
      description: 'Temaet du leter etter finnes ikke.',
      path: '/alle-spill',
      noindex: true,
    });
  }

  return buildPageMetadata({
    title: `${theme.title} | GameNight`,
    description: theme.metaDescription,
    path: `/tema/${theme.slug}`,
  });
}

export default async function ThemePage({ params }: ThemePageProps) {
  const { slug } = await params;
  const theme = await getTheme(slug);

  if (!theme) {
    notFound();
  }

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Forside', path: '/' },
    { name: theme.title, path: `/tema/${theme.slug}` },
  ]);

  return (
    <>
      <JsonLd id="theme-breadcrumb-jsonld" data={breadcrumbJsonLd} />
      <ThemePageClient theme={theme} />
    </>
  );
}
