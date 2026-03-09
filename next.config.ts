import type {NextConfig} from 'next';

function normalizeBasePath(basePath?: string) {
  if (!basePath || basePath === '/') {
    return '';
  }

  const withLeadingSlash = basePath.startsWith('/') ? basePath : `/${basePath}`;
  return withLeadingSlash.replace(/\/+$/, '');
}

const isStaticExport = process.env.STATIC_EXPORT === 'true';
const basePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH);

const nextConfig: NextConfig = {
  ...(isStaticExport ? {output: 'export' as const} : {}),
  ...(basePath ? {basePath, assetPrefix: basePath} : {}),
  ...(isStaticExport ? {trailingSlash: true} : {}),
  images: {
    ...(isStaticExport ? {unoptimized: true} : {}),
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.cloudworkstations.dev',
      },
    ],
  },
  allowedDevOrigins: ['*.cloudworkstations.dev'],
};

export default nextConfig;
