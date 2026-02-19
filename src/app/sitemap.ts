import { getGames } from '@/lib/games';
import { getArticles } from '@/lib/articles';
import { getThemes } from '@/lib/themes';
import type { MetadataRoute } from 'next';

const URL = 'https://gamenight.no';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const games = await getGames();
  const articles = await getArticles();
  const themes = await getThemes();

  const gameUrls = games.map(game => ({
    url: `${URL}/spill/${game.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const articleUrls = articles.map(article => ({
    url: `${URL}/drikkeleker/${article.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const themeUrls = themes.map(theme => ({
    url: `${URL}/tema/${theme.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${URL}/alle-spill`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${URL}/fadderuka`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${URL}/russetiden`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${URL}/drikkeleker`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${URL}/musikkleker`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
     {
      url: `${URL}/skjermleker`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${URL}/info/om-oss`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${URL}/info/personvern`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${URL}/info/kontakt-oss`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  return [...staticUrls, ...gameUrls, ...articleUrls, ...themeUrls];
}
