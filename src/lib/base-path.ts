const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const normalizedBasePath = (() => {
  if (!rawBasePath || rawBasePath === '/') {
    return '';
  }

  const withLeadingSlash = rawBasePath.startsWith('/')
    ? rawBasePath
    : `/${rawBasePath}`;

  return withLeadingSlash.replace(/\/+$/, '');
})();

export function getBasePath(): string {
  return normalizedBasePath;
}

export function withBasePath(path: `/${string}`): string {
  if (!normalizedBasePath) {
    return path;
  }

  return `${normalizedBasePath}${path}`;
}

export function withBasePathIfAbsolute(path: string): string {
  if (!path.startsWith('/')) {
    return path;
  }

  return withBasePath(path as `/${string}`);
}
