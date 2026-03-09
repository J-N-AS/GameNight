import type { Metadata } from 'next';
import { withBasePath, withBasePathIfAbsolute } from './base-path';

const DEFAULT_SITE_ORIGIN = 'https://gamenight.no';
const DEFAULT_OG_IMAGE_PATH = '/GameNight-logo-small.png';

export const SITE_NAME = 'GameNight';

function normalizeSiteOrigin(rawUrl?: string): string {
  if (!rawUrl) {
    return DEFAULT_SITE_ORIGIN;
  }

  try {
    const parsedUrl = new URL(rawUrl);
    return `${parsedUrl.protocol}//${parsedUrl.host}`;
  } catch {
    return DEFAULT_SITE_ORIGIN;
  }
}

const siteOrigin = normalizeSiteOrigin(
  process.env.NEXT_PUBLIC_CANONICAL_ORIGIN || process.env.NEXT_PUBLIC_SITE_URL
);

export function getCanonicalOrigin(): string {
  return siteOrigin;
}

export function getMetadataBase(): URL {
  return new URL(siteOrigin);
}

export function getCanonicalPath(path: `/${string}`): string {
  return withBasePath(path);
}

export function getCanonicalUrl(path: `/${string}`): string {
  return `${siteOrigin}${getCanonicalPath(path)}`;
}

export function getAbsoluteAssetUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${siteOrigin}${withBasePathIfAbsolute(path)}`;
}

export function getDefaultOgImageUrl(): string {
  return getCanonicalUrl(DEFAULT_OG_IMAGE_PATH);
}

type BuildPageMetadataInput = {
  title: string;
  description: string;
  path: `/${string}`;
  type?: 'website' | 'article';
  noindex?: boolean;
};

export function buildPageMetadata({
  title,
  description,
  path,
  type = 'website',
  noindex = false,
}: BuildPageMetadataInput): Metadata {
  const canonicalPath = getCanonicalPath(path);
  const canonicalUrl = getCanonicalUrl(path);
  const ogImageUrl = getDefaultOgImageUrl();

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type,
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: 'nb_NO',
      images: [
        {
          url: ogImageUrl,
          alt: `${SITE_NAME} logo`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
    robots: noindex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
          },
        }
      : undefined,
  };
}

type BreadcrumbItem = {
  name: string;
  path: `/${string}`;
};

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: getCanonicalUrl(item.path),
    })),
  };
}

export function getOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: getCanonicalUrl('/'),
    logo: getDefaultOgImageUrl(),
    email: 'hei@gamenight.no',
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: 'hei@gamenight.no',
        availableLanguage: ['Norwegian'],
      },
    ],
  };
}

export function getWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: getCanonicalUrl('/'),
    inLanguage: 'nb-NO',
  };
}
