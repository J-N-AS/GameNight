'use client';

import { getArticle } from '@/lib/articles';
import { DrikkelekArticleClient } from '@/components/drikkeleker/DrikkelekArticleClient';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params;
  const article = await getArticle(slug);
  if (!article) {
    return {
      title: 'Artikkel ikke funnet | GameNight'
    };
  }
  return {
    title: `${article.title} - Regler og Varianter | GameNight`,
    description: `Lær hvordan du spiller ${article.title}. Vi gir deg reglene, hva du trenger, og morsomme varianter.`,
  };
}

export default async function DrikkelekArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug);

  if (!article) {
    notFound();
  }

  return <DrikkelekArticleClient article={article} />;
}
