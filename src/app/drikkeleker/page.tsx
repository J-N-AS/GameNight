import { getArticles } from '@/lib/articles';
import { DrikkelekerClient } from '@/components/drikkeleker/DrikkelekerClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Klassiske Drikkeleker | GameNight',
  description: 'Finn reglene til tidløse klassikere som Beer Pong, Ring of Fire og mye mer. Alt du trenger for en vellykket fest.',
};

export default async function DrikkelekerPage() {
  const games = await getArticles();
  return <DrikkelekerClient games={games} />;
}
