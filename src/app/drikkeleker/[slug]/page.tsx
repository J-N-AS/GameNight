import { getArticle } from '@/lib/articles';
import { getArticles } from '@/lib/articles';
import { DrikkelekArticleClient } from '@/components/drikkeleker/DrikkelekArticleClient';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';
import { getGames } from '@/lib/games';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  buildBreadcrumbJsonLd,
  getAbsoluteAssetUrl,
  getCanonicalUrl,
} from '@/lib/seo';

type DrikkelekArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const RELATED_GAME_IDS = ['party-klassikere', 'vorspiel-mix', 'pekefest'];

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: DrikkelekArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) {
    return buildPageMetadata({
      title: 'Artikkel ikke funnet | GameNight',
      description: 'Artikkelen du leter etter finnes ikke.',
      path: '/drikkeleker',
      noindex: true,
    });
  }
  return buildPageMetadata({
    title: `${article.title} - Regler og Varianter | GameNight`,
    description: `Lær hvordan du spiller ${article.title}. Vi gir deg reglene, hva du trenger, og morsomme varianter.`,
    path: `/drikkeleker/${article.slug}`,
    type: 'article',
  });
}

export default async function DrikkelekArticlePage({
  params,
}: DrikkelekArticlePageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  const [allArticles, allGames] = await Promise.all([getArticles(), getGames()]);

  const relatedArticles = allArticles
    .filter((candidate) => candidate.slug !== article.slug)
    .slice(0, 4)
    .map((candidate) => ({ slug: candidate.slug, title: candidate.title }));

  const relatedGames = RELATED_GAME_IDS.map((gameId) =>
    allGames.find((game) => game.id === gameId)
  )
    .filter((game): game is NonNullable<typeof game> => Boolean(game))
    .map((game) => ({ id: game.id, title: game.title }));

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    inLanguage: 'nb-NO',
    isAccessibleForFree: true,
    mainEntityOfPage: getCanonicalUrl(`/drikkeleker/${article.slug}`),
    author: {
      '@type': 'Organization',
      name: 'GameNight',
    },
    publisher: {
      '@type': 'Organization',
      name: 'GameNight',
      logo: {
        '@type': 'ImageObject',
        url: getCanonicalUrl('/GameNight-logo-small.png'),
      },
    },
    ...(article.imageUrl
      ? {
          image: [getAbsoluteAssetUrl(article.imageUrl)],
        }
      : {}),
  };

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Forside', path: '/' },
    { name: 'Klassiske drikkeleker', path: '/drikkeleker' },
    { name: article.title, path: `/drikkeleker/${article.slug}` },
  ]);

  return (
    <>
      <JsonLd id="drikkelek-article-jsonld" data={articleJsonLd} />
      <JsonLd id="drikkelek-breadcrumb-jsonld" data={breadcrumbJsonLd} />
      <DrikkelekArticleClient
        article={article}
        relatedArticles={relatedArticles}
        relatedGames={relatedGames}
      />
    </>
  );
}
