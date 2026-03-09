import { getArticle } from '@/lib/articles';
import { getArticles } from '@/lib/articles';
import { DrikkelekArticleClient } from '@/components/drikkeleker/DrikkelekArticleClient';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

type DrikkelekArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

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
    return {
      title: 'Artikkel ikke funnet | GameNight',
    };
  }
  return {
    title: `${article.title} - Regler og Varianter | GameNight`,
    description: `Lær hvordan du spiller ${article.title}. Vi gir deg reglene, hva du trenger, og morsomme varianter.`,
  };
}

export default async function DrikkelekArticlePage({
  params,
}: DrikkelekArticlePageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  return <DrikkelekArticleClient article={article} />;
}
