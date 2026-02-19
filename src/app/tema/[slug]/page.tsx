import { getTheme } from '@/lib/themes';
import { ThemePageClient } from '@/components/themes/ThemePageClient';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getThemes } from '@/lib/themes';

type ThemePageProps = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  const themes = await getThemes();
  return themes.map(theme => ({
    slug: theme.slug,
  }));
}

export async function generateMetadata({ params }: ThemePageProps): Promise<Metadata> {
  const { slug } = params;
  const theme = await getTheme(slug);

  if (!theme) {
    return {
      title: 'Tema ikke funnet | GameNight'
    };
  }

  return {
    title: `${theme.title} | GameNight`,
    description: theme.metaDescription,
  };
}

export default async function ThemePage({ params }: ThemePageProps) {
  const theme = await getTheme(params.slug);

  if (!theme) {
    notFound();
  }

  return <ThemePageClient theme={theme} />;
}
