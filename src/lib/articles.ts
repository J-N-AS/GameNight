import type { GameArticle } from './types';
import drikkeleker from '@/data/drikkeleker.json';
import { PlaceHolderImages } from './placeholder-images';
import { cache } from 'react';

const loadArticles = cache(async (): Promise<GameArticle[]> => {
  const articles = drikkeleker as Omit<GameArticle, 'imageUrl' | 'imageHint' | 'attributionHtml'>[];
  
  return articles.map(article => {
    const imageData = PlaceHolderImages.find(img => img.id === article.slug);
    return {
      ...article,
      imageUrl: imageData?.imageUrl,
      imageHint: imageData?.imageHint,
      attributionHtml: imageData?.attributionHtml,
    };
  });
});

export const getArticles = cache(async (): Promise<
  Omit<GameArticle, 'whatYouNeed' | 'rules' | 'cardRules' | 'attributionHtml'>[]
> => {
  const articles = await loadArticles();
  return articles.map(({ slug, title, description, imageUrl, imageHint }) => ({
    slug,
    title,
    description,
    imageUrl,
    imageHint,
  }));
});

export const getArticle = cache(async (slug: string): Promise<GameArticle | undefined> => {
  const articles = await loadArticles();
  return articles.find(article => article.slug === slug);
});
