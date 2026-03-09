import type { MetadataRoute } from 'next';
import { withBasePath } from '@/lib/base-path';
import { getCanonicalOrigin } from '@/lib/seo';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  const siteOrigin = getCanonicalOrigin();

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${siteOrigin}${withBasePath('/sitemap.xml')}`,
  };
}
