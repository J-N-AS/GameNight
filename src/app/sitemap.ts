import { getGames } from '@/lib/games';
import { getArticles } from '@/lib/articles';
import { getThemes } from '@/lib/themes';
import type { MetadataRoute } from 'next';
import { withBasePath } from '@/lib/base-path';

const DEFAULT_SITE_URL = 'https://gamenight.no';
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '') || DEFAULT_SITE_URL;
export const dynamic = 'force-static';

function toAbsoluteUrl(path: `/${string}`): string {
  return `${SITE_URL}${withBasePath(path)}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const games = await getGames();
  const articles = await getArticles();
  const themes = await getThemes();

  const gameUrls = games.map(game => ({
    url: toAbsoluteUrl(`/spill/${game.id}`),
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const articleUrls = articles.map(article => ({
    url: toAbsoluteUrl(`/drikkeleker/${article.slug}`),
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const themeUrls = themes.map(theme => ({
    url: toAbsoluteUrl(`/tema/${theme.slug}`),
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: toAbsoluteUrl('/'),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: toAbsoluteUrl('/alle-spill'),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: toAbsoluteUrl('/fadderuka'),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: toAbsoluteUrl('/russetiden'),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: toAbsoluteUrl('/drikkeleker'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: toAbsoluteUrl('/musikkleker'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
     {
      url: toAbsoluteUrl('/skjermleker'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: toAbsoluteUrl('/info/om-oss'),
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: toAbsoluteUrl('/info/personvern'),
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: toAbsoluteUrl('/info/kontakt-oss'),
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  return [...staticUrls, ...gameUrls, ...articleUrls, ...themeUrls];
}
