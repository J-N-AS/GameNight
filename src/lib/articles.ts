'use server';

import type { GameArticle } from './types';
import drikkeleker from '@/data/drikkeleker.json';

// This function now uses 'use server' to indicate it only runs on the server,
// but can be called from client components.
async function loadArticles(): Promise<GameArticle[]> {
  // Instead of reading from fs, we import the JSON directly.
  // This works on both server and client, but with 'use server',
  // this function's code won't be sent to the client.
  return drikkeleker as GameArticle[];
}

export async function getArticles(): Promise<
  Omit<GameArticle, 'whatYouNeed' | 'rules' | 'cardRules'>[]
> {
  const articles = await loadArticles();
  return articles.map(({ slug, title, description }) => ({
    slug,
    title,
    description,
  }));
}

export async function getArticle(slug: string): Promise<GameArticle | undefined> {
  const articles = await loadArticles();
  return articles.find(article => article.slug === slug);
}
