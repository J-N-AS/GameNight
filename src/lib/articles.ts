import type { GameArticle } from './types';
import drikkeleker from '@/data/drikkeleker.json';
import { PlaceHolderImages } from './placeholder-images';
import { cache } from 'react';
import type { DrikkelekListItem } from './drikkelek-metadata';

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

export const getArticles = cache(async (): Promise<DrikkelekListItem[]> => {
  const articles = await loadArticles();
  return articles.map(
    ({
      slug,
      title,
      description,
      imageUrl,
      imageHint,
      intensity,
      players,
      tags,
      sipAmount,
      penalty,
    }) => ({
      slug,
      title,
      description,
      imageUrl,
      imageHint,
      intensity,
      players,
      tags,
      sipAmount,
      penalty,
    })
  );
});

export const getArticle = cache(async (slug: string): Promise<GameArticle | undefined> => {
  const articles = await loadArticles();
  return articles.find(article => article.slug === slug);
});
