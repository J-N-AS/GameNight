'use server';

import type { GameArticle } from './types';
import drikkeleker from '@/data/drikkeleker.json';
import { PlaceHolderImages } from './placeholder-images';

async function loadArticles(): Promise<GameArticle[]> {
  const articles = drikkeleker as Omit<GameArticle, 'imageUrl' | 'imageHint'>[];
  
  return articles.map(article => {
    const imageData = PlaceHolderImages.find(img => img.id === article.slug);
    return {
      ...article,
      imageUrl: imageData?.imageUrl,
      imageHint: imageData?.imageHint,
    };
  });
}

export async function getArticles(): Promise<
  Omit<GameArticle, 'whatYouNeed' | 'rules' | 'cardRules'>[]
> {
  const articles = await loadArticles();
  return articles.map(({ slug, title, description, imageUrl, imageHint }) => ({
    slug,
    title,
    description,
    imageUrl,
    imageHint,
  }));
}

export async function getArticle(slug: string): Promise<GameArticle | undefined> {
  const articles = await loadArticles();
  return articles.find(article => article.slug === slug);
}
